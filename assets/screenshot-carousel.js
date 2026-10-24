document.querySelectorAll('[data-screenshot-carousel]').forEach(carousel => {
  const track = carousel.querySelector('.screenshot-carousel-track');
  const previous = carousel.querySelector('[data-carousel-previous]');
  const next = carousel.querySelector('[data-carousel-next]');
  const position = carousel.querySelector('[data-carousel-position]');
  const slides = [...track.children];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function step() {
    return slides.length > 1 ? slides[1].getBoundingClientRect().left - slides[0].getBoundingClientRect().left : track.clientWidth;
  }

  function update() {
    const stride = step();
    const visible = Math.max(1, Math.round(track.clientWidth / stride));
    const first = Math.max(0, Math.min(slides.length - visible, Math.round(track.scrollLeft / stride)));
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    const label = `${first + 1}\u2013${Math.min(first + visible, slides.length)} / ${slides.length}`;
    if (position.textContent !== label) position.textContent = label;
  }

  function move(direction) {
    track.scrollBy({ left: direction * step(), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }

  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      track.scrollTo({ left: event.key === 'Home' ? 0 : track.scrollWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }
  });

  carousel.classList.add('is-enhanced');
  previous.hidden = false;
  next.hidden = false;
  new ResizeObserver(update).observe(track);
  update();
});
