// Helpers
const $ = (q, ctx = document) => ctx.querySelector(q);
const $$ = (q, ctx = document) => [...ctx.querySelectorAll(q)];

document.addEventListener("DOMContentLoaded", () => {
  // Año dinámico
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Toggle nav en móvil
  const navBtn = $(".nav-toggle");
  const nav = $("#site-nav");
  if (navBtn && nav) {
    navBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navBtn.setAttribute("aria-expanded", String(open));
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  // Dark / Light theme toggle with localStorage
  const themeBtn = $("#themeBtn");
  const root = document.documentElement;
  const KEY = "pref-theme";

  if (themeBtn) {
    const setTheme = (mode) => {
      root.dataset.theme = mode;
      themeBtn.setAttribute("aria-pressed", String(mode === "dark"));

      const icon = themeBtn.querySelector("i");
      if (icon) icon.className = mode === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";

      try {
        localStorage.setItem(KEY, mode);
      } catch (_) {}
    };

    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    let saved = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch (_) {}
    setTheme(saved || (sysDark ? "dark" : "light"));

    themeBtn.addEventListener("click", () => {
      setTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  // Back to top
  const toTop = $("#toTop");
  if (toTop) {
    const onScroll = () => {
      toTop.hidden = !(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Filters
  const chips = $$(".chip");
  const cards = $$(".project-card");
  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const f = chip.dataset.filter;
      cards.forEach((card) => {
        const tags = card.dataset.tags || "";
        const match = f === "all" || tags.includes(f);
        card.style.display = match ? "" : "none";
      });
    })
  );

  // Modal (seguro: si no existe, no truena)
  const modal = $("#projectModal");
  if (modal) {
    const title = $(".modal-title", modal);
    const img = $(".modal-img", modal);
    const desc = $(".modal-desc", modal);
    const actions = $$(".modal-actions a", modal);
    const demo = actions[0] || null;
    const repo = actions[1] || null;

    $$(".open-modal").forEach((btn) => {
      btn.addEventListener("click", (ev) => {
        const card = ev.currentTarget.closest(".project-card");
        if (!card) return;

        if (title) title.textContent = card.dataset.title || "";
        if (desc) desc.textContent = card.dataset.desc || "";

        const cardImg = $("img", card);
        if (img && cardImg) {
          img.src = cardImg.src;
          img.alt = card.dataset.title || "";
        }

        if (demo) demo.href = card.dataset.demo || "#";
        if (repo) repo.href = card.dataset.repo || "#";

        // Hide empty actions (so it never looks like a template)
        const isEmptyHref = (h) => !h || h === "#" || h === "javascript:void(0)";
        if (demo) demo.style.display = isEmptyHref(demo.getAttribute("href")) ? "none" : "inline-flex";
        if (repo) repo.style.display = isEmptyHref(repo.getAttribute("href")) ? "none" : "inline-flex";

        if (typeof modal.showModal === "function") modal.showModal();
      });
    });

    const closeBtn = $(".modal-close", modal);
    closeBtn?.addEventListener("click", () => modal.close());

    modal.addEventListener("click", (e) => {
      const card = $(".modal-card", modal);
      if (!card) return;
      const rc = card.getBoundingClientRect();
      const outside =
        e.clientX < rc.left ||
        e.clientX > rc.right ||
        e.clientY < rc.top ||
        e.clientY > rc.bottom;
      if (outside) modal.close();
    });
  }

  // Carruseles de evolución de diseños
  const designCarousels = $$(".design-carousel");

  designCarousels.forEach((carousel) => {
    const track = $(".carousel-track", carousel);
    if (!track) return;

    const slides = $$("img", track);
    if (!slides.length) return;

    const prevBtn = $(".carousel-btn.prev", carousel);
    const nextBtn = $(".carousel-btn.next", carousel);

    const card = carousel.closest(".design-card");
    const dots = card ? $$(".carousel-dots .dot", card) : [];

    let index = 0;

    const showSlide = (i) => {
      const total = slides.length;
      if (!total) return;

      const newIndex = (i + total) % total;

      slides.forEach((img, idx) => {
        img.classList.toggle("is-active", idx === newIndex);
        img.setAttribute("aria-hidden", String(idx !== newIndex));
      });

      dots.forEach((dot, idx) => {
        const active = idx === newIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", String(active));
        dot.setAttribute("tabindex", active ? "0" : "-1");
      });

      index = newIndex;
    };

    prevBtn?.addEventListener("click", () => showSlide(index - 1));
    nextBtn?.addEventListener("click", () => showSlide(index + 1));

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => showSlide(idx));
      dot.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          showSlide(idx);
        }
      });
    });

    showSlide(0);
  });



