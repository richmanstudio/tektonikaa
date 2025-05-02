/* бургер‑меню и блокировка скролла */
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('mobileNav');

  if (!burger || !nav) return;

  const openMenu  = () => {
    nav.classList.add('open');
    burger.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    nav.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });

  nav.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', closeMenu)
  );

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') &&
        !nav.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });
});
