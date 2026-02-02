document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector(".search-wrapper button");
  const input = document.querySelector(".search-wrapper input");

  // ✅ SAFETY CHECK
  if (searchBtn && input) {
    searchBtn.addEventListener("click", () => {
      const query = input.value.trim();
      if (query) {
        alert(`Searching for: ${query}`);
      }
    });
  }
});


function slideMonsoonLeft() {
  const slider = getSiblingSlider(event.target);
  if (!slider) return;
  const card = slider.querySelector('.test-card');
  if (!card) return;
  const cardWidth = card.offsetWidth + 16;
  slider.scrollBy({ left: -cardWidth, behavior: 'smooth' });
}

function slideMonsoonRight() {
  const slider = getSiblingSlider(event.target);
  if (!slider) return;
  const card = slider.querySelector('.test-card');
  if (!card) return;
  const cardWidth = card.offsetWidth + 16;
  slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
}

function getSiblingSlider(button) {
  // Find nearest parent section and the slider inside it
  let parent = button.closest('.test-slider-section');
  if (!parent) return null;
  return parent.querySelector('.slider');
}
let currentSlide = 0;
const slides = document.querySelectorAll('.slider-card .slide');
const dotsContainer = document.getElementById('slideDots');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  updateDots(index);
}
function updateDots(index) {
  if (!dotsContainer) return;   // ✅ safety guard

  const dots = dotsContainer.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

// Create dots dynamically
slides.forEach((_, i) => {
  const dot = document.createElement('span');
  dot.classList.add('dot');
  dot.addEventListener('click', () => {
    currentSlide = i;
    showSlide(currentSlide);
  });
  dotsContainer.appendChild(dot);
});

showSlide(currentSlide);

// Auto slide
setInterval(() => {
  nextSlide();
}, 5000);


// sliiding part 3rd one
let labCurrentIndex = 0;

function slideLab(direction) {
  const slider = document.getElementById("labPartnerSlider");
  const cards = document.querySelectorAll(".lab-card");
  const cardCount = cards.length;

  const screenWidth = window.innerWidth;
  let cardsPerView = 4; // default desktop
  if (screenWidth <= 1024) cardsPerView = 2; // tablet
  if (screenWidth <= 768) cardsPerView = 1; // mobile

  // update index
  labCurrentIndex += direction;

  // clamp index so last card fits
  if (labCurrentIndex < 0) labCurrentIndex = 0;
  if (labCurrentIndex > cardCount - cardsPerView) {
    labCurrentIndex = cardCount - cardsPerView;
  }

  // width of one card = wrapper width / cardsPerView
  const cardWidth = document.querySelector(".lab-slider-wrapper").offsetWidth / cardsPerView;

  slider.style.transform = `translateX(-${labCurrentIndex * cardWidth}px)`;
}

function slideLabLeft() {
  slideLab(-1);
}
function slideLabRight() {
  slideLab(1);
}
// 4th part
const quizSteps = [
  { question: "Enter your age", input: '<input type="number" class="quiz-input" id="age" placeholder="Your Age" required />' },
  { question: "Select your gender", input: '<select class="quiz-input" id="gender" required><option value="">--Select--</option><option>Male</option><option>Female</option><option>Other</option></select>' },
  { question: "What’s your main health concern?", input: '<select class="quiz-input" id="concern" required><option value="">--Select--</option><option>Fatigue</option><option>Headache</option><option>Diabetes</option><option>Heart</option><option>Other</option></select>' },
  { question: "Quiz Completed!", input: '<button type="button" class="quiz-btn" onclick="restartQuiz()">Take Quiz Again</button> <button type="button" class="quiz-btn" onclick="openBookingModal()">Book Test</button>' }
];

let currentStep = 0;

function renderStep() {
  const step = quizSteps[currentStep];
  document.getElementById("quizSteps").innerHTML = `
    <div class="quiz-step active">
      <h3>Step ${currentStep + 1}: ${step.question}</h3>
      ${step.input}
      ${currentStep < quizSteps.length - 1 ? '<button type="button" class="quiz-btn" onclick="nextStep()">Next</button>' : ""}
    </div>
  `;

  // Enter key support
  const inputEl = document.querySelector(".quiz-input");
  if (inputEl) {
    inputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        nextStep();
      }
    });
  }
}

function nextStep() {
  if (currentStep < quizSteps.length - 1) {
    currentStep++;
    renderStep();
  }
}

function restartQuiz() {
  currentStep = 0;
  renderStep();
}

function openBookingModal() {
  document.getElementById("bookingModal").style.display = "block";
  const concern = document.getElementById("concern").value;
  document.getElementById("testName").value = concern ? concern + " Test" : "General Health Checkup";
}

function closeBookingModal() {
  document.getElementById("bookingModal").style.display = "none";
}