// Hide placeholder / empty links (so the portfolio never looks like a template)
const hideIfEmptyLink = (a) => {
  if (!a) return;
  const href = (a.getAttribute("href") || "").trim();
  if (!href || href === "#" || href === "javascript:void(0)") {
    a.style.display = "none";
  }
};

// Hide demo buttons with empty hrefs
$$(".project-card a.btn").forEach((a) => hideIfEmptyLink(a));
// Hide modal buttons if empty
["#modalDemo", "#modalRepo"].forEach((sel) => hideIfEmptyLink($(sel)));

// Contact form -> opens the user's email client (professional for static sites)
const form = $(".contact-form");
if (form) {
  const status = $(".form-status", form) || null;

  const setStatus = (msg, isOk = true) => {
    if (!status) return;
    status.textContent = msg;
    status.style.color = isOk ? "" : "#b42318";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let ok = true;

    form.querySelectorAll("input[required], textarea[required]").forEach((field) => {
      const error = field.parentElement?.querySelector(".error") || null;

      if (!field.value.trim()) {
        ok = false;
        if (error) error.textContent = "Este campo es obligatorio.";
      } else if (field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value)) {
        ok = false;
        if (error) error.textContent = "Ingresa un email válido.";
      } else {
        if (error) error.textContent = "";
      }
    });

    if (!ok) {
      setStatus("Revisa los campos marcados para poder enviar.", false);
      return;
    }

    const name = (form.querySelector('input[name="name"]')?.value || "").trim();
    const email = (form.querySelector('input[name="email"]')?.value || "").trim();
    const message = (form.querySelector('textarea[name="message"]')?.value || "").trim();

    const subject = encodeURIComponent(`Contacto desde Portafolio — ${name || "Nuevo mensaje"}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}\n\n— Enviado desde mi portafolio`
    );

    setStatus("Abriendo tu correo para enviar el mensaje…");

    window.location.href = `mailto:tonathiupalma@gmail.com?subject=${subject}&body=${body}`;

    // Optional: reset after opening mail client
    setTimeout(() => {
      form.reset();
      setStatus("Listo. Si no se abrió tu correo, copia el email y envíame el mensaje manualmente.");
    }, 600);
  });
}
});

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
  const dpi = window.devicePixelRatio || 1;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpi;
    canvas.height = rect.height * dpi;
    ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
  }

  resize();
  window.addEventListener("resize", resize);

  // Seguimiento del mouse normalizado (-1 a 1)
  const mouse = { x: 0, y: 0 };
  let mouseInside = false;

  window.addEventListener(
    "mousemove",
    (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;

      if (mx >= 0 && mx <= 1 && my >= 0 && my <= 1) {
        mouseInside = true;
        mouse.x = (mx - 0.5) * 2; // -1 a 1
        mouse.y = (my - 0.5) * 2; // -1 a 1
      } else {
        mouseInside = false;
      }
    },
    { passive: true }
  );

  // Scroll: lo usamos para inclinar un poquito extra la cabeza
  let scrollY = window.scrollY || 0;
  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY || 0;
    },
    { passive: true }
  );

  function roundedRect(x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  // Estilo
  const colBrand = "#f2b705";
  const colInk = "#f7f3e8";

  let t = 0;

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    // Limpieza
    ctx.clearRect(0, 0, w, h);

    // Fondo suave
    const bg = ctx.createRadialGradient(w * 0.65, h * 0.4, 10, w * 0.65, h * 0.4, Math.max(w, h));
    bg.addColorStop(0, "rgba(242,183,5,0.10)");
    bg.addColorStop(1, "rgba(242,183,5,0.00)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Movimiento base suave
    const baseOffsetX = Math.cos(t * 0.0015) * 28;
    const baseOffsetY = Math.sin(t * 0.0012) * 18;
    const baseAngle = Math.sin(t * 0.0015) * 0.25;

    // Influencia del mouse (si está encima del hero)
    const lookX = mouseInside ? mouse.x : 0;
    const lookY = mouseInside ? mouse.y : 0;

    // Extra tilt con el scroll
    const scrollTilt = Math.min(scrollY / 800, 0.35); // se limita para no volverse loco

    const offsetX = baseOffsetX + lookX * 20;
    const offsetY = baseOffsetY + lookY * 14;
    const angle = baseAngle + lookX * 0.18 - scrollTilt * 0.25;

    // Dibujo cabeza (abstracta)
    ctx.save();
    ctx.translate(w * 0.78 + offsetX, h * 0.54 + offsetY);
    ctx.rotate(angle);

    // Cráneo
    ctx.fillStyle = "rgba(6,8,14,0.65)";
    ctx.strokeStyle = "rgba(242,183,5,0.35)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.ellipse(0, 0, 78, 90, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Visor
    ctx.fillStyle = "rgba(242,183,5,0.10)";
    ctx.strokeStyle = "rgba(247,243,232,0.35)";
    roundedRect(-60, -20, 120, 50, 18);
    ctx.fill();
    ctx.stroke();

    // Ojos
    ctx.fillStyle = "rgba(247,243,232,0.75)";
    ctx.beginPath();
    ctx.arc(-25, 5, 5.2, 0, Math.PI * 2);
    ctx.arc(25, 5, 5.2, 0, Math.PI * 2);
    ctx.fill();

    // Detalle boca
    const mouthW = 74;
    const mouthH = 18;
    const mouthY = 40;

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
    ctx.strokeStyle = "rgba(242,183,5,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -92);
    ctx.lineTo(0, -125);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -130, 7, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(242,183,5,0.6)";
    ctx.fill();

    // Brillo interior
    const glow = ctx.createRadialGradient(-10, -15, 5, -10, -15, 120);
    glow.addColorStop(0, "rgba(242,183,5,0.12)");
    glow.addColorStop(1, "rgba(242,183,5,0.00)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(0, 0, 78, 90, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    t += 16;
    requestAnimationFrame(draw);
  }

  draw();
});

