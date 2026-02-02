document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("labCarouselTrack");
  const dotsContainer = document.getElementById("labDots");
  const slides = document.querySelectorAll(".lab-slide");

  // ✅ SAFETY CHECK (MOST IMPORTANT)
  if (!carousel || !dotsContainer || slides.length === 0) {
    return; // stop script safely
  }

  const totalSlides = slides.length;
  let currentIndex = 0;

  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => moveToSlide(i));
    dotsContainer.appendChild(dot);
  }

  function moveToSlide(index) {
    currentIndex = index;
    carousel.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function updateDots() {
    const dots = dotsContainer.children;
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === currentIndex);
    }
  }

  // Auto slide
  setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    moveToSlide(currentIndex);
  }, 5000);
});
