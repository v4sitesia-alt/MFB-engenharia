/* =============================================================
   MFB Engenharia — interações da landing page
   ============================================================= */
(function () {
  'use strict';

  var HEADER_H = 65;

  /* ------------------------- Contato ------------------------- */
  /* Número comercial: +55 11 4858-4921 */
  var WHATSAPP_BASE = 'https://wa.me/551148584921';

  /* Webhooks do n8n que recebem o lead e disparam o e-mail para
     comercial@mfbengenharia.com.br. */
  var WEBHOOK = {
    producao: 'https://webhook.v4mundim.com/webhook/mfbengenharia',
    teste: 'https://n8n.v4mundim.com/webhook-test/mfbengenharia'
  };

  /* O webhook de teste só responde depois de clicar em "Execute workflow" no n8n
     e vale por uma chamada — não serve para o site publicado. Fica atrás de um
     interruptor: em localhost ele é o padrão, e no site no ar basta abrir a
     página com ?wh=test para apontar para ele sem republicar nada. */
  function endpoint() {
    var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
    var pedeTeste = /[?&]wh=test(&|$)/.test(window.location.search);
    return local || pedeTeste ? WEBHOOK.teste : WEBHOOK.producao;
  }

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
  /* [data-modal] fica de fora: esses âncoras abrem uma janela, não rolam até
     um elemento da página. */
  document.querySelectorAll('a[href^="#"]:not([data-modal])').forEach(function (link) {
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

  /* ------------------ Política de privacidade ------------------ */
  var politica = document.getElementById('politica-de-privacidade');

  if (politica) {
    var HASH_POLITICA = '#politica-de-privacidade';
    /* O <dialog> nativo já entrega armadilha de foco, Esc e fundo escurecido.
       Onde ele não existir, o fallback recria o essencial na unha. */
    var temDialog = typeof politica.showModal === 'function';
    var scrim = null;
    var focoAnterior = null;

    function travarFundo() {
      /* Compensa a barra de rolagem: sem isso a página salta para o lado ao
         esconder o overflow, e o header e o botão flutuante pulam junto. */
      var barra = window.innerWidth - document.documentElement.clientWidth;
      if (barra > 0) document.body.style.paddingRight = barra + 'px';
      document.body.classList.add('policy-aberta');
    }

    function soltarFundo() {
      document.body.style.paddingRight = '';
      document.body.classList.remove('policy-aberta');
    }

    function abrirPolitica() {
      if (politica.open) return;
      focoAnterior = document.activeElement;

      if (temDialog) {
        politica.showModal();
      } else {
        politica.classList.add('is-fallback');
        politica.setAttribute('open', '');
        scrim = document.createElement('div');
        scrim.className = 'policy-scrim';
        scrim.addEventListener('click', fecharPolitica);
        document.body.appendChild(scrim);
      }

      travarFundo();
      var corpo = politica.querySelector('.policy__body');
      if (corpo) { corpo.scrollTop = 0; corpo.focus(); }
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', HASH_POLITICA);
      }
    }

    function fecharPolitica() {
      if (temDialog) {
        if (politica.open) politica.close();   // dispara o evento 'close'
        return;
      }
      politica.removeAttribute('open');
      if (scrim) { scrim.remove(); scrim = null; }
      aoFechar();
    }

    function aoFechar() {
      soltarFundo();
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
      focoAnterior = null;
    }

    // Cobre também o fechamento pelo Esc, que o navegador faz sozinho.
    politica.addEventListener('close', aoFechar);

    document.querySelectorAll('a[href="' + HASH_POLITICA + '"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        abrirPolitica();
      });
    });

    var btnFechar = politica.querySelector('.policy__close');
    if (btnFechar) btnFechar.addEventListener('click', fecharPolitica);

    // Clique no fundo escurecido: o alvo é o próprio dialog, não o conteúdo.
    politica.addEventListener('click', function (e) {
      if (e.target !== politica) return;
      var r = politica.getBoundingClientRect();
      var fora = e.clientX < r.left || e.clientX > r.right ||
                 e.clientY < r.top || e.clientY > r.bottom;
      if (fora) fecharPolitica();
    });

    // Endereço compartilhável: abrir a página com a âncora já mostra o documento.
    if (window.location.hash === HASH_POLITICA) abrirPolitica();
    window.addEventListener('hashchange', function () {
      if (window.location.hash === HASH_POLITICA) abrirPolitica();
    });
  }

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

    var botao = form.querySelector('button[type="submit"]');
    var waLink = form.querySelector('.form__wa');
    var enviando = false;

    function aviso(texto, erro) {
      if (!status) return;
      status.classList.toggle('is-error', !!erro);
      status.textContent = texto;
    }

    /* Saudação já preenchida na conversa, com os dados que a pessoa acabou de
       digitar — a equipe recebe o contexto sem ter que perguntar de novo. */
    function saudacao(d) {
      var linhas = [
        'Olá, MFB Engenharia!',
        '',
        'Acabei de solicitar uma avaliação técnica pelo site.',
        '',
        'Nome: ' + d.nome,
        'Empresa: ' + d.empresa,
        'E-mail: ' + d.email
      ];
      if (d.mensagem) linhas.push('Operação: ' + d.mensagem);
      linhas.push(
        '',
        'Gostaria de conversar sobre a disponibilidade e a segurança da nossa infraestrutura.'
      );
      return linhas.join('\n');
    }

    function irParaWhatsapp(url) {
      if (waLink) { waLink.href = url; waLink.hidden = false; }
      setTimeout(function () { window.location.href = url; }, 1400);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (enviando) return;

      var inputs = Array.prototype.slice.call(form.querySelectorAll('input, textarea'));
      if (!inputs.map(validateField).every(Boolean)) {
        aviso('Revise os campos destacados para continuar.', true);
        var first = form.querySelector('.field.has-error input, .field.has-error textarea');
        if (first) first.focus();
        return;
      }

      var dados = {
        nome: form.nome.value.trim(),
        email: form.email.value.trim(),
        empresa: form.empresa.value.trim(),
        mensagem: form.mensagem.value.trim(),
        site: form.site ? form.site.value : '',   // isca anti-robô
        origem: window.location.href
      };

      var url = WHATSAPP_BASE + '?text=' + encodeURIComponent(saudacao(dados));

      enviando = true;
      if (botao) botao.disabled = true;
      aviso('Enviando sua solicitação...', false);

      fetch(endpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(dados)
      })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          aviso('Solicitação enviada. Abrindo o WhatsApp...', false);
          form.reset();
        })
        .catch(function (err) {
          /* Falha de rede, CORS ou erro do workflow. O lead não pode se perder
             por isso: o WhatsApp segue levando os mesmos dados. */
          if (window.console) console.error('[MFB] falha ao enviar o lead:', err);
          aviso('Não foi possível registrar por e-mail. Seguindo pelo WhatsApp...', true);
        })
        .then(function () {
          enviando = false;
          if (botao) botao.disabled = false;
          irParaWhatsapp(url);
        });
    });
  }
})();
