/* Inside pages: need a signed-in member. This only sends a signed-out visitor to the login page; the page text is not secret. */
(function () {
  if (!/(?:^|; )hfl_in=1/.test(document.cookie)) location.replace('login.html');
})();