// ===== Red neuronal PRO (más ligera) + palabras en cuadritos + rotación estable =====
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("neuralCanvas");
  const phraseEl = document.getElementById("neuralPhrase");
  if (!canvas || !phraseEl) return;

  // Respeta "reducir movimiento"
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ctx = canvas.getContext("2d", { alpha: true });
  const rootStyles = getComputedStyle(document.documentElement);
  const dpi = Math.max(1, window.devicePixelRatio || 1);

  const colInk = (rootStyles.getPropertyValue("--ink") || "").trim() || "#f7f3e8";
  const colBrand = (rootStyles.getPropertyValue("--brand") || "").trim() || "#f2b705";

  const isEn = document.documentElement.lang === "en";
  const phrases = isEn
    ? [
        "Neural graphs, real decisions.",
        "Data flows → insight grows.",
        "Signals in, strategy out.",
        "AI that speaks marketing.",
        "From noise to clarity.",
      ]
    : [
        "Conectamos ideas con datos.",
        "Señales → insight → acción.",
        "Analítica que impulsa estrategia.",
        "IA que habla marketing.",
        "Del ruido a la claridad.",
      ];

  const shapeWords = isEn
    ? ["AI", "DATA", "ROAS", "CTR", "CPA", "LTV", "SEO", "CRM", "KPI", "GROWTH"]
    : ["IA", "DATOS", "ROAS", "CTR", "CPA", "LTV", "SEO", "CRM", "KPI", "CRECER"];

  let currentPhrase = 0;
  let currentShapeIndex = 0;

  const setPhrase = (text) => {
    phraseEl.classList.remove("is-visible");
    phraseEl.textContent = text;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => phraseEl.classList.add("is-visible"))
    );
  };
  setPhrase(phrases[currentPhrase]);

  // ✅ Rotación garantizada (independiente de los "paquetes")
  const ROTATE_MS = reduceMotion ? 4500 : 3000;
  let rotateTimer = 0;

  function rotateNow() {
    currentPhrase = (currentPhrase + 1) % phrases.length;
    setPhrase(phrases[currentPhrase]);

    currentShapeIndex = (currentShapeIndex + 1) % shapeWords.length;
    buildWordTargets();
  }

  function startRotate() {
    if (!rotateTimer) rotateTimer = window.setInterval(rotateNow, ROTATE_MS);
  }

  function stopRotate() {
    if (rotateTimer) {
      clearInterval(rotateTimer);
      rotateTimer = 0;
    }
  }

  let width = 0,
    height = 0;

  // Network
  let nodes = [];
  let edges = [];
  let packets = [];

  // Pixel field (amarillo) + word pixels (blanco)
  let field = []; // celdas de fondo
  let wordTargets = []; // puntos de la palabra
  let wordParticles = []; // partículas que se mueven a los puntos

  // Perf controls
  const MAX_FPS = reduceMotion ? 18 : 30;
  const FRAME_MS = 1000 / MAX_FPS;
  let rafId = 0;
  let lastTs = 0;
  let running = false;
  let fires = 0;

  const mouse = { x: 0, y: 0, inside: false };

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    if (mx >= 0 && mx <= 1 && my >= 0 && my <= 1) {
      mouse.inside = true;
      mouse.x = mx;
      mouse.y = my;
    } else {
      mouse.inside = false;
    }
  }

  canvas.addEventListener("mousemove", onMouseMove, { passive: true });
  canvas.addEventListener("mouseleave", () => (mouse.inside = false), { passive: true });

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function currentWord() {
    return shapeWords[currentShapeIndex % shapeWords.length];
  }

  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(r.width));
    height = Math.max(1, Math.floor(r.height));
    canvas.width = Math.floor(width * dpi);
    canvas.height = Math.floor(height * dpi);
    ctx.setTransform(dpi, 0, 0, dpi, 0, 0);

    buildNetwork();
    buildPixelField();
    buildWordTargets();
  }

  function buildNetwork() {
    nodes = [];
    edges = [];
    packets = [];

    const nCount = clamp(
      Math.round((width * height) / (reduceMotion ? 26000 : 18000)),
      18,
      reduceMotion ? 48 : 72
    );

    for (let i = 0; i < nCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (reduceMotion ? 0.1 : 0.18),
        vy: (Math.random() - 0.5) * (reduceMotion ? 0.1 : 0.18),
        r: 1.2 + Math.random() * 1.4,
      });
    }

    const maxDist = clamp(Math.min(width, height) * 0.26, 90, 170);
    const maxD2 = maxDist * maxDist;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j];
        const dx = a.x - b.x,
          dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxD2) edges.push({ a: i, b: j, d2 });
      }
    }

    const pCount = reduceMotion ? 7 : 12;
    for (let k = 0; k < pCount; k++) {
      packets.push({
        edgeIndex: (Math.random() * edges.length) | 0,
        t: Math.random(),
        speed:
          (reduceMotion ? 0.0022 : 0.003) +
          Math.random() * (reduceMotion ? 0.002 : 0.003),
        glow: 0.25 + Math.random() * 0.45,
      });
    }
  }

  function buildPixelField() {
    field = [];
    const cell = clamp(Math.round(Math.min(width, height) / 18), 14, 24);
    const cols = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        field.push({
          x,
          y,
          a: Math.random() * 0.25,
          tw: 0.6 + Math.random() * 0.8,
        });
      }
    }
  }

  function buildWordTargets() {
    wordTargets = [];
    wordParticles = [];

    const word = currentWord();

    const off = document.createElement("canvas");
    const tw = 540;
    const th = 200;
    off.width = tw;
    off.height = th;
    const o = off.getContext("2d");

    o.clearRect(0, 0, tw, th);
    o.fillStyle = "#000";
    o.fillRect(0, 0, tw, th);

    const fontSize = clamp(Math.round(Math.min(width, height) / 4.6), 44, 92);
    o.font = `800 ${fontSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial`;
    o.textAlign = "center";
    o.textBaseline = "middle";
    o.fillStyle = "#fff";
    o.fillText(word, tw / 2, th / 2);

    const img = o.getImageData(0, 0, tw, th).data;
    const step = clamp(Math.round(fontSize / 12), 5, 10);

    for (let y = 0; y < th; y += step) {
      for (let x = 0; x < tw; x += step) {
        const i = (y * tw + x) * 4;
        const a = img[i + 3];
        if (a > 25) {
          const px = width * 0.5 + (x - tw / 2) * 0.65;
          const py = height * 0.54 + (y - th / 2) * 0.65;
          wordTargets.push({ x: px, y: py });
        }
      }
    }

    shuffleInPlace(wordTargets);

    const LIMIT = clamp(
      Math.round(wordTargets.length * (reduceMotion ? 0.2 : 0.28)),
      70,
      reduceMotion ? 180 : 260
    );

    for (let i = 0; i < LIMIT; i++) {
      const t = wordTargets[i % wordTargets.length];
      wordParticles.push({
        x: t.x + (Math.random() - 0.5) * 120,
        y: t.y + (Math.random() - 0.5) * 80,
        tx: t.x,
        ty: t.y,
        v: 0.03 + Math.random() * 0.05,
        r: 1.0 + Math.random() * 0.9,
      });
    }
  }

  function stepNetwork() {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    }

    for (const p of packets) {
      p.t += p.speed;
      if (p.t >= 1) resetPacket(p);
    }
  }

  function resetPacket(p) {
    p.edgeIndex = (Math.random() * edges.length) | 0;
    p.t = 0;
    p.speed =
      (reduceMotion ? 0.0022 : 0.003) +
      Math.random() * (reduceMotion ? 0.002 : 0.003);

    // Conservamos el contador por si lo usas para efectos/telemetría,
    // pero la rotación de frases/palabras ahora es por timer (más estable).
    fires++;
  }

  function drawFrame() {
    ctx.clearRect(0, 0, width, height);

    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "rgba(6,8,14,1)");
    bg.addColorStop(1, "rgba(12,10,22,1)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const offsetX = mouse.inside ? (mouse.x - 0.5) * 14 : 0;
    const offsetY = mouse.inside ? (mouse.y - 0.5) * 10 : 0;

    ctx.save();
    ctx.translate(offsetX, offsetY);

    const maxDist = clamp(Math.min(width, height) * 0.26, 90, 170);
    const maxD2 = maxDist * maxDist;

    ctx.lineWidth = 1;

    for (const e of edges) {
      const a = nodes[e.a],
        b = nodes[e.b];
      const dx = a.x - b.x,
        dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < maxD2) {
        const t = 1 - d2 / maxD2;
        ctx.strokeStyle = `rgba(242,183,5,${(0.06 + 0.28 * t).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    for (const n of nodes) {
      ctx.fillStyle = "rgba(247,243,232,0.65)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const p of packets) {
      const e = edges[p.edgeIndex];
      if (!e) continue;

      const a = nodes[e.a],
        b = nodes[e.b];
      const x = a.x + (b.x - a.x) * p.t;
      const y = a.y + (b.y - a.y) * p.t;

      ctx.fillStyle = `rgba(242,183,5,${(0.45 + 0.35 * p.glow).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, 2.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(242,183,5,0.25)";
      ctx.beginPath();
      ctx.arc(x, y, 8.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();

    // Pixel field amarillo (cuadritos)
    const cell = clamp(Math.round(Math.min(width, height) / 18), 14, 24);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (const c of field) {
      c.a += 0.01 * c.tw * (reduceMotion ? 0.6 : 1);
      if (c.a > 1) c.a = 0;

      const xx = c.x * cell;
      const yy = c.y * cell;

      ctx.fillStyle = `rgba(242,183,5,${(0.02 + 0.12 * c.a).toFixed(3)})`;
      ctx.fillRect(xx, yy, cell - 2, cell - 2);
    }

    // Word particles (blanco)
    for (const wp of wordParticles) {
      wp.x += (wp.tx - wp.x) * wp.v;
      wp.y += (wp.ty - wp.y) * wp.v;

      ctx.fillStyle = "rgba(247,243,232,0.92)";
      ctx.fillRect(wp.x, wp.y, wp.r * 1.7, wp.r * 1.7);
    }

    // “Amarillos alrededor”
    const glowCount = reduceMotion ? 40 : 70;
    for (let i = 0; i < glowCount && i < wordTargets.length; i++) {
      const t = wordTargets[(i * 11) % wordTargets.length];
      ctx.fillStyle = "rgba(242,183,5,0.35)";
      ctx.fillRect(t.x + (Math.random() - 0.5) * 2, t.y + (Math.random() - 0.5) * 2, 2, 2);
    }

    ctx.restore();
  }

  function loop(ts) {
    if (!running) return;
    if (!lastTs) lastTs = ts;
    const dt = ts - lastTs;

    if (dt >= FRAME_MS) {
      lastTs = ts;
      stepNetwork();
      drawFrame();
    }

    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    lastTs = 0;

    // ✅ Rotación garantizada de frase + palabra (no depende de los paquetes)
    startRotate();

    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;

    // ✅ Pausa rotación cuando la sección sale de viewport / pestaña
    stopRotate();

    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  // init
  resize();
  window.addEventListener("resize", resize, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
      return;
    }

    // Al volver a la pestaña, reanuda si la sección está visible
    const sec = canvas.closest(".neural-section");
    if (!sec) {
      start();
      return;
    }
    const r = sec.getBoundingClientRect();
    const inView = r.bottom > 0 && r.top < window.innerHeight;
    if (inView) start();
  });

  const section = canvas.closest(".neural-section");
  if (section) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
    }, { threshold: 0.18 });
    obs.observe(section);
  } else {
    start();
  }
});


