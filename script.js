/* =====================================================================
   Т Е К Т О Н И К А • script.js  (2025-05, единый фронт-bundle)
   Функционал:
   – Бургер-меню (моб.)
   – Плавный скролл по якорям
   – Анимация появления секций
   – Табы (карьера и медиа-центр: sidebar + mobile-select)
   – Lightbox-галерея (Фото)
   – Toast-уведомление (форма практики / stub)
   ===================================================================== */
   document.addEventListener('DOMContentLoaded', () => {

    /* ───────────────────────────────────────────
       1.  Burger-menu (mobile)
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
       2.  Smooth anchor scroll (no reduce-motion)
       ───────────────────────────────────────── */
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
          const id = link.getAttribute('href').slice(1);
          const target = document.getElementById(id);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', `#${id}`);
          }
        });
      });
    }
  
    /* ───────────────────────────────────────────
       3.  Reveal-on-scroll (IntersectionObserver)
       ───────────────────────────────────────── */
    const animElems = document.querySelectorAll('.anim-init');
    if (animElems.length && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, ob) => {
        entries.forEach(el => {
          if (el.isIntersecting) {
            el.target.classList.add('anim-active');
            ob.unobserve(el.target);
          }
        });
      }, { threshold: .15 });
      animElems.forEach(e => io.observe(e));
    } else {
      animElems.forEach(e => e.classList.add('anim-active'));
    }
  
    /* ───────────────────────────────────────────
       4.  Универсальные табы
       ───────────────────────────────────────── */
    function activateTab(id){
      /* кнопки */
      document.querySelectorAll('.tab-button, .tab-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.tab === id)
      );
      /* панели */
      document.querySelectorAll('.tab-panel, .tab-pane').forEach(p =>
        p.classList.toggle('active', p.id === id)
      );
      /* mobile-select sync */
      const select = document.getElementById('mediaSelect');
      if (select && select.value !== id) select.value = id;
    }
  
    document.querySelectorAll('.tab-button, .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn.dataset.tab));
    });
  
    const mediaSelect = document.getElementById('mediaSelect');
    if (mediaSelect){
      mediaSelect.addEventListener('change', () => activateTab(mediaSelect.value));
    }
  
    /* ───────────────────────────────────────────
       5.  Practice form (stub) + toast
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
       6.  Lightbox-gallery (media > Фото)
       ───────────────────────────────────────── */
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = lightbox ? lightbox.querySelector('img') : null;
    const gallery   = document.querySelectorAll('.gallery a');
  
    if (lightbox && lbImg && gallery.length){
      gallery.forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          lbImg.src = link.href;
          lightbox.classList.add('show');
        });
      });
      const close = () => lightbox.classList.remove('show');
      lightbox.addEventListener('click', close);
      document.addEventListener('keyup', e => e.key === 'Escape' && close());
    }
  
    /* ───────────────────────────────────────────
       Helper • toast()
       ───────────────────────────────────────── */
    function toast(msg = 'OK', ms = 4000){
      let t = document.querySelector('.toast');
      if (t) t.remove();
  
      t = document.createElement('div');
      t.className = 'toast';
      t.textContent = msg;
      document.body.appendChild(t);
  
      requestAnimationFrame(() => t.classList.add('show'));
      setTimeout(() => {
        t.classList.remove('show');
        t.addEventListener('transitionend', () => t.remove(), { once: true });
      }, ms);
    }
  
  });