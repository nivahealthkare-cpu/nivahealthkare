document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("bookingModal");
  const openBtn = document.getElementById("openBooking");
  const closeBtn = document.getElementById("closeModal");
  const bookingForm = document.getElementById("bookingForm");
  const formMessage = document.getElementById("formMessage");

  // Open modal
  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });
  }

  // Close modal
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
      resetForm();
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (modal && e.target === modal) {
      modal.style.display = "none";
      resetForm();
    }
  });

  // Form submit handling
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const mobile = document.getElementById("mobile").value.trim();

      if (!name || !mobile) {
        formMessage.textContent = "Please fill in Name and Mobile Number.";
        formMessage.classList.remove("success-message");
        return;
      }

      // Success message
      formMessage.textContent = "✅ Your appointment is booked successfully!";
      formMessage.classList.add("success-message");

      // Auto-close modal after 2 seconds
      setTimeout(() => {
        modal.style.display = "none";
        resetForm();
      }, 2000);
    });
  }

  // Reset form function
  function resetForm() {
    if (bookingForm) bookingForm.reset();
    if (formMessage) {
      formMessage.textContent = "";
      formMessage.classList.remove("success-message");
    }
  }

  // Global function to open modal
  window.openModal = function () {
    if (modal) modal.style.display = "block";
  };

  // Carousel scrolling (View All Packages carousel)
  const viewCarousel = document.getElementById("carousel");
  const prev = document.getElementById("prev");
  const next = document.getElementById("next");

  if (prev && viewCarousel) {
    prev.addEventListener("click", () => {
      viewCarousel.scrollBy({ left: -150, behavior: "smooth" });
    });
  }

  if (next && viewCarousel) {
    next.addEventListener("click", () => {
      viewCarousel.scrollBy({ left: 150, behavior: "smooth" });
    });
  }

  // Removed single-item requisites logic so all tags show naturally in scroll
  // essential package

let currentSlide = 0;
const slides = document.querySelectorAll('#carousel9 .slide');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

setInterval(nextSlide, 5000); // 5 seconds
// Smooth scroll for nav links
document.querySelectorAll('.top-nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
  });


// FAQ toggle (height-aware)
document.querySelectorAll('.faq-section').forEach(section => {
  section.addEventListener('click', (e) => {
    const question = e.target.closest('.faq-question');
    if (!question) return;

    const item   = question.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const icon   = question.querySelector('span');
    const isOpen = item.classList.contains('open');

    // Close other open items in this section
    section.querySelectorAll('.faq-item.open').forEach(openItem => {
      if (openItem === item) return;
      openItem.classList.remove('open');
      const ans = openItem.querySelector('.faq-answer');
      if (ans) ans.style.maxHeight = '0px';
      const ic = openItem.querySelector('span');
      if (ic) ic.textContent = '+';
    });

    // Toggle this one
    if (isOpen) {
      item.classList.remove('open');
      answer.style.maxHeight = '0px';
      if (icon) icon.textContent = '+';
    } else {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      if (icon) icon.textContent = '−';
    }
  });
});

// Resize fix
window.addEventListener('resize', () => {
  document.querySelectorAll('.faq-item.open .faq-answer').forEach(ans => {
    ans.style.maxHeight = ans.scrollHeight + 'px';
  });
});


// === Package Navigation Show/Hide + Highlight ===
const topNav = document.querySelector(".top-nav");
const sections = document.querySelectorAll(".package");
const navLinks = document.querySelectorAll(".top-nav a");

if (topNav && sections.length && navLinks.length) {
  const firstSection = sections[0];
  const lastSection = sections[sections.length - 1];

  function updateNavVisibility() {
    const firstRect = firstSection.getBoundingClientRect();
    const lastRect = lastSection.getBoundingClientRect();

    const started = firstRect.top <= 0 || firstRect.top < window.innerHeight * 0.5;
    const ended = lastRect.bottom <= 0;

    if (started && !ended) {
      topNav.classList.add("show");
    } else {
      topNav.classList.remove("show");
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.id;
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${activeId}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: "-40% 0px -40% 0px",
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));

  updateNavVisibility();
  window.addEventListener("scroll", updateNavVisibility, { passive: true });
  window.addEventListener("resize", updateNavVisibility);
}

// ✅ Separate toggle function for viewalltest.html
function toggleCartItem(id) {
  const card = document.querySelector(`.test-card[data-id="${id}"]`);
  if (!card) return;

  const btn = card.querySelector(".cart-btn");

  // If already in cart → remove
  if (cartItems.find(item => item.id === id)) {
    removeFromCart(id);
    btn.innerHTML = "Add to Cart";
    btn.classList.remove("remove");
    btn.classList.add("solid");
  } else {
    addToCart(id);
    btn.innerHTML = 'Remove <i class="fas fa-trash"></i>'; // ✅ one style only
    btn.classList.add("remove");
  }
}

// ✅ Auto-update button states on page load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".all-tests-grid .test-card").forEach(card => {
    const id = parseInt(card.dataset.id);
    const btn = card.querySelector(".cart-btn");

    if (cartItems.find(item => item.id === id)) {
      btn.innerHTML = 'Remove <i class="fas fa-trash"></i>'; // ✅ only one format
      btn.classList.add("remove");
    } else {
      btn.innerHTML = "Add to Cart";
      btn.classList.remove("remove");
    }
  });
});

// ✅ Know More toggle for parameter lists
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".param-item .toggle").forEach(button => {
    button.addEventListener("click", () => {
      const details = button.closest(".param-item").querySelector(".param-details");
      if (details.style.maxHeight) {
        details.style.maxHeight = null;
        button.textContent = "Know more +";
      } else {
        details.style.maxHeight = details.scrollHeight + "px";
        button.textContent = "Know less −";
      }
    });
  });
});
