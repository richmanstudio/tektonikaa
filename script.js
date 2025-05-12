/* =========================================================================
   ТЕКТОНИКА — front-end logic
   (burger-menu, smooth-scroll, reveal-on-scroll, tabs, toast on form submit)
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------
     1. Burger-menu (mobile)
  ------------------------------------------------- */
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
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => nav.classList.contains('open') && toggleMenu())
    );

    /* click outside */
    document.addEventListener('click', e => {
      if (nav.classList.contains('open') &&
          !nav.contains(e.target) && !burger.contains(e.target)) {
        toggleMenu();
      }
    });
  }

  /* -------------------------------------------------
     2. Smooth anchor scroll (if motion allowed)
  ------------------------------------------------- */
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const id = link.getAttribute('href').slice(1);
        const tgt = document.getElementById(id);
        if (tgt) {
          e.preventDefault();
          tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', `#${id}`);
        }
      });
    });
  }

  /* -------------------------------------------------
     3. Reveal-on-scroll via IntersectionObserver
  ------------------------------------------------- */
  const animElems = document.querySelectorAll('.anim-init');
  if (animElems.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((ent, ob) => {
      ent.forEach(item => {
        if (item.isIntersecting) {
          item.target.classList.add('anim-active');
          ob.unobserve(item.target);
        }
      });
    }, { threshold: .15 });
    animElems.forEach(el => io.observe(el));
  } else {
    animElems.forEach(el => el.classList.add('anim-active'));
  }

  /* -------------------------------------------------
     4. Careers tabs
  ------------------------------------------------- */
  const tabBtns   = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabBtns.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        /* buttons */
        tabBtns.forEach(b => b.classList.toggle('active', b === btn));
        /* panels */
        tabPanels.forEach(p => p.classList.toggle('active', p.id === btn.dataset.tab));
      });
    });
  }

  /* -------------------------------------------------
     5. Practice form — toast feedback (stub)
  ------------------------------------------------- */
  const form = document.getElementById('internForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      /* simple field check */
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      showToast('Спасибо! Заявка отправлена.');

      /* reset fields for UX */
      form.reset();
    });
  }

  /* -------------------------------------------------
     Helper: toast generator
  ------------------------------------------------- */
  function showToast(msg = 'OK', ms = 4000) {
    /* if existing toast — remove */
    const old = document.querySelector('.toast');
    if (old) old.remove();

    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);

    /* trigger transition */
    requestAnimationFrame(() => el.classList.add('show'));

    /* auto hide */
    setTimeout(() => {
      el.classList.remove('show');
      el.addEventListener('transitionend', () => el.remove(), { once:true });
    }, ms);
  }

});
