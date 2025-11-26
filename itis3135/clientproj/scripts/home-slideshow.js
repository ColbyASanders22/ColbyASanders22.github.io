/**
 * Hunter's Guitar Lessons - Homepage Slideshow
 * Interactivity: Auto-rotating slideshow with manual controls
 */

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".slide-nav.prev");
  const nextBtn = document.querySelector(".slide-nav.next");

  // If this page doesn't have a slideshow, do nothing
  if (!slides.length) return;

  let currentIndex = 0;
  let slideTimer = null;
  const INTERVAL_MS = 5000; // 5 seconds

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    currentIndex = index;
  }

  function goToNext() {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }

  function goToPrev() {
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  }

  function resetTimer() {
    if (slideTimer) {
      clearInterval(slideTimer);
    }
    slideTimer = setInterval(goToNext, INTERVAL_MS);
  }

  // Button events
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goToNext();
      resetTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      goToPrev();
      resetTimer();
    });
  }

  // Dot click events
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.slide) || 0;
      showSlide(index);
      resetTimer();
    });
  });

  // Start slideshow on first slide
  showSlide(0);
  resetTimer();
});
