document.addEventListener('DOMContentLoaded', () => {
  const reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Navegadores viejos: mostramos todo sin animaciones complejas
    reveals.forEach(section => {
      section.classList.add('visible');
      applyStaggerClasses(section);
    });
    return;
  }

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const section = entry.target;
      section.classList.add('visible');
      applyStaggerClasses(section);

      obs.unobserve(section);
    });
  }, { threshold: 0.2 });

  reveals.forEach(el => io.observe(el));

  /**
   * Aplica clases stagger-X a elementos internos
   * para escalonar la animación.
   */
  function applyStaggerClasses(section){
    const toStagger = [
      ...section.querySelectorAll('.resume-main p'),
      ...section.querySelectorAll('.resume-main .resume-list li'),
      ...section.querySelectorAll('.resume-aside h3'),
      ...section.querySelectorAll('.resume-aside h4'),
      ...section.querySelectorAll('.resume-aside .resume-list li')
    ];

    toStagger.forEach((el, idx) => {
      const n = Math.min(idx, 9); // usamos 0–9
      el.classList.add(`stagger-${n}`);
    });
  }
});

