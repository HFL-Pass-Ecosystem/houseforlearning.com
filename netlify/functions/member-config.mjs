// Serves /member-home/config.js: the two PUBLIC sign-in values (Supabase URL + publishable/anon key) from Netlify settings.
// Never put the service key here. With either value missing, the member home runs in demo mode.
export default async () => {
  const u = process.env.SUPABASE_URL || '', k = process.env.SUPABASE_ANON_KEY || '';
  const body = 'window.HFL_CONFIG=' + JSON.stringify({ supabaseUrl: u && k ? u : '', supabaseAnonKey: u && k ? k : '' }) + ';';
  return new Response(body, { status: 200, headers: { 'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-store' } });
};
