/* theme-init.js
   1) Read theme/accent/density from localStorage before paint (no flash).
   2) Fade body out on internal link clicks (page transition).
*/
(function() {
  try {
    var t = localStorage.getItem('usamar.theme') || 'light';
    var a = localStorage.getItem('usamar.accent');
    var d = localStorage.getItem('usamar.density') || 'comfy';
    document.documentElement.setAttribute('data-theme', t);
    document.documentElement.setAttribute('data-density', d);
    if (a) document.documentElement.style.setProperty('--accent', a);
  } catch (e) {}

  function isInternal(a) {
    var href = a.getAttribute('href');
    if (!href) return false;
    if (a.target === '_blank' || a.hasAttribute('download')) return false;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
    if (href.startsWith('#')) return false;
    if (/^https?:\/\//i.test(href)) {
      try { return new URL(href).host === location.host; } catch (e) { return false; }
    }
    return true;
  }

  function bind() {
    document.addEventListener('click', function(e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      var a = e.target.closest && e.target.closest('a');
      if (!a || !isInternal(a)) return;
      var href = a.getAttribute('href');
      // Same-page hash within current pathname → let it scroll naturally
      if (href.indexOf('#') > -1) {
        var [path] = href.split('#');
        if (!path || path === location.pathname.split('/').pop()) return;
      }
      e.preventDefault();
      document.body.classList.add('page-out');
      setTimeout(function() { window.location.href = href; }, 260);
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
