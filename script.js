/* =====================================================================
   Т Е К Т О Н И К А • script.js   (May-2025  —  full bundle v6)
   Реализует:
   ▸ Бургер-меню
   ▸ Плавный скролл по якорям
   ▸ Reveal-on-scroll (добавляет .show элементам .reveal)
   ▸ Главные табы (Новости / Фото / Документы)
   ▸ Сезонные табы внутри «Фото»
   ▸ Lightbox-галерею
   ▸ Toast-уведомления (форма практики – заглушка)
   ===================================================================== */
   document.addEventListener('DOMContentLoaded', () => {

    /* ───────────────────────────────────────────
       1.  Burger-меню
       ───────────────────────────────────────── */
    const burger = document.getElementById('burger');
    const nav    = document.getElementById('mobileNav');
  
    if (burger && nav) {
      const blockScroll = () => document.body.style.overflow = 'hidden';
      const allowScroll = () => document.body.style.overflow = '';
  
      const toggle = () => {
        const open = nav.classList.toggle('open');
        burger.classList.toggle('open', open);
        open ? blockScroll() : allowScroll();
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
       2.  Smooth anchor scroll
       ───────────────────────────────────────── */
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
          const id = link.getAttribute('href').slice(1);
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
       3.  Reveal-on-scroll
       ───────────────────────────────────────── */
    const revealElems = () => document.querySelectorAll('.reveal:not(.show)');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('show');
          obs.unobserve(ent.target);
        }
      });
    }, { threshold:.15 });
  
    revealElems().forEach(el => io.observe(el));
  
    /* ───────────────────────────────────────────
       4.  Главные табы (News / Photo / Docs)
       ───────────────────────────────────────── */
    function activateMainTab(id){
      document.querySelectorAll('.tab-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.tab === id)
      );
      document.querySelectorAll('.tab-pane').forEach(p =>
        p.classList.toggle('active', p.id === id)
      );
      const sel = document.getElementById('mediaSelect');
      if (sel && sel.value !== id) sel.value = id;
  
      /* подгружаем reveal для нового контента */
      revealElems().forEach(el => io.observe(el));
    }
  
    document.querySelectorAll('.media-sidebar .tab-btn').forEach(btn =>
      btn.addEventListener('click', () => activateMainTab(btn.dataset.tab))
    );
  
    const mediaSelect = document.getElementById('mediaSelect');
    if (mediaSelect){
      mediaSelect.addEventListener('change', () => activateMainTab(mediaSelect.value));
    }
  
    /* ───────────────────────────────────────────
       5.  Season-tabs (внутри Фото)
       ───────────────────────────────────────── */
    function activateSeason(id){
      document.querySelectorAll('.season-tabs .tab-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.season === id)
      );
      document.querySelectorAll('.season-pane').forEach(p =>
        p.classList.toggle('active', p.id === `season-${id}`)
      );
      revealElems().forEach(el => io.observe(el));
    }
  
    document.querySelectorAll('.season-tabs .tab-btn').forEach(btn =>
      btn.addEventListener('click', () => activateSeason(btn.dataset.season))
    );
  
    /* ───────────────────────────────────────────
       6.  Lightbox-галерея (Фото)
       ───────────────────────────────────────── */
    const lightbox = document.getElementById('lightbox');
    const lbImg    = lightbox ? lightbox.querySelector('img') : null;
  
    if (lightbox && lbImg){
      document.body.addEventListener('click', e => {
        const link = e.target.closest('.gallery a');
        if (link){
          e.preventDefault();
          lbImg.src = link.href;
          lightbox.classList.add('show');
        }
      });
      const close = () => lightbox.classList.remove('show');
      lightbox.addEventListener('click', close);
      document.addEventListener('keyup', e => e.key === 'Escape' && close());
    }
  
    /* ───────────────────────────────────────────
       7.  Практика-форма (toast-заглушка)
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
       Helper • Toast
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