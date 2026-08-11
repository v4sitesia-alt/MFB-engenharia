/* =============================================================
   MFB Engenharia — interações da landing page
   ============================================================= */
(function () {
  'use strict';

  var HEADER_H = 65;

  /* ---------------------- Menu mobile ---------------------- */
  var burger = document.querySelector('.header__burger');
  var nav = document.getElementById('nav-principal');

  function closeMenu() {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) closeMenu();
    });
  }

  /* ------------------ Rolagem suave com offset ------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_H;
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: Math.max(top, 0), behavior: reduce ? 'auto' : 'smooth' });

      // mantém o foco acessível após a rolagem
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ------------------ Animações de entrada ------------------ */
  /* O <head> já decidiu se as animações valem para este visitante e marcou
     .reveal-on. Aqui só observamos os alvos e revelamos uma vez cada. */
  var docEl = document.documentElement;

  if (docEl.classList.contains('reveal-on')) {
    docEl.setAttribute('data-reveal-ready', '');

    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );

    document
      .querySelectorAll('[data-reveal], [data-reveal-group], .hero__visual')
      .forEach(function (el) { revealObserver.observe(el); });
  }

  /* ------------------- Link ativo na navegação ------------------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.header__nav a[href^="#"]')
  );
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (a) {
            a.classList.toggle(
              'is-active',
              a.getAttribute('href') === '#' + entry.target.id
            );
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------- FAQ (acordeão) ------------------------- */
  var accs = Array.prototype.slice.call(document.querySelectorAll('.acc'));

  accs.forEach(function (acc) {
    var btn = acc.querySelector('.acc__q');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var willOpen = !acc.classList.contains('is-open');

      accs.forEach(function (other) {
        other.classList.remove('is-open');
        var b = other.querySelector('.acc__q');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      if (willOpen) {
        acc.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --------------------------- Formulário --------------------------- */
  var form = document.querySelector('.form');
  if (form) {
    var status = form.querySelector('.form__status');

    var rules = {
      nome: function (v) {
        if (!v.trim()) return 'Informe seu nome completo.';
        if (v.trim().length < 3) return 'Nome muito curto.';
        return '';
      },
      email: function (v) {
        if (!v.trim()) return 'Informe seu e-mail corporativo.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'E-mail inválido.';
        return '';
      },
      empresa: function (v) {
        if (!v.trim()) return 'Informe o nome da empresa.';
        return '';
      }
    };

    function validateField(input) {
      var rule = rules[input.name];
      if (!rule) return true;

      var msg = rule(input.value);
      var field = input.closest('.field');
      var err = field ? field.querySelector('[data-err]') : null;

      if (field) field.classList.toggle('has-error', !!msg);
      if (err) err.textContent = msg;
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }

    form.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('has-error')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var inputs = Array.prototype.slice.call(form.querySelectorAll('input, textarea'));
      var ok = inputs.map(validateField).every(Boolean);

      if (status) {
        status.classList.toggle('is-error', !ok);
        status.textContent = ok
          ? 'Solicitação registrada. Retornaremos em até 24h úteis.'
          : 'Revise os campos destacados para continuar.';
      }

      if (!ok) {
        var first = form.querySelector('.field.has-error input, .field.has-error textarea');
        if (first) first.focus();
        return;
      }

      // TODO: integrar com o endpoint real (CRM, e-mail marketing ou API).
      form.reset();
    });
  }
})();
