/* ================================
   LOCATION SELECTOR – KARNATAKA
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openLocation");
  const mobileOpenBtn = document.getElementById("mobileLocation");
  const popup = document.getElementById("locationPopup");
  const closeBtn = document.getElementById("closePopup");

  const cityList = document.getElementById("cityList");
  const popularList = document.getElementById("popularCities");
  const popularLabel = document.getElementById("popularLabel");

  const selectedCity = document.getElementById("selectedCity");
  const mobileSelectedCity = document.getElementById("mobileSelectedCity");

  const searchInput = document.getElementById("citySearch");
  const suggestionBox = document.getElementById("citySuggestions");

  let activeIndex = -1;

  /* --------------------------------
     ALL KARNATAKA CITIES (A–Z)
  -------------------------------- */
  const karnatakaCities = [
    "Bagalkot","Ballari","Bengaluru","Bhadravati","Bidar",
    "Chikkaballapura","Chikkamagaluru","Chitradurga","Davanagere",
    "Gadag-Betageri","Gangavati","Hassan","Hosapete",
    "Hubballi-Dharwad","Kalaburagi","Kolar","Mandya",
    "Mangaluru","Mysuru","Raichur","Ranebennuru",
    "Robertson Pet","Shivamogga","Tumakuru","Udupi","Vijayapura"
  ].sort();

  /* --------------------------------
     POPULAR CITIES
  -------------------------------- */
  const popularCities = [
    "Bengaluru",
    "Mysuru",
    "Mangaluru",
    "Hubballi-Dharwad",
    "Udupi",
    "Ballari"
  ];

  /* --------------------------------
     RENDER POPULAR BUTTONS
  -------------------------------- */
  popularCities.forEach(city => {
    const btn = document.createElement("button");
    btn.textContent = city;
    btn.dataset.city = city;
    popularList.appendChild(btn);
  });

  /* --------------------------------
     OPEN / CLOSE POPUP
  -------------------------------- */
  openBtn?.addEventListener("click", openPopup);
  mobileOpenBtn?.addEventListener("click", openPopup);

  function openPopup() {
    popup.classList.add("active");
    searchInput.value = "";
    suggestionBox.classList.remove("active");
    showPopular();
    searchInput.focus();
  }

  closeBtn?.addEventListener("click", () => {
    popup.classList.remove("active");
  });

  /* --------------------------------
     GEOLOCATION (DO NOT REMOVE)
  -------------------------------- */
  if (!getCookie("city") && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          const autoCity =
            data.address.city ||
            data.address.town ||
            data.address.village;

          if (autoCity && karnatakaCities.includes(autoCity)) {
            updateCityUI(autoCity);
            setCookie("city", autoCity, 365);
          }
        } catch (e) {
          console.warn("Location detection failed");
        }
      }
    );
  }

  /* --------------------------------
     LOAD SAVED CITY
  -------------------------------- */
  const savedCity = getCookie("city");
  if (savedCity) updateCityUI(savedCity);

  /* --------------------------------
     SEARCH INPUT (GOOGLE STYLE)
  -------------------------------- */
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    activeIndex = -1;

    if (!query) {
      suggestionBox.classList.remove("active");
      showPopular();
      return;
    }

    popularList.style.display = "none";
    popularLabel.style.display = "none";

    const matches = karnatakaCities.filter(city =>
      city.toLowerCase().includes(query)
    );

    renderSuggestions(matches);
  });

  /* --------------------------------
     KEYBOARD NAVIGATION
  -------------------------------- */
  searchInput.addEventListener("keydown", e => {
    const items = suggestionBox.querySelectorAll("li");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex =
        (activeIndex - 1 + items.length) % items.length;
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectCity(items[activeIndex].textContent);
    }

    items.forEach(i => i.classList.remove("active"));
    if (activeIndex >= 0) {
      items[activeIndex].classList.add("active");
    }
  });

  /* --------------------------------
     RENDER SUGGESTIONS
  -------------------------------- */
  function renderSuggestions(list) {
    suggestionBox.innerHTML = "";

    if (!list.length) {
      suggestionBox.classList.remove("active");
      return;
    }

    list.forEach(city => {
      const li = document.createElement("li");
      li.textContent = city;
      li.onclick = () => selectCity(city);
      suggestionBox.appendChild(li);
    });

    suggestionBox.classList.add("active");
  }

  /* --------------------------------
     SELECT CITY (FINAL)
  -------------------------------- */
  function selectCity(city) {
    updateCityUI(city);
    setCookie("city", city, 365);
    popup.classList.remove("active");
  }

  /* --------------------------------
     POPULAR CLICK
  -------------------------------- */
  popularList.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") {
      selectCity(e.target.dataset.city);
    }
  });

  /* --------------------------------
     UI UPDATE
  -------------------------------- */
  function updateCityUI(city) {
    if (selectedCity) selectedCity.textContent = city;
    if (mobileSelectedCity) mobileSelectedCity.textContent = city;
    localStorage.setItem("selectedCity", city);
  }

  function showPopular() {
    popularList.style.display = "flex";
    popularLabel.style.display = "block";
  }

  /* --------------------------------
     COOKIES
  -------------------------------- */
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
  }

  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith(name + "="))
      ?.split("=")[1];
  }
});
