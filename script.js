const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const clientsCarousel = document.querySelector('[data-clients-carousel]');

if (clientsCarousel) {
  const viewport = clientsCarousel.querySelector('.clients-viewport');
  const track = clientsCarousel.querySelector('.clients-track');
  const slides = Array.from(clientsCarousel.querySelectorAll('.client-slide'));
  const previousButton = clientsCarousel.querySelector('[data-clients-prev]');
  const nextButton = clientsCarousel.querySelector('[data-clients-next]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentIndex = 0;
  let timer;
  let paused = false;

  const getMaxIndex = () => {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const visibleSlides = Math.max(1, Math.floor((viewport.clientWidth + gap) / (slideWidth + gap)));
    return Math.max(0, slides.length - visibleSlides);
  };

  const updateCarousel = () => {
    const maxIndex = getMaxIndex();
    currentIndex = Math.min(currentIndex, maxIndex);
    track.style.transform = `translateX(-${slides[currentIndex].offsetLeft}px)`;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === maxIndex;
  };

  const stopTimer = () => {
    window.clearInterval(timer);
  };

  const startTimer = () => {
    stopTimer();
    if (paused || reducedMotion.matches || getMaxIndex() === 0) return;

    timer = window.setInterval(() => {
      currentIndex = currentIndex >= getMaxIndex() ? 0 : currentIndex + 1;
      updateCarousel();
    }, 4000);
  };

  previousButton.addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateCarousel();
    startTimer();
  });

  nextButton.addEventListener('click', () => {
    currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
    updateCarousel();
    startTimer();
  });

  clientsCarousel.addEventListener('mouseenter', () => {
    paused = true;
    stopTimer();
  });

  clientsCarousel.addEventListener('mouseleave', () => {
    paused = false;
    startTimer();
  });

  clientsCarousel.addEventListener('focusin', () => {
    paused = true;
    stopTimer();
  });

  clientsCarousel.addEventListener('focusout', (event) => {
    if (!clientsCarousel.contains(event.relatedTarget)) {
      paused = false;
      startTimer();
    }
  });

  window.addEventListener('resize', updateCarousel);
  reducedMotion.addEventListener('change', startTimer);
  updateCarousel();
  startTimer();
}
