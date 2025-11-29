# SoleHub 🏀👟

**SoleHub** adalah aplikasi mobile berbasis komunitas yang dirancang khusus untuk pecinta sepatu basket. Aplikasi ini memungkinkan pengguna untuk menemukan, mengulas, dan melihat rating detail dari berbagai sepatu basket, membantu pemain menemukan sepatu yang tepat untuk gaya bermain mereka.

## 🚀 Fitur Utama

*   **🏀 Katalog Sepatu Lengkap**: Jelajahi koleksi sepatu basket dari berbagai merek ternama.
*   **⭐ Review & Rating Detail**: Sistem penilaian mendalam untuk aspek krusial seperti **Traction** (Traksi), **Cushion** (Bantalan), dan **Material**.
*   **📝 Bagikan Pengalaman**: Tulis ulasan Anda sendiri dan bantu komunitas memilih sepatu terbaik.
*   **❤️ Favorit**: Simpan sepatu impian Anda ke dalam daftar favorit (Wishlist) untuk akses cepat.
*   **👤 Profil Pengguna**: Kelola profil, riwayat ulasan, dan preferensi Anda.
*   **🔐 Autentikasi Aman**: Sistem Login dan Register yang aman terintegrasi dengan Supabase.
*   **🎨 Desain Modern**: Antarmuka yang responsif, elegan, dan ramah pengguna (User Friendly).

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan teknologi modern untuk memastikan performa dan pengalaman pengguna yang terbaik:

*   **Frontend**: [React Native](https://reactnative.dev/) dengan [Expo SDK 52](https://expo.dev/)
*   **Bahasa Pemrograman**: [TypeScript](https://www.typescriptlang.org/)
*   **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL)
*   **Navigasi**: [Expo Router](https://docs.expo.dev/router/introduction/)
*   **Icons**: Lucide React Native
*   **State Management**: React Context & Hooks

## 📦 Cara Instalasi & Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

1.  **Clone Repositori**
    ```bash
    git clone [https://github.com/username-anda/SoleHub.git](https://github.com/username-anda/SoleHub.git)
    cd SoleHub
    ```

2.  **Instal Dependensi**
    Pastikan Anda sudah menginstal Node.js.
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**
    Buat file `.env` di root folder dan masukkan kredensial Supabase Anda:
    ```env
    EXPO_PUBLIC_SUPABASE_URL=url_supabase_anda
    EXPO_PUBLIC_SUPABASE_ANON_KEY=anon_key_supabase_anda
    ```

4.  **Jalankan Aplikasi**
    ```bash
    npx expo start
    ```
    Scan QR code yang muncul menggunakan aplikasi **Expo Go** di Android/iOS, atau tekan `w` untuk membuka di web, `a` untuk Android Emulator.

## 📱 Tangkapan Layar (Screenshots)

*(Anda bisa menambahkan gambar screenshot aplikasi di sini nanti)*

| Home Screen | Detail Sepatu | Halaman Review |
|:-----------:|:-------------:|:--------------:|
| *(Gambar)*  |   *(Gambar)*  |    *(Gambar)*  |

---

Dibuat oleh [Nama Anda] untuk Tugas Akhir Pengembangan Perangkat Lunak Bergerak (PPB).
