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
| **Database** | PostgreSQL 16 (Docker, lokal di server) |
| **Auth** | Custom session (scrypt + cookie httpOnly) |
| **Storage** | File lokal (volume Docker, disajikan via /api/files) |
| **Bahasa** | TypeScript |

## Persiapan

### 1. Clone & Install

```bash
git clone https://github.com/<username>/<repo>.git
cd achi-home-rental
npm install
```

### 2. Database Setup (Postgres lokal)

Jalankan Postgres (misal via Docker):

```bash
docker run -d --name postgres-kontrakan \
  -e POSTGRES_USER=kontrakan \
  -e POSTGRES_PASSWORD=kontrakan123 \
  -e POSTGRES_DB=kontrakan \
  -v postgres_kontrakan_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16-alpine
```

Lalu terapkan migration dari `supabase/migrations/` secara berurutan
(001 s.d. 007) ke database `kontrakan`.

### 3. Environment Variables

Buat `.env.local`:

```env
DATABASE_URL=postgres://kontrakan:kontrakan123@localhost:5432/kontrakan
UPLOAD_DIR=./uploads
```

### 4. Create Admin User

Admin seed dibuat otomatis oleh migration `007_auth_local.sql`:
- Email: `admin@achi-kosan.com`
- Password: `AchiKosan#2026`  ← WAJIB diganti segera (ganti via database)

### 5. Run Dev Server

```bash
npm run dev
```

Buka `http://localhost:3000` untuk landing page, `http://localhost:3000/admin/login` untuk admin.

## Deploy

Build image + jalankan (butuh Docker):

```bash
docker build -t kontrakan:latest .
docker compose up -d
```

> `docker-compose.yml` sudah berisi environment DATABASE_URL (via `host.docker.internal`),
> volume untuk upload, dan metadata CasaOS. Postgres berjalan sebagai container terpisah
> (`postgres-kontrakan`) di port 5432.

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
