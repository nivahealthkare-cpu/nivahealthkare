
document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("locationPopup");
  const openText = document.getElementById("locationText");
  const closeBtn = document.getElementById("closePopupBtn");

  if (popup && openText && closeBtn) {
    openText.addEventListener("click", () => {
      popup.classList.remove("hidden");
    });

    closeBtn.addEventListener("click", () => {
      popup.classList.add("hidden");
    });
  }
});



function toggleCustomCheckupPopup() {
  const popup = document.getElementById("customCheckupPopup");
  popup.classList.toggle("show");
}

function scrollToNext() {
  window.scrollBy({
    top: window.innerHeight,
    behavior: 'smooth'
  });
}

// ✅ Auto-scroll badges on mobile
function autoScrollBadgesMobile() {
  const badgeContainer = document.querySelector(".lab-badges");
  if (!badgeContainer || window.innerWidth > 768) return;

  let scrollDirection = 1;

  setInterval(() => {
    const maxScroll = badgeContainer.scrollWidth - badgeContainer.clientWidth;
    badgeContainer.scrollLeft += scrollDirection * 1.2;
    if (badgeContainer.scrollLeft >= maxScroll || badgeContainer.scrollLeft <= 0) {
      scrollDirection *= -1;
    }
  }, 25);
}
window.addEventListener("load", autoScrollBadgesMobile);

// ==============================
// ✅ CART LOGIC WITH LOCALSTORAGE
// ==============================
let cartItems = [];

// Load saved cart from localStorage on page load
function loadCartFromStorage() {
  try {
    const saved = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (Array.isArray(saved)) {
      cartItems = saved;
    }
  } catch (e) {
    console.warn("Could not load saved cart:", e);
    cartItems = [];
  }
}

// Save cart to localStorage
function saveCart() {
  try {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  } catch (e) {
    console.warn("Could not save cart:", e);
  }
}

// Add to cart
function addToCart(id) {
  const card = document.querySelector(`.test-card[data-id="${id}"]`);
  if (!card) return;

  const title = card.querySelector("h3")?.innerText || "";

  // ✅ Get discounted price (ignoring del + span)
  let actualPrice = 0;
  const priceElement = card.querySelector(".price");
  if (priceElement) {
    const cloned = priceElement.cloneNode(true);
    cloned.querySelectorAll("del, span").forEach(el => el.remove());
    const discountedText = cloned.innerText.trim();
    actualPrice = parseInt(discountedText.replace(/[^\d]/g, "")) || 0;
  }

  const discount = card.querySelector(".discount")?.innerText || "";

  if (cartItems.find(item => item.id === id)) {
    showToast("Item already in cart");
    return;
  }

  cartItems.push({ id, title, price: actualPrice, discount });
  saveCart();
  renderCartItems();
  updateCartCount();
  showToast("Added to cart");
  updateCartButtons();
}

// Remove from cart
function removeFromCart(id) {
  cartItems = cartItems.filter(item => item.id !== id);
  saveCart();
  renderCartItems();
  updateCartCount();
  showToast("Removed from cart");
  updateCartButtons();
}

// Render cart items
function renderCartItems() {
  const container = document.getElementById("cartItemsContainer");
  if (!container) return;

  container.innerHTML = "";
  let total = 0;

  cartItems.forEach(item => {
    total += Number(item.price) || 0;
  });

  const totalTestsEl = document.getElementById("totalTests");
  const totalPriceEl = document.getElementById("totalPrice");
  if (totalTestsEl) totalTestsEl.innerText = cartItems.length;
  if (totalPriceEl) totalPriceEl.innerText = "₹" + total;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is currently empty.</p>
      </div>
    `;
    return;
  }

  cartItems.forEach(item => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-price">₹${item.price}</div>
        <div class="cart-item-discount">${item.discount}</div>
      </div>
<button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove from cart">
  <i class="fa-solid fa-trash-can"></i>
</button>
    `;
    container.appendChild(cartItem);
  });
}

