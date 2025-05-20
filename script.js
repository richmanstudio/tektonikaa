/* =====================================================================
   Т Е К Т О Н И К А • script.js            (full bundle v7 – 2025-05-30)
   ───────────────────────────────────────────
   ▸ Бургер-меню
   ▸ Плавный скролл
   ▸ Reveal-on-scroll   (.reveal → .show)
   ▸ Универсальные ТАБЫ  (элемент с data-tab на ЛЮБОЙ странице)
   ▸ «Фото» → сезоны (data-season)
   ▸ Лайтбокс-галерея
   ▸ Toast-уведомление (форма практики – заглушка)
   ===================================================================== */
   document.addEventListener('DOMContentLoaded', () => {

    /* ───────────────────────────────────────────
       1.  Burger
       ───────────────────────────────────────── */
    const burger = document.getElementById('burger');
    const nav    = document.getElementById('mobileNav');
  
    if (burger && nav) {
      const lock   = () => document.body.style.overflow = 'hidden';
      const unlock = () => document.body.style.overflow = '';
  
      const toggle = () => {
        const open = nav.classList.toggle('open');
        burger.classList.toggle('open', open);
        open ? lock() : unlock();
      };
  
      burger.addEventListener('click', toggle);
      nav.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => nav.classList.contains('open') && toggle())
      );
      document.addEventListener('click', e => {
        if (nav.classList.contains('open') &&
            !nav.contains(e.target) && !burger.contains(e.target)) toggle();
      });
    }
  
    /* ───────────────────────────────────────────
       2.  Smooth anchors (skip if reduce-motion)
       ───────────────────────────────────────── */
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const id = a.getAttribute('href').slice(1);
          const tgt = document.getElementById(id);
          if (tgt) {
            e.preventDefault();
            tgt.scrollIntoView({ behavior:'smooth', block:'start' });
            history.pushState(null,'',`#${id}`);
          }
        });
      });
    }
  
    /* ───────────────────────────────────────────
       3.  Reveal-observer
       ───────────────────────────────────────── */
    const revealElems = () => document.querySelectorAll('.reveal:not(.show)');
    const io = new IntersectionObserver((entries, ob) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('show');
          ob.unobserve(ent.target);
        }
      });
    },{ threshold:.15 });
    revealElems().forEach(el => io.observe(el));
  
    /* ───────────────────────────────────────────
       4.  MAIN TABS  (любой элемент data-tab)
       ───────────────────────────────────────── */
    const mainTabBtns = document.querySelectorAll('[data-tab]');
  
    function activateMainTab(id){
      /* кнопки */
      mainTabBtns.forEach(btn =>
        btn.classList.toggle('active', btn.dataset.tab === id)
      );
  
      /* панели (поддержка .tab-pane и .tab-panel) */
      document.querySelectorAll('.tab-pane, .tab-panel').forEach(p =>
        p.classList.toggle('active', p.id === id)
      );
  
      /* mobile <select> sync */
      const sel = document.getElementById('mediaSelect');
      if (sel && sel.value !== id) sel.value = id;
  
      /* наблюдать reveal в новом контенте */
      revealElems().forEach(el => io.observe(el));
    }
  
    mainTabBtns.forEach(btn =>
      btn.addEventListener('click', () => activateMainTab(btn.dataset.tab))
    );
  
    const mediaSelect = document.getElementById('mediaSelect');
    if (mediaSelect){
      mediaSelect.addEventListener('change', () => activateMainTab(mediaSelect.value));
    }
  
    /* ───────────────────────────────────────────
       5.  SEASON TABS (data-season)
       ───────────────────────────────────────── */
    const seasonBtns = document.querySelectorAll('.season-tabs .tab-btn');
    function activateSeason(code){
      seasonBtns.forEach(b =>
        b.classList.toggle('active', b.dataset.season === code)
      );
      document.querySelectorAll('.season-pane').forEach(p =>
        p.classList.toggle('active', p.id === `season-${code}`)
      );
      revealElems().forEach(el => io.observe(el));
    }
    seasonBtns.forEach(btn =>
      btn.addEventListener('click', () => activateSeason(btn.dataset.season))
    );
  
    /* ───────────────────────────────────────────
       6.  Lightbox gallery
       ───────────────────────────────────────── */
    const lightbox = document.getElementById('lightbox');
    const lbImg    = lightbox ? lightbox.querySelector('img') : null;
    if (lightbox && lbImg){
      document.body.addEventListener('click', e => {
        const anchor = e.target.closest('.gallery a');
        if (anchor){
          e.preventDefault();
          lbImg.src = anchor.href;
          lightbox.classList.add('show');
        }
      });
      const close = () => lightbox.classList.remove('show');
      lightbox.addEventListener('click', close);
      document.addEventListener('keyup', e => e.key === 'Escape' && close());
    }
  
    /* ───────────────────────────────────────────
       7.  Practice-form stub  → toast
       ───────────────────────────────────────── */
    const internForm = document.getElementById('internForm');
    if (internForm){
      internForm.addEventListener('submit', e => {
        e.preventDefault();
        if (!internForm.checkValidity()){internForm.reportValidity();return;}
        toast('Спасибо! Заявка отправлена.');
        internForm.reset();
      });
    }
  
    /* ───────────────────────────────────────────
       Helper: TOAST
       ───────────────────────────────────────── */
    function toast(msg='OK', ms=4000){
      let t = document.querySelector('.toast');
      if (t) t.remove();
  
      t = document.createElement('div');
      t.className = 'toast';
      t.textContent = msg;
      document.body.appendChild(t);
  
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => {
        t.classList.remove('show');
        t.addEventListener('transitionend', () => t.remove(), { once:true });
      }, ms);
    }
  
  });