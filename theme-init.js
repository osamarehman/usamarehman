/* theme-init.js — runs synchronously in <head> to set the theme BEFORE paint,
   avoiding a flash of the wrong palette when navigating between pages. */
(function() {
  try {
    var t = localStorage.getItem('usamar.theme') || 'light';
    var a = localStorage.getItem('usamar.accent');
    var d = localStorage.getItem('usamar.density') || 'regular';
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.setAttribute('data-density', d);
    if (a) document.documentElement.style.setProperty('--accent', a);
  } catch (e) {}
})();
