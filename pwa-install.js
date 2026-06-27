(() => {
  "use strict";
  const APP_NAME = "FileShore Metadata";
  const APP_SLUG = "fileshore";
  const THEME = "#1d9e75";
  const ACCENT_2 = "#e8991a";
  let deferredPrompt = null;
  let launcher, overlay, installButton;

  const isStandalone = () =>
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true;

  const platformGuide = () => {
    const ua = navigator.userAgent || "";
    const isIOS = /iphone|ipad|ipod/i.test(ua);
    const isAndroid = /android/i.test(ua);
    const isMac = /macintosh|mac os x/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/chrome|crios|edg|opr|firefox|fxios/i.test(ua);
    if (isIOS) return [
      "Buka menu Bagikan (ikon kotak dengan panah ke atas).",
      "Pilih Tambahkan ke Layar Utama.",
      "Konfirmasi nama aplikasi lalu tekan Tambah."
    ];
    if (isMac && isSafari) return [
      "Buka menu File di Safari.",
      "Pilih Add to Dock / Tambahkan ke Dock.",
      "Konfirmasi untuk memasang aplikasi."
    ];
    if (isAndroid) return [
      "Buka menu browser (⋮ atau menu Bagikan).",
      "Pilih Instal aplikasi atau Tambahkan ke layar utama.",
      "Konfirmasi pemasangan."
    ];
    return [
      "Cari ikon instal di bilah alamat browser atau buka menu browser.",
      "Pilih Install app / Instal aplikasi / Apps > Install this site as an app.",
      "Konfirmasi agar aplikasi muncul di Start Menu, Dock, desktop, atau layar utama."
    ];
  };

  function closeGuide() {
    if (overlay) overlay.hidden = true;
  }

  function openGuide() {
    if (!overlay) return;
    const list = overlay.querySelector(".pwa-install-steps");
    list.innerHTML = platformGuide().map((step, index) =>
      `<li><b>${index + 1}</b><span>${step}</span></li>`
    ).join("");
    overlay.hidden = false;
    overlay.querySelector(".pwa-install-close")?.focus();
  }

  async function requestInstall() {
    if (isStandalone()) {
      launcher.hidden = true;
      return;
    }
    if (!deferredPrompt) {
      openGuide();
      return;
    }
    try {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } catch (error) {
      console.info("Install prompt tidak tersedia:", error);
      openGuide();
    } finally {
      deferredPrompt = null;
      if (installButton) installButton.querySelector("span").textContent = "Cara instal";
    }
  }

  function buildUI() {
    if (document.getElementById("pwa-install-launcher") || isStandalone()) return;
    document.documentElement.style.setProperty("--pwa-accent", THEME);
    document.documentElement.style.setProperty("--pwa-accent-2", ACCENT_2);

    launcher = document.createElement("div");
    launcher.id = "pwa-install-launcher";
    launcher.setAttribute("role", "region");
    launcher.setAttribute("aria-label", `Instal ${APP_NAME}`);
    launcher.innerHTML = `
      <button id="pwa-install-button" type="button" aria-label="Instal ${APP_NAME}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14"/></svg>
        <span>Cara instal</span>
      </button>
      <button id="pwa-install-dismiss" type="button" aria-label="Tutup tombol instal">×</button>`;
    document.body.appendChild(launcher);
    installButton = launcher.querySelector("#pwa-install-button");
    installButton.addEventListener("click", requestInstall);
    launcher.querySelector("#pwa-install-dismiss").addEventListener("click", () => {
      launcher.hidden = true;
      try { sessionStorage.setItem(`${APP_SLUG}-install-dismissed`, "1"); } catch (_) {}
    });

    overlay = document.createElement("div");
    overlay.id = "pwa-install-overlay";
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="pwa-install-dialog" role="dialog" aria-modal="true" aria-labelledby="pwa-install-title">
        <header class="pwa-install-head">
          <img class="pwa-install-app-icon" src="./icon-192.png" alt="">
          <div class="pwa-install-title"><small>Mobile & laptop</small><h2 id="pwa-install-title">Instal ${APP_NAME}</h2></div>
          <button class="pwa-install-close" type="button" aria-label="Tutup">×</button>
        </header>
        <div class="pwa-install-body">
          <p>Pasang sebagai aplikasi mandiri agar dapat dibuka dari layar utama, Start Menu, Dock, atau desktop tanpa mencari alamat website lagi.</p>
          <ol class="pwa-install-steps"></ol>
          <p class="pwa-install-note">Tombol instal otomatis hanya muncul di browser yang mendukungnya. Petunjuk manual tetap tersedia untuk Safari, iPhone/iPad, Firefox, dan browser lainnya.</p>
        </div>
        <footer class="pwa-install-actions">
          <button class="pwa-install-secondary" type="button">Nanti</button>
          <button class="pwa-install-primary" type="button">Coba instal otomatis</button>
        </footer>
      </section>`;
    document.body.appendChild(overlay);
    overlay.querySelector(".pwa-install-close").addEventListener("click", closeGuide);
    overlay.querySelector(".pwa-install-secondary").addEventListener("click", closeGuide);
    overlay.querySelector(".pwa-install-primary").addEventListener("click", async () => {
      closeGuide();
      if (deferredPrompt) await requestInstall();
      else openGuide();
    });
    overlay.addEventListener("click", (event) => { if (event.target === overlay) closeGuide(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeGuide(); });

    try {
      if (sessionStorage.getItem(`${APP_SLUG}-install-dismissed`) === "1") launcher.hidden = true;
    } catch (_) {}
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (!launcher) buildUI();
    if (launcher) launcher.hidden = false;
    if (installButton) installButton.querySelector("span").textContent = "Instal aplikasi";
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    if (launcher) launcher.hidden = true;
    closeGuide();
  });

  const start = () => {
    buildUI();
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
          .catch((error) => console.info("Service worker tidak dapat didaftarkan:", error));
      }, { once: true });
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
