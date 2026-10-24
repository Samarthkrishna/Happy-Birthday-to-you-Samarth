(() => {
  "use strict";

  // PERSONALIZE THESE TWO VALUES.
  const BIRTHDAY_NAME = "Birthday boy Samarth";
  // Optional: set a birthday date as "YYYY-MM-DD" if you later want a countdown.
  // This version intentionally avoids a countdown until a real date is provided.

  const $ = (selector, root = document) => root.querySelector(selector);
  const song = $("#birthdaySong");
  const musicToggle = $("#musicToggle");
  const musicLabel = $("#musicLabel");
  const toast = $("#toast");
  const mainPhoto = $("#mainPhoto");
  const mainPhotoPlaceholder = $("#mainPhotoPlaceholder");
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightboxImage");
  let toastTimer = null;

  $("#heroName").textContent = BIRTHDAY_NAME;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function showPhotoPlaceholder(image, placeholder) {
    image.hidden = true;
    placeholder.hidden = false;
  }

  function showPhoto(image, placeholder) {
    image.hidden = false;
    placeholder.hidden = true;
  }

  // Missing personal photos gracefully show a guide rather than a broken image icon.
  mainPhoto.addEventListener("load", () => showPhoto(mainPhoto, mainPhotoPlaceholder));
  mainPhoto.addEventListener("error", () => showPhotoPlaceholder(mainPhoto, mainPhotoPlaceholder));
  if (mainPhoto.complete) {
    if (mainPhoto.naturalWidth > 0) showPhoto(mainPhoto, mainPhotoPlaceholder);
    else showPhotoPlaceholder(mainPhoto, mainPhotoPlaceholder);
  }

  document.querySelectorAll(".gallery-card").forEach((card) => {
    const image = $("img", card);
    const placeholder = $(".gallery-placeholder", card);
    const updateImageState = () => {
      if (image.complete && image.naturalWidth > 0) {
        image.hidden = false;
        placeholder.hidden = true;
      } else if (image.complete) {
        image.hidden = true;
        placeholder.hidden = false;
      }
    };
    image.addEventListener("load", updateImageState);
    image.addEventListener("error", updateImageState);
    if (image.complete) updateImageState();

    card.addEventListener("click", () => {
      if (!image || image.hidden || !image.naturalWidth) {
        showToast("Add your own photo to the images folder to fill this memory.");
        return;
      }
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "Birthday memory";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      $("#lightboxClose").focus();
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    document.body.style.overflow = "";
  }
  $("#lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });

  async function toggleMusic() {
    if (!song) return;
    if (song.paused) {
      try {
        await song.play();
        musicToggle.classList.add("is-playing");
        musicToggle.setAttribute("aria-pressed", "true");
        musicLabel.textContent = "Pause our song";
      } catch (error) {
        showToast("Please add birthday-music.mp3 beside index.html, then try again.");
      }
    } else {
      song.pause();
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "Play our song";
    }
  }
  musicToggle.addEventListener("click", toggleMusic);
  song.addEventListener("ended", () => {
    musicToggle.classList.remove("is-playing");
    musicToggle.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "Play our song";
  });
  song.addEventListener("error", () => {
    // Keep the page usable when the optional MP3 is missing.
    musicToggle.title = "Add birthday-music.mp3 beside index.html";
  });

  function launchConfetti() {
    const colors = ["#ff9bd5", "#c8a7ff", "#ffe0a6", "#fff0fb", "#9d83ff"];
    const amount = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 110;
    for (let i = 0; i < amount; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      piece.style.setProperty("--drift", `${Math.round((Math.random() - 0.5) * 220)}px`);
      piece.style.setProperty("--fall-time", `${2.1 + Math.random() * 2.1}s`);
      piece.style.animationDelay = `${Math.random() * 0.55}s`;
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 5200);
    }
  }

  $("#wishButton").addEventListener("click", () => {
    showToast("Take a deep breath, make your wish, and keep believing. ✨");
    launchConfetti();
  });
  $("#celebrateButton").addEventListener("click", () => {
    launchConfetti();
    showToast("Happy Birthday! May your wish find its way to you. ♡");
    if (song.paused) toggleMusic();
  });

  // Avoid broken image symbols before image events fire on slower devices.
  document.querySelectorAll(".gallery-card img").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) img.hidden = true;
  });
})();