// --- Videos: populate mini cards (hide empty) ---
(function initMoreVideos(){
  const cards = document.querySelectorAll('.video-mini-card');
  if(!cards || !cards.length) return;

  cards.forEach(card => {
    const yt = (card.getAttribute('data-yt') || '').trim();
    const title = (card.getAttribute('data-title') || '').trim();
    const desc = (card.getAttribute('data-desc') || '').trim();

    // Fill text
    const h4 = card.querySelector('.video-mini-body h4');
    const p = card.querySelector('.video-mini-body p');
    if(h4) h4.textContent = title || 'Video';
    if(p) p.textContent = desc || '';

    // If no YouTube ID, remove the card (keeps the portfolio clean)
    if(!yt){
      card.remove();
      return;
    }

    // Build embed URL
    const iframe = card.querySelector('iframe');
    if(iframe){
      iframe.src = `https://www.youtube.com/embed/${yt}?rel=0&modestbranding=1&playsinline=1`;
      iframe.setAttribute('referrerpolicy','strict-origin-when-cross-origin');
      iframe.setAttribute('loading','lazy');
      iframe.setAttribute('allowfullscreen','');
    }
  });

  // If all cards removed, remove the whole block
  const grid = document.querySelector('.video-more-grid');
  if(grid && !grid.querySelector('.video-mini-card')){
    const wrap = document.querySelector('.video-more');
    if(wrap) wrap.remove();
  }
})();
