document.addEventListener("DOMContentLoaded", function () {
  // Theme Color Logic
  const button = document.getElementById("colorButton");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const htmlElement = document.documentElement;
  
  const lightThemes = ["#fff3e0", "#eaf6ff", "#f0fff4", "#f5f0ff", "#f6f7fb"];
  const darkThemes = ["#1e293b", "#0f172a", "#111827", "#171717", "#020617"];
  let themeIndex = 0;

  function updateBodyBackground() {
    const isDark = htmlElement.classList.contains("dark");
    if (themeIndex === 0) {
      // Reset to default Tailwind background
      document.body.style.backgroundColor = "";
    } else {
      const currentThemes = isDark ? darkThemes : lightThemes;
      document.body.style.backgroundColor = currentThemes[themeIndex - 1];
    }
  }

  function updateColorButtonState() {
    if (button) {
      const isDark = htmlElement.classList.contains("dark");
      button.disabled = isDark;
      if (isDark) {
        button.classList.add("opacity-50", "cursor-not-allowed");
        button.title = "Theme colors are disabled in dark mode";
        // Reset to default dark background if a custom theme was selected
        document.body.style.backgroundColor = "";
      } else {
        button.classList.remove("opacity-50", "cursor-not-allowed");
        button.title = "Change theme color";
        // Re-apply the selected theme color if any
        updateBodyBackground();
      }
    }
  }

  if (button) {
    button.addEventListener("click", function () {
      if (!htmlElement.classList.contains("dark")) {
        themeIndex = (themeIndex + 1) % (lightThemes.length + 1);
        updateBodyBackground();
      }
    });
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", function () {
      htmlElement.classList.toggle("dark");
      const isDark = htmlElement.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      updateThemeIcon(isDark);
      
      // Update color button state and background
      updateColorButtonState();
      
      // Update toggle icon feedback
      darkModeToggle.style.transform = "rotate(360deg)";
      setTimeout(() => darkModeToggle.style.transform = "", 500);
    });
  }

  function updateThemeIcon(isDark) {
    if (darkModeToggle) {
      // Moon icon for light mode, Sun icon for dark mode
      darkModeToggle.innerHTML = isDark 
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
          </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>`;
    }
  }

  // Initial state for color button
  updateColorButtonState();

  // Back to Top Logic
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove("opacity-0", "translate-y-10", "pointer-events-none");
      } else {
        backToTopBtn.classList.add("opacity-0", "translate-y-10", "pointer-events-none");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Scroll Reveal Animation (Repeatable)
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      } else {
        // Remove class when element leaves viewport to allow re-animation
        entry.target.classList.remove("revealed");
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    revealObserver.observe(el);
  });

  // Smooth Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth"
        });
      }
    });
  });

  // Fetch and display Customer Reviews
  const reviewsList = document.getElementById("reviews-list");

  async function fetchReviews() {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/comments?_limit=3");
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const reviews = await response.json();
      
      reviewsList.innerHTML = "";
      reviews.forEach((review, idx) => {
        const reviewCard = document.createElement("div");
        reviewCard.className = "bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-500 group relative";
        reviewCard.style.transitionDelay = `${idx * 150}ms`;

        // Quote icon
        const quoteIcon = document.createElement("div");
        quoteIcon.className = "absolute -top-4 -left-4 w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg";
        quoteIcon.textContent = "“";
        
        const reviewerName = document.createElement("h4");
        reviewerName.className = "text-xl font-['Playfair_Display'] font-bold text-slate-900 dark:text-white mb-3 capitalize";
        reviewerName.textContent = review.name.split(" ").slice(0, 2).join(" ");

        const rating = document.createElement("div");
        rating.className = "flex text-orange-400 mb-4";
        rating.innerHTML = "★".repeat(5);

        const reviewText = document.createElement("p");
        reviewText.className = "text-slate-600 dark:text-slate-400 italic leading-relaxed text-sm";
        reviewText.textContent = `"${review.body}"`;

        reviewCard.append(quoteIcon, reviewerName, rating, reviewText);
        reviewsList.appendChild(reviewCard);
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      reviewsList.innerHTML = "<div class='col-span-full text-center py-12'><p class='text-red-500 font-medium'>Unable to load reviews at this time.</p></div>";
    }
  }

  fetchReviews();

  // Contact Form Validation
  const contactForm = document.getElementById("contactForm");
  const inputs = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    password: document.getElementById("password")
  };
  const errors = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    password: document.getElementById("passwordError")
  };

  const validate = {
    name: () => {
      const val = inputs.name.value.trim();
      const isValid = val !== "";
      errors.name.textContent = isValid ? "" : "Please enter your name";
      inputs.name.classList.toggle("border-red-500", !isValid);
      return isValid;
    },
    email: () => {
      const val = inputs.email.value.trim();
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = regex.test(val);
      errors.email.textContent = isValid ? "" : "Please enter a valid email";
      inputs.email.classList.toggle("border-red-500", !isValid);
      return isValid;
    },
    password: () => {
      const val = inputs.password.value.trim();
      const isValid = val.length >= 6;
      errors.password.textContent = isValid ? "" : "Min 6 characters required";
      inputs.password.classList.toggle("border-red-500", !isValid);
      return isValid;
    }
  };

  Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener("input", validate[key]);
  });

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const isFormValid = Object.values(validate).every(v => v());

      if (isFormValid) {
        const btn = contactForm.querySelector("button");
        const originalText = btn.textContent;
        btn.textContent = "Processing...";
        btn.disabled = true;

        setTimeout(() => {
          alert(`Success! Table reserved for ${inputs.name.value}.`);
          contactForm.reset();
          btn.textContent = originalText;
          btn.disabled = false;
        }, 1500);
      }
    });
  }
});

