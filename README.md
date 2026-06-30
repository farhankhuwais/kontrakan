# Achi Kosan — Landing Page + Admin Panel

Full-stack landing page untuk kos/kontrakan dengan admin panel. Dibangun dengan **Next.js 16 App Router**, **Tailwind CSS v4**, **Supabase**.

## Fitur

### Landing Page
- Hero dengan blob dekoratif & badge mitra
- Daftar kamar dengan foto carousel, badge status, link WhatsApp
- Fasilitas dengan ikon Heroicons & foto kolase
- Kontak dengan Google Maps embed & WhatsApp
- Responsive design

### Admin Panel (`/admin`)
- Login dengan email/password (Supabase Auth)
- CRUD kamar: tambah, edit, hapus, upload foto
- Edit profil kos: nama, alamat, deskripsi, WhatsApp, fasilitas, mitra
- Upload foto hero & foto fasilitas
- Single-tenant (1 admin)

## Tech Stack

| Stack | Keterangan |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Styling** | Tailwind CSS v4 + Heroicons v2 |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (email/password) |
| **Storage** | Supabase Storage (gambar) |
| **Bahasa** | TypeScript |

## Persiapan

### 1. Clone & Install

```bash
git clone https://github.com/<username>/<repo>.git
cd achi-home-rental
npm install
```

### 2. Supabase Setup

Buat project di [supabase.com](https://supabase.com), lalu jalankan SQL migration di **SQL Editor** secara berurutan:

1. `supabase/migrations/001_init.sql` — tabel `kos_profile`, `kamar`, `kamar_foto`
2. `supabase/migrations/002_rls_policies.sql` — RLS policies
3. `supabase/migrations/003_storage_rls.sql` — storage bucket RLS
4. `supabase/migrations/004_alamat_kamar.sql` — kolom `alamat` & `maps_url`
5. `supabase/migrations/005_fasilitas_foto_mitra.sql` — kolom `fasilitas_foto` & `mitra`

### 3. Environment Variables

Buat `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

### 4. Create Admin User

Di Supabase Dashboard → **Authentication** → **Users** → **Add User**, buat akun admin (email + password).

### 5. Run Dev Server

```bash
npm run dev
```

Buka `http://localhost:3000` untuk landing page, `http://localhost:3000/admin/login` untuk admin.

## Deploy ke Vercel

```bash
npm run build    # pastikan build sukses
```

1. Push repo ke GitHub
2. Import di [vercel.com](https://vercel.com)
3. Set environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Deploy

> Pastikan Supabase project mengizinkan koneksi dari publik (RLS sudah diatur di migration 002 & 003).

## Struktur Project

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx      # Halaman login
│   │   ├── page.tsx            # Server guard
│   │   └── AdminDashboardClient.tsx  # Dashboard admin
│   ├── api/
│   │   ├── auth/route.ts       # Login & session check
│   │   ├── kamar/route.ts      # CRUD kamar (list + create)
│   │   ├── kamar/[id]/route.ts # CRUD kamar (update + delete)
│   │   ├── profil/route.ts     # GET & PUT profil
│   │   ├── upload/route.ts     # Upload foto kamar
│   │   ├── upload-hero/route.ts # Upload foto hero
│   │   └── upload-fasilitas/route.ts # Upload foto fasilitas
│   ├── globals.css             # Tailwind theme
│   └── page.tsx                # Landing page
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── KamarSection.tsx
│   ├── KamarCard.tsx
│   ├── FasilitasSection.tsx
│   ├── KontakSection.tsx
│   └── Footer.tsx
└── lib/
    ├── types.ts                # TypeScript interfaces
    └── supabase/
        ├── client.ts           # Browser client
        └── server.ts           # Server client (cookie auth)
```

## API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/profil` | Ambil profil kos |
| PUT | `/api/profil` | Update profil (auth) |
| GET | `/api/kamar` | List semua kamar |
| POST | `/api/kamar` | Tambah kamar (auth) |
| PUT | `/api/kamar/[id]` | Update kamar (auth) |
| DELETE | `/api/kamar/[id]` | Hapus kamar (auth) |
| POST | `/api/upload` | Upload foto kamar (auth) |
| DELETE | `/api/upload` | Hapus foto kamar (auth) |
| POST | `/api/upload-hero` | Upload foto hero (auth) |
| DELETE | `/api/upload-hero` | Hapus foto hero (auth) |
| POST | `/api/upload-fasilitas` | Upload foto fasilitas (auth) |
| DELETE | `/api/upload-fasilitas` | Hapus foto fasilitas (auth) |
| POST | `/api/auth` | Login |
| GET | `/api/auth` | Cek session |
