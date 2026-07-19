<div align="center">

# 🌏 Suasana

### _Bringing Indonesia's Hidden Treasures to the Digital Stage_

<img src="@/assets/logo/suasana-banner.png" alt="Suasana Banner" width="100%" />

[![Live Demo](https://img.shields.io/badge/🌐_Demo-suasana.vercel.app-00C853?style=for-the-badge&logoColor=white)](https://suasana.vercel.app)
[![Status](https://img.shields.io/badge/Status-In_Development-FFB300?style=for-the-badge)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)]()
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)]()
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()

**An interactive platform for showcasing, supporting, and preserving Indonesia's still-hidden ecotourism destinations and local culture.**

[🚀 Live Demo](https://suasana.vercel.app) • [📖 Documentation](#-project-architecture) • [🤝 Contributing](#-contributing)

---

</div>

## 📖 About Suasana

While popular tourist destinations dominate promotion, **millions of local cultural and ecotourism treasures** scattered across Indonesia remain hidden from public attention — despite deserving far wider recognition.

**Suasana** exists as a **digital bridge** between the public and Indonesia's cultural and ecotourism riches. The platform takes an **informative, visual, and participatory** approach to boosting the visibility of lesser-known destinations.

### 🎯 Our Mission

<table>
<tr>
<td width="50%">

**📢 Increasing Visibility**

Giving a digital stage to local tourism and culture that hasn't yet reached a wider audience.

</td>
<td width="50%">

**🤝 Encouraging Participation**

Involving the public in supporting cultural preservation through voting, donations, and discussion.

</td>
</tr>
<tr>
<td width="50%">

**🌱 Sustainable Preservation**

Building awareness of the importance of protecting Indonesia's cultural heritage and environment.

</td>
<td width="50%">

**🔗 Connecting Communities**

Bringing together the public, travelers, and local stakeholders in one digital ecosystem.

</td>
</tr>
</table>

---

## ✨ Key Features

<div align="center">

|            Feature            | Description                                                                                                                                                    |
| :----------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  🗺️ **Cultural Exploration**   | Browse 60+ ecotourism and local destinations from across Indonesia, presented visually and organized by category and location |
| 🗳️ **Voting & Leaderboard** | Vote for your favorite destinations. A dynamic leaderboard shows the most-supported destinations in real time            |
|    💝 **Donation System**     | Directly support the preservation of local culture and destinations through an integrated donation feature                                                         |
|  💬 **Comments & Discussion**  | Share experiences, opinions, and tips about a destination or piece of culture with the community                                                              |
|   📝 **Educational Articles**   | Read informative articles on ecotourism, local culture, and travel tips                                                                    |
|   🔐 **Secure Authentication**   | A secure login & registration system with Google OAuth and Magic Link support                                                              |
|   🔍 **Smart Search**   | Find content easily by category, location, or keyword                                                                                    |

</div>

---

## 🏗️ Project Architecture

### Tech Stack

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
├─────────────────────────────────────────────────────────────┤
│  React 19  │  TanStack Router  │  TanStack Form  │  NUQS    │
│            │  (File-based)     │  (Type-safe)    │  (URL)   │
├─────────────────────────────────────────────────────────────┤
│                     UI COMPONENTS                           │
├─────────────────────────────────────────────────────────────┤
│        shadcn/ui (New York Style)  │  Tailwind CSS v4       │
├─────────────────────────────────────────────────────────────┤
│                       FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│                    TanStack Start                           │
│              (Full-stack React + Nitro Server)              │
├─────────────────────────────────────────────────────────────┤
│                        BACKEND                              │
├─────────────────────────────────────────────────────────────┤
│   Drizzle ORM   │   Better Auth   │   Server Functions      │
│   (Type-safe)   │   (Auth Layer)  │   (createServerFn)      │
├─────────────────────────────────────────────────────────────┤
│                       DATABASE                              │
├─────────────────────────────────────────────────────────────┤
│              Neon PostgreSQL (Serverless)                   │
└─────────────────────────────────────────────────────────────┘
```

</div>

### Technologies Used

| Layer          | Technology                                      | Purpose                                         |
| -------------- | ------------------------------------------------ | ------------------------------------------------- |
| **Framework**  | [TanStack Start](https://tanstack.com/start)   | Full-stack React framework with a Nitro server |
| **Frontend**   | [React 19](https://react.dev/)                 | UI library with the latest features (RSC, Actions) |
| **Routing**    | [TanStack Router](https://tanstack.com/router) | File-based routing with type-safety          |
| **Forms**      | [TanStack Form](https://tanstack.com/form)     | Form handling with Zod validation              |
| **URL State**  | [NUQS](https://nuqs.47ng.com/)                 | Type-safe URL query state management           |
| **ORM**        | [Drizzle](https://orm.drizzle.team/)           | Lightweight, performant TypeScript ORM   |
| **Database**   | [Neon](https://neon.tech/)                     | Serverless PostgreSQL with edge support          |
| **Auth**       | [Better Auth](https://better-auth.com/)        | Auth library with OAuth & Magic Link           |
| **UI**         | [shadcn/ui](https://ui.shadcn.com/)            | Accessible components built on Radix UI            |
| **Styling**    | [Tailwind CSS v4](https://tailwindcss.com/)    | Utility-first CSS framework                    |
| **Validation** | [Zod](https://zod.dev/)                        | TypeScript-first schema validation             |

---

## 📁 Project Structure

```
src/
├── 📂 routes/              # File-based routing (TanStack Router)
│   ├── 📂 (auth)/          # Auth routes (login, register)
│   ├── 📂 api/             # API routes
│   ├── 📂 dashboard/       # Protected dashboard routes
│   └── 📂 destinations/    # Destination pages
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

### Main Entities

| Entity      | Description                                                |
| ------------ | ------------------------------------------------------------ |
| `user`       | User data (integrated with Better Auth)          |
| `destination`  | Indonesian tourism/cultural destinations (referred to as `Destinasi` in the schema)          |
| `category`   | Content categories (Health, Education, Environment, etc.) |
| `vote`       | User votes/support for a destination                   |
| `comment`    | Comments and discussion on a destination                       |
| `article`    | Educational articles about culture & tourism                  |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- A PostgreSQL database ([Neon](https://neon.tech/) recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/Ahmad-Yu2up-Ar-Raf/Suasana.git
cd Suasana

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Push database schema
npx drizzle-kit push

# Seed database (optional)
pnpm db:seed

# Run development server
pnpm dev
```

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

| Command                   | Description                               |
| -------------------------- | -------------------------------------------- |
| `pnpm dev`                | Start the development server (port 3000) |
| `pnpm build`              | Build for production                        |
| `pnpm start`              | Run the production server              |
| `pnpm check`              | Lint & format code                          |
| `pnpm test`               | Run tests                              |
| `npx drizzle-kit push`   | Push schema to the database                 |
| `npx drizzle-kit studio` | Open Drizzle Studio                     |
| `pnpm db:seed`           | Seed the database with dummy data         |

---

## 💡 Platform Benefits

<div align="center">

|           For the Public           |      For Local Destinations      |
| :----------------------------------: | :---------------------------------: |
| ✅ Easy access to travel information | ✅ Free digital promotion media |
|  ✅ Discovering hidden destinations  |    ✅ Increased exposure     |
| ✅ Participating in preservation efforts  |  ✅ Receiving direct support  |
|   ✅ Sharing travel experiences   |     ✅ Building community      |

</div>

---

## 📌 Scope & Disclaimer

- 🔹 The platform focuses on **information and promotion**, not booking services
- 🔹 The voting system is a form of **community appreciation**, not an official assessment
- 🔹 Content is **informational and educational** in nature
- 🔹 The donation feature will integrate with a trusted payment gateway

---

## 🤝 Contributing

Contributions from the community are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Fork the repository
# Create a new branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add some AmazingFeature'

# Push the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

## 🏆 Built For

<div align="center">

**Web Design Competition**

### 🎖️ Kesatuan Bogor Olympic Festival (KBOF)

_IBI Kesatuan Bogor_

</div>

---

## 📄 License

This project is licensed under the [MIT License](LICENSE.md).

---

<div align="center">

### 🌏 Let's Preserve Indonesia's Culture and Ecotourism Together!

<img src="https://flagcdn.com/w160/id.png" width="80" alt="Indonesia Flag" />

**Made with ❤️ in Indonesia**

[⬆ Back to Top](#-suasana)

</div>

---

## 📝 Translator's notes

- The database schema table used a stray fenced code block with no language/content (an empty ` ``` ` right before "### Main Entities") — removed, since it wasn't rendering anything useful.
- `Destinasi` (Indonesian for "destination") is likely a literal table/model name in your Drizzle schema — I kept it noted alongside the English gloss rather than silently renaming it, since renaming a real schema identifier in the docs without touching the code would be misleading.
- Given the "Built For" section names a specific competition, once the event is over it might be worth adding a results/badge (e.g. "Finalist" or "Winner") if applicable — a nice authenticity touch for a portfolio README.
