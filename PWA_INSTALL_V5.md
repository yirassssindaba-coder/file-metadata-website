# PWA Install V5

Proyek **FileShore Metadata** sekarang mendukung instalasi pada mobile dan laptop.

## Fitur
- Web App Manifest dengan ikon 192px, 512px, serta maskable icon.
- Mode standalone setelah terpasang.
- Tombol instal otomatis untuk Chromium melalui `beforeinstallprompt`.
- Petunjuk manual untuk iPhone/iPad, Safari macOS, Firefox, Android, Chrome, dan Edge.
- Service worker app-shell dan halaman offline.
- Tombol instal disembunyikan otomatis saat aplikasi sudah berjalan dalam mode standalone.
- Safe-area untuk perangkat berponi dan tampilan responsif.

## Catatan deployment
PWA harus dijalankan melalui HTTPS atau localhost. Setelah mengganti service worker, lakukan deployment baru dan muat ulang halaman.
