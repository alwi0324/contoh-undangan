const music = document.getElementById("background-music");
const btnMusic = document.getElementById("btn-music");
const iconPlay = document.getElementById("icon-play");
const iconPause = document.getElementById("icon-pause");

// Variabel untuk melacak apakah user sengaja mem-pause musik via tombol
let isUserPaused = false;

music.addEventListener("ended", () => {
  updateMusicIcon(false); // Mengubah ikon kembali ke play dan mematikan animasi CD/pendaran
  isUserPaused = true; // Status dianggap berhenti
});

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyQF-GJ9x0xDSlbh_NG4SKcVKEZDYFV-5RwyYiJ7tubMru4EwqUsUqCM85QMv08jIwM/exec";

// Ambil parameter slug dari URL
const urlParams = new URLSearchParams(window.location.search);
const currentSlug = urlParams.get("to") || "";

// Fungsi helper untuk mengubah slug (misal: "ahmad-sukri") menjadi Title Case ("Ahmad Sukri")
function formatSlugToName(slug) {
  if (!slug) return "Tamu Undangan";
  return slug
    .replace(/[-_]/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Pre-fill Nama Tamu Default sebelum di-fetch dari server
let guestName = currentSlug ? formatSlugToName(currentSlug) : "Tamu Undangan";
document.getElementById("guest-name-display").innerText = guestName;
document.getElementById("rsvp-name").value = guestName;
document.getElementById("doa-name").value = guestName;

document.addEventListener("DOMContentLoaded", () => {
  AOS.init({ once: false, offset: 50 });
  validateAndLoadData();
});

// Buka Undangan
function bukaUndangan() {
  document.body.classList.remove("overflow-hidden");
  const nav = document.getElementById("bottom-nav");
  nav.classList.remove("hidden");
  setTimeout(() => nav.classList.add("show"), 10);
  document
    .getElementById("countdown-section")
    .scrollIntoView({ behavior: "smooth" });
  
  loadUcapanCards();

  const randomInterval =
    Math.floor(Math.random() * (40000 - 10000 + 1)) + 10000;
  setInterval(() => {
    if (typeof loadUcapanCards === "function") {
      loadUcapanCards();
    }
  }, randomInterval);

  // Putar musik
  music
    .play()
    .then(() => {
      // Tampilkan tombol kontrol di kiri bawah setelah undangan dibuka
      btnMusic.classList.remove("hidden");
      updateMusicIcon(true);
    })
    .catch((error) => {
      console.log("Autoplay dicegah browser:", error);
    });
}

function toggleMusic() {
  if (music.paused) {
    music.play();
    isUserPaused = false; // User ingin memainkan kembali
    updateMusicIcon(true);
  } else {
    music.pause();
    isUserPaused = true; // User dengan sengaja mematikan musik
    updateMusicIcon(false);
  }
}

function updateMusicIcon(isPlaying) {
  if (isPlaying) {
    iconPlay.classList.add("hidden");
    iconPause.classList.remove("hidden");
    // Tambahkan efek berputar dan berpendar saat musik menyala
    btnMusic.classList.add("animate-spin-slow", "music-glow");
  } else {
    iconPlay.classList.remove("hidden");
    iconPause.classList.add("hidden");
    // Hentikan putaran dan hilangkan pendaran saat dipause
    btnMusic.classList.remove("animate-spin-slow", "music-glow");
  }
}

document.addEventListener("visibilitychange", () => {
  // Cek apakah undangan sudah dibuka (artinya tombol musik sudah muncul)
  const isInvitationOpened = !btnMusic.classList.contains("hidden");

  if (isInvitationOpened) {
    if (document.hidden) {
      // Jika pindah tab / minimize, pause musik (tapi ingat statusnya)
      if (!music.paused) {
        music.pause();
      }
    } else {
      // Jika balik lagi ke tab ini DAN sebelumnya user tidak sengaja mem-pause lagu
      if (!isUserPaused) {
        music.play().catch((e) => console.log("Gagal resume otomatis:", e));
        updateMusicIcon(true);
      }
    }
  }
});

// Salin Rekening
function salinRekening(elementId, btnElement) {
  const textToCopy = document.getElementById(elementId).innerText.trim();
  let whatRek = elementId === "norek-jago" ? "BANK JAGO" : "BSI";
  navigator.clipboard.writeText(textToCopy).then(() => {
    Swal.fire({
      icon: "success",
      title: `Nomor rekening ${whatRek} berhasil disalin!`,
      text: textToCopy,
      showConfirmButton: false,
      timer: 3000,
      toast: true,
      position: "top",
      background: "#f7f3ef",
      color: "#3e2723",
      customClass: {
        popup: "rounded-xl shadow-lg border border-[#b38b59]/30",
      },
    });
  });
}

// Countdown Timer
const countDownDate = new Date("Oct 23, 2026 07:30:00").getTime();
const x = setInterval(() => {
  const now = new Date().getTime();
  const distance = countDownDate - now;

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("days").innerText = "00";
    document.getElementById("hours").innerText = "00";
    document.getElementById("minutes").innerText = "00";
    document.getElementById("seconds").innerText = "00";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = String(days).padStart(2, "0");
  document.getElementById("hours").innerText = String(hours).padStart(2, "0");
  document.getElementById("minutes").innerText = String(minutes).padStart(
    2,
    "0",
  );
  document.getElementById("seconds").innerText = String(seconds).padStart(
    2,
    "0",
  );
}, 1000);

// Auto Highlight Navigasi & Klik tanpa merubah URL hash (#)
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("data-target");
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const observerOptions = {
  root: null,
  rootMargin: "-20% 0px -50% 0px",
  threshold: 0,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let id = entry.target.getAttribute("id");

      if (id === "countdown-section" || id === "opening") {
        id = "cover";
      }

      navLinks.forEach((link) => {
        link.classList.remove("bg-gray-100", "text-theme-dark");
        link.classList.add("text-gray-400");

        if (link.getAttribute("data-target") === id) {
          link.classList.remove("text-gray-400");
          link.classList.add("bg-gray-100", "text-theme-dark");
        }
      });
    }
  });
}, observerOptions);

