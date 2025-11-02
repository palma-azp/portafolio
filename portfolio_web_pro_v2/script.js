// Helpers
const $ = (q, ctx=document) => ctx.querySelector(q);
const $$ = (q, ctx=document) => [...ctx.querySelectorAll(q)];

document.addEventListener('DOMContentLoaded', () => {
  // Año dinámico
  $('#year').textContent = new Date().getFullYear();

  // Toggle nav en móvil
  const navBtn = $('.nav-toggle');
  const nav = $('#site-nav');
  navBtn?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navBtn.setAttribute('aria-expanded', String(open));
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.2});
  $$('.reveal').forEach(el => io.observe(el));

  // Dark / Light theme toggle with localStorage
  const themeBtn = $('#themeBtn');
  const root = document.documentElement;
  const KEY = 'pref-theme';
  const setTheme = (mode) => {
    root.dataset.theme = mode;
    themeBtn.setAttribute('aria-pressed', mode === 'dark');
    const icon = themeBtn.querySelector('i');
    icon.className = mode === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem(KEY, mode);
  };
  const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(localStorage.getItem(KEY) || (sysDark ? 'dark' : 'light'));
  themeBtn.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  // Back to top
  const toTop = $('#toTop');
  const onScroll = () => {
    if (window.scrollY > 600) {
      toTop.hidden = false;
    } else {
      toTop.hidden = true;
    }
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // Filters
  const chips = $$('.chip');
  const cards = $$('.project-card');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    const f = chip.dataset.filter;
    cards.forEach(card => {
      const match = f === 'all' || card.dataset.tags.includes(f);
      card.style.display = match ? '' : 'none';
    });
  }));

  // Modal
  const modal = $('#projectModal');
  const title = $('.modal-title', modal);
  const img = $('.modal-img', modal);
  const desc = $('.modal-desc', modal);
  const [demo, repo] = $$('.modal-actions a', modal);

  $$('.open-modal').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const card = ev.currentTarget.closest('.project-card');
      title.textContent = card.dataset.title;
      desc.textContent = card.dataset.desc;
      img.src = $('img', card).src;
      img.alt = card.dataset.title;
      demo.href = card.dataset.demo;
      repo.href = card.dataset.repo;
      modal.showModal();
    });
  });
  $('.modal-close', modal).addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => {
    const rc = $('.modal-card', modal).getBoundingClientRect();
    const outside = e.clientX < rc.left || e.clientX > rc.right || e.clientY < rc.top || e.clientY > rc.bottom;
    if (outside) modal.close();
  });

  // Form validation (client side)
  const form = $('.contact-form');
  form.addEventListener('submit', (e) => {
    let ok = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(field => {
      const error = field.parentElement.querySelector('.error');
      if (!field.value.trim()) {
        ok = false;
        error.textContent = 'Este campo es obligatorio.';
      } else if (field.type === 'email' && !/^\S+@\S+\.\S+$/.test(field.value)) {
        ok = false;
        error.textContent = 'Ingresa un email válido.';
      } else {
        error.textContent = '';
      }
    });
    if (ok) {
      alert('¡Gracias! Me pondré en contacto.');
      form.reset();
    } else {
      e.preventDefault();
    }
  });
});
