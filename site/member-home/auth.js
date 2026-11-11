// Real HFL sign-in (Supabase). Falls back to demo mode when no settings are given.
(function(){
'use strict';
var cfg=window.HFL_CONFIG||{};
var live=!!(cfg.supabaseUrl&&cfg.supabaseAnonKey&&window.supabase);
var client=live?window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,detectSessionInUrl:true,autoRefreshToken:true}}):null;
window.HFLAuth={live:live,client:client,user:null};
function $(s){return document.querySelector(s)}
function say(t,bad){var m=$('#authmsg');if(m){m.textContent=t;m.style.color=bad?'#b3261e':'#5b6770'}}
function nameOf(u){var m=u.user_metadata||{};return m.full_name||m.name||(u.email||'Member').split('@')[0]}
window.HFLAuth.signOut=function(){if(client)client.auth.signOut().then(function(){location.reload()})};
window.HFLAuth.gate=function(start){
 if(!live){start(null);return}
 client.auth.getSession().then(function(r){
  var s=r.data&&r.data.session;
  if(s){window.HFLAuth.user=s.user;start(s.user);return}
  showForm(start);
 });
 client.auth.onAuthStateChange(function(ev,sess){if(ev==='SIGNED_IN'&&sess&&!window.HFLAuth.user){window.HFLAuth.user=sess.user;$('#gate').hidden=true;start(sess.user)}});
};
function showForm(start){
 $('#skeleton').hidden=true;var g=$('#gate');g.hidden=false;
 g.innerHTML='<div class="card" style="max-width:440px;margin:40px auto"><div class="logo">HFL <span>Member</span></div><h2>Sign in</h2>'
  +'<p class="small">Use your HFL email. No codes to type.</p>'
  +'<label class="small">Email<br><input id="em" type="email" autocomplete="username" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:10px;font:inherit"></label>'
  +'<label class="small"><br>Password<br><input id="pw" type="password" autocomplete="current-password" style="width:100%;padding:10px;border:1px solid var(--line);border-radius:10px;font:inherit"></label>'
  +'<p><button class="btn" id="signin" type="button" style="width:100%">Sign in</button></p>'
  +'<p><button class="btn o" id="link" type="button" style="width:100%">Email me a one-tap link instead</button></p>'
  +'<p id="authmsg" class="small" role="status"></p></div>';
 $('#signin').onclick=function(){var e=$('#em').value.trim(),p=$('#pw').value;if(!e||!p){say('Please enter your email and password.',1);return}
  say('Signing in…');client.auth.signInWithPassword({email:e,password:p}).then(function(r){
   if(r.error){say('That did not work. Check your email and password, or use the one-tap link.',1);return}
  })};
 $('#link').onclick=function(){var e=$('#em').value.trim();if(!e){say('Type your email first.',1);return}
  say('Sending…');client.auth.signInWithOtp({email:e,options:{emailRedirectTo:location.origin+location.pathname}}).then(function(r){
   say(r.error?'Could not send the link. Please try again.':'Done. Open the email on this device and tap the link.',!!r.error)})};
}
window.HFLAuth.nameOf=nameOf;
})();