// Update cart badge
function updateCartCount() {
  const badge = document.getElementById("cart-count");
  if (badge) {
    badge.innerText = cartItems.length;
  }
}

// Drawer helpers
function openDrawer() {
  document.getElementById("drawer").classList.add("open");
}


// Toast
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// ✅ View details
function viewDetails(id) {
  window.location.href = `view-all1.html?scrollTo=${id}`;
}



// Update cart buttons state
function updateCartButtons() {
  document.querySelectorAll('.test-card').forEach(card => {
    const id = parseInt(card.getAttribute('data-id'));
    const button = card.querySelector('.cart-btn');
    if (!button) return;

    if (cartItems.some(item => item.id === id)) {
      button.innerHTML = '<i class="fas fa-trash"></i> Remove';
      button.classList.add('remove');
      button.onclick = function() { removeFromCart(id); };
    } else {
      button.textContent = 'Add to Cart';
      button.classList.remove('remove');
      button.onclick = function() { addToCart(id); };
    }
  });
}

// ✅ Load cart on page load
document.addEventListener('DOMContentLoaded', function () {
  loadCartFromStorage();
  renderCartItems();
  updateCartCount();
  updateCartButtons();
});

// Go to checkout
function goToCheckout() {
  if (cartItems.length === 0) {
    showToast("Your cart is empty!");
    return;
  }
  window.location.href = "checkout.html";
}

// ✅ Keep mobile badge + desktop badge sync (unchanged existing code)

/* === MOBILE CART BADGE SYNC (safe append) === */
(function () {
  document.addEventListener('DOMContentLoaded', function () {

    // Helper: read desktop badge or fallback to localStorage length
    function getCurrentCount() {
      const desktop = document.getElementById('cart-count');
      if (desktop && desktop.innerText.trim() !== '') return desktop.innerText.trim();
      try {
        const arr = JSON.parse(null || '[]');
        return String((arr || []).length || 0);
      } catch (e) {
        return '0';
      }
    }

    // Create mobile badge and append next to mobile cart icon (if present)
    function createOrSyncMobileBadge() {
      // find mobile cart icon inside mobile bottom bar (or mobile header)
      const mobileIcon = document.querySelector('.mobile-bottom .fa-shopping-cart, .mobile-header .fa-shopping-cart, .mobile-actions .fa-shopping-cart');
      if (!mobileIcon) return null;
      const parent = mobileIcon.closest('a') || mobileIcon.parentElement;
      if (!parent) return null;

      // ensure parent is positioned so absolute badge works (this is a tiny inline style change)
      if (window.getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative';
      }

      let mobileBadge = parent.querySelector('.cart-count-mobile');
      if (!mobileBadge) {
        mobileBadge = document.createElement('span');
        mobileBadge.className = 'cart-count-mobile';
        mobileBadge.setAttribute('aria-hidden', 'true');
        parent.appendChild(mobileBadge);
      }
      mobileBadge.innerText = getCurrentCount();
      return mobileBadge;
    }

    // initial create/sync
    createOrSyncMobileBadge();

    // Watch desktop badge (#cart-count) for changes and copy value to mobile badge
    const desktopBadge = document.getElementById('cart-count');
    if (desktopBadge) {
      const observer = new MutationObserver(function () {
        const mobileBadge = document.querySelector('.cart-count-mobile');
        if (!mobileBadge) createOrSyncMobileBadge();
        const v = getCurrentCount();
        const mb = document.querySelector('.cart-count-mobile');
        if (mb) mb.innerText = v;
      });
      observer.observe(desktopBadge, { childList: true, characterData: true, subtree: true });
    } else {
      // fallback poll (if #cart-count isn't present) — updates mobile badge from localStorage
      setInterval(function () {
        const mb = document.querySelector('.cart-count-mobile');
        if (mb) {
          const v = getCurrentCount();
          if (mb.innerText !== v) mb.innerText = v;
        } else {
          createOrSyncMobileBadge();
        }
      }, 300);
    }

    // also respond to storage events (other tabs)
    window.addEventListener('storage', function (e) {
      if (e.key === 'cartItems') {
        const mb = document.querySelector('.cart-count-mobile');
        if (mb) mb.innerText = getCurrentCount();
      }
    });

    // If your code updates cart-count via JS functions elsewhere,
    // this will keep mobile badge in sync through the observer/poll above.

  });
})();
/* === CLICK OUTSIDE TO CLOSE CART DRAWER (Desktop Only) === */
(function () {
  document.addEventListener('click', function (event) {
    // Run only for desktop screens (adjust 768 if your breakpoint is different)
    if (window.innerWidth < 769) return;

    const drawer = document.getElementById('drawer');
    if (!drawer) return;

    // only run if drawer is open
    if (!drawer.classList.contains('open')) return;

    // if click is inside drawer → ignore
    if (drawer.contains(event.target)) return;

    // if click is on cart toggle button → ignore
    const cartBtn = document.querySelector('[onclick*="toggleDrawer"], #cart-icon, .header-item .fa-shopping-cart');
    if (cartBtn && cartBtn.contains(event.target)) return;

    // else — close the drawer
    drawer.classList.remove('open');
  });
})();



