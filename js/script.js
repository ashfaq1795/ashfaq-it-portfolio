(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var root = document.documentElement;

  /* ---- Theme ---- */
  var themeBtn = document.getElementById('themeToggle');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  applyTheme(root.getAttribute('data-theme') || 'light');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage unavailable: applies for this visit only */ }
  });

  /* ---- Mobile menu ---- */
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menuToggle');
  function setMenu(open) {
    if (!nav || !menuBtn) return;
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  if (nav) nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
  });

  /* ---- Active nav link ---- */
  var links = nav ? nav.querySelectorAll('a') : [];
  if ('IntersectionObserver' in window && links.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s); });
  }

  /* ---- Back to top ---- */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () { toTop.hidden = window.scrollY < 600; }, { passive: true });
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0 }); });
  }

  /* ---- Hero rotating focus line ---- */
  var rot = document.getElementById('rotator');
  if (rot && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var words = ['systems administration', 'network administration', 'cloud engineering'], wi = 0;
    setInterval(function () {
      rot.classList.add('out');
      setTimeout(function () { wi = (wi + 1) % words.length; rot.textContent = words[wi]; rot.classList.remove('out'); }, 300);
    }, 2600);
  }

  /* ---- Header shadow and scroll-reveal ---- */
  var header = document.querySelector('.site-header');
  window.addEventListener('scroll', function () { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }, { passive: true });
  var items = document.querySelectorAll('.section h2, .section .card, .reach, .stage, .about-photo, .journey h2');
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window);
  var rv = still ? null : new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in'); rv.unobserve(en.target);
      setTimeout(function () { en.target.style.transitionDelay = ''; }, 1000);
    });
  }, { threshold: 0.12 });
  items.forEach(function (el) {
    el.classList.add('reveal');
    if (!rv) { el.classList.add('in'); return; }
    el.style.transitionDelay = (Array.prototype.indexOf.call(el.parentNode.children, el) % 4) * 90 + 'ms';
    rv.observe(el);
  });

  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Contact form: validates, then opens a prefilled mailto: draft ---- */
  var form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = document.getElementById('formError');
    var fields = [form.elements.name, form.elements.email, form.elements.message];
    var bad = fields.filter(function (f) { return !f.value.trim() || !f.checkValidity(); });
    fields.forEach(function (f) { f.setAttribute('aria-invalid', bad.indexOf(f) > -1 ? 'true' : 'false'); });
    if (bad.length) { err.textContent = 'Please complete all fields with a valid email address.'; bad[0].focus(); return; }
    err.textContent = '';
    var body = form.elements.message.value + '\n\nFrom: ' + form.elements.name.value + ' (' + form.elements.email.value + ')';
    window.location.href = 'mailto:ahmad.ashfaq1795@gmail.com?subject=' + encodeURIComponent('Portfolio enquiry from ' + form.elements.name.value) + '&body=' + encodeURIComponent(body);
  });
})();
