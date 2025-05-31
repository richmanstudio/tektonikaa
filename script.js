/* =====================================================================
   Т Е К Т О Н И К А • script.js            (full bundle v7 – 2025-05-30)
   ───────────────────────────────────────────
   ▸ Бургер-меню
   ▸ Плавный скролл
   ▸ Reveal-on-scroll   (.reveal → .show)
   ▸ Универсальные ТАБЫ  (элемент с data-tab на ЛЮБОЙ странице)
   ▸ «Фото» → сезоны (data-season)
   ▸ Лайтбокс-галерея
   ▸ Toast-уведомление (форма практики – отправка через EmailJS)
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
     4.  MAIN TABS  (любые data-tab)
     ───────────────────────────────────────── */
  const mainTabBtns = document.querySelectorAll('[data-tab]');

  function activateMainTab(id){
    mainTabBtns.forEach(btn =>
      btn.classList.toggle('active', btn.dataset.tab === id)
    );
    document.querySelectorAll('.tab-pane, .tab-panel').forEach(p =>
      p.classList.toggle('active', p.id === id)
    );
    // sync media-select
    const sel = document.getElementById('mediaSelect');
    if (sel && sel.value !== id) sel.value = id;
    // sync research-select
    const rsel = document.getElementById('researchSelect');
    if (rsel && rsel.value !== id) rsel.value = id;
    revealElems().forEach(el => io.observe(el));
  }

  mainTabBtns.forEach(btn =>
    btn.addEventListener('click', () => activateMainTab(btn.dataset.tab))
  );

  const mediaSelect = document.getElementById('mediaSelect');
  if (mediaSelect){
    mediaSelect.addEventListener('change', () => activateMainTab(mediaSelect.value));
  }

  // research select (mobile)
  const researchSelect = document.getElementById('researchSelect');
  if (researchSelect){
    researchSelect.addEventListener('change', () => activateMainTab(researchSelect.value));
  }

  /* ───────────────────────────────────────────
     5.  SEASON TABS (data-season)
     ───────────────────────────────────────── */
  const seasonBtns = document.querySelectorAll('[data-season]');
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
     7.  Practice-form → EmailJS отправка
     ───────────────────────────────────────── */
  const internForm = document.getElementById('internForm');
  if (internForm) {
    internForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!internForm.checkValidity()) {
        internForm.reportValidity();
        return;
      }

      const submitBtn = internForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Блокируем кнопку на время отправки
      submitBtn.disabled = true;
      submitBtn.textContent = "Отправка...";

      try {
        // Собираем данные формы
        const formData = {
          track: internForm.querySelector('[name="track"]').value,
          start: internForm.querySelector('[name="start"]').value,
          weeks: internForm.querySelector('[name="weeks"]').value,
          fio: internForm.querySelector('[name="fio"]').value,
          dob: internForm.querySelector('[name="dob"]').value,
          city: internForm.querySelector('[name="city"]').value,
          phone: internForm.querySelector('[name="phone"]').value,
          email: internForm.querySelector('[name="email"]').value,
          prev: internForm.querySelector('[name="prev"]').value,
          prevInfo: internForm.querySelector('[name="prevInfo"]').value,
          edu: internForm.querySelector('[name="edu"]').value,
          skills: internForm.querySelector('[name="skills"]').value,
          cv: "Прикреплено в виде файла"
        };

        // Обработка файла резюме
        const cvFile = internForm.querySelector('[name="cv"]').files[0];
        let cvAttachment = null;
        
        if (cvFile) {
          // Преобразуем файл в base64 для отправки
          cvAttachment = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({
              name: cvFile.name,
              data: reader.result.split(',')[1]
            });
            reader.readAsDataURL(cvFile);
          });
        }

        // Отправка через EmailJS
        const response = await emailjs.send(
          'service_labg6pe',
          'template_tusbpp5',
          formData,
          'm4DT1MN15nyCSdWzE',
          cvAttachment ? [cvAttachment] : null
        );

        if (response.status === 200) {
          toast('Спасибо! Заявка отправлена.');
          internForm.reset();
        } else {
          toast('Ошибка отправки. Попробуйте позже.');
        }
      } catch (error) {
        console.error('Ошибка отправки:', error);
        toast('Ошибка: ' + (error.text || 'Попробуйте позже'));
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
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