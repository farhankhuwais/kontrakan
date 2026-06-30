# PRD — Landing Page Achi Kosan

> Versi: 1.0 | Tanggal: 29/06/2026 | Status: Draft

---

## 1. Overview

- **Product**: Landing page kos/kontrakan Achi Kosan
- **Target user**: Calon penyewa kamar kos yang mencari informasi kos secara online (mahasiswa, pekerja), serta pemilik kos sebagai pengelola konten
- **Problem**: Pemilik kos butuh halaman online untuk menampilkan info kos (foto, harga, fasilitas) tanpa harus tergantung developer setiap kali ada perubahan data
- **Value prop**: Menampilkan informasi kos secara profesional dan mudah ditemukan, sekaligus memungkinkan pemilik mengelola kontennya sendiri tanpa coding

---

## 2. Tech Stack

- **Backend**: Next.js API Routes (built-in, tidak perlu backend terpisah)
- **Admin Panel**: Custom dashboard sederhana (halaman `/admin`, bukan Filament/AdminJS)
- **Frontend**: Next.js (React) + Tailwind CSS
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth (email + password, 1 akun admin/pemilik kos)
- **Payment**: Tidak ada
- **Notifikasi**: Tidak ada integrasi API — kontak calon penyewa cukup via link `wa.me` (manual, tanpa backend)
- **Storage**: Supabase Storage (untuk upload foto kamar/kos)
- **Hosting**: Vercel
- **Catatan constraint**: Single-tenant (1 pemilik kos, 1 akun admin). Tidak perlu queue worker atau scheduler — semua operasi sinkron (CRUD biasa)

---

## 3. Features

> ★ = MVP (wajib ada di Phase 1–2) | ☆ = Nice-to-have (Phase 3+)

### Auth & Admin
- ★ Admin (pemilik kos) dapat login ke halaman `/admin`
- ★ Admin dapat logout
- ☆ Admin dapat reset password via email

### Halaman Publik (Landing Page)
- ★ Pengunjung dapat melihat informasi umum kos (nama, alamat, deskripsi, fasilitas umum)
- ★ Pengunjung dapat melihat daftar kamar beserta foto, harga, dan status (tersedia/penuh)
- ★ Pengunjung dapat klik tombol "Hubungi via WhatsApp" yang mengarah ke `wa.me` dengan nomor pemilik kos
- ☆ Pengunjung dapat melihat lokasi kos di Google Maps (embed)
- ☆ Pengunjung dapat melihat galeri foto kos (area umum, kamar mandi, dapur, dll)

### Manajemen Konten (Admin)
- ★ Admin dapat menambah, mengedit, dan menghapus data kamar (nama/no kamar, harga, deskripsi, status)
- ★ Admin dapat upload, mengganti, dan menghapus foto kamar
- ★ Admin dapat mengedit informasi umum kos (nama, alamat, deskripsi, nomor WhatsApp kontak)
- ☆ Admin dapat mengatur urutan tampil kamar (drag & drop atau nomor urut)
- ☆ Admin dapat mengaktifkan/menyembunyikan kamar tertentu dari halaman publik

---

## 4. Data Model

| Table | Kolom Kunci | Relasi |
|-------|-------------|--------|
| admin_users | id, email, password (dikelola Supabase Auth) | — |
| kos_profile | id, nama_kos, alamat, deskripsi, no_whatsapp, maps_embed_url | — (single row, hanya 1 kos) |
| kamar | id, nama_kamar, harga, deskripsi, status (tersedia/penuh), urutan, is_visible | belongsTo → kos_profile (implisit, karena single tenant) |
| kamar_foto | id, kamar_id, foto_url, urutan | belongsTo → kamar |

**Catatan khusus:**
- Tidak ada kolom `tenant_id` di manapun — karena sistem ini single-tenant (1 kos saja)
- Tabel `kos_profile` cukup 1 baris data saja (representasi 1 kos), tidak perlu relasi ke user lain
- Tidak perlu soft delete — data kos relatif sederhana dan tidak butuh riwayat historis

---

## 5. Phases

**Phase 1 — Foundation**
Setup project Next.js + Tailwind, koneksi Supabase (database, auth, storage), buat migration tabel `kos_profile`, `kamar`, `kamar_foto`, dan seeder data dummy untuk testing tampilan.

**Phase 2 — Core MVP**
Implementasi halaman publik (tampilkan profil kos & daftar kamar), implementasi login admin, implementasi CRUD kamar dan edit profil kos dari `/admin`, implementasi upload foto kamar.