// ==========================
// ✅ Smartlab Ads Slider Init
// ==========================
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.getElementById("smartlabSlider");
  const slides = slider ? slider.querySelectorAll(".smartlab-slide") : [];
  const dotsContainer = document.getElementById("smartlabDots");

  if (!slider || slides.length === 0 || !dotsContainer) return;

  let index = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => {
      index = i;
      showSlide(index);
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".dot");

  function showSlide(i) {
    slider.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((dot, idx) => dot.classList.toggle("active", idx === i));
  }

  function autoSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  // Initial state
  showSlide(index);

  // Auto-play every 5s
  setInterval(autoSlide, 5000);
});
// =======================
// ✅ FAQ Accordion Toggle
// =======================
document.addEventListener("DOMContentLoaded", function () {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const parent = question.closest(".faq-item");

      // Close other open FAQs (optional)
      document.querySelectorAll(".faq-item.active").forEach((item) => {
        if (item !== parent) {
          item.classList.remove("active");
          item.querySelector(".faq-answer").style.maxHeight = null;
        }
      });

      // Toggle current FAQ
      parent.classList.toggle("active");
      const answer = parent.querySelector(".faq-answer");

      if (parent.classList.contains("active")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
});
// data storage (UI + cart only)
function placeOrder() {
  try {
    let items = JSON.parse(localStorage.getItem("cartItems") || "[]");
    if (!Array.isArray(items) || items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const email = document.getElementById("custEmail").value.trim();
    const paymentMode =
      document.querySelector("input[name='payment']:checked")?.value || "COD";

    // Extra fields from Member Details
    const address = document.getElementById("address").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const preferredDate = document.getElementById("preferredDate").value;
    const preferredTime = document.getElementById("preferredTime").value;

    if (!name || !phone || !address || !pincode) {
      alert("Please fill in required fields.");
      return;
    }

    const total = items.reduce(
      (sum, it) => sum + (Number(it.price) || 0),
      0
    );

    const payload = {
      type: "cart",
      items_json: JSON.stringify(items),
      total_amount: total,
      name,
      phone,
      email,
      address,
      pincode,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      payment_mode: paymentMode
    };

    // ⛔ BACKEND CALL REMOVED
    // submitOrder(payload);  <-- this will live in booking.js later

    console.log("Order payload ready (not sent yet):", payload);

  } catch (err) {
    console.error(err);
    alert("Could not process order. Please try again.");
  }
}




// ============================
// ✅ Google Reviews Auto Slider
// ============================
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.getElementById("autoCarousel");
  if (!carousel) return;

  const reviews = carousel.querySelectorAll(".review-card");
  let index = 0;

  function showReview(i) {
    carousel.style.transform = `translateX(-${i * 100}%)`;
    carousel.style.transition = "transform 0.6s ease-in-out";
  }

  function autoSlide() {
    index = (index + 1) % reviews.length;
    showReview(index);
  }

  // Initial
  showReview(index);

  // Auto every 4s
  setInterval(autoSlide, 4000);
});

