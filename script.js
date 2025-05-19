/* =====================================================================
   ТЕКТОНИКА • script.js
   Single client-side bundle: burger-menu, smooth scroll, reveal-on-scroll,
   tabs (careers), toast-feedback, lightbox-gallery.
   ===================================================================== */
   document.addEventListener('DOMContentLoaded', () => {

    /* ──────────────────────────────────────────────────────────────────
       1.  Burger-menu (mobile)
       ──────────────────────────────────────────────────────────────── */
    const burger = document.getElementById('burger');
    const nav    = document.getElementById('mobileNav');
  
    if (burger && nav) {
      const lock   = () => document.body.style.overflow = 'hidden';
      const unlock = () => document.body.style.overflow = '';
  
      const toggleMenu = () => {
        const isOpen = nav.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        isOpen ? lock() : unlock();
      };
  
      burger.addEventListener('click', toggleMenu);
      nav.querySelectorAll('a').forEach(link =>
        link.addEventListener('click', () => nav.classList.contains('open') && toggleMenu())
      );
  
      document.addEventListener('click', e => {
        if (nav.classList.contains('open') &&
            !nav.contains(e.target) && !burger.contains(e.target))
          toggleMenu();
      });
    }
  
    /* ──────────────────────────────────────────────────────────────────
       2.  Smooth anchor scroll (respect reduced-motion)
       ──────────────────────────────────────────────────────────────── */
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
  
    /* ──────────────────────────────────────────────────────────────────
       3.  Reveal-on-scroll  (IntersectionObserver)
       ──────────────────────────────────────────────────────────────── */
    const revealElems = document.querySelectorAll('.anim-init');
    if (revealElems.length && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('anim-active');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: .15 });
      revealElems.forEach(el => io.observe(el));
    } else {
      revealElems.forEach(el => el.classList.add('anim-active'));
    }
  
    /* ──────────────────────────────────────────────────────────────────
       4.  Careers.html › Tabs
       ──────────────────────────────────────────────────────────────── */
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels  = document.querySelectorAll('.tab-panel');
  
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.toggle('active', b === btn));
        tabPanels.forEach(p => p.classList.toggle('active', p.id === id));
      });
    });
  
    /* ──────────────────────────────────────────────────────────────────
       5.  Practice form stub  + toast feedback
       ──────────────────────────────────────────────────────────────── */
    const form = document.getElementById('internForm');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        showToast('Спасибо! Заявка отправлена.');
        form.reset();
      });
    }
  
    /* ──────────────────────────────────────────────────────────────────
       6.  Lightbox gallery (media.html)
       ──────────────────────────────────────────────────────────────── */
    const galleryLinks = document.querySelectorAll('.gallery a');
    const lightbox     = document.getElementById('lightbox');
    const lbImg        = lightbox ? lightbox.querySelector('img') : null;
  
    if (galleryLinks.length && lightbox && lbImg) {
      galleryLinks.forEach(link => {
        link.addEventListener('click', e => {
          e.preventDefault();
          lbImg.src = link.href;
          lightbox.classList.add('show');
        });
      });
  
      const hide = () => lightbox.classList.remove('show');
      lightbox.addEventListener('click', hide);
      document.addEventListener('keyup', e => e.key === 'Escape' && hide());
    }
  
    /* ──────────────────────────────────────────────────────────────────
       Helper • Toast
       ──────────────────────────────────────────────────────────────── */
    function showToast(message = 'OK', ms = 4000) {
      let toast = document.querySelector('.toast');
      if (toast) toast.remove();
  
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      document.body.appendChild(toast);
  
      requestAnimationFrame(() => toast.classList.add('show'));
      setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove(), { once:true });
      }, ms);
    }
  
  });