sections.forEach((section) => observer.observe(section));

// Validasi Slug & Ambil Nama Tamu saat Halaman Dibuka
async function validateAndLoadData() {
  if (!currentSlug) {
    document.getElementById("guest-name-display").innerText = "Tamu Undangan";
    document.getElementById("rsvp-name").value = "Tamu Undangan";
    document.getElementById("doa-name").value = "Tamu Undangan";
    return;
  }

  try {
    const response = await fetch(
      `${SCRIPT_URL}?action=check_slug&to=${currentSlug}`,
    );
    const result = await response.json();

    if (result.isValid) {
      document.getElementById("guest-name-display").innerText = result.namaTamu;
      document.getElementById("rsvp-name").value = result.namaTamu;
      document.getElementById("doa-name").value = result.namaTamu;
    } else {
      showErrorScreen(
        "Maaf, tautan undangan tidak ditemukan di daftar tamu kami.",
      );
    }
  } catch (error) {
    console.error("Gagal memvalidasi slug:", error);
  }
}

// 8. Fungsi Kirim RSVP via Fetch POST
async function submitRsvp() {
  const jmlOrang = document.getElementById("rsvp-jumlah").value;
  const rsvpStatus = document.getElementById("rsvp-status").value;

  Swal.fire({
    title: "Menyimpan...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "save_rsvp",
        slug: currentSlug,
        jml_orang: jmlOrang,
        rsvp: rsvpStatus,
      }),
    });
    const result = await response.json();

    if (result.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Terima kasih atas konfirmasi Anda!",
        showConfirmButton: false,
        timer: 2000,
        background: "#f7f3ef",
        color: "#3e2723",
      });
    } else {
      Swal.fire("Gagal", result.message, "error");
    }
  } catch (error) {
    Swal.fire("Error", "Terjadi kesalahan jaringan.", "error");
  }
}