function toggleServiceType() {
  const service = document.getElementById("serviceType").value;
  const testDropdown = document.getElementById("testDropdown");
  const surgeryDropdown = document.getElementById("surgeryDropdown");

  if (service === "test") {
    testDropdown.style.display = "block";
    surgeryDropdown.style.display = "none";
  } else if (service === "surgery") {
    surgeryDropdown.style.display = "block";
    testDropdown.style.display = "none";
  } else {
    testDropdown.style.display = "none";
    surgeryDropdown.style.display = "none";
  }
}


// === Sticky Banner Close Function ===
document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("closeSticky");
  const stickyBanner = document.getElementById("stickyBanner");

  if (closeBtn && stickyBanner) {
    closeBtn.addEventListener("click", () => {
      stickyBanner.style.display = "none";
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("appointmentModal");
  const bookButtons = document.querySelectorAll(".book-btn");
  const closeBtn = document.querySelector(".modal-close");
  const doctorField = document.getElementById("doctorField");
  const form = document.getElementById("appointmentForm");

  // Open modal and prefill doctor (if provided)
  bookButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const docName = btn.getAttribute("data-doctor") || "";
      if (doctorField) doctorField.value = docName;
      if (modal) {
        modal.style.display = "flex";
        modal.setAttribute("aria-hidden", "false");
        // focus first input for accessibility
        const first = form.querySelector('input,select,textarea,button');
        if (first) first.focus();
      }
    });
  });

  // Close function
  function closeModal() {
    if (modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
    }
  }

  // Close on close button
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Close when clicking outside modal-content
  window.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

// Form submit handler (frontend UI only)
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Gather form data (for UI validation only)
    const data = {
      doctor: form.doctor?.value || "",
      name: form.name?.value || "",
      age: form.age?.value || "",
      gender: form.gender?.value || "",
      mobile: form.mobile?.value || "",
      message: form.message?.value || ""
    };

    // Simple UI validation
    if (!data.name || !data.mobile) {
      alert("Please enter name and mobile number.");
      return;
    }

    // Frontend-only behavior
    console.log("Consultation form data (not sent):", data);

    // UI cleanup only
    form.reset();
    closeModal();
  });
}




// Close popup
function closeBookingPopup() {
  document.getElementById("bookingPopup").style.display = "none";
}

// Close popup on clicking outside content
window.addEventListener("click", (e) => {
  const popup = document.getElementById("bookingPopup");
  if (e.target === popup) popup.style.display = "none";
});



function openSurgeriesPopup(surgeryName) {
  const popup = document.getElementById('surgeriesPopup');
  const input = document.getElementById('surgeryType');
  input.value = surgeryName;
  popup.classList.add('active');
}

function closeSurgeriesPopup() {
  const popup = document.getElementById('surgeriesPopup');
  popup.classList.remove('active');
}

// Optional: Close popup when clicking outside
window.addEventListener('click', function (e) {
  const popup = document.getElementById('surgeriesPopup');
  if (e.target === popup) {
    closeSurgeriesPopup();
  }
});


document.addEventListener("DOMContentLoaded", function () {

  // Update price
  const testSelect = document.getElementById('testSelect');
  const priceDisplay = document.getElementById('priceDisplay');

  if (testSelect && priceDisplay) {
    testSelect.addEventListener('change', function () {
      const option = this.selectedOptions[0];
      const price = option?.dataset?.price;
      if (price) {
        priceDisplay.textContent = `Price: ₹${price}`;
      }
    });
  }

  // Detect location placeholder
  const detectBtn = document.getElementById('detectLocationBtn');
  const userAddress = document.getElementById('userAddress');

  if (detectBtn && userAddress) {
    detectBtn.addEventListener('click', () => {
      userAddress.value = 'Fetching your current location...';
    });
  }

});

});



