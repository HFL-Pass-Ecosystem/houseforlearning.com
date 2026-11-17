// Runs every day by itself (Netlify scheduled function). HFL Vidyapeetha safety sweep:
// 1. A tutor whose police clearance has run out is set to 'renewal': hidden, no new bookings, payouts held.
// 2. Reminders 60, 30 and 7 days before the clearance runs out.
// 3. Random checks by our own assessors: home-visit tutors about once a month, others about once a quarter.
import { rest, note, months } from './vidyapeetha.mjs';

export const config = { schedule: '@daily' };

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (n) => { const d = new Date(); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

export default async () => {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return new Response('off');
  const s = { url: url.replace(/\/$/, ''), key };
  const out = { expired: 0, reminded: 0, audits: 0 };
  try {
    const expired = await rest(s, 'PATCH', 'vp_tutors', `status=eq.verified&pcc_valid_until=lt.${today()}`, { status: 'renewal', status_note: 'Police clearance out of date. Upload a new one to teach again.', updated_at: new Date().toISOString() }, 'return=representation');
    for (const t of expired) await note(s, t.user_id, 'tutor', 'Your police clearance is out of date. Your profile is hidden and payouts are held until you upload a new one.');
    out.expired = expired.length;

    const live = await rest(s, 'GET', 'vp_tutors', `status=eq.verified&pcc_valid_until=gte.${today()}&select=user_id,pcc_valid_until,reminded,home_visits`);
    for (const t of live) {
      const left = Math.round((Date.parse(t.pcc_valid_until) - Date.parse(today())) / 864e5);
      const step = [7, 30, 60].find((d) => left <= d);
      const sent = Array.isArray(t.reminded) ? t.reminded : [];
      if (step && !sent.includes(step)) {
        await note(s, t.user_id, 'tutor', `Your police clearance runs out in ${left} days (${t.pcc_valid_until}). Upload a new one from the area where you live now (renew every ${t.home_visits ? months.home : months.other} months).`);
        await rest(s, 'PATCH', 'vp_tutors', `user_id=eq.${t.user_id}`, { reminded: [...sent, step] }, 'return=minimal');
        out.reminded++;
      }
      if (Math.random() < (t.home_visits ? 1 / 30 : 1 / 90)) {
        const kinds = t.home_visits ? ['random_home_visit', 'police_liaison', 'document_recheck'] : ['document_recheck', 'police_liaison'];
        await rest(s, 'POST', 'vp_audits', '', { tutor_id: t.user_id, kind: kinds[Math.floor(Math.random() * kinds.length)], due: plusDays(3), note: 'Random check (not announced to the tutor).' }, 'return=minimal');
        out.audits++;
      }
    }
  } catch { /* try again tomorrow */ }
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
};
