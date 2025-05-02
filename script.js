document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('mobileNav');

  if (!burger || !nav) return;

  const lockScroll   = () => document.body.style.overflow = 'hidden';
  const unlockScroll = () => document.body.style.overflow = '';

  const toggleMenu = () => {
    const open = nav.classList.toggle('open');
    burger.classList.toggle('open', open);
    open ? lockScroll() : unlockScroll();
  };

  burger.addEventListener('click', toggleMenu);

  /* закрытие по ссылке */
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      if (nav.classList.contains('open')) toggleMenu();
    })
  );

  /* закрытие по тапу вне панели */
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) && !burger.contains(e.target)) {
      toggleMenu();
    }
  });
});