// Fungsi Kirim Ucapan & Doa via Fetch POST
async function submitUcapan() {
  const nama = document.getElementById("doa-name").value.trim();
  const ucapan = document.getElementById("doa-message").value.trim();

  if (!nama || !ucapan) {
    Swal.fire("Perhatian", "Nama dan ucapan tidak boleh kosong!", "warning");
    return;
  }

  Swal.fire({
    title: "Mengirim ucapan...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "save_ucapan",
        nama: nama,
        ucapan: ucapan,
      }),
    });
    const result = await response.json();

    if (result.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Terima kasih atas ucapan dan doanya 😊",
        showConfirmButton: false,
        timer: 1500,
        background: "#f7f3ef",
        color: "#3e2723",
      });
      renderUcapanCards(result.ucapanList);
      document.getElementById("doa-message").value = "";
    } else {
      Swal.fire("Gagal", result.message, "error");
    }
  } catch (error) {
    Swal.fire("Error", "Gagal mengirim ucapan.", "error");
  }
}

// Ambil & Render 10 Ucapan Terbaru
async function loadUcapanCards() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=get_ucapan`);
    const list = await response.json();
    renderUcapanCards(list);
  } catch (error) {
    console.error("Gagal memuat ucapan:", error);
  }
}

function renderUcapanCards(list) {
  const container = document.getElementById("list-ucapan-container");
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `<p class="text-xs text-gray-500 text-center py-4">Belum ada ucapan.</p>`;
    return;
  }

  let html = "";
  list.forEach((item, index) => {
    // Hanya item paling atas (index 0 / ucapan terbaru) yang diberi animasi meluncur dari atas
    const animationClass = index === 0 ? "animate-new-message" : "";

    html += `
            <div class="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left shadow-sm transition-all ${animationClass}">
              <div class="flex justify-between items-center mb-1">
                <h4 class="font-bold text-sm text-theme-dark">${escapeHtml(item.nama)}</h4>
                <span class="text-[10px] text-gray-400 italic time-ago" data-timestamp="${item.timestamp}">${item.timeAgo}</span>
              </div>
              <p class="text-xs text-gray-700 leading-relaxed whitespace-pre-line">${escapeHtml(item.ucapan)}</p>
            </div>
          `;
  });
  container.innerHTML = html;
}

// Fungsi untuk memperbarui semua teks "waktu lalu" secara otomatis
function updateAllTimeAgo() {
  const timeElements = document.querySelectorAll(".time-ago");

  timeElements.forEach((el) => {
    const timestamp = parseInt(el.getAttribute("data-timestamp"));
    if (timestamp) {
      const date = new Date(timestamp);
      el.innerText = formatDiffForHumans(date);
    }
  });
}

// Fungsi Helper untuk Menghitung Selisih Waktu secara Real-time
function formatDiffForHumans(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "Baru saja";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} jam lalu`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} hari lalu`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan lalu`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} tahun lalu`;
}

// Jalankan fungsi pembaruan setiap 60 detik (60000 milidetik)
setInterval(updateAllTimeAgo, 60000);

function showErrorScreen(message) {
  document.body.innerHTML = `
          <div class="min-h-screen flex items-center justify-center p-6 bg-[#f7f3ef] text-center">
            <div class="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl max-w-sm w-full border border-gray-200">
              <div class="text-amber-600 text-5xl mb-4">⚠️</div>
              <h2 class="text-xl font-bold text-gray-800 mb-2">Undangan Tidak Ditemukan</h2>
              <p class="text-xs text-gray-600 mb-6 leading-relaxed">${message}</p>
              <a href="index.html" class="inline-block bg-[#3e2723] text-white text-xs uppercase tracking-widest px-6 py-3 rounded-full shadow">Kembali</a>
            </div>
          </div>
        `;
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.toString().replace(/[&<>"']/g, (m) => map[m]);
}

const rsvpStatusSelect = document.getElementById("rsvp-status");
const wrapperJumlah = document.getElementById("wrapper-jumlah");
const rsvpJumlahInput = document.getElementById("rsvp-jumlah");

if (rsvpStatusSelect) {
  rsvpStatusSelect.addEventListener("change", () => {
    if (rsvpStatusSelect.value === "Hadir") {
      wrapperJumlah.style.display = "block";
      rsvpJumlahInput.value = "1";
    } else {
      wrapperJumlah.style.display = "none";
      rsvpJumlahInput.value = "0";
    }
  });
}
