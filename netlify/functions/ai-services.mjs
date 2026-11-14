// /api/ai-services: the staff "AI services" picker. ADMIN members only (members.role = 'admin').
//   GET                 -> { services: [{name, website, provider, env, coupon, hasKey}] }  (keys are never returned)
//   POST {save:{...}}   -> saves one service; an optional key is encrypted before it is stored
//   POST {remove:name}  -> removes a service
//   POST {ask:"brief"}  -> sends the brief to every saved service that has a key and returns the replies
// Needs Netlify settings: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, AI_KEYS_SECRET (any long random text).
// Table: supabase/ai_services.sql. Keys never reach the browser and are never logged.
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { ok, fail, text, readBody } from './_lib.mjs';
import { whoIs, withSession } from './_session.mjs';

const db = () => {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  return url && key && process.env.AI_KEYS_SECRET ? { url: url.replace(/\/$/, ''), key } : null;
};
async function rest(c, path, opt = {}) {
  const r = await fetch(`${c.url}/rest/v1/${path}`, { ...opt, headers: { apikey: c.key, Authorization: `Bearer ${c.key}`, 'Content-Type': 'application/json', ...(opt.headers || {}) } });
  let data = null; try { data = await r.json(); } catch { /* empty */ }
  return { ok: r.ok, data };
}
const k32 = () => createHash('sha256').update(process.env.AI_KEYS_SECRET).digest();
const seal = (v) => { const iv = randomBytes(12), c = createCipheriv('aes-256-gcm', k32(), iv); const e = Buffer.concat([c.update(v, 'utf8'), c.final()]);
  return [iv, c.getAuthTag(), e].map((b) => b.toString('base64url')).join('.'); };
const open = (s) => { const [iv, tag, e] = s.split('.').map((x) => Buffer.from(x, 'base64url')); const d = createDecipheriv('aes-256-gcm', k32(), iv); d.setAuthTag(tag);
  return Buffer.concat([d.update(e), d.final()]).toString('utf8'); };

async function post(url, body, headers) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(25000) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}
const ASK = {
  openai: async (s, k, b) => (await post(s.base_url.replace(/\/$/, '') + '/chat/completions', { model: s.model || 'gpt-4o-mini', messages: [{ role: 'user', content: b }] }, { Authorization: 'Bearer ' + k })).choices[0].message.content,
  gemini: async (s, k, b) => (await post('https://generativelanguage.googleapis.com/v1beta/models/' + (s.model || 'gemini-2.5-flash') + ':generateContent', { contents: [{ parts: [{ text: b }] }] }, { 'x-goog-api-key': k })).candidates[0].content.parts[0].text,
  anthropic: async (s, k, b) => (await post('https://api.anthropic.com/v1/messages', { model: s.model || 'claude-sonnet-4-5', max_tokens: 2000, messages: [{ role: 'user', content: b }] }, { 'x-api-key': k, 'anthropic-version': '2023-06-01' })).content[0].text,
};

export default async (req) => {
  const who = await whoIs(req);
  const res = (r) => withSession(r, who);
  if (!who || !who.id) return fail(401, 'Please sign in');
  const c = db();
  if (!c) return res(fail(503, 'Not switched on yet'));
  const me = await rest(c, `members?id=eq.${encodeURIComponent(who.id)}&select=role`);
  if (!me.ok || !me.data || !me.data[0] || me.data[0].role !== 'admin') return res(fail(403, 'Staff administrators only'));

  if (req.method === 'GET') {
    const r = await rest(c, 'ai_services_saved?select=name,website,provider,env,coupon,key_enc,updated_at&order=name');
    const rows = r.ok && Array.isArray(r.data) ? r.data : [];
    return res(ok({ services: rows.map(({ key_enc, ...x }) => ({ ...x, hasKey: !!key_enc })) }));
  }
  const { body, error } = await readBody(req);
  if (error) return res(fail(...error));

  if (body.save) {
    const s = body.save, name = text(s.name, 80);
    if (!name) return res(fail(400, 'Name needed'));
    const provider = ['openai', 'gemini', 'anthropic'].includes(s.provider) ? s.provider : 'none';
    const base = text(s.base_url, 200);
    if (base && !/^https:\/\//.test(base)) return res(fail(400, 'Address must start with https://'));
    const row = { name, website: text(s.website, 200), provider, env: text(s.env, 60), base_url: base, model: text(s.model, 80),
      coupon: text(s.coupon, 80), updated_by: who.email || '', updated_at: new Date().toISOString() };
    const key = text(s.key, 400);
    if (key) row.key_enc = seal(key);
    const r = await rest(c, 'ai_services_saved?on_conflict=name', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(row) });
    return res(r.ok ? ok({ saved: name }) : fail(502, 'Could not save'));
  }
  if (body.remove) {
    const r = await rest(c, `ai_services_saved?name=eq.${encodeURIComponent(text(body.remove, 80))}`, { method: 'DELETE' });
    return res(r.ok ? ok({ removed: true }) : fail(502, 'Could not remove'));
  }
  if (body.ask) {
    const brief = text(body.ask, 12000);
    const r = await rest(c, 'ai_services_saved?select=name,provider,base_url,model,key_enc,website');
    const out = [];
    for (const s of (r.ok && Array.isArray(r.data) ? r.data : [])) {
      if (!ASK[s.provider]) { out.push({ name: s.name, status: 'reference only', text: 'Saved for reference (no API). ' + s.website }); continue; }
      if (!s.key_enc) { out.push({ name: s.name, status: 'skipped', text: 'No key saved yet.' }); continue; }
      try { out.push({ name: s.name, status: 'ok', text: await ASK[s.provider](s, open(s.key_enc), brief) }); }
      catch (e) { out.push({ name: s.name, status: 'error', text: 'Call failed: ' + (e.message || '').slice(0, 40) }); }
    }
    return res(ok({ replies: out }));
  }
  return res(fail(400, 'Nothing to do'));
};