**Phase 3 — Polish**
Tambahkan fitur ☆ yang diprioritaskan (galeri foto, embed Google Maps, urutan tampil kamar), perbaikan responsif mobile, optimasi gambar (compress/lazy load).

**Phase 4 — Deploy**
Validasi form lengkap (misal nomor WhatsApp wajib format benar), error handling upload foto, testing manual end-to-end, setup domain custom (kalau ada), deploy ke Vercel.

---

## 6. UI/UX Design

> Referensi visual utama: [bunga-mayang.vercel.app](https://bunga-mayang.vercel.app/) — landing page kos satu halaman (single-page) dengan navigasi anchor, struktur seksi vertikal, dan layout yang clean dan modern.

---

### 6.1 Prinsip Desain

| Prinsip | Penjelasan |
|---------|------------|
| **Single-page layout** | Semua konten tersaji dalam satu halaman dengan scroll vertikal. Navigasi menggunakan anchor link (`#kamar`, `#fasilitas`, `#kontak`) |
| **Mobile-first** | Didesain untuk mobile terlebih dahulu, lalu di-scale ke desktop. Breakpoint utama: `sm` (640px), `md` (768px), `lg` (1024px) menggunakan Tailwind CSS |
| **Informasi langsung** | Pengunjung harus bisa melihat foto, harga, dan tombol WhatsApp tanpa harus klik ke halaman lain |
| **Minimalisme fungsional** | Tidak ada animasi berlebihan. Fokus pada keterbacaan dan kemudahan kontak |

---

### 6.2 Struktur Halaman (Section Layout)

```
┌─────────────────────────────────────┐
│  NAVBAR (sticky)                    │
│  Logo | Kamar | Fasilitas | Kontak  │
├─────────────────────────────────────┤
│  HERO SECTION                       │
│  Tagline utama kos                  │
│  Foto hero / ilustrasi              │
│  CTA: "Lihat Kamar" (anchor)        │
├─────────────────────────────────────┤
│  KAMAR SECTION  (#kamar)            │
│  Grid kartu kamar (2 col mobile,    │
│  3–4 col desktop)                   │
│  Tiap kartu: foto, nama, harga,     │
│  status badge, tombol WA            │
├─────────────────────────────────────┤
│  FASILITAS SECTION  (#fasilitas)    │
│  Grid ikon + label fasilitas umum   │
│  (WiFi, parkir, dapur, dll)         │
│  Opsional: foto area umum           │
├─────────────────────────────────────┤
│  KONTAK / CTA SECTION  (#kontak)    │
│  Alamat kos                         │
│  Tombol "Hubungi via WhatsApp"      │
│  Embed Google Maps (opsional)       │
├─────────────────────────────────────┤
│  FOOTER                             │
│  Nama kos | Alamat | Nomor WA       │
└─────────────────────────────────────┘
```

---

### 6.3 Komponen UI

#### Navbar
- Sticky di atas (posisi `fixed top-0`)
- Logo/nama kos di kiri, menu anchor di kanan
- Di mobile: hamburger menu atau menu horizontal scroll
- Background putih dengan subtle shadow saat di-scroll

#### Hero Section
- Headline besar: nama kos + tagline singkat (contoh: *"Kamar nyaman untuk mahasiswa & pekerja"*)
- Subheadline: lokasi dan USP singkat
- Satu tombol CTA primer: `"Lihat Kamar Tersedia"` → anchor ke `#kamar`
- Background: foto kos atau warna solid dengan foto di sisi kanan (layout 2-kolom di desktop)

#### Kartu Kamar
```
┌──────────────────────┐
│  [FOTO KAMAR]        │
│  badge: Tersedia /   │
│         Penuh        │
├──────────────────────┤
│  Nama Kamar          │
│  Rp xxx.xxx / bulan  │
│  Deskripsi singkat   │
│                      │
│  [Hubungi via WA]    │
└──────────────────────┘
```
- Badge status: `Tersedia` (hijau) / `Penuh` (merah/abu)
- Kartu dengan status **Penuh** tetap ditampilkan tapi tombol WA di-disable atau diganti teks *"Tidak tersedia"*
- Foto menggunakan `aspect-ratio: 4/3`, object-fit cover

#### Fasilitas Section
- Grid ikon SVG + label teks (contoh: WiFi, Parkir, Dapur Bersama, Kamar Mandi Dalam, dll)
- Layout: 3 kolom di mobile, 4–6 kolom di desktop
- Data fasilitas dikelola dari tabel `kos_profile` (field `fasilitas` dalam format JSON array)

#### Tombol WhatsApp
- Warna hijau WhatsApp (`#25D366`) atau warna brand
- Link format: `https://wa.me/62XXXXXXXXXX?text=Halo,%20saya%20tertarik%20dengan%20kamar%20[nama_kamar]`
- Pesan default bisa di-preload dengan nama kamar yang diklik

---

### 6.4 Design Tokens (Tailwind Config)

```js
// tailwind.config.js — extend
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#2563EB',    // biru utama (CTA, aksen)
        secondary: '#F8FAFC',  // background section abu muda
        accent: '#16A34A',     // hijau untuk badge Tersedia & tombol WA
        danger: '#DC2626',     // merah badge Penuh
        text: '#1E293B',       // teks utama
        muted: '#64748B',      // teks sekunder/deskripsi
      }
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],       // body
      display: ['Plus Jakarta Sans', 'sans-serif'], // heading
    },
    borderRadius: {
      card: '12px',
    }
  }
}
```

> **Font**: gunakan Google Fonts — `Inter` (body) + `Plus Jakarta Sans` (heading). Keduanya gratis dan cocok untuk tampilan properti modern.

---

### 6.5 Responsif (Breakpoints)

| Elemen | Mobile (< 640px) | Tablet (640–1024px) | Desktop (> 1024px) |
|--------|-----------------|--------------------|--------------------|
| Grid kartu kamar | 1 kolom | 2 kolom | 3–4 kolom |
| Grid fasilitas | 2 kolom | 3 kolom | 4–6 kolom |
| Hero layout | Stack vertikal | Stack vertikal | 2 kolom (teks + foto) |
| Navbar | Nama kos + hamburger atau scroll | Full menu | Full menu |
| Foto kartu | aspect 4/3 full width | aspect 4/3 | aspect 4/3 |

---

### 6.6 Halaman Admin (`/admin`)

Halaman admin tidak perlu mengikuti desain landing page — fokus pada **fungsionalitas dan kemudahan pengelolaan**.

**Layout admin:**
```
┌─────────────────────────────────────┐
│  Sidebar / Top Nav (nama kos, logout│
├──────────┬──────────────────────────┤
│  Menu:   │  Konten Area             │
│  - Profil│  (form / tabel / upload) │
│  - Kamar │                          │
└──────────┴──────────────────────────┘
```

- Gunakan komponen Tailwind yang simpel: tabel, form input, tombol aksi
- Tidak perlu library UI berat — cukup komponen custom atau Headless UI
- Upload foto: drag & drop area atau `<input type="file">` biasa, preview sebelum simpan
- Tabel daftar kamar: kolom nama, harga, status, aksi (Edit / Hapus)

---

### 6.7 Referensi & Inspirasi UI

| Sumber | Keterangan |
|--------|------------|
| [bunga-mayang.vercel.app](https://bunga-mayang.vercel.app/) | Referensi utama — struktur seksi, kartu kamar, layout navigasi |
| [Tailwind UI — Marketing](https://tailwindui.com/components/marketing) | Komponen hero, feature section, CTA section (berbayar, tapi ada free preview) |
| [Flowbite](https://flowbite.com/docs/components/card/) | Komponen kartu gratis berbasis Tailwind |
| [Heroicons](https://heroicons.com/) | Ikon SVG gratis dari tim Tailwind untuk ikon fasilitas |
| [Google Fonts — Inter](https://fonts.google.com/specimen/Inter) | Font body |
| [Google Fonts — Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) | Font heading |
| [WhatsApp Button Generator](https://wa.me/) | Format URL WhatsApp dengan pesan otomatis |

---

## Catatan Tambahan

- Project ini **bukan** platform multi-kos — dirancang khusus untuk 1 pemilik kos. Kalau di masa depan ingin dikembangkan jadi multi-tenant (banyak pemilik kos), perlu refactor besar: tambah kolom `tenant_id`/`user_id` di tabel `kos_profile` dan `kamar`, serta sistem isolasi data per pemilik.
- Tidak ada fitur booking/reservasi online — interaksi penyewaan tetap manual via WhatsApp di luar sistem.
- Form booking, payment, dan notifikasi otomatis sengaja tidak diimplementasikan di versi ini karena di luar scope (landing page informasi, bukan sistem manajemen penyewaan).
