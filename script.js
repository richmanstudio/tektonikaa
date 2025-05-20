/* =====================================================================
   Т Е К Т О Н И К А • script.js
   Универсальный клиент-скрипт: бургер-меню, плавный скролл, появление
   секций, табы (карьера / медиа), lightbox-галерея, toast-уведомления.
   ===================================================================== */
   document.addEventListener('DOMContentLoaded', () => {

    /* ───────────────────────────────────────────
       1.  Burger-меню (mobile)
       ───────────────────────────────────────── */
    const burger = document.getElementById('burger');
    const nav    = document.getElementById('mobileNav');
  
    if (burger && nav) {
      const lock   = () => document.body.style.overflow = 'hidden';
      const unlock = () => document.body.style.overflow = '';
  
      const toggleMenu = () => {
        const open = nav.classList.toggle('open');
        burger.classList.toggle('open', open);
        open ? lock() : unlock();
      };
  
      burger.addEventListener('click', toggleMenu);
      nav.querySelectorAll('a').forEach(link =>
        link.addEventListener('click', () => nav.classList.contains('open') && toggleMenu())
      );
  
      document.addEventListener('click', e => {
        if (nav.classList.contains('open') &&
            !nav.contains(e.target) && !burger.contains(e.target)) {
          toggleMenu();
        }
      });
    }
  
    /* ───────────────────────────────────────────
       2.  Smooth-scroll по якорям
       ───────────────────────────────────────── */
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          const id = a.getAttribute('href').slice(1);
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
    const reveal = document.querySelectorAll('.anim-init');
    if (reveal.length && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, ob) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('anim-active');
            ob.unobserve(entry.target);
          }
        });
      }, { threshold: .15 });
      reveal.forEach(el => io.observe(el));
    } else {
      reveal.forEach(el => el.classList.add('anim-active'));
    }
  
    /* ───────────────────────────────────────────
       4.  Tabs — карьера ('.tab-button')
                  и медиа ('.tab-btn' + select)
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
      /* select (mobile) */
      const sel = document.getElementById('mediaSelect');
      if (sel && sel.value !== id) sel.value = id;
    }
  
    /* кнопки-табы */
    document.querySelectorAll('.tab-button, .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => activateTab(btn.dataset.tab));
    });
  
    /* mobile-select в media.html */
    const mediaSelect = document.getElementById('mediaSelect');
    if (mediaSelect){
      mediaSelect.addEventListener('change', () => activateTab(mediaSelect.value));
    }
  
    /* ───────────────────────────────────────────
       5.  Practice form stub + toast
       ───────────────────────────────────────── */
    const internForm = document.getElementById('internForm');
    if (internForm){
      internForm.addEventListener('submit', e => {
        e.preventDefault();
        if (!internForm.checkValidity()){internForm.reportValidity();return;}
        showToast('Спасибо! Заявка отправлена.');
        internForm.reset();
      });
    }
  
    /* ───────────────────────────────────────────
       6.  Lightbox-галерея (media.html > .gallery)
       ───────────────────────────────────────── */
    const galleryLinks = document.querySelectorAll('.gallery a');
    const lightbox     = document.getElementById('lightbox');
    const lbImg        = lightbox ? lightbox.querySelector('img') : null;
  
    if (galleryLinks.length && lightbox && lbImg){
      galleryLinks.forEach(link => {
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
       Helper • Toast
       ───────────────────────────────────────── */
    function showToast(msg='OK', ms=4000){
      let t = document.querySelector('.toast');
      if (t) t.remove();
  
      t = document.createElement('div');
      t.className = 'toast';
      t.textContent = msg;
      document.body.appendChild(t);
  
      requestAnimationFrame(()=>t.classList.add('show'));
      setTimeout(()=>{
        t.classList.remove('show');
        t.addEventListener('transitionend', ()=>t.remove(),{once:true});
      }, ms);
    }
  
  });