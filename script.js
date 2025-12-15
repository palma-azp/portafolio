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

<<<<<<< HEAD
    // Carruseles de evolución de diseños
  const designCarousels = $$('.design-carousel');

  designCarousels.forEach(carousel => {
    const track   = $('.carousel-track', carousel);
    const slides  = $$('img', track);
    const prevBtn = $('.carousel-btn.prev', carousel);
    const nextBtn = $('.carousel-btn.next', carousel);
    const dots    = $$('.carousel-dots .dot', carousel.closest('.design-card'));

    let index = 0;

    const showSlide = (i) => {
      const total = slides.length;
      const newIndex = (i + total) % total;

      slides.forEach((img, idx) => {
        img.classList.toggle('is-active', idx === newIndex);
      });

      dots.forEach((dot, idx) => {
        const active = idx === newIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active);
      });

      index = newIndex;
    };

    prevBtn?.addEventListener('click', () => showSlide(index - 1));
    nextBtn?.addEventListener('click', () => showSlide(index + 1));

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => showSlide(idx));
    });

    // Aseguramos que arranque bien
    showSlide(0);
  });


=======
>>>>>>> 4144d5602e85c7b2967893b9bb40bf35f3a6ceb5
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
<<<<<<< HEAD

// ===== Ocultar "Procesando datos..." después de que la sección IA sea visible =====
document.addEventListener("DOMContentLoaded", () => {
  const aiSection = document.querySelector(".ai-analytics");
  const aiStatus = document.querySelector(".ai-status");

  if (!aiSection || !aiStatus) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Espera unos segundos como si la IA estuviera analizando
          setTimeout(() => {
            aiStatus.classList.add("is-done");
          }, 3500); // 3.5 segundos

          // Ya no necesitamos seguir observando
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 } // ~40% de la sección debe estar visible
  );

  observer.observe(aiSection);
});

// ===========================
// Fondo animado: cabeza de robot (reactivo al mouse y scroll)
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  // Opcional: desactivar en pantallas muy pequeñas
  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  if (isMobile) return;

  const ctx = canvas.getContext("2d");
  const rootStyles = getComputedStyle(document.documentElement);

  const colBg      = rootStyles.getPropertyValue("--bg").trim()            || "#050509";
  const colInk     = rootStyles.getPropertyValue("--ink").trim()           || "#f7f3e8";
  const colBrand   = rootStyles.getPropertyValue("--brand").trim()         || "#f2b705";
  const colAccent  = rootStyles.getPropertyValue("--brand-accent").trim()  || "#e13b3b";

  const dpi = window.devicePixelRatio || 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width  = rect.width * dpi;
    canvas.height = rect.height * dpi;
    ctx.setTransform(dpi, 0, 0, dpi, 0, 0); // coordenadas en px "normales"
  }

  resize();
  window.addEventListener("resize", resize);

  // Seguimiento del mouse normalizado (-1 a 1)
  const mouse = { x: 0, y: 0 };
  let mouseInside = false;

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;

    if (mx >= 0 && mx <= 1 && my >= 0 && my <= 1) {
      mouseInside = true;
      mouse.x = (mx - 0.5) * 2;  // -1 a 1
      mouse.y = (my - 0.5) * 2;  // -1 a 1
    } else {
      mouseInside = false;
    }
  });

  // Scroll: lo usamos para inclinar un poquito extra la cabeza
  let scrollY = window.scrollY || 0;
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY || 0;
  }, { passive: true });

  function roundedRect(x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.lineTo(x + w - rr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
    ctx.lineTo(x + w, y + h - rr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
    ctx.lineTo(x + rr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
    ctx.lineTo(x, y + rr);
    ctx.quadraticCurveTo(x, y, x + rr, y);
    ctx.closePath();
  }

  let t = 0;

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    // Fondo constructivista suave
    ctx.save();
    ctx.fillStyle = colBg;
    ctx.fillRect(0, 0, w, h);

    ctx.globalAlpha = 0.14;
    ctx.fillStyle = colBrand;
    ctx.beginPath();
    ctx.moveTo(-w * 0.2, h * 0.2);
    ctx.lineTo(w * 0.7, -h * 0.3);
    ctx.lineTo(w * 1.1, h * 0.1);
    ctx.lineTo(w * 0.2, h * 0.6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = colAccent;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.8);
    ctx.lineTo(w * 0.9, h * 0.3);
    ctx.lineTo(w * 1.2, h * 1.1);
    ctx.lineTo(-w * 0.1, h * 1.1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Centro "base" donde flota la cabeza
    const cx = w * 0.68;
    const cy = h * 0.35;

    // Movimiento base suave
    const baseOffsetX = Math.cos(t * 0.0015) * 28;
    const baseOffsetY = Math.sin(t * 0.0012) * 18;
    const baseAngle   = Math.sin(t * 0.0015) * 0.25;

    // Influencia del mouse (si está encima del hero)
    const lookX = mouseInside ? mouse.x : 0;
    const lookY = mouseInside ? mouse.y : 0;

    // Extra tilt con el scroll
    const scrollTilt = Math.min(scrollY / 800, 0.35); // se limita para no volverse loco

    const offsetX = baseOffsetX + lookX * 26;
    const offsetY = baseOffsetY + lookY * 16;
    const angle   = baseAngle + lookX * 0.35 + scrollTilt;

    ctx.save();
    ctx.translate(cx + offsetX, cy + offsetY);
    ctx.rotate(angle);

    const headW = 120;
    const headH = 140;

    // Glow detrás de la cabeza
    ctx.beginPath();
    ctx.arc(0, 0, headH * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,0,0,0.40)";
    ctx.fill();

    // Cabeza (caja principal)
    roundedRect(-headW / 2, -headH / 2, headW, headH, 18);
    ctx.fillStyle = "#050509";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = colBrand;
    ctx.stroke();

    // Franja frontal diagonal
    ctx.save();
    ctx.translate(0, -headH * 0.2);
    ctx.rotate(-0.25);
    roundedRect(-headW * 0.55, -12, headW * 1.1, 24, 10);
    ctx.fillStyle = colAccent;
    ctx.fill();
    ctx.restore();

    // Parpadeo
    const blink = 0.6 + 0.4 * Math.abs(Math.sin(t * 0.004));
    const eyeY = -headH * 0.05;
    const eyeOffsetX = headW * 0.22;

    // Pupilas miran hacia el mouse
    const pupilLookX = lookX * 4.5;
    const pupilLookY = lookY * 3.0;

    function drawEye(ex) {
      ctx.save();
      ctx.translate(ex, eyeY);

      // Forma del ojo
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 10 * blink, 0, 0, Math.PI * 2);
      ctx.fillStyle = colInk;
      ctx.fill();

      // Iris
      ctx.beginPath();
      ctx.arc(0, 0, 5 * blink, 0, Math.PI * 2);
      ctx.fillStyle = colBrand;
      ctx.fill();

      // Pupila
      ctx.beginPath();
      ctx.arc(pupilLookX, pupilLookY, 2.2 * blink, 0, Math.PI * 2);
      ctx.fillStyle = "#050509";
      ctx.fill();

      ctx.restore();
    }

    drawEye(-eyeOffsetX);
    drawEye(eyeOffsetX);

    // Boca / rejilla
    const mouthW = headW * 0.6;
    const mouthH = 18;
    const mouthY = headH * 0.22;

    roundedRect(-mouthW / 2, mouthY - mouthH / 2, mouthW, mouthH, 6);
    ctx.fillStyle = "#111";
    ctx.fill();
    ctx.strokeStyle = colBrand;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.save();
    ctx.beginPath();
    for (let i = -3; i <= 3; i++) {
      const x = (mouthW / 2) * (i / 3);
      ctx.moveTo(x, mouthY - mouthH / 2);
      ctx.lineTo(x, mouthY + mouthH / 2);
    }
    ctx.strokeStyle = "rgba(247,243,232,0.4)";
    ctx.stroke();
    ctx.restore();

    // Antena
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, -headH / 2);
    ctx.lineTo(0, -headH * 0.8);
    ctx.strokeStyle = colBrand;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -headH * 0.86, 8, 0, Math.PI * 2);
    ctx.fillStyle = colAccent;
    ctx.fill();
    ctx.restore();

    // Cuello / base
    ctx.save();
    const neckW = headW * 0.4;
    const neckH = 18;
    roundedRect(-neckW / 2, headH * 0.35, neckW, neckH, 6);
    ctx.fillStyle = "#111";
    ctx.fill();
    ctx.restore();

    ctx.restore();

    t += 16;
    requestAnimationFrame(draw);
  }

  draw();
});

// ===== Red neuronal + cuadritos que generan frases y múltiples palabras =====
document.addEventListener('DOMContentLoaded', () => {
  const canvas   = document.getElementById('neuralCanvas');
  const phraseEl = document.getElementById('neuralPhrase');
  if (!canvas || !phraseEl) return;

  const ctx = canvas.getContext('2d');
  const rootStyles = getComputedStyle(document.documentElement);
  const dpi = window.devicePixelRatio || 1;

  const colInk    = rootStyles.getPropertyValue('--ink').trim()          || '#f7f3e8';
  const colBrand  = rootStyles.getPropertyValue('--brand').trim()        || '#f2b705';
  const colAccent = rootStyles.getPropertyValue('--brand-accent').trim() || '#e13b3b';

  const isEn = document.documentElement.lang === 'en';

  // Frases del chip de texto
  const phrases = isEn
    ? [
        'Landing pages focused on conversion',
        'Meta & Google Ads optimized by KPIs',
        'Dashboards to decide faster',
        'Python + APIs for automation',
        'From data to clear actions'
      ]
    : [
        'Landing pages enfocadas a conversión',
        'Campañas Meta & Google Ads optimizadas por KPIs',
        'Dashboards para decidir más rápido',
        'Automatización con Python y APIs',
        'De datos a acciones concretas'
      ];

  // Palabras que se dibujan con bloques en el canvas
  const shapeWords = isEn
    ? ['AI', 'DATA', 'KPIS', 'MARKETING', 'COMMUNITY']
    : ['IA', 'DATOS', 'INTELIGENCIA', 'MK', 'COMMUNITY', 'ADS', 'KPIS', 'PYTHON'];

  let currentPhrase = 0;
  let currentShapeIndex = 0;

  function currentShapeWord() {
    return shapeWords[currentShapeIndex % shapeWords.length];
  }

  function setPhrase(text){
    phraseEl.classList.remove('is-visible');
    phraseEl.textContent = text;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        phraseEl.classList.add('is-visible');
      });
    });
  }

  setPhrase(phrases[currentPhrase]);

  let width = 0;
  let height = 0;

  let nodes = [];
  let edges = [];
  let packets = [];

  let textTargets = [];
  let textParticles = [];

  let t = 0;
  let fires = 0;
  const pulsesPerPhrase = 7;
  let running = false;

  const mouse = { x: 0, y: 0, inside: false };

  function onMouseMove(e){
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    if (mx >= 0 && mx <= 1 && my >= 0 && my <= 1){
      mouse.inside = true;
      mouse.x = mx;
      mouse.y = my;
    } else {
      mouse.inside = false;
    }
  }
  window.addEventListener('mousemove', onMouseMove);

  function resize(){
    const rect = canvas.getBoundingClientRect();
    width  = rect.width;
    height = rect.height;
    canvas.width  = width * dpi;
    canvas.height = height * dpi;
    ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
    buildNetwork();
    buildTextTargets();
  }

  // Red de nodos + conexiones
  function buildNetwork(){
    nodes = [];
    edges = [];
    packets = [];

    const cols = 7;
    const rows = 4;
    const marginX = width  * 0.12;
    const marginY = height * 0.18;
    const usableW = width  - marginX * 2;
    const usableH = height - marginY * 2;

    for (let j = 0; j <= rows; j++){
      for (let i = 0; i <= cols; i++){
        const x = marginX + (usableW / cols) * i + (Math.random() - 0.5) * 18;
        const y = marginY + (usableH / rows) * j + (Math.random() - 0.5) * 14;
        nodes.push({ x, y });
      }
    }

    const idx = (i, j) => j * (cols + 1) + i;

    for (let j = 0; j <= rows; j++){
      for (let i = 0; i <= cols; i++){
        if (i < cols) {
          edges.push({ a: idx(i, j), b: idx(i + 1, j) });
        }
        if (j < rows) {
          edges.push({ a: idx(i, j), b: idx(i, j + 1) });
          if (i < cols) {
            edges.push({ a: idx(i, j), b: idx(i + 1, j + 1) });
          }
        }
      }
    }

    const packetCount = 18;
    for (let k = 0; k < packetCount; k++){
      packets.push({
        edgeIndex: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.0025 + Math.random() * 0.0035
      });
    }
  }

  // Genera puntos destino para dibujar la palabra actual
  function buildTextTargets(){
    textTargets = [];
    textParticles = [];

    if (!width || !height) return;

    const word = currentShapeWord();

    const off = document.createElement('canvas');
    const tw = 340;
    const th = 120;
    off.width  = tw;
    off.height = th;
    const octx = off.getContext('2d');

    octx.fillStyle = 'black';
    octx.fillRect(0, 0, tw, th);

    octx.font = '700 68px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillStyle = 'white';
    octx.fillText(word, tw / 2, th / 2);

    const img = octx.getImageData(0, 0, tw, th);
    const data = img.data;
    const step = 4;

    for (let y = 0; y < th; y += step){
      for (let x = 0; x < tw; x += step){
        const idx = (y * tw + x) * 4 + 3; // alpha
        if (data[idx] > 128){
          const px = width * 0.55 + (x / tw - 0.5) * (width * 0.4);
          const py = height * 0.5 + (y / th - 0.5) * (height * 0.6);
          textTargets.push({ x: px, y: py });
        }
      }
    }

    textParticles = textTargets.map(target => ({
      x: width * 0.5 + (Math.random() - 0.5) * width * 0.6,
      y: height * 0.5 + (Math.random() - 0.5) * height * 0.4,
      target,
      phase: Math.random()
    }));
  }

  resize();
  window.addEventListener('resize', resize);

  function resetPacket(p){
    p.edgeIndex = Math.floor(Math.random() * edges.length);
    p.t = 0;
    p.speed = 0.0025 + Math.random() * 0.0035;

    fires++;
    if (fires % pulsesPerPhrase === 0){
      // Cambiar frase del chip
      currentPhrase = (currentPhrase + 1) % phrases.length;
      setPhrase(phrases[currentPhrase]);

      // Cambiar palabra dibujada con bloques
      currentShapeIndex = (currentShapeIndex + 1) % shapeWords.length;
      buildTextTargets();
    }
  }

  function draw(){
    if (!running) return;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, 'rgba(0,0,0,1)');
    bg.addColorStop(1, 'rgba(10,10,18,1)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    const offsetX = mouse.inside ? (mouse.x - 0.5) * 14 : 0;
    const offsetY = mouse.inside ? (mouse.y - 0.5) * 10 : 0;

    // Líneas de la red
    ctx.save();
    ctx.lineCap = 'round';
    edges.forEach((e) => {
      const a = nodes[e.a];
      const b = nodes[e.b];
      ctx.beginPath();
      ctx.moveTo(a.x + offsetX * 0.2, a.y + offsetY * 0.2);
      ctx.lineTo(b.x + offsetX * 0.2, b.y + offsetY * 0.2);
      ctx.strokeStyle = 'rgba(99,102,135,0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.restore();

    // Paquetes que viajan por la red
    ctx.save();
    packets.forEach((p) => {
      p.t += p.speed;
      if (p.t >= 1){
        resetPacket(p);
      }

      const e = edges[p.edgeIndex];
      const a = nodes[e.a];
      const b = nodes[e.b];

      const x = a.x + (b.x - a.x) * p.t + offsetX * 0.25;
      const y = a.y + (b.y - a.y) * p.t + offsetY * 0.25;

      const glow = 0.5 + 0.5 * Math.sin((t * 0.01) + p.edgeIndex);
      const size = 3 + glow * 2;

      ctx.fillStyle = `rgba(242,183,5,${0.4 + glow * 0.4})`;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);

      ctx.fillStyle = `rgba(225,59,59,${0.25 + glow * 0.25})`;
      ctx.fillRect(x - size, y - size / 4, size * 0.7, size / 2);
    });
    ctx.restore();

    // Nodos
    ctx.save();
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x + offsetX * 0.15, n.y + offsetY * 0.15, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(148,163,184,0.9)';
      ctx.fill();
    });
    ctx.restore();

    // Palabra formada por cuadritos
    if (textParticles.length){
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      textParticles.forEach((p) => {
        const speed = 0.08;
        p.x += (p.target.x - p.x) * speed;
        p.y += (p.target.y - p.y) * speed;

        const flick = 0.5 + 0.5 * Math.sin(t * 0.05 + p.phase * Math.PI * 2);
        const size = 2 + flick * 2;

        ctx.fillStyle = `rgba(242,183,5,${0.25 + 0.5 * flick})`;
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);

        if (p.phase > 0.7){
          ctx.fillStyle = `rgba(225,59,59,${0.15 + 0.3 * flick})`;
          ctx.fillRect(p.x - size / 2, p.y - size / 2, size * 0.7, size * 0.7);
        }
      });

      ctx.restore();
    }

    // Contorno muy suave de la palabra (para darle forma)
    ctx.save();
    ctx.font = `${Math.min(width, height) / 7.5}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = 'rgba(15,23,42,0.8)';
    ctx.lineWidth = 3;
    ctx.strokeText(currentShapeWord(), width * 0.55, height * 0.5);
    ctx.restore();

    t += 1;
    requestAnimationFrame(draw);
  }

  const section = canvas.closest('.neural-section');
  if (section){
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting){
            if (!running){
              running = true;
              draw();
            }
          } else {
            running = false;
          }
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(section);
  } else {
    running = true;
    draw();
  }
});
=======
>>>>>>> 4144d5602e85c7b2967893b9bb40bf35f3a6ceb5
