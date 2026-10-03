/* MundoPeludo Sales Funnel v1.0 */
(function () {
  'use strict';

  var DISCOUNT_CODE = 'BIENVENIDO10';
  var POPUP_DELAY = 9000;
  var HALLOWEEN_END = new Date('2026-10-31T23:59:59');

  /* ── EMAIL POPUP ── */
  function createEmailPopup() {
    if (localStorage.getItem('mp_popup_dismissed') || localStorage.getItem('mp_email_captured')) return;
    if (document.getElementById('mp-popup-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'mp-popup-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;transition:opacity .3s;';

    var box = document.createElement('div');
    box.style.cssText = 'background:#fff;border-radius:14px;max-width:460px;width:100%;padding:40px 28px 28px;position:relative;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.4);';
    box.innerHTML =
      '<button id="mp-close" style="position:absolute;top:12px;right:16px;background:none;border:none;font-size:22px;cursor:pointer;color:#aaa;line-height:1;">&#10005;</button>' +
      '<div style="font-size:44px;margin-bottom:6px;">🐾</div>' +
      '<h2 style="font-size:22px;font-weight:800;margin:0 0 8px;color:#111;">10% OFF tu primer pedido</h2>' +
      '<p style="color:#666;font-size:14px;margin:0 0 22px;">Más de 2.000 dueños de mascotas ya disfrutan de MundoPeludo. Únete y llévate tu descuento ahora.</p>' +
      '<form id="mp-email-form">' +
        '<input id="mp-email-input" type="email" placeholder="Tu email..." required ' +
          'style="width:100%;padding:13px 15px;border:2px solid #e0e0e0;border-radius:8px;font-size:15px;box-sizing:border-box;margin-bottom:10px;outline:none;">' +
        '<button type="submit" ' +
          'style="width:100%;padding:15px;background:#1a472a;color:#fff;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;transition:background .2s;">' +
          'Quiero mi 10% de descuento →' +
        '</button>' +
      '</form>' +
      '<p id="mp-email-ok" style="display:none;color:#1a472a;font-weight:800;font-size:16px;margin:16px 0 0;"></p>' +
      '<p style="margin:10px 0 0;font-size:11px;color:#bbb;">Sin spam. Cancela cuando quieras.</p>';

    overlay.appendChild(box);
    document.body.appendChild(overlay);
    requestAnimationFrame(function () { overlay.style.opacity = '1'; });

    function dismiss() {
      overlay.style.opacity = '0';
      setTimeout(function () { overlay.remove(); }, 300);
      localStorage.setItem('mp_popup_dismissed', '1');
    }

    document.getElementById('mp-close').addEventListener('click', dismiss);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) dismiss(); });

    document.getElementById('mp-email-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('mp-email-input').value.trim();
      if (!email) return;

      fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'form_type=customer&utf8=%E2%9C%93&customer%5Bemail%5D=' + encodeURIComponent(email) + '&customer%5Baccepts_marketing%5D=true'
      }).catch(function () {});

      localStorage.setItem('mp_email_captured', '1');

      var ok = document.getElementById('mp-email-ok');
      ok.style.display = 'block';
      ok.innerHTML = '¡Listo! Tu código: <span style="background:#e8f5e9;padding:3px 10px;border-radius:4px;letter-spacing:1px;">' + DISCOUNT_CODE + '</span> 🎉<br><span style="font-size:12px;font-weight:400;color:#777;">Cópialo y úsalo al hacer checkout</span>';
      document.getElementById('mp-email-form').style.display = 'none';
      setTimeout(function () {
        overlay.style.opacity = '0';
        setTimeout(function () { overlay.remove(); }, 300);
      }, 5000);
    });
  }

  /* ── SOCIAL PROOF TOASTS ── */
  var SP_NAMES  = ['Carlos','María','Lucía','Javier','Ana','Pablo','Isabel','Diego','Sofía','Marcos','Elena','Rubén'];
  var SP_CITIES = ['Madrid','Barcelona','Valencia','Sevilla','Bilbao','Málaga','Zaragoza','Murcia','Alicante','Vigo'];
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
        '<div style="font-weight:700;font-size:13px;color:#111;">' + name + ' de ' + city + '</div>' +
        '<div style="font-size:12px;color:#555;">compró <strong>' + product + '</strong></div>' +
        '<div style="font-size:11px;color:#aaa;">hace ' + mins + ' min</div>' +
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

    var viewers  = Math.floor(Math.random() * 11) + 4;
    var boughtToday = Math.floor(Math.random() * 17) + 6;

    var bar = document.createElement('div');
    bar.style.cssText = 'background:#fff8f0;border:1px solid #ffe0b2;border-radius:8px;padding:10px 14px;margin:12px 0;font-size:13px;line-height:1.8;';
    bar.innerHTML =
      '<div style="color:#e65100;font-weight:700;">🔥 ' + boughtToday + ' personas compraron esto hoy</div>' +
      '<div id="mp-viewers" style="color:#555;">👀 <span id="mp-v-count">' + viewers + '</span> personas están viendo este producto ahora</div>';

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

    var anchor = document.querySelector('#shopify-section-announcement-bar, .announcement-bar, [data-section-type="announcement-bar"], header');
    if (anchor) anchor.insertAdjacentElement('afterend', bar);
    else document.body.prepend(bar);
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

  /* ── EXIT INTENT ── */
  function setupExitIntent() {
    if (localStorage.getItem('mp_popup_dismissed') || localStorage.getItem('mp_email_captured')) return;
    document.addEventListener('mouseleave', function handler(e) {
      if (e.clientY <= 0) {
        document.removeEventListener('mouseleave', handler);
        if (!document.getElementById('mp-popup-overlay')) createEmailPopup();
      }
    });
  }

  /* ── INIT ── */
  function init() {
    addCountdown();
    addUrgency();
    addStickyBuy();
    startToasts();
    setupExitIntent();
    if (!localStorage.getItem('mp_popup_dismissed') && !localStorage.getItem('mp_email_captured')) {
      setTimeout(createEmailPopup, POPUP_DELAY);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
