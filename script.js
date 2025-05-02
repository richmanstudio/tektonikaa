/* плавный скролл формы */
document.getElementById('contactForm')
  .addEventListener('submit', e=>{
    e.preventDefault();
    document.getElementById('formMsg').textContent = 'Спасибо! Мы свяжемся с вами в течение дня.';
    e.target.reset();
});

/* бургер-меню */
const burger = document.getElementById('burger');
const nav    = document.getElementById('mobileNav');

burger.addEventListener('click', ()=>{
  nav.classList.toggle('open');
  burger.classList.toggle('open');
});

/* закрывать меню при клике по ссылке */
nav.querySelectorAll('a').forEach(link=>{
  link.addEventListener('click', ()=>{
    if(nav.classList.contains('open')){
      nav.classList.remove('open');
      burger.classList.remove('open');
    }
  });
});
