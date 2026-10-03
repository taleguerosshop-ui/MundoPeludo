/* MundoPeludo Sales Funnel v1.3 */
(function () {
  'use strict';

  var HALLOWEEN_END = new Date('2026-10-31T23:59:59');

  /* ── SOCIAL PROOF TOASTS ── */
  var SP_NAMES  = ['Tyler','Ashley','Michael','Jessica','Brandon','Sarah','Kevin','Emily','Chris','Melissa','Jake','Amanda'];
  var SP_CITIES = ['New York','Los Angeles','Chicago','Houston','Phoenix','San Diego','Dallas','Austin','Seattle','Miami','Denver','Boston'];
  var SP_ITEMS  = ['Arnés sin tirones','Comedero automático','Cepillo antideshedding','Cama ortopédica','Cortaúñas eléctrico','Collar táctico','Cama calmante','Árbol para gatos','Transportín'];

  function showToast() {
    var name    = SP_NAMES[Math.floor(Math.random() * SP_NAMES.length)];
    var city    = SP_CITIES[Math.floor(Math.random() * SP_CITIES.length)];
    var product = SP_ITEMS[Math.floor(Math.random() * SP_ITEMS.length)];
    var mins    = Math.floor(Math.random() * 44) + 3;

    var el = document.createElement('div');
    el.style.cssText = 'position:fixed;bottom:72px;left:14px;z-index:99998;background:#fff;border-radius:10px;padding:11px 15px;box-shadow:0 4px 22px rgba(0,0,0,.14);display:flex;align-items:center;gap:11px;max-width:290px;transform:translateX(-120%);transition:transform .4s ease;border-left:4px solid #1a472a;';
    el.innerHTML =
      '<div style="font-size:26px;">🐾</div>' +
      '<div>' +
        '<div style="font-weight:700;font-size:13px;color:#111;">' + name + ' from ' + city + '</div>' +
        '<div style="font-size:12px;color:#555;">just bought <strong>' + product + '</strong></div>' +
        '<div style="font-size:11px;color:#aaa;">' + mins + ' min ago</div>' +
      '</div>';

    document.body.appendChild(el);
    requestAnimationFrame(function () { el.style.transform = 'translateX(0)'; });
    setTimeout(function () {
      el.style.transform = 'translateX(-120%)';
      setTimeout(function () { el.remove(); }, 400);
    }, 4800);
  }

  function startToasts() {
    setTimeout(function () {
      showToast();
      setInterval(showToast, 28000 + Math.floor(Math.random() * 14000));
    }, 15000);
  }

  /* ── PRODUCT PAGE URGENCY ── */
  function addUrgency() {
    if (window.location.pathname.indexOf('/products/') === -1) return;
    var form = document.querySelector('form[action="/cart/add"]');
    if (!form) return;

    var viewers     = Math.floor(Math.random() * 11) + 4;
    var boughtToday = Math.floor(Math.random() * 17) + 6;

    var bar = document.createElement('div');
    bar.style.cssText = 'background:#fff8f0;border:1px solid #ffe0b2;border-radius:8px;padding:10px 14px;margin:12px 0;font-size:13px;line-height:1.8;';
    bar.innerHTML =
      '<div style="color:#e65100;font-weight:700;">🔥 ' + boughtToday + ' people bought this today</div>' +
      '<div id="mp-viewers" style="color:#555;">👀 <span id="mp-v-count">' + viewers + '</span> people are viewing this right now</div>';

    form.insertAdjacentElement('beforebegin', bar);

    setInterval(function () {
      var el  = document.getElementById('mp-v-count');
      if (!el) return;
      var cur = parseInt(el.textContent, 10);
      var nxt = Math.max(3, Math.min(22, cur + (Math.random() > .5 ? 1 : -1)));
      el.textContent = nxt;
    }, 9000);
  }

  /* ── HALLOWEEN COUNTDOWN BAR ── */
  function addCountdown() {
    if (new Date() > HALLOWEEN_END) return;

    var bar = document.createElement('div');
    bar.id = 'mp-countdown';
    bar.style.cssText = 'background:#e65100;color:#fff;text-align:center;padding:7px 12px;font-size:13px;font-weight:700;letter-spacing:.4px;position:relative;z-index:100;';

    function tick() {
      var diff = HALLOWEEN_END - new Date();
      if (diff <= 0) { bar.remove(); return; }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      bar.textContent = '🎃 OFERTA HALLOWEEN TERMINA EN: ' + d + 'd ' + h + 'h ' + m + 'm ' + s + 's — Código: SPOOKY20';
    }

    tick();
    setInterval(tick, 1000);

    function insertCountdown() {
      // On home page the sticky header can overlap content; prepend to main instead
      var main = document.querySelector('main, [role="main"], #MainContent, #content-for-layout');
      if (main) { main.insertAdjacentElement('afterbegin', bar); return; }
      // Fallback: after header section
      var anchor = document.querySelector(
        '#shopify-section-header, [data-section-type="header"], .header-section, .site-header'
      );
      if (anchor) { anchor.insertAdjacentElement('afterend', bar); return; }
      document.body.prepend(bar);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', insertCountdown);
    } else {
      var tries = 0;
      var poll = setInterval(function () {
        var m = document.querySelector('main, [role="main"], #MainContent, #content-for-layout, header, .site-header');
        if (m || ++tries > 20) { clearInterval(poll); insertCountdown(); }
      }, 100);
    }
  }

  /* ── STICKY BUY BUTTON (MOBILE) ── */
  function addStickyBuy() {
    if (window.location.pathname.indexOf('/products/') === -1) return;
    if (window.innerWidth > 768) return;

    var form = document.querySelector('form[action="/cart/add"]');
    if (!form) return;
    var originalBtn = form.querySelector('button[type="submit"], input[type="submit"], .btn-product-form');
    if (!originalBtn) return;

    var wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:9997;background:#fff;padding:10px 14px;padding-bottom:max(10px,env(safe-area-inset-bottom));box-shadow:0 -3px 18px rgba(0,0,0,.12);display:none;';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = '🛒 Añadir al carrito';
    btn.style.cssText = 'width:100%;padding:15px;background:#1a472a;color:#fff;border:none;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;';
    btn.addEventListener('click', function () { originalBtn.click(); });

    wrap.appendChild(btn);
    document.body.appendChild(wrap);

    var io = new IntersectionObserver(function (entries) {
      wrap.style.display = entries[0].isIntersecting ? 'none' : 'block';
    }, { threshold: 0 });
    io.observe(originalBtn);
  }

  /* ── HALLOWEEN POPUP PREMIUM ── */
  function createHalloweenPopup() {
    if (new Date() > HALLOWEEN_END) return;
    if (localStorage.getItem('mp_halloween_shown')) return;
    if (document.getElementById('mp-hw-overlay')) return;

    var style = document.createElement('style');
    style.textContent = [
      '@keyframes mpHwSlide{from{transform:translateY(50px) scale(.96);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}',
      '@keyframes mpHwGlow{0%,100%{box-shadow:0 0 20px rgba(255,107,0,.55),0 0 50px rgba(255,107,0,.18),inset 0 0 30px rgba(255,107,0,.04)}50%{box-shadow:0 0 36px rgba(255,107,0,.85),0 0 80px rgba(255,107,0,.35),inset 0 0 50px rgba(255,107,0,.08)}}',
      '@keyframes mpHwBat{0%{transform:translateX(-100px) translateY(0) scaleX(1)}30%{transform:translateX(30vw) translateY(-20px) scaleX(1)}60%{transform:translateX(60vw) translateY(10px) scaleX(-1)}100%{transform:translateX(calc(100vw + 100px)) translateY(-5px) scaleX(-1)}}',
      '@keyframes mpHwBat2{0%{transform:translateX(-100px) translateY(0) scaleX(1)}25%{transform:translateX(25vw) translateY(16px) scaleX(1)}55%{transform:translateX(55vw) translateY(-22px) scaleX(-1)}100%{transform:translateX(calc(100vw + 100px)) translateY(0) scaleX(-1)}}',
      '@keyframes mpHwBat3{0%{transform:translateX(-100px) translateY(0) scaleX(1)}40%{transform:translateX(40vw) translateY(-14px) scaleX(1)}70%{transform:translateX(70vw) translateY(18px) scaleX(-1)}100%{transform:translateX(calc(100vw + 100px)) translateY(0) scaleX(-1)}}',
      '@keyframes mpHwShimmer{0%{background-position:200% center}100%{background-position:-200% center}}',
      '@keyframes mpHwFloat{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-10px) rotate(3deg)}}',
      '@keyframes mpHwStar{0%,100%{opacity:0;transform:scale(0) rotate(0deg)}40%,60%{opacity:1;transform:scale(1) rotate(180deg)}}'
    ].join('');
    document.head.appendChild(style);

    var batSVG = '<svg width="28" height="18" viewBox="0 0 32 20" fill="currentColor"><path d="M16 8C12 4 6 0 0 2c4 2 6 6 8 8-2 0-5-1-7 2 3-1 6 0 7 1 1 1 2 3 4 3 1 0 2-1 4-2 2 1 3 2 4 2 2 0 3-2 4-3 1-1 4-2 7-1-2-3-5-2-7-2 2-2 4-6 8-8-6-2-12 2-16 6z"/></svg>';

    var batConfigs = [
      { anim: 'mpHwBat',  dur: '7s',  delay: '0s',   top: '12%', color: '#2d1040', size: '28px' },
      { anim: 'mpHwBat2', dur: '9s',  delay: '2.5s', top: '22%', color: '#1a0828', size: '22px' },
      { anim: 'mpHwBat3', dur: '11s', delay: '5s',   top: '8%',  color: '#3d1560', size: '18px' }
    ];
    var batEls = [];
    batConfigs.forEach(function (cfg) {
      var b = document.createElement('div');
      b.style.cssText = 'position:fixed;top:' + cfg.top + ';left:0;z-index:100002;pointer-events:none;color:' + cfg.color + ';font-size:' + cfg.size + ';animation:' + cfg.anim + ' ' + cfg.dur + ' ' + cfg.delay + ' linear infinite;';
      b.innerHTML = batSVG;
      document.body.appendChild(b);
      batEls.push(b);
    });

    var overlay = document.createElement('div');
    overlay.id = 'mp-hw-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(5,0,18,.88);z-index:100001;display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .45s;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);';

    var starsHTML = '';
    for (var i = 0; i < 20; i++) {
      var sz   = (Math.random() * 2.5 + 1).toFixed(1);
      var sx   = (Math.random() * 94 + 3).toFixed(1);
      var sy   = (Math.random() * 90 + 5).toFixed(1);
      var sd   = (Math.random() * 2.5).toFixed(2);
      var sdur = (1.8 + Math.random() * 2).toFixed(1);
      starsHTML += '<div style="position:absolute;width:' + sz + 'px;height:' + sz + 'px;background:#ffb347;border-radius:50%;left:' + sx + '%;top:' + sy + '%;animation:mpHwStar ' + sdur + 's ' + sd + 's ease-in-out infinite;"></div>';
    }

    var box = document.createElement('div');
    box.style.cssText = 'background:linear-gradient(150deg,#1e0b38 0%,#0e0520 55%,#1a0808 100%);border:2px solid #ff6b00;border-radius:22px;max-width:480px;width:100%;padding:48px 32px 38px;position:relative;text-align:center;overflow:hidden;animation:mpHwSlide .55s cubic-bezier(.22,.68,0,1.2) both,mpHwGlow 2.8s ease-in-out 0.6s infinite;';

    function hwTime() {
      var diff = HALLOWEEN_END - new Date();
      if (diff <= 0) return '<span style="color:#ff6b00;">¡Última hora!</span>';
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      return '<span style="color:#ff9a3c;font-weight:800;">' + (d > 0 ? d + 'd ' : '') + pad(h) + ':' + pad(m) + ':' + pad(s) + '</span>';
    }
    function pad(n) { return n < 10 ? '0' + n : n; }

    box.innerHTML = starsHTML +
      '<button id="mp-hw-close" style="position:absolute;top:16px;right:20px;background:none;border:none;font-size:18px;cursor:pointer;color:rgba(255,255,255,.4);line-height:1;z-index:2;transition:color .2s;">✕</button>' +
      '<div style="font-size:60px;animation:mpHwFloat 3.2s ease-in-out infinite;display:inline-block;filter:drop-shadow(0 0 18px rgba(255,107,0,.9)) drop-shadow(0 0 40px rgba(255,60,0,.5));margin-bottom:4px;">🎃</div>' +
      '<div style="font-size:10px;font-weight:800;letter-spacing:4px;color:#ff9a3c;text-transform:uppercase;margin-bottom:6px;">— Oferta especial Halloween —</div>' +
      '<h2 style="font-size:58px;font-weight:900;margin:0 0 2px;line-height:1;background:linear-gradient(90deg,#ff6b00 0%,#ffd700 40%,#ff8c00 60%,#ff6b00 100%);background-size:250%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:mpHwShimmer 3s linear infinite;">20% OFF</h2>' +
      '<p style="color:rgba(255,255,255,.7);font-size:15px;margin:0 0 24px;font-weight:500;line-height:1.5;">En <strong style="color:#fff;">toda la tienda</strong> para tus mascotas 🐾<br><span style="font-size:13px;color:rgba(255,255,255,.45);">El mejor precio del año, solo esta semana</span></p>' +
      '<div style="background:rgba(255,107,0,.1);border:1.5px solid rgba(255,107,0,.45);border-radius:14px;padding:18px 22px 14px;margin:0 0 14px;">' +
        '<div style="font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(255,255,255,.4);margin-bottom:8px;">TU CÓDIGO DE DESCUENTO</div>' +
        '<div id="mp-hw-code" style="font-size:30px;font-weight:900;letter-spacing:5px;color:#fff;text-shadow:0 0 22px rgba(255,107,0,.9),0 0 50px rgba(255,60,0,.4);margin-bottom:10px;">SPOOKY20</div>' +
        '<button id="mp-hw-copy" style="background:rgba(255,107,0,.18);border:1.5px solid rgba(255,107,0,.5);color:#ffb347;padding:7px 22px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;letter-spacing:.5px;transition:all .2s;">📋 Copiar código</button>' +
      '</div>' +
      '<div style="font-size:12px;color:rgba(255,255,255,.4);margin-bottom:20px;">⏳ Termina en: <span id="mp-hw-cd"></span></div>' +
      '<a href="/collections/all" id="mp-hw-cta" style="display:block;padding:17px 24px;background:linear-gradient(90deg,#ff6b00,#e65100);color:#fff;border-radius:12px;font-size:16px;font-weight:800;cursor:pointer;text-decoration:none;letter-spacing:.3px;box-shadow:0 8px 28px rgba(255,107,0,.45);transition:transform .18s,box-shadow .18s;">🛒 Ver ofertas Halloween →</a>' +
      '<p style="margin:14px 0 0;font-size:11px;color:rgba(255,255,255,.25);">Solo hasta el 31 de octubre · No acumulable con otras ofertas</p>';

    overlay.appendChild(box);
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.style.opacity = '1'; });

    var cdEl = document.getElementById('mp-hw-cd');
    if (cdEl) {
      cdEl.innerHTML = hwTime();
      var cdTimer = setInterval(function () {
        var el = document.getElementById('mp-hw-cd');
        if (el) el.innerHTML = hwTime();
        else clearInterval(cdTimer);
      }, 1000);
    }

    var copyBtn = document.getElementById('mp-hw-copy');
    copyBtn.addEventListener('click', function () {
      var btn = this;
      navigator.clipboard.writeText('SPOOKY20').then(function () {
        btn.textContent = '✓ ¡Copiado!';
        btn.style.color = '#4caf50';
        btn.style.borderColor = 'rgba(76,175,80,.5)';
        setTimeout(function () {
          btn.textContent = '📋 Copiar código';
          btn.style.color = '#ffb347';
          btn.style.borderColor = 'rgba(255,107,0,.5)';
        }, 2200);
      }).catch(function () {
        try {
          var range = document.createRange();
          range.selectNode(document.getElementById('mp-hw-code'));
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          btn.textContent = '✓ ¡Seleccionado!';
        } catch (err) {}
      });
    });

    var ctaEl = document.getElementById('mp-hw-cta');
    ctaEl.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 12px 36px rgba(255,107,0,.65)';
    });
    ctaEl.addEventListener('mouseleave', function () {
      this.style.transform = '';
      this.style.boxShadow = '0 8px 28px rgba(255,107,0,.45)';
    });

    var closeBtn = document.getElementById('mp-hw-close');
    closeBtn.addEventListener('mouseenter', function () { this.style.color = 'rgba(255,255,255,.8)'; });
    closeBtn.addEventListener('mouseleave', function () { this.style.color = 'rgba(255,255,255,.4)'; });

    function hwDismiss() {
      overlay.style.opacity = '0';
      setTimeout(function () { if (overlay.parentNode) overlay.remove(); }, 450);
      batEls.forEach(function (b) {
        b.style.opacity = '0';
        setTimeout(function () { if (b.parentNode) b.remove(); }, 450);
      });
      localStorage.setItem('mp_halloween_shown', '1');
    }

    closeBtn.addEventListener('click', hwDismiss);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) hwDismiss(); });

    setTimeout(function () {
      if (document.getElementById('mp-hw-overlay')) hwDismiss();
    }, 18000);
  }

  /* ── INIT ── */
  function init() {
    addCountdown();
    addUrgency();
    addStickyBuy();
    startToasts();
    setTimeout(createHalloweenPopup, 22000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
