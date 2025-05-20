/* =====================================================================
   Т Е К Т О Н И К А • script.js  (May-2025, rev-4)
   Функционал:
     – бургер-меню
     – плавный скролл
     – reveal-on-scroll
     – табы (кадры «карьера» + медиа: news / photo / docs — без video & audio)
     – lightbox-галерея для фото
     – toast-уведомления (форма практики — заглушка)
   ===================================================================== */
   document.addEventListener('DOMContentLoaded', () => {

    /* ───────────────────────────────────────────
       1.  Burger-меню
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
       2.  Anchor-scroll
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
    const reveal = document.querySelectorAll('.anim-init');
    if (reveal.length && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, ob) => {
        entries.forEach(ent => {
          if (ent.isIntersecting) {
            ent.target.classList.add('anim-active');
            ob.unobserve(ent.target);
          }
        });
      }, { threshold:.15 });
      reveal.forEach(el => io.observe(el));
    } else { reveal.forEach(el => el.classList.add('anim-active')); }
  
    /* ───────────────────────────────────────────
       4.  Tabs  (универсально по data-tab)
       ───────────────────────────────────────── */
    function activateTab(id){
      document.querySelectorAll('.tab-btn,.tab-button').forEach(b =>
        b.classList.toggle('active', b.dataset.tab === id)
      );
      document.querySelectorAll('.tab-pane,.tab-panel').forEach(p =>
        p.classList.toggle('active', p.id === id)
      );
      const sel = document.getElementById('mediaSelect');
      if (sel && sel.value !== id) sel.value = id;
    }
  
    document.querySelectorAll('.tab-btn,.tab-button').forEach(btn =>
      btn.addEventListener('click', () => activateTab(btn.dataset.tab))
    );
  
    const mediaSelect = document.getElementById('mediaSelect');
    if (mediaSelect){
      mediaSelect.addEventListener('change', () => activateTab(mediaSelect.value));
    }
  
    /* ───────────────────────────────────────────
       5.  Practice-form (stub) + toast
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
       6.  Lightbox-галерея (Фото)
       ───────────────────────────────────────── */
    const lightbox = document.getElementById('lightbox');
    const lbImg    = lightbox ? lightbox.querySelector('img') : null;
    if (lightbox && lbImg){
      document.querySelectorAll('.gallery a').forEach(link => {
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
       Helper • toast
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