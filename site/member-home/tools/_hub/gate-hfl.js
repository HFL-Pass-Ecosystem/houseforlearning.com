// Members only (House for Learning): if real sign-in is switched on and nobody is signed in, go to the member home to sign in.
// When sign-in is not set up (demo mode), the page simply opens.
(function () {
  'use strict';
  var A = window.HFLAuth;
  if (!A || !A.live || !A.client) return;
  document.documentElement.classList.add('hub-wait');
  A.client.auth.getSession().then(function (r) {
    if (r.data && r.data.session) { document.documentElement.classList.remove('hub-wait'); return; }
    location.replace('/member-home/');
  }).catch(function () { location.replace('/member-home/'); });
})();
