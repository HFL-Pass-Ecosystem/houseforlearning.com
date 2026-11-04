// /api/voicefeedback: voice notes left on the Yoga page (and any page that loads voice-feedback.js).
//   POST {item, kind, page, site, mime, seconds, audio(base64)}  -> saves a note with status "new" (anyone)
//   GET  ?list=1            -> the reviewed list, without audio     (needs header x-review-token)
//   GET  ?audio=REF         -> one note's audio                      (needs header x-review-token)
//   POST {action:"status", ref, status, decision_note} -> mark a note (needs header x-review-token)
// Status: new, reviewed, approved, declined. Approving a note does NOT change any page: the team still decides.
// Settings (Netlify environment variables, never in this repository): SUPABASE_URL, SUPABASE_SERVICE_KEY, VOICE_REVIEW_TOKEN.
import { timingSafeEqual } from 'node:crypto';
import { ok, fail, ref, text, save, notify } from './_lib.mjs';

const STATUS = ['new', 'reviewed', 'approved', 'declined'];
const MIMES = /^audio\/(webm|ogg|mp4|mpeg|wav|x-m4a)/;
const base = () => (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const hdr = () => { const k = process.env.SUPABASE_SERVICE_KEY; return { apikey: k, Authorization: `Bearer ${k}`, 'Content-Type': 'application/json' }; };

function reviewer(req) {
  const want = process.env.VOICE_REVIEW_TOKEN || '';
  const got = req.headers.get('x-review-token') || '';
  if (!want || want.length < 12) return false;
  const a = Buffer.from(got), b = Buffer.from(want);
  return a.length === b.length && timingSafeEqual(a, b);
}

export default async (req) => {
  const site = process.env.SITE_ORIGIN, origin = req.headers.get('origin');
  if (site && origin && origin !== site) return fail(403, 'Wrong origin');
  const url = new URL(req.url);

  if (req.method === 'GET') {
    if (!reviewer(req)) return fail(401, 'Review code needed');
    if (!base() || !process.env.SUPABASE_SERVICE_KEY) return fail(503, 'Database not set up');
    const aref = url.searchParams.get('audio');
    const q = aref
      ? `voice_feedback?ref=eq.${encodeURIComponent(aref)}&select=mime,audio_b64&limit=1`
      : 'voice_feedback?select=ref,created_at,item,kind,page,seconds,status,decision_note&order=created_at.desc&limit=300';
    const r = await fetch(`${base()}/rest/v1/${q}`, { headers: hdr() });
    if (!r.ok) return fail(502, 'Could not read');
    const rows = await r.json();
    if (aref) return rows[0] ? ok({ mime: rows[0].mime, audio: rows[0].audio_b64 }) : fail(404, 'Not found');
    return ok({ notes: rows });
  }

  if (req.method !== 'POST') return fail(405, 'Use GET or POST');
  if (Number(req.headers.get('content-length') || 0) > 1500000) return fail(413, 'Too long');
  let body;
  try { body = await req.json(); } catch { return fail(400, 'Bad request'); }
  if (!body || typeof body !== 'object') return fail(400, 'Bad request');
  if (body.website) return ok({ ref: ref('VF') });   // hidden field: only spam robots fill it

  if (body.action === 'status') {
    if (!reviewer(req)) return fail(401, 'Review code needed');
    if (!STATUS.includes(body.status)) return fail(400, 'Unknown status');
    if (!base() || !process.env.SUPABASE_SERVICE_KEY) return fail(503, 'Database not set up');
    const r = await fetch(`${base()}/rest/v1/voice_feedback?ref=eq.${encodeURIComponent(text(body.ref, 40))}`, {
      method: 'PATCH', headers: { ...hdr(), Prefer: 'return=minimal' },
      body: JSON.stringify({ status: body.status, decision_note: text(body.decision_note, 1000), reviewed_at: new Date().toISOString() }),
    });
    return r.ok ? ok({ ok: true }) : fail(502, 'Not saved');
  }

  const audio = String(body.audio || '');
  const mime = text(body.mime, 60);
  if (!audio || audio.length > 900000 || !/^[A-Za-z0-9+/=]+$/.test(audio)) return fail(400, 'No usable recording');
  if (!MIMES.test(mime)) return fail(400, 'Unsupported recording');
  const row = {
    ref: ref('VF'), item: text(body.item, 200), kind: text(body.kind, 20), page: text(body.page, 300),
    site: text(body.site, 120), mime, seconds: Math.min(Math.max(parseInt(body.seconds, 10) || 0, 0), 120),
    audio_b64: audio, status: 'new',
  };
  const s = await save('voice_feedback', row);
  if (s.status !== 200) return fail(s.status, 'Not saved');
  await notify('New voice feedback ' + row.ref, [`About: ${row.item}`, `Page: ${row.page}`, `Length: ${row.seconds}s`, 'Listen on the voice feedback review page. Nothing changes until the team approves.']);
  return ok({ ref: row.ref });
};