/* =========================
   Test Slider Dots – SAFE
========================= */

(function () {

  const slider = document.getElementById("testSlider");
  const dotsContainer = document.getElementById("sliderDots");

  if (!slider || !dotsContainer) return;

  // Take ONLY first 5 cards (exclude View All)
  const cards = Array.from(
    slider.querySelectorAll(".test-card")
  ).slice(0, 5);

  if (cards.length !== 5) return;

  // Clear old dots (important if script runs again)
  dotsContainer.innerHTML = "";

  const gap = 16;
  const cardWidth = cards[0].offsetWidth + gap;
  const maxIndex = cards.length - 1;

  /* ===== CREATE 5 DOTS ONLY ===== */
  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);

    dot.addEventListener("click", () => {
      slider.scrollTo({
        left: i * cardWidth,
        behavior: "smooth"
      });
    });
  });

  const dots = dotsContainer.querySelectorAll("span");

  /* ===== UPDATE ACTIVE DOT ===== */
  slider.addEventListener("scroll", () => {
    let index = Math.round(slider.scrollLeft / cardWidth);
    index = Math.max(0, Math.min(index, maxIndex)); // clamp

    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
  });

  /* ===== ARROWS (reuse your buttons) ===== */
  window.slideMonsoonRight = () => {
    slider.scrollBy({ left: cardWidth, behavior: "smooth" });
  };

  window.slideMonsoonLeft = () => {
    slider.scrollBy({ left: -cardWidth, behavior: "smooth" });
  };

})();


/* =========================
   Monsoon Slider Dots
========================= */
(function () {

  const slider = document.getElementById("monsoonSlider");
  const dotsContainer = document.getElementById("monsoonSliderDots");

  if (!slider || !dotsContainer) return;

  // Take ONLY first 5 cards (ignore View All)
  const cards = Array.from(
    slider.querySelectorAll(".test-card")
  ).slice(0, 5);

  if (cards.length !== 5) return;

  // Clear existing dots
  dotsContainer.innerHTML = "";

  const gap = 16;
  const cardWidth = cards[0].offsetWidth + gap;
  const maxIndex = cards.length - 1;

  /* Create dots */
  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);

    dot.addEventListener("click", () => {
      slider.scrollTo({
        left: i * cardWidth,
        behavior: "smooth"
      });
    });
  });

  const dots = dotsContainer.querySelectorAll("span");

  /* Update active dot */
  slider.addEventListener("scroll", () => {
    let index = Math.round(slider.scrollLeft / cardWidth);
    index = Math.max(0, Math.min(index, maxIndex));

    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
  });

})();


function toggleDrawer() {
  const drawer = document.querySelector(".drawer");
  const overlay = document.getElementById("cartOverlay");

  drawer.classList.add("open");
  overlay.classList.add("show");
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  const drawer = document.querySelector(".drawer");
  const overlay = document.getElementById("cartOverlay");

  drawer.classList.remove("open");
  overlay.classList.remove("show");
  document.body.classList.remove("drawer-open");
}


// OPEN CHECKUP MODAL
function openModal() {
  const modal = document.getElementById("modalOverlay");
  modal.style.display = "flex";

  // reset confirmation
  document.getElementById("checkupConfirmationMessage").style.display = "none";
  document.getElementById("consultationForm").style.display = "block";
}

// CLOSE CHECKUP MODAL
function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
}

// SHOW CONFIRMATION MESSAGE
function showConfirmation() {
  const mobile = document.getElementById("mobile").value.trim();

  if (mobile.length < 10) {
    alert("Please enter a valid mobile number");
    return;
  }

  document.getElementById("consultationForm").style.display = "none";
  document.getElementById("checkupConfirmationMessage").style.display = "block";
}
