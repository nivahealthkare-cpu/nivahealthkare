console.log("booking.js loaded");

function openBooking(serviceName) {
  document.body.style.overflow = "hidden";
  document.getElementById("bookingModal").style.display = "flex";
  resetSteps();

  // Set the service input dynamically
  const serviceInput = document.getElementById("serviceType");
  if (serviceInput && serviceName) {
    serviceInput.value = serviceName;
  }
}


function closeBooking() {
  document.body.style.overflow = "";
  document.getElementById("bookingModal").style.display = "none";
  resetSteps();
}

/* ===== STEP CONTROL ===== */
function setStep(step) {
  document.getElementById("step1").classList.toggle("active", step === 1);
  document.getElementById("step2").classList.toggle("active", step === 2);
  document.getElementById("step3").classList.toggle("active", step === 3);

  document.querySelectorAll(".step").forEach((el, i) => {
    el.classList.toggle("active", i < step);
  });
}

function resetSteps() {
  setStep(1);
  document.getElementById("confirmationMessage").innerHTML = "";
}

/* ===== STEP 1 → STEP 2 ===== */
function goToStep2() {
  const mobile = document.getElementById("bookingMobile").value.trim();

  if (!/^\d{10}$/.test(mobile)) {
    alert("Please enter a valid 10-digit mobile number");
    return;
  }

  // OTP validation can be added later
  setStep(2);
}

/* ===== STEP 2 → BACKEND → STEP 3 ===== */
async function confirmBooking() {
  console.log("CONFIRM BUTTON CLICKED");

  const mobile = document.getElementById("bookingMobile").value.trim();
  const name = document.getElementById("custName").value.trim();
  const email = document.getElementById("custEmail").value.trim();
  const service = document.getElementById("serviceType").value.trim();

  if (!name) {
    alert("Please enter your name");
    return;
  }

  const bookingData = {
    name,
    mobile_no: mobile,
    email: email || "",
    service,
    message: "Booking from website",
    location: localStorage.getItem("selectedCity") || "Unknown"
  };

  
  console.log("SENDING DATA:", bookingData);

  try {
    const response = await fetch("http://127.0.0.1:5000/api/web-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData)
    });

    const data = await response.json();
    console.log("BACKEND RESPONSE:", data);

    if (!response.ok || !data.success) {
      alert(data.error || "Booking failed. Try again.");
      return;
    }

    // ✅ SUCCESS — SHOW STEP 3
    document.getElementById("confirmationMessage").innerText =
      `Thank you ${name}! Your booking is confirmed.`;

    setStep(3);

  } catch (error) {
    console.error("SERVER ERROR:", error);
    alert("Cannot connect to server.");
  }
}

/* ===== OTP INPUT UX ===== */
document.addEventListener("DOMContentLoaded", () => {
  const otpInputs = document.querySelectorAll(".otp-input");

  otpInputs.forEach((input, index) => {
    input.addEventListener("input", e => {
      e.target.value = e.target.value.replace(/\D/g, "");
      if (e.target.value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
});

/* ===== CALLBACK UI (UNCHANGED UI ONLY) ===== */
function openCallback(doctorName) {
  document.body.style.overflow = "hidden";
  document.getElementById("callbackModal").style.display = "flex";
  document.getElementById("callbackDoctor").value = doctorName;
}

function closeCallback() {
  document.body.style.overflow = "";
  document.getElementById("callbackModal").style.display = "none";
}

function submitCallback() {
  const mobile = document.getElementById("callbackMobile").value.trim();

  if (mobile.length !== 10) {
    alert("Please enter a valid 10-digit mobile number");
    return;
  }

  alert("✅ Thank you! Our agent will call you back shortly.");
  closeCallback();
}


async function submitConsultForm() {
  console.log("submitConsultForm fired");

  try {
    const nameInput = document.getElementById("consultName");
    const mobileInput = document.getElementById("consultMobile");

    const name = nameInput.value.trim();
    const mobile = mobileInput.value.trim();

    if (!name) {
      alert("Please enter your full name");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const payload = {
      name,
      mobile_no: mobile,
      email: "",
      service: "Surgery Consultation",
      message: "Callback request from surgery page",
      location: localStorage.getItem("selectedCity") || "Unknown"
    };

    const response = await fetch("http://127.0.0.1:5000/api/web-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      alert("Submission failed. Try again.");
      return;
    }

    const data = await response.json();
    if (!data.success) {
      alert(data.error || "Submission failed");
      return;
    }

    // ✅ SHOW POPUP ONLY
    document.getElementById("simplePopup").style.display = "flex";

    // reset inputs
    nameInput.value = "";
    mobileInput.value = "";

  } catch (err) {
    console.error(err);
    alert("Server not reachable");
  }
}


// ---------- Checkup Modal Logic ----------

// Open / Close Modal
function openCheckupModal() {
  const modal = document.getElementById('checkupModalOverlay');
  if (modal) modal.style.display = 'flex';
}

function closeCheckupModal() {
  const modal = document.getElementById('checkupModalOverlay');
  if (modal) modal.style.display = 'none';
}

// Submit Checkup Form
async function submitCheckupForm() {
  try {
    console.log("submitCheckupForm fired");

    const nameInput = document.getElementById("checkupName");
    const mobileInput = document.getElementById("checkupMobile");

    const name = nameInput.value.trim();
    const mobile = mobileInput.value.trim();

    // --- Validation ---
    if (!name) {
      alert("Please enter your full name");
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    const payload = {
      name,
      mobile_no: mobile,
      email: "",
      service: "Checkup",
      message: document.getElementById("checkupMessage")?.value || "Callback request from Checkup button",
      location: localStorage.getItem("selectedCity") || "Header"
    };

    // Use same backend URL as working Surgery form
    const response = await fetch("http://127.0.0.1:5000/api/web-leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      alert("Submission failed. Try again.");
      return;
    }

    const data = await response.json().catch(() => ({}));

    if (data.success === false) {
      alert(data.error || "Submission failed");
      return;
    }

    // ✅ Show same popup as Surgery form
    const simplePopup = document.getElementById("simplePopup");
    if (simplePopup) simplePopup.style.display = "flex";

    // Reset inputs
    nameInput.value = "";
    mobileInput.value = "";
    const messageInput = document.getElementById("checkupMessage");
    if (messageInput) messageInput.value = "";

  } catch (err) {
    console.error(err);
    alert("Server not reachable");
  }
}


