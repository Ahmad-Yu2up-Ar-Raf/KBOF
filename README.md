<div align="center">

# 🌏 Suasana

### _Mengangkat Kekayaan Tersembunyi Indonesia ke Panggung Digital_

<img src="@/assets/logo/suasana-banner.png" alt="Suasana Banner" width="100%" />

[![Live Demo](https://img.shields.io/badge/🌐_Demo-suasana.vercel.app-00C853?style=for-the-badge&logoColor=primary-foreground)](https://suasana.vercel.app)
[![Status](https://img.shields.io/badge/Status-In_Development-FFB300?style=for-the-badge)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=primary-foreground)]()
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=primary)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=primary-foreground)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()

**Platform interaktif untuk memperkenalkan, mendukung, dan melestarikan ekowisata serta budaya lokal Indonesia yang masih tersembunyi.**

[🚀 Live Demo](https://suasana.vercel.app) • [📖 Dokumentasi](#-arsitektur-project) • [🤝 Kontribusi](#-kontribusi)

---

</div>

## 📖 Tentang Suasana

Di tengah maraknya promosi destinasi wisata populer, **jutaan kekayaan budaya dan ekowisata lokal Indonesia** di pelosok negeri tetap tersembunyi dari perhatian publik. Padahal, destinasi-destinasi ini memiliki nilai tinggi yang patut dikenal masyarakat luas.

**Suasana** hadir sebagai **jembatan digital** antara masyarakat dengan kekayaan budaya dan ekowisata Indonesia. Platform ini menggunakan pendekatan yang **informatif, visual, dan partisipatif** untuk mengangkat visibilitas destinasi yang kurang dikenal.

### 🎯 Misi Kami

<table>
<tr>
<td width="50%">

**📢 Meningkatkan Visibilitas**

Memberikan panggung digital bagi wisata & budaya lokal yang belum terekspos ke masyarakat luas.

</td>
<td width="50%">

**🤝 Mendorong Partisipasi**

Melibatkan publik dalam mendukung pelestarian budaya melalui voting, donasi, dan diskusi.

</td>
</tr>
<tr>
<td width="50%">

**🌱 Pelestarian Berkelanjutan**

Menumbuhkan kesadaran pentingnya menjaga kekayaan budaya dan lingkungan Indonesia.

</td>
<td width="50%">

**🔗 Menghubungkan Komunitas**

Menyatukan masyarakat, wisatawan, dan pelaku lokal dalam satu ekosistem digital.

</td>
</tr>
</table>

---

## ✨ Fitur Utama

<div align="center">

|            Fitur            | Deskripsi                                                                                                                                                    |
| :-------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  🗺️ **Eksplorasi Budaya**   | Jelajahi 80+ destinasi ekowisata dan Destinasi lokal dari seluruh Indonesia dengan tampilan visual yang menarik, terstruktur berdasarkan kategori dan lokasi |
| 🗳️ **Voting & Leaderboard** | Berikan dukungan (vote) untuk destinasi favorit Anda. Sistem leaderboard dinamis menampilkan destinasi dengan dukungan terbanyak secara real-time            |
|    💝 **Sistem Donasi**     | Dukung pelestarian budaya dan destinasi lokal secara langsung melalui fitur donasi yang terintegrasi                                                         |
|  💬 **Komentar & Diskusi**  | Bagikan pengalaman, pendapat, dan tips tentang destinasi atau budaya tertentu bersama komunitas                                                              |
|   📝 **Artikel Edukatif**   | Baca artikel informatif dan edukatif seputar ekowisata, budaya lokal, dan tips perjalanan                                                                    |
|   🔐 **Autentikasi Aman**   | Sistem login & registrasi yang aman dengan dukungan Google OAuth dan Magic Link                                                                              |
|   🔍 **Pencarian Cerdas**   | Temukan konten dengan mudah berdasarkan kategori, lokasi, atau kata kunci                                                                                    |

</div>

---

## 🏗️ Arsitektur Project

### Tech Stack

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
├─────────────────────────────────────────────────────────────┤
│  React 19  │  TanStack Router  │  TanStack Form  │  NUQS   │
│            │  (File-based)     │  (Type-safe)    │  (URL)  │
├─────────────────────────────────────────────────────────────┤
│                     UI COMPONENTS                            │
├─────────────────────────────────────────────────────────────┤
│        shadcn/ui (New York Style)  │  Tailwind CSS v4       │
├─────────────────────────────────────────────────────────────┤
│                       FRAMEWORK                              │
├─────────────────────────────────────────────────────────────┤
│                    TanStack Start                            │
│              (Full-stack React + Nitro Server)               │
├─────────────────────────────────────────────────────────────┤
│                        BACKEND                               │
├─────────────────────────────────────────────────────────────┤
│   Drizzle ORM   │   Better Auth   │   Server Functions      │
│   (Type-safe)   │   (Auth Layer)  │   (createServerFn)      │
├─────────────────────────────────────────────────────────────┤
│                       DATABASE                               │
├─────────────────────────────────────────────────────────────┤
│              Neon PostgreSQL (Serverless)                    │
└─────────────────────────────────────────────────────────────┘
```

</div>

### Teknologi yang Digunakan

| Layer          | Teknologi                                      | Fungsi                                         |
| -------------- | ---------------------------------------------- | ---------------------------------------------- |
| **Framework**  | [TanStack Start](https://tanstack.com/start)   | Full-stack React framework dengan Nitro server |
| **Frontend**   | [React 19](https://react.dev/)                 | Library UI dengan fitur terbaru (RSC, Actions) |
| **Routing**    | [TanStack Router](https://tanstack.com/router) | File-based routing dengan type-safety          |
| **Forms**      | [TanStack Form](https://tanstack.com/form)     | Form handling dengan validasi Zod              |
| **State URL**  | [NUQS](https://nuqs.47ng.com/)                 | Type-safe URL query state management           |
| **ORM**        | [Drizzle](https://orm.drizzle.team/)           | TypeScript ORM yang lightweight & performant   |
| **Database**   | [Neon](https://neon.tech/)                     | Serverless PostgreSQL dengan edge support      |
| **Auth**       | [Better Auth](https://better-auth.com/)        | Auth library dengan OAuth & Magic Link         |
| **UI**         | [shadcn/ui](https://ui.shadcn.com/)            | Accessible components dengan Radix UI          |
| **Styling**    | [Tailwind CSS v4](https://tailwindcss.com/)    | Utility-first CSS framework                    |
| **Validation** | [Zod](https://zod.dev/)                        | TypeScript-first schema validation             |

---

## 📁 Struktur Project

```
src/
├── 📂 routes/              # File-based routing (TanStack Router)
│   ├── 📂 (auth)/          # Auth routes (login, register)
│   ├── 📂 api/             # API routes
│   ├── 📂 dashboard/       # Protected dashboard routes
│   └── 📂 Destinasi/         # Destinasi pages
├── 📂 db/                  # Database layer
│   ├── schema.ts           # Drizzle schema definitions
│   ├── relations.ts        # Table relations
│   ├── seed.ts             # Database seeder
│   └── index.ts            # Database connection
├── 📂 lib/
│   ├── 📂 auth/            # Better Auth configuration
│   ├── 📂 server/          # Server functions & queries
│   ├── 📂 validations/     # Zod validation schemas
│   └── 📂 utils/           # Utility functions
├── 📂 hooks/               # Custom React hooks
│   └── 📂 form/            # Form-specific hooks
├── 📂 components/
│   └── 📂 ui/
│       ├── 📂 core/        # Feature components
│       └── 📂 fragments/   # Reusable UI fragments
├── 📂 config/              # App configuration
│   └── 📂 data/            # Static data (JSON)
└── 📂 types/               # TypeScript type definitions
```

---

## 🗄️ Database Schema

````

### Entitas Utama

| Entitas    | Deskripsi                                                |
| ---------- | -------------------------------------------------------- |
| `user`     | Data pengguna (terintegrasi dengan Better Auth)          |
| `Destinasi`  | Destinasi, wisata, dan budaya lokal Indonesia              |
| `category` | Kategori konten (Kesehatan, Pendidikan, Lingkungan, dll) |
| `vote`     | Vote/dukungan pengguna untuk Destinasi                     |
| `comment` | Komentar dan diskusi pada Destinasi |
| `article` | Artikel edukatif tentang budaya & wisata |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) atau npm
- PostgreSQL database ([Neon](https://neon.tech/) recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/Ahmad-Yu2up-Ar-Raf/KBOF.git
cd KBOF

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan credentials Anda

# Push database schema
npx drizzle-kit push

# Seed database (optional)
pnpm db:seed

# Run development server
pnpm dev
````

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key"

# OAuth (Google)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Email (Resend)
RESEND_API_KEY="..."
EMAIL_SENDER_NAME="Suasana"
EMAIL_SENDER_ADDRESS="noreply@suasana.id"
```

---

## 📜 Scripts

| Command                  | Deskripsi                               |
| ------------------------ | --------------------------------------- |
| `pnpm dev`               | Jalankan development server (port 3000) |
| `pnpm build`             | Build production                        |
| `pnpm start`             | Jalankan production server              |
| `pnpm check`             | Lint & format code                      |
| `pnpm test`              | Jalankan tests                          |
| `npx drizzle-kit push`   | Push schema ke database                 |
| `npx drizzle-kit studio` | Buka Drizzle Studio                     |
| `pnpm db:seed`           | Seed database dengan dummy data         |

---

## 💡 Manfaat Platform

<div align="center">

|           Untuk Masyarakat           |      Untuk Destinasi Lokal      |
| :----------------------------------: | :-----------------------------: |
| ✅ Akses informasi wisata yang mudah | ✅ Media promosi digital gratis |
|  ✅ Menemukan destinasi tersembunyi  |    ✅ Meningkatkan eksposur     |
| ✅ Berpartisipasi dalam pelestarian  |  ✅ Menerima dukungan langsung  |
|   ✅ Berbagi pengalaman perjalanan   |     ✅ Membangun komunitas      |

</div>

---

## 📌 Batasan & Disclaimer

- 🔹 Platform fokus pada **informasi dan promosi**, bukan layanan pemesanan
- 🔹 Sistem voting bersifat **apresiasi komunitas**, bukan penilaian resmi
- 🔹 Konten bersifat **informatif dan edukatif**
- 🔹 Fitur donasi akan terintegrasi dengan payment gateway terpercaya

---

## 🤝 Kontribusi

Kami menyambut kontribusi dari komunitas! Silakan baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan kontribusi.

```bash
# Fork repository
# Buat branch baru
git checkout -b feature/AmazingFeature

# Commit perubahan
git commit -m 'Add some AmazingFeature'

# Push ke branch
git push origin feature/AmazingFeature

# Buat Pull Request
```

---

## 🏆 Dibuat Untuk

<div align="center">

**Lomba Web Design**

### 🎖️ Kesatuan Bogor Olympic Festival (KBOF)

_IBI Kesatuan Bogor_

</div>

---

## 📄 Lisensi

Project ini dilisensikan di bawah [MIT License](LICENSE.md).

---

<div align="center">

### 🌏 Mari Bersama Lestarikan Budaya dan Ekowisata Indonesia!

<img src="https://flagcdn.com/w160/id.png" width="80" alt="Indonesia Flag" />

**Made with ❤️ in Indonesia**

[⬆ Back to Top](#-suasana)

</div>
