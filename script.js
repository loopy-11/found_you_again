
const pages = [...document.querySelectorAll(".book > .page")];

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const counter = document.getElementById("counter");
const dots = document.getElementById("dots");

const song = document.getElementById("song");
const musicBtn = document.getElementById("musicBtn");
const musicLabel = document.getElementById("musicLabel");

let current = 0;

// Membuat titik navigasi untuk semua halaman
dots.innerHTML = "";

pages.forEach((page, index) => {
  const dot = document.createElement("button");

  dot.type = "button";
  dot.className = "dot";
  dot.setAttribute("aria-label", `Buka halaman ${index + 1}`);

  dot.addEventListener("click", () => goTo(index));

  dots.appendChild(dot);
});

// Berpindah halaman
function goTo(index) {
  current = Math.max(0, Math.min(pages.length - 1, index));

  pages.forEach((page, i) => {
    page.classList.toggle("active", i === current);
    page.setAttribute("aria-hidden", i !== current);
  });

  [...dots.children].forEach((dot, i) => {
    dot.classList.toggle("active", i === current);
    dot.setAttribute("aria-current", i === current ? "page" : "false");
  });

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === pages.length - 1;

  counter.textContent = `HALAMAN ${current + 1} DARI ${pages.length}`;
}

function changePage(delta) {
  goTo(current + delta);
}

// Navigasi tombol panah keyboard
document.addEventListener("keydown", (event) => {
  if (
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.target.matches("input, textarea, select")
  ) {
    return;
  }

  if (event.key === "ArrowRight") changePage(1);
  if (event.key === "ArrowLeft") changePage(-1);
});

// Memperbarui tulisan tombol musik
function updateMusicLabel() {
  musicLabel.textContent = song.paused
    ? "play panasea"
    : "pause music";
}

song.addEventListener("play", updateMusicLabel);
song.addEventListener("pause", updateMusicLabel);

// Tombol play/pause musik
musicBtn.addEventListener("click", async () => {
  if (song.paused) {
    try {
      await song.play();
    } catch (error) {
      alert('Pastikan file "panasea.mp3" ada di folder website.');
    }
  } else {
    song.pause();
  }

  updateMusicLabel();
});

// Tombol mulai membaca
const openBookBtn = document.querySelector(".cover .primary");

if (openBookBtn) {
  openBookBtn.addEventListener("click", async () => {
    goTo(1);

    try {
      await song.play();
    } catch (error) {
      // Musik tetap bisa diputar melalui tombol musik.
    }

    updateMusicLabel();
  });
}

// Tombol kembali ke awal
const restartBtn = document.querySelector(".close-page .primary");

if (restartBtn) {
  restartBtn.addEventListener("click", () => {
    song.pause();
    song.currentTime = 0;

    updateMusicLabel();
    goTo(0);
  });
}

// Tampilkan halaman sampul saat website dibuka
goTo(0);