(function () {
  "use strict";
  var B = window.__BRAND__ || {};
  document.documentElement.classList.remove("no-js");

  function safe(fn, n) { try { fn(); } catch (e) { console.warn("[Aillapan] " + n + " falló:", e); } }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function wa(text) {
    var n = String(B.whatsapp || "").replace(/\D/g, "");
    return "https://wa.me/" + n + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  function initSplash() {
    var s = document.querySelector("[data-splash]");
    var t = document.querySelector("[data-hero-title]");
    var done = false;
    var hide = function () {
      if (done) return; done = true;
      if (s) s.classList.add("is-out");
      setTimeout(function () { if (t) t.classList.add("is-in"); }, 250);
    };
    if (document.readyState === "complete") setTimeout(hide, 1100);
    else window.addEventListener("load", function () { setTimeout(hide, 900); });
    setTimeout(hide, 3800);
  }

  function initReveal() {
    var els = $$(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        var el = x.target, sib = el.parentElement ? $$(":scope > .reveal", el.parentElement) : [], i = sib.indexOf(el);
        el.style.transitionDelay = (i > 0 ? Math.min(i, 7) * 70 : 0) + "ms";
        el.classList.add("is-visible"); io.unobserve(el);
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -5% 0px" });
    els.forEach(function (e) { io.observe(e); });
    setTimeout(function () {
      $$(".reveal:not(.is-visible)").forEach(function (e) { if (e.getBoundingClientRect().top < innerHeight) e.classList.add("is-visible"); });
    }, 6000);
  }

  function initNav() {
    var nav = document.querySelector("[data-nav]"), t = document.querySelector("[data-menu-toggle]");
    if (!nav) return;
    var on = function () { nav.classList.toggle("is-scrolled", scrollY > 40); };
    addEventListener("scroll", on, { passive: true }); on();
    if (!t) return;
    var close = function () { nav.classList.remove("is-open"); t.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; };
    t.addEventListener("click", function () {
      var o = nav.classList.toggle("is-open");
      t.setAttribute("aria-expanded", o ? "true" : "false");
      document.body.style.overflow = o ? "hidden" : "";
    });
    $$("[data-menu] a").forEach(function (a) { a.addEventListener("click", close); });
  }

  function initLinks() {
    $$("[data-wa-link]").forEach(function (a) { a.href = wa("¡Hola Aillapan! Quería hacer una consulta."); a.target = "_blank"; a.rel = "noopener"; });
    $$("[data-wa-consult]").forEach(function (a) {
      a.href = wa("¡Hola Aillapan! Quería consultar por " + a.getAttribute("data-wa-consult") + ".");
      a.target = "_blank"; a.rel = "noopener";
    });
    if (B.tienda) $$("[data-shop-link]").forEach(function (a) { a.href = B.tienda; });
    $$("[data-year]").forEach(function (s) { s.textContent = new Date().getFullYear(); });
  }

  function initQuote() {
    var f = document.querySelector("[data-quote-form]");
    if (!f || f.dataset.bound) return;
    f.dataset.bound = "1";
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var n = f.elements.nombre, t = f.elements.tipo, ok = true;
      [n, t].forEach(function (x) { var bad = !x.value || !String(x.value).trim(); x.classList.toggle("is-invalid", bad); if (bad) ok = false; });
      if (!ok) { (n.value.trim() ? t : n).focus(); return; }
      var l = f.elements.localidad.value.trim(), m = f.elements.m2.value.trim(), x = f.elements.mensaje.value.trim();
      var msg = "¡Hola Aillapan! Soy " + n.value.trim() + " y quiero pedir un presupuesto.\n" +
        "• Obra: " + t.value + (l ? "\n• Localidad: " + l : "") + (m ? "\n• Superficie aprox.: " + m + " m²" : "") + (x ? "\n• " + x : "");
      open(wa(msg), "_blank", "noopener");
    });
    $$("input, select, textarea", f).forEach(function (x) {
      ["input", "change"].forEach(function (ev) { x.addEventListener(ev, function () { x.classList.remove("is-invalid"); }); });
    });
  }

  function initWorks() {
    var tr = document.querySelector("[data-works-track]");
    if (!tr) return;
    var step = function () { var it = tr.querySelector(".work"); return it ? it.getBoundingClientRect().width + 14 : 300; };
    var p = document.querySelector("[data-works-prev]"), n = document.querySelector("[data-works-next]");
    if (p) p.addEventListener("click", function () { tr.scrollBy({ left: -step() * 2, behavior: "smooth" }); });
    if (n) n.addEventListener("click", function () { tr.scrollBy({ left: step() * 2, behavior: "smooth" }); });
    var down = false, sx = 0, sl = 0;
    tr.addEventListener("mousedown", function (e) { down = true; sx = e.pageX; sl = tr.scrollLeft; tr.style.scrollSnapType = "none"; tr.style.cursor = "grabbing"; });
    addEventListener("mouseup", function () { if (!down) return; down = false; tr.style.scrollSnapType = ""; tr.style.cursor = ""; });
    tr.addEventListener("mousemove", function (e) { if (!down) return; e.preventDefault(); tr.scrollLeft = sl - (e.pageX - sx); });
  }

  function initSlides() {
    var box = document.querySelector("[data-slides]");
    if (!box) return;
    var sl = $$(".slide", box), bars = $$("[data-slide-bars] i"), n = document.querySelector("[data-slide-n]"), cap = document.querySelector("[data-slide-cap]");
    var i = 0;
    function go(k) {
      sl[i].classList.remove("is-on"); if (bars[i]) bars[i].classList.remove("on");
      i = k % sl.length;
      sl[i].classList.add("is-on");
      if (bars[i]) { void bars[i].offsetWidth; bars[i].classList.add("on"); }
      if (n) n.textContent = ("0" + (i + 1)).slice(-2);
      if (cap) cap.textContent = sl[i].getAttribute("data-cap") || "";
    }
    setInterval(function () { if (!document.hidden) go(i + 1); }, 5500);
  }

  function initTimeline() {
    var tl = document.querySelector("[data-tl]");
    if (!tl) return;
    var tabs = $$("[data-tl-tab]", tl), panels = $$("[data-tl-panel]", tl);
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        var k = t.getAttribute("data-tl-tab");
        tabs.forEach(function (x) { x.setAttribute("aria-selected", x === t ? "true" : "false"); });
        panels.forEach(function (p) { p.classList.toggle("is-on", p.getAttribute("data-tl-panel") === k); });
      });
    });
  }

  function initWaFloat() {
    var b = document.querySelector(".wa-float"), q = document.querySelector("#presupuesto");
    if (!b) return;
    var on = function () {
      var past = scrollY > innerHeight * .7, r = q ? q.getBoundingClientRect() : null;
      var at = r && r.top < innerHeight * .9 && r.bottom > 0;
      b.classList.toggle("is-shown", past && !at);
    };
    addEventListener("scroll", on, { passive: true }); on();
  }

  function initMagnetic() {
    if (matchMedia("(hover: none)").matches) return;
    $$("[data-magnetic]").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * .18 + "px," + (e.clientY - r.top - r.height / 2) * .3 + "px)";
      });
      b.addEventListener("mouseout", function (e) {
        if (b.contains(e.relatedTarget)) return;
        b.style.transition = "transform .6s cubic-bezier(.34,1.56,.64,1), background .3s";
        b.style.transform = "";
        setTimeout(function () { b.style.transition = ""; }, 600);
      });
    });
  }

  function initParallax() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    $$("[data-parallax]").forEach(function (el) {
      gsap.to(el, { y: (parseFloat(el.getAttribute("data-parallax")) || 0) * 2, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } });
    });
    gsap.to(".slides", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .5 } });
    gsap.to(".hero-slash", { xPercent: 10, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } });
    // Marquee acelera con el scroll
    var track = document.querySelector(".marquee-track");
    if (track && track.getAnimations) {
      var anim = track.getAnimations()[0], last = scrollY, t;
      addEventListener("scroll", function () {
        if (!anim) return;
        var v = Math.min(4, 1 + Math.abs(scrollY - last) / 30); last = scrollY;
        anim.playbackRate = v; clearTimeout(t); t = setTimeout(function () { anim.playbackRate = 1; }, 160);
      }, { passive: true });
    }
  }

  function boot() {
    safe(initSplash, "splash"); safe(initReveal, "reveal"); safe(initNav, "nav"); safe(initLinks, "links");
    safe(initQuote, "quote"); safe(initWorks, "works"); safe(initSlides, "slides"); safe(initTimeline, "timeline"); safe(initWaFloat, "waFloat"); safe(initMagnetic, "magnetic"); safe(initParallax, "parallax");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
