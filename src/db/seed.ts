// =============================================================================
// DATABASE SEEDER - SUASANA
// =============================================================================
// Comprehensive seeder for wisata & budaya Indonesia
// Run: npm run db:seed (or npx tsx src/db/seed.ts)
// =============================================================================

import 'dotenv/config'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

import {
  user,
  account,
  session,
  verification,
  destination,
  vote,
  review,
  article,
  destinationType,
  destinationCategory,
  provinsiIndonesia,
} from './schema'

// Promisify scrypt for async usage
const scryptAsync = promisify(scrypt)

// Password hashing function compatible with Better Auth
async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer
  return `${salt}:${derivedKey.toString('hex')}`
}

// Default password for all seed users
const SEED_PASSWORD = 'Test123!'

// =============================================================================
// SEED DATA - WISATA & BUDAYA INDONESIA
// =============================================================================

// Sample users for seeding
const seedUsers = [
  { name: 'Admin Suasana', email: 'admin@suasana.id' },
  { name: 'Budi Santoso', email: 'budi.santoso@email.com' },
  { name: 'Siti Nurhaliza', email: 'siti.nurhaliza@email.com' },
  { name: 'Ahmad Wijaya', email: 'ahmad.wijaya@email.com' },
  { name: 'Dewi Lestari', email: 'dewi.lestari@email.com' },
  { name: 'Rizki Pratama', email: 'rizki.pratama@email.com' },
  { name: 'Maya Sari', email: 'maya.sari@email.com' },
  { name: 'Andi Kusuma', email: 'andi.kusuma@email.com' },
  { name: 'Ratna Dewi', email: 'ratna.dewi@email.com' },
  { name: 'Faisal Rahman', email: 'faisal.rahman@email.com' },
  // Additional users for more votes and reviews
  { name: 'Putri Handayani', email: 'putri.handayani@email.com' },
  { name: 'Agus Setiawan', email: 'agus.setiawan@email.com' },
  { name: 'Rina Wulandari', email: 'rina.wulandari@email.com' },
  { name: 'Hendra Gunawan', email: 'hendra.gunawan@email.com' },
  { name: 'Lina Marlina', email: 'lina.marlina@email.com' },
  { name: 'Yusuf Hakim', email: 'yusuf.hakim@email.com' },
  { name: 'Novi Anggraini', email: 'novi.anggraini@email.com' },
  { name: 'Bambang Suryadi', email: 'bambang.suryadi@email.com' },
  { name: 'Indah Permata', email: 'indah.permata@email.com' },
  { name: 'Doni Saputra', email: 'doni.saputra@email.com' },
  { name: 'Wulan Sari', email: 'wulan.sari@email.com' },
  { name: 'Rudi Hermawan', email: 'rudi.hermawan@email.com' },
  { name: 'Tina Mulyani', email: 'tina.mulyani@email.com' },
  { name: 'Eko Prasetyo', email: 'eko.prasetyo@email.com' },
  { name: 'Fitri Rahayu', email: 'fitri.rahayu@email.com' },
  { name: 'Joko Widodo', email: 'joko.widodo@email.com' },
  { name: 'Anita Susanti', email: 'anita.susanti@email.com' },
  { name: 'Teguh Pranoto', email: 'teguh.pranoto@email.com' },
  { name: 'Diana Kusuma', email: 'diana.kusuma@email.com' },
  { name: 'Wahyu Hidayat', email: 'wahyu.hidayat@email.com' },
  { name: 'Sri Wahyuni', email: 'sri.wahyuni@email.com' },
  { name: 'Irfan Maulana', email: 'irfan.maulana@email.com' },
  { name: 'Yanti Kurniawati', email: 'yanti.kurniawati@email.com' },
  { name: 'Arief Budiman', email: 'arief.budiman@email.com' },
  { name: 'Nia Rahmawati', email: 'nia.rahmawati@email.com' },
  { name: 'Bayu Nugroho', email: 'bayu.nugroho@email.com' },
  { name: 'Dina Fitriani', email: 'dina.fitriani@email.com' },
  { name: 'Sigit Purnomo', email: 'sigit.purnomo@email.com' },
  { name: 'Lia Amelia', email: 'lia.amelia@email.com' },
  { name: 'Hendri Susanto', email: 'hendri.susanto@email.com' },
  { name: 'Mega Putri', email: 'mega.putri@email.com' },
  { name: 'Fajar Sidiq', email: 'fajar.sidiq@email.com' },
  { name: 'Citra Dewi', email: 'citra.dewi@email.com' },
  { name: 'Galih Permana', email: 'galih.permana@email.com' },
  { name: 'Rini Astuti', email: 'rini.astuti@email.com' },
  { name: 'Dimas Aditya', email: 'dimas.aditya@email.com' },
  { name: 'Sari Indrawati', email: 'sari.indrawati@email.com' },
  { name: 'Taufik Hidayat', email: 'taufik.hidayat@email.com' },
  { name: 'Ayu Lestari', email: 'ayu.lestari@email.com' },
  { name: 'Rangga Wibowo', email: 'rangga.wibowo@email.com' },
  { name: 'Melani Safitri', email: 'melani.safitri@email.com' },
  { name: 'Adi Nugraha', email: 'adi.nugraha@email.com' },
  { name: 'Kartika Sari', email: 'kartika.sari@email.com' },
  { name: 'Surya Dharma', email: 'surya.dharma@email.com' },
  { name: 'Nadia Putri', email: 'nadia.putri@email.com' },
  { name: 'Gilang Ramadhan', email: 'gilang.ramadhan@email.com' },
  { name: 'Laras Wati', email: 'laras.wati@email.com' },
  { name: 'Yoga Pratama', email: 'yoga.pratama@email.com' },
  { name: 'Bella Anastasia', email: 'bella.anastasia@email.com' },
  { name: 'Kevin Wijaya', email: 'kevin.wijaya@email.com' },
  { name: 'Rosa Melinda', email: 'rosa.melinda@email.com' },
  { name: 'Andika Putra', email: 'andika.putra@email.com' },
  { name: 'Shinta Dewi', email: 'shinta.dewi@email.com' },
  { name: 'Ferry Kurniawan', email: 'ferry.kurniawan@email.com' },
  { name: 'Vina Oktavia', email: 'vina.oktavia@email.com' },
  { name: 'Danang Saputro', email: 'danang.saputro@email.com' },
  { name: 'Elsa Maharani', email: 'elsa.maharani@email.com' },
  { name: 'Rio Fernando', email: 'rio.fernando@email.com' },
  { name: 'Nurul Hidayah', email: 'nurul.hidayah@email.com' },
]

// Comprehensive destination data - Wisata & Budaya Indonesia
const destinationData: Array<{
  name: string
  description: string
  type: (typeof destinationType.enumValues)[number]
  category: (typeof destinationCategory.enumValues)[number]
  provinsi: (typeof provinsiIndonesia.enumValues)[number]
  kabupatenKota?: string
  // Manual Unsplash images - fill in with actual URLs
  coverImage: string
  images: string[] // Gallery images (3 recommended)
}> = [
    // ========== WISATA ALAM ==========
    {
      name: 'Danau Toba',
      description:
        'Danau vulkanik terbesar di Asia Tenggara dengan keindahan alam yang memukau. Pulau Samosir di tengah danau menyimpan warisan budaya Batak yang kaya. Destinasi wajib bagi pecinta alam dan budaya.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'sumatera-utara',
      kabupatenKota: 'Toba Samosir',
      coverImage: 'https://images.unsplash.com/photo-1642762205001-aada86f9dbe2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Danau Toba aerial
      images: [
        'https://images.unsplash.com/photo-1586703449297-0618fa522ecf?q=80&w=415&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Toba lake view
        'https://images.unsplash.com/photo-1440558929809-1412944a6225?q=80&w=1029&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Samosir island
        'https://images.unsplash.com/photo-1623692333663-c2d4aeb14b83?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batak house Toba
      ],
    },
    {
      name: 'Raja Ampat',
      description:
        'Surga bawah laut dunia dengan keanekaragaman hayati laut tertinggi di planet. Lebih dari 1.500 spesies ikan dan 75% spesies karang dunia ada di sini. Paradise for divers.',
      type: 'wisata-bahari',
      category: 'pariwisata',
      provinsi: 'papua-barat',
      kabupatenKota: 'Raja Ampat',
      coverImage: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Raja Ampat islands
      images: [
        'https://images.unsplash.com/photo-1702664045144-8c97b3034d26?q=80&w=382&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Raja Ampat wayag
        'https://images.unsplash.com/photo-1715940094024-b704b7493be4?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Raja Ampat underwater
        'https://plus.unsplash.com/premium_photo-1684943834601-3a5e8e8f7005?q=80&w=821&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tropical island
      ],
    },
    {
      name: 'Gunung Bromo',
      description:
        'Gunung berapi aktif yang ikonik dengan pemandangan matahari terbit spektakuler. Lautan pasir dan kawah yang mengeluarkan asap menjadi daya tarik utama. Salah satu destinasi foto terbaik Indonesia.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'jawa-timur',
      kabupatenKota: 'Probolinggo',
      coverImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Bromo sunrise
      images: [
        'https://images.unsplash.com/photo-1602154663343-89fe0bf541ab?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Bromo crater
        'https://images.unsplash.com/photo-1589277683134-e0fc4231addf?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Bromo sea of sand
        'https://images.unsplash.com/photo-1565619109666-b8bfe0e95ceb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Bromo aerial
      ],
    },
    {
      name: 'Kawah Ijen',
      description:
        'Kawah vulkanik dengan blue fire fenomenal dan danau asam terbesar di dunia. Penambang belerang tradisional menjadi pemandangan unik. Pendakian malam untuk melihat api biru yang memukau.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'jawa-timur',
      kabupatenKota: 'Banyuwangi',
      coverImage: 'https://images.unsplash.com/photo-1555058170-94d5f5016a2c?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ijen blue fire
      images: [
        'https://images.unsplash.com/photo-1536146094120-8d7fcbc4c45b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ijen crater lake
        'https://images.unsplash.com/photo-1603718989452-e832af5e2b1e?q=80&w=443&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ijen sulfur miners
        'https://images.unsplash.com/photo-1629735990937-8c24ffd1a413?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ijen sunrise
      ],
    },
    {
      name: 'Taman Nasional Komodo',
      description:
        'Habitat asli komodo, kadal terbesar di dunia. UNESCO World Heritage Site dengan savana, pantai pink, dan perairan yang kaya biota laut. Petualangan wildlife yang tak terlupakan.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'nusa-tenggara-timur',
      kabupatenKota: 'Manggarai Barat',
      coverImage: 'https://images.unsplash.com/photo-1717238977683-5f06a9e60694?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Komodo dragon
      images: [
        'https://images.unsplash.com/photo-1660280274563-767dd6b56374?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Komodo island
        'https://images.unsplash.com/photo-1656384778813-dd8fd7fbc785?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Padar island
        'https://images.unsplash.com/photo-1562578057-3ca1f7815237?q=80&w=902&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Pink beach Komodo
      ],
    },
    {
      name: 'Pantai Pink Lombok',
      description:
        'Salah satu dari 7 pantai pink di dunia. Pasir berwarna merah muda unik berasal dari pecahan karang merah yang bercampur pasir putih. Keajaiban alam yang instagramable.',
      type: 'wisata-bahari',
      category: 'pariwisata',
      provinsi: 'nusa-tenggara-barat',
      kabupatenKota: 'Lombok Timur',
      coverImage: 'https://images.unsplash.com/photo-1562008928-6185cc645f76?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Pink beach
      images: [
        'https://images.unsplash.com/photo-1603886219003-b15275da8b9c?q=80&w=722&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Lombok beach
        'https://images.unsplash.com/photo-1724127722795-96efb9caffbc?q=80&w=929&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tropical beach
        'https://images.unsplash.com/photo-1558089551-95d707e6c13c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Beach sunset
      ],
    },
    {
      name: 'Gili Trawangan',
      description:
        'Pulau kecil tanpa kendaraan bermotor dengan pantai pasir putih dan terumbu karang. Snorkeling dengan penyu laut dan sunset yang romantic. Party island yang terkenal hingga mancanegara.',
      type: 'wisata-bahari',
      category: 'pariwisata',
      provinsi: 'nusa-tenggara-barat',
      kabupatenKota: 'Lombok Utara',
      coverImage: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1200&h=800&fit=crop', // Gili Trawangan
      images: [
        'https://images.unsplash.com/photo-1605216663815-98e407cd8a4a?w=800&h=600&fit=crop', // Gili beach
        'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop', // Underwater turtle
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Coral reef
      ],
    },
    {
      name: 'Kepulauan Derawan',
      description:
        'Kepulauan tropis dengan ubur-ubur tidak menyengat di Danau Kakaban. Penyu hijau bertelur, manta ray, dan pari manta. Surga diving tersembunyi di Kalimantan.',
      type: 'wisata-bahari',
      category: 'pariwisata',
      provinsi: 'kalimantan-timur',
      kabupatenKota: 'Berau',
      coverImage: 'https://images.unsplash.com/photo-1758653000057-34adac6ac623?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Derawan jellyfish lake
      images: [
        'https://images.unsplash.com/photo-1759861995679-5eb30a7e3942?q=80&w=512&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Sea turtle
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Underwater
        'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&h=600&fit=crop', // Tropical island
      ],
    },
    {
      name: 'Danau Kelimutu',
      description:
        'Tiga danau kawah dengan warna berbeda yang bisa berubah-ubah. Dipercaya sebagai tempat bersemayamnya arwah. Keajaiban alam yang mistis dan spektakuler.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'nusa-tenggara-timur',
      kabupatenKota: 'Ende',
      coverImage: 'https://images.unsplash.com/photo-1519901246372-95385e087ff3?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Kelimutu lakes
      images: [
        'https://images.unsplash.com/photo-1712129461375-7dc489010665?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Volcanic crater lake
        'https://images.unsplash.com/photo-1639541295171-bd57d9c3e6ed?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mountain scenery
        'https://images.unsplash.com/photo-1639541271425-75478489de23?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mountain sunrise
      ],
    },
    {
      name: 'Gunung Rinjani',
      description:
        'Gunung berapi tertinggi kedua di Indonesia dengan Segara Anak yang memukau. Pendakian menantang dengan pemandangan panorama luar biasa. Spiritual journey bagi masyarakat Sasak.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'nusa-tenggara-barat',
      kabupatenKota: 'Lombok Timur',
      coverImage: 'https://images.unsplash.com/photo-1621001481154-a52cbb91fcc2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Rinjani crater
      images: [
        'https://images.unsplash.com/photo-1699754493225-3b0a60e12d06?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Rinjani view
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', // Mountain trekking
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Volcanic lake
      ],
    },
    {
      name: 'Taman Nasional Way Kambas',
      description:
        'Pusat konservasi gajah sumatera dan badak sumatera. Safari adventure dan interaksi dengan satwa langka. Pengalaman wildlife conservation yang edukatif.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'lampung',
      kabupatenKota: 'Lampung Timur',
      coverImage: 'https://images.unsplash.com/photo-1738394595245-73dcb15bca0b?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Sumatran elephant
      images: [
        'https://images.unsplash.com/photo-1680226687502-6223346fffe5?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Elephant bathing
        'https://images.unsplash.com/photo-1691745375674-108730c775e6?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Wildlife
        'https://images.unsplash.com/photo-1604069871151-23761eebcb7d?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Rainforest
      ],
    },
    {
      name: 'Taman Nasional Ujung Kulon',
      description:
        'Habitat terakhir badak jawa yang hampir punah. UNESCO World Heritage dengan hutan hujan tropis dan pantai perawan. Konservasi dan petualangan alam liar.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'banten',
      kabupatenKota: 'Pandeglang',
      coverImage: 'https://images.unsplash.com/photo-1722688010304-bdb181fbda3a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tropical rainforest
      images: [
        'https://images.unsplash.com/photo-1604069871151-23761eebcb7d?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Dense jungle
        'https://images.unsplash.com/photo-1692435671357-f50d0c256d46?q=80&w=940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Beach forest
        'https://images.unsplash.com/photo-1687958131741-2950de79d0de?q=80&w=465&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Wildlife
      ],
    },
    {
      name: 'Ngarai Sianok',
      description:
        'Grand Canyon-nya Indonesia dengan tebing curam dan sawah bertingkat. Rumah Gadang di tepi ngarai menambah pesona. Trekking dan photography paradise.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'sumatera-barat',
      kabupatenKota: 'Bukittinggi',
      coverImage: 'https://images.unsplash.com/photo-1720033787459-0eb7ea2913d5?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Canyon valley
      images: [
        'https://images.unsplash.com/photo-1668086381606-eb0a1404a1b8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Valley view
        'https://images.unsplash.com/photo-1643207711188-4aca63172249?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mountain scenery
        'https://images.unsplash.com/photo-1609412058473-c199497c3c5d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Rice terraces
      ],
    },
    {
      name: 'Danau Maninjau',
      description:
        'Danau vulkanik dengan 44 tikungan legendaris menuju ke sana. Pesona alam yang tenang dan damai. Tempat retreat dan refleksi yang sempurna.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'sumatera-barat',
      kabupatenKota: 'Agam',
      coverImage: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=800&fit=crop', // Volcanic lake
      images: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop', // Lake panorama
        'https://images.unsplash.com/photo-1712129461375-7dc489010665?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mountain reflection
        'https://images.unsplash.com/photo-1684189930003-9434c949925f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Serene nature
      ],
    },

    // ========== WISATA BUDAYA & SEJARAH ==========
    {
      name: 'Candi Borobudur',
      description:
        'Candi Buddha terbesar di dunia dan UNESCO World Heritage Site. 2.672 panel relief dan 504 arca Buddha. Sunrise dari Punthuk Setumbu yang legendaris.',
      type: 'wisata-sejarah',
      category: 'situs-sejarah',
      provinsi: 'jawa-tengah',
      kabupatenKota: 'Magelang',
      coverImage: 'https://images.unsplash.com/photo-1645699822985-5b3389ff5b58?q=80&w=385&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Borobudur temple
      images: [
        'https://images.unsplash.com/photo-1620549146396-9024d914cd99?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Borobudur stupa
        'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&h=600&fit=crop', // Buddha statue
        'https://images.unsplash.com/photo-1588312578101-cacee14bb0ab?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Borobudur sunrise
      ],
    },
    {
      name: 'Candi Prambanan',
      description:
        'Kompleks candi Hindu terbesar di Indonesia. Arsitektur megah dengan relief Ramayana yang detail. Sendratari Ramayana saat malam bulan purnama.',
      type: 'wisata-sejarah',
      category: 'situs-sejarah',
      provinsi: 'di-yogyakarta',
      kabupatenKota: 'Sleman',
      coverImage: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200&h=800&fit=crop', // Prambanan temple
      images: [
        'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?q=80&w=806&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Prambanan detail
        'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&h=600&fit=crop', // Temple complex
        'https://images.unsplash.com/photo-1566559631133-969041fc5583?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Sunset view
      ],
    },
    {
      name: 'Keraton Yogyakarta',
      description:
        'Istana kesultanan yang masih aktif dan pusat kebudayaan Jawa. Arsitektur tradisional dengan filosofi Jawa yang mendalam. Museum dan pertunjukan seni klasik.',
      type: 'wisata-budaya',
      category: 'lokasi-budaya',
      provinsi: 'di-yogyakarta',
      kabupatenKota: 'Yogyakarta',
      coverImage: 'https://images.unsplash.com/photo-1631681895793-4dbe543350e2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Keraton Jogja
      images: [
        'https://images.unsplash.com/photo-1543875376-a32d8bc36315?q=80&w=404&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Javanese architecture
        'https://images.unsplash.com/photo-1630214801769-24784bfd2b9c?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Palace interior
        'https://images.unsplash.com/photo-1631795617958-3ddcf718d6aa?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Traditional building
      ],
    },
    {
      name: 'Keraton Surakarta',
      description:
        'Pusat kebudayaan Jawa Solo dengan pusaka kerajaan yang sakral. Arsitektur Jawa klasik dan tradisi yang terjaga. Pasar Klewer dan kuliner Solo di sekitarnya.',
      type: 'wisata-budaya',
      category: 'lokasi-budaya',
      provinsi: 'jawa-tengah',
      kabupatenKota: 'Surakarta',
      coverImage: 'https://images.unsplash.com/photo-1707544338081-147f3608bc64?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Solo Palace
      images: [
        'https://images.unsplash.com/photo-1543875376-a32d8bc36315?q=80&w=404&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Javanese architecture
        'https://images.unsplash.com/photo-1630214801769-24784bfd2b9c?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Palace interior
        'https://images.unsplash.com/photo-1631795617958-3ddcf718d6aa?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Traditional building
      ],
    },
    {
      name: 'Tana Toraja',
      description:
        'Tanah leluhur dengan arsitektur Tongkonan yang ikonik. Upacara pemakaman Rambu Solo yang unik. Kubur batu tebing dan patung Tau-tau. Budaya yang menghormati leluhur.',
      type: 'wisata-budaya',
      category: 'adat-istiadat',
      provinsi: 'sulawesi-selatan',
      kabupatenKota: 'Tana Toraja',
      coverImage: 'https://images.unsplash.com/photo-1582426007790-f5a2e2392dd3?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Toraja Tongkonan
      images: [
        'https://images.unsplash.com/photo-1675206362603-b3c3c3ca47c6?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Traditional house
        'https://images.unsplash.com/photo-1676134690674-fa97718b8510?q=80&w=361&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Toraja culture
        'https://images.unsplash.com/photo-1619238445475-4742e8c8ebd3?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Burial site
      ],
    },
    {
      name: 'Desa Penglipuran Bali',
      description:
        'Desa tradisional Bali yang terjaga keasliannya. Tata ruang desa yang teratur dengan arsitektur seragam. Desa terbersih di dunia dengan kearifan lokal yang kuat.',
      type: 'wisata-budaya',
      category: 'lokasi-budaya',
      provinsi: 'bali',
      kabupatenKota: 'Bangli',
      coverImage: 'https://images.unsplash.com/photo-1671080749889-19f8a69deb2b?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Bali village
      images: [
        'https://images.unsplash.com/photo-1680188700662-5b03bdcf3017?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Balinese gate
        'https://images.unsplash.com/photo-1680188700627-537d543ed3a8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Village street
        'https://images.unsplash.com/photo-1680188700625-217db9f545f0?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Traditional house
      ],
    },
    {
      name: 'Pura Besakih',
      description:
        'Pura terbesar dan tersucil di Bali, ibu dari semua pura. Kompleks 23 pura di lereng Gunung Agung. Pusat spiritual Hindu Bali dengan upacara megah.',
      type: 'wisata-religi',
      category: 'lokasi-budaya',
      provinsi: 'bali',
      kabupatenKota: 'Karangasem',
      coverImage: 'https://images.unsplash.com/photo-1593938637471-cb705e42d533?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Besakih temple
      images: [
        'https://images.unsplash.com/photo-1655289112205-d3b56c6b61f8?q=80&w=905&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Temple stairs
        'https://images.unsplash.com/photo-1593938637267-7d70420742a3?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Temple complex
        'https://images.unsplash.com/photo-1636549887083-5eb4bc623ef4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mount Agung view
      ],
    },
    {
      name: 'Pura Tanah Lot',
      description:
        'Pura di atas karang tengah laut yang ikonik. Sunset spot terbaik di Bali. Arsitektur yang menyatu dengan alam dan legenda Dang Hyang Nirartha.',
      type: 'wisata-religi',
      category: 'lokasi-budaya',
      provinsi: 'bali',
      kabupatenKota: 'Tabanan',
      coverImage: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&h=800&fit=crop', // Tanah Lot sunset
      images: [
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop', // Temple on rock
        'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&h=600&fit=crop', // Sea temple
        'https://images.unsplash.com/photo-1624935851312-845758a99160?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Sunset view
      ],
    },
    {
      name: 'Masjid Istiqlal',
      description:
        'Masjid terbesar di Asia Tenggara dengan arsitektur modern minimalis. Simbol toleransi bersebelahan dengan Katedral Jakarta. Destinasi wisata religi internasional.',
      type: 'wisata-religi',
      category: 'situs-sejarah',
      provinsi: 'dki-jakarta',
      kabupatenKota: 'Jakarta Pusat',
      coverImage: 'https://images.unsplash.com/photo-1636984011278-886b13d0772d?w=1200&h=800&fit=crop', // Istiqlal Mosque
      images: [
        'https://images.unsplash.com/photo-1733760746690-f07b1d6015cd?w=800&h=600&fit=crop', // Mosque interior
        'https://images.unsplash.com/photo-1666593687574-285b8672980e?w=800&h=600&fit=crop', // Dome view
        'https://images.unsplash.com/photo-1740500574894-d2c33117f31e?w=800&h=600&fit=crop', // Architecture
      ],
    },
    {
      name: 'Lawang Sewu',
      description:
        'Gedung bersejarah peninggalan Belanda dengan seribu pintu. Arsitektur art deco yang megah. Wisata sejarah dan spot foto heritage di Semarang.',
      type: 'wisata-sejarah',
      category: 'situs-sejarah',
      provinsi: 'jawa-tengah',
      kabupatenKota: 'Semarang',
      coverImage: 'https://images.unsplash.com/photo-1651890053473-b25f7e1672dd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Colonial building
      images: [
        'https://images.unsplash.com/photo-1604973746130-1876090c8a79?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Architecture detail
        'https://images.unsplash.com/photo-1651890059696-247893997e83?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Heritage building
        'https://images.unsplash.com/photo-1668352781006-34e81523ae3c?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Interior corridor
      ],
    },
    {
      name: 'Kota Tua Jakarta',
      description:
        'Kawasan bersejarah dengan bangunan kolonial Belanda. Museum Fatahillah dan café heritage. Time travel ke era VOC yang historis.',
      type: 'wisata-sejarah',
      category: 'situs-sejarah',
      provinsi: 'dki-jakarta',
      kabupatenKota: 'Jakarta Barat',
      coverImage: 'https://images.unsplash.com/photo-1695444297714-f418f5a7507e?q=80&w=385&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Kota Tua square
      images: [
        'https://images.unsplash.com/photo-1614655683452-5bedbf434db7?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Museum Fatahillah
        'https://images.unsplash.com/photo-1655553721258-b534f832fcc2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Colonial buildings
        'https://images.unsplash.com/photo-1692448500924-7e8ea759b1be?q=80&w=385&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Heritage area
      ],
    },
    {
      name: 'Istana Maimun',
      description:
        'Istana Kesultanan Deli dengan arsitektur perpaduan Melayu, Islam, dan Eropa. Warna kuning keemasan yang megah. Simbol kemegahan Melayu Deli.',
      type: 'wisata-sejarah',
      category: 'lokasi-budaya',
      provinsi: 'sumatera-utara',
      kabupatenKota: 'Medan',
      coverImage: 'https://images.unsplash.com/photo-1610570534468-19a1a86a3c36?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Maimun Palace
      images: [
        'https://images.unsplash.com/photo-1761500545837-b19876118bdb?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Palace interior
        'https://images.unsplash.com/photo-1730581822486-72518b0750ef?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Golden dome
        'https://images.unsplash.com/photo-1692822380975-7584b49eaba2?q=80&w=360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Malay architecture
      ],
    },

    // ========== KESENIAN & KERAJINAN ==========
    {
      name: 'Tari Kecak Uluwatu',
      description:
        'Pertunjukan tari sakral tanpa alat musik, hanya suara cak-cak penari. Dipentaskan saat sunset di tebing Uluwatu. Drama Ramayana yang memukau.',
      type: 'kesenian',
      category: 'kesenian-daerah',
      provinsi: 'bali',
      kabupatenKota: 'Badung',
      coverImage: 'https://images.unsplash.com/photo-1718631932394-dfedda3a212f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Kecak dance
      images: [
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop', // Dancers
        'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&h=600&fit=crop', // Sunset performance
        'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&h=600&fit=crop', // Uluwatu temple
      ],
    },
    {
      name: 'Wayang Kulit Solo',
      description:
        'Seni pertunjukan wayang dengan dalang maestro. Cerita Mahabharata dan Ramayana semalam suntuk. Warisan budaya lisan dan visual UNESCO.',
      type: 'kesenian',
      category: 'kesenian-daerah',
      provinsi: 'jawa-tengah',
      kabupatenKota: 'Surakarta',
      coverImage: 'https://images.unsplash.com/photo-1662793524504-bd11271b4b56?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Wayang kulit
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Shadow puppet
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Performance
        'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&h=600&fit=crop', // Puppet detail
      ],
    },
    {
      name: 'Tari Saman',
      description:
        'Tari seribu tangan dari Aceh yang mendunia. Gerakan kompak tanpa musik instrumental. UNESCO Intangible Cultural Heritage yang membanggakan.',
      type: 'kesenian',
      category: 'kesenian-daerah',
      provinsi: 'aceh',
      kabupatenKota: 'Gayo Lues',
      coverImage: 'https://images.unsplash.com/photo-1741272689174-f7f03b09a0ab?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Saman dance
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Dancers in line
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Traditional costume
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop', // Group performance
      ],
    },
    {
      name: 'Angklung Saung Udjo',
      description:
        'Pertunjukan angklung interaktif yang menghibur. Belajar dan bermain alat musik bambu tradisional. Edutainment budaya Sunda yang menyenangkan.',
      type: 'kesenian',
      category: 'kesenian-daerah',
      provinsi: 'jawa-barat',
      kabupatenKota: 'Bandung',
      coverImage: 'https://images.unsplash.com/photo-1691229219602-f3634d8ff4b0?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Angklung performance
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Bamboo instruments
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Interactive show
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop', // Cultural performance
      ],
    },
    {
      name: 'Batik Pekalongan',
      description:
        'Kota batik dengan motif pesisir yang khas. Museum Batik dan workshop membatik. UNESCO Creative City dengan warisan tekstil yang kaya.',
      type: 'kerajinan',
      category: 'kesenian-daerah',
      provinsi: 'jawa-tengah',
      kabupatenKota: 'Pekalongan',
      coverImage: 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=1200&h=800&fit=crop', // Batik fabric
      images: [
        'https://images.unsplash.com/photo-1604973104381-870c92f10343?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batik process
        'https://images.unsplash.com/photo-1616125162686-770bf85622b9?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batik pattern
        'https://plus.unsplash.com/premium_photo-1664114934715-4ee5e2526409?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batik workshop
      ],
    },
    {
      name: 'Batik Yogyakarta',
      description:
        'Batik klasik dengan motif filosofis Keraton. Pakem Keraton dan batik tulis berkualitas tinggi. Sentra batik Malioboro dan Kotagede.',
      type: 'kerajinan',
      category: 'kesenian-daerah',
      provinsi: 'di-yogyakarta',
      kabupatenKota: 'Yogyakarta',
      coverImage: 'https://images.unsplash.com/photo-1604973104381-870c92f10343?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batik Yogya
      images: [
        'https://plus.unsplash.com/premium_photo-1664114934715-4ee5e2526409?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Classic batik
        'https://images.unsplash.com/photo-1630929436231-91f4c6fe4884?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batik making
        'https://images.unsplash.com/photo-1616125162686-770bf85622b9?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batik motif
      ],
    },
    {
      name: 'Tenun Ikat Flores',
      description:
        'Kain tenun tradisional dengan motif tribal yang unik. Proses pembuatan berbulan-bulan dengan pewarna alami. Warisan budaya Manggarai dan Sikka.',
      type: 'kerajinan',
      category: 'kesenian-daerah',
      provinsi: 'nusa-tenggara-timur',
      kabupatenKota: 'Sikka',
      coverImage: 'https://images.unsplash.com/photo-1593671186131-d58817e7dee0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tenun weaving
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Ikat pattern
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Traditional weaving
        'https://images.unsplash.com/photo-1570789210967-2cac24557701?w=800&h=600&fit=crop', // Flores textile
      ],
    },
    {
      name: 'Songket Palembang',
      description:
        'Kain tenun mewah dengan benang emas dan perak. Simbol kemewahan dan status sosial. Tradisi tenun yang diwariskan turun-temurun.',
      type: 'kerajinan',
      category: 'kesenian-daerah',
      provinsi: 'sumatera-selatan',
      kabupatenKota: 'Palembang',
      coverImage: 'https://images.unsplash.com/photo-1718938611659-fa97f0a87b9b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Songket
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Gold thread
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Weaving loom
        'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&h=600&fit=crop', // Traditional fabric
      ],
    },
    {
      name: 'Ukiran Jepara',
      description:
        'Pusat seni ukir kayu berkualitas ekspor. Mebel dan kerajinan dengan detail yang rumit. Tradisi R.A. Kartini dan pengrajin terampil.',
      type: 'kerajinan',
      category: 'kesenian-daerah',
      provinsi: 'jawa-tengah',
      kabupatenKota: 'Jepara',
      coverImage: 'https://images.unsplash.com/photo-1681311370373-980633672183?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Wood carving
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Carved furniture
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Carving detail
        'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&h=600&fit=crop', // Artisan work
      ],
    },
    {
      name: 'Perak Kotagede',
      description:
        'Sentra kerajinan perak dengan teknik tradisional. Perhiasan dan aksesoris berkualitas tinggi. Kampung perak di kawasan heritage Yogyakarta.',
      type: 'kerajinan',
      category: 'kesenian-daerah',
      provinsi: 'di-yogyakarta',
      kabupatenKota: 'Yogyakarta',
      coverImage: 'https://images.unsplash.com/photo-1511253819057-5408d4d70465?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Silver jewelry
      images: [
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=600&fit=crop', // Silver crafting
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Silver accessories
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Jewelry display
      ],
    },
    {
      name: 'Keramik Kasongan',
      description:
        'https://images.unsplash.com/photo-1695815870444-da67db99d7c0?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      type: 'kerajinan',
      category: 'kesenian-daerah',
      provinsi: 'di-yogyakarta',
      kabupatenKota: 'Bantul',
      coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&h=800&fit=crop', // Pottery making
      images: [
        'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&h=600&fit=crop', // Clay pottery
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Ceramic products
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Workshop
      ],
    },

    // ========== ADAT ISTIADAT & FESTIVAL ==========
    {
      name: 'Upacara Kasada Bromo',
      description:
        'Ritual tahunan suku Tengger persembahan ke kawah Bromo. Sesaji hasil bumi dilempar ke kawah. Tradisi Hindu-Buddha yang unik di pegunungan.',
      type: 'adat-istiadat',
      category: 'adat-istiadat',
      provinsi: 'jawa-timur',
      kabupatenKota: 'Probolinggo',
      coverImage: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=1200&h=800&fit=crop', // Bromo ceremony
      images: [
        'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&h=600&fit=crop', // Tengger tribe
        'https://images.unsplash.com/photo-1602158123419-c1c4d0e6e554?w=800&h=600&fit=crop', // Ritual offerings
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Traditional ceremony
      ],
    },
    {
      name: 'Nyepi di Bali',
      description:
        'Hari raya Saka yang sunyi tanpa aktivitas. Ogoh-ogoh parade malam sebelumnya yang meriah. Refleksi spiritual dan detox digital alami.',
      type: 'adat-istiadat',
      category: 'adat-istiadat',
      provinsi: 'bali',
      kabupatenKota: 'Denpasar',
      coverImage: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=1200&h=800&fit=crop', // Nyepi Bali
      images: [
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop', // Ogoh-ogoh
        'https://images.unsplash.com/photo-1558005137-d9619a5c539f?w=800&h=600&fit=crop', // Balinese ceremony
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Silent day
      ],
    },
    {
      name: 'Sekaten Solo',
      description:
        'Perayaan Maulid Nabi dengan gamelan sakral Keraton. Pasar malam dan kirab budaya. Perpaduan Islam dan tradisi Jawa yang harmonis.',
      type: 'festival',
      category: 'adat-istiadat',
      provinsi: 'jawa-tengah',
      kabupatenKota: 'Surakarta',
      coverImage: 'https://images.unsplash.com/photo-1600093112291-7e65c36c2c11?w=1200&h=800&fit=crop', // Sekaten festival
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Gamelan
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Night market
        'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=800&h=600&fit=crop', // Cultural parade
      ],
    },
    {
      name: 'Festival Lembah Baliem',
      description:
        'Festival budaya suku Dani dengan atraksi perang-perangan. Tarian tradisional dan ritual bakar batu. Kekayaan budaya Papua yang eksotis.',
      type: 'festival',
      category: 'adat-istiadat',
      provinsi: 'papua',
      kabupatenKota: 'Jayawijaya',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop', // Baliem valley
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Dani tribe
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Traditional dance
        'https://images.unsplash.com/photo-1570789210967-2cac24557701?w=800&h=600&fit=crop', // Papua culture
      ],
    },
    {
      name: 'Jember Fashion Carnaval',
      description:
        'Karnaval fashion terbesar di Asia dengan kostum spektakuler. Kreativitas anak bangsa yang mendunia. Street fashion parade yang fenomenal.',
      type: 'festival',
      category: 'kesenian-daerah',
      provinsi: 'jawa-timur',
      kabupatenKota: 'Jember',
      coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=800&fit=crop', // Fashion carnival
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Costume parade
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Street festival
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop', // Creative costumes
      ],
    },
    {
      name: 'Cap Go Meh Singkawang',
      description:
        'Festival Tatung dengan atraksi mistis yang menakjubkan. Perayaan Imlek terbesar di Indonesia. Budaya Tionghoa-Dayak yang harmonis.',
      type: 'festival',
      category: 'adat-istiadat',
      provinsi: 'kalimantan-barat',
      kabupatenKota: 'Singkawang',
      coverImage: 'https://images.unsplash.com/photo-1682827893620-457803c24cc9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Chinese new year
      images: [
        'https://images.unsplash.com/photo-1614503719153-561f3fbcc089?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tatung parade
        'https://images.unsplash.com/photo-1637978313102-af2558d7d05a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Festival lights
        'https://images.unsplash.com/photo-1614503779931-7ad8b62a859b?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Dragon dance
      ],
    },
    {
      name: 'Erau Kutai Kartanegara',
      description:
        'Festival adat Kesultanan Kutai dengan ritual sakral. Prosesi adat Melayu Kalimantan yang megah. Pesta rakyat dengan berbagai atraksi.',
      type: 'festival',
      category: 'adat-istiadat',
      provinsi: 'kalimantan-timur',
      kabupatenKota: 'Kutai Kartanegara',
      coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=800&fit=crop', // Erau festival
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Malay ceremony
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Cultural parade
        'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop', // River festival
      ],
    },
    {
      name: 'Pasola Sumba',
      description:
        'Ritual perang berkuda dengan lembing dari suku Sumba. Tradisi panen dan kesuburan tanah. Atraksi budaya yang mendebarkan dan sakral.',
      type: 'adat-istiadat',
      category: 'adat-istiadat',
      provinsi: 'nusa-tenggara-timur',
      kabupatenKota: 'Sumba Barat',
      coverImage: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&h=800&fit=crop', // Horse riding
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Sumba culture
        'https://images.unsplash.com/photo-1570789210967-2cac24557701?w=800&h=600&fit=crop', // Traditional ritual
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Spear throwing
      ],
    },
    {
      name: 'Tabuik Pariaman',
      description:
        'Festival mengenang Husein dengan prosesi Tabuik ke laut. Perpaduan Islam dan tradisi Minangkabau. Ritual yang khidmat dan meriah.',
      type: 'festival',
      category: 'adat-istiadat',
      provinsi: 'sumatera-barat',
      kabupatenKota: 'Pariaman',
      coverImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=800&fit=crop', // Tabuik festival
      images: [
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Procession
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Sea ceremony
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Festival crowd
      ],
    },

    // ========== KULINER TRADISIONAL ==========
    {
      name: 'Kampung Kuliner Semarang',
      description:
        'Wisata kuliner dengan aneka masakan khas Semarang. Lumpia, wingko babat, dan bandeng presto. Food trail di kota Lunpia.',
      type: 'wisata-kuliner',
      category: 'kuliner-tradisional',
      provinsi: 'jawa-tengah',
      kabupatenKota: 'Semarang',
      coverImage: 'https://images.unsplash.com/photo-1600004637343-27fc104f67b8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Indonesian food
      images: [
        'https://images.unsplash.com/photo-1585071524737-25578b0b2c5a?q=80&w=857&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Street food
        'https://images.unsplash.com/photo-1681311370652-4bae085833de?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Local dishes
        'https://images.unsplash.com/photo-1634871572365-8bc444e6faea?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Food market
      ],
    },
    {
      name: 'Kuliner Malioboro',
      description:
        'Surga jajanan kaki lima Yogyakarta. Gudeg, bakpia, dan wedang ronde. Pengalaman kuliner otentik di jantung Jogja.',
      type: 'wisata-kuliner',
      category: 'kuliner-tradisional',
      provinsi: 'di-yogyakarta',
      kabupatenKota: 'Yogyakarta',
      coverImage: 'https://images.unsplash.com/photo-1568622998407-0084ebf482b0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Malioboro street food
      images: [
        'https://images.unsplash.com/photo-1569925873429-e769889c2077?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Gudeg
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop', // Traditional snacks
        'https://images.unsplash.com/photo-1641224286624-8b87abc6bc49?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Night market
      ],
    },
    {
      name: 'Pasar Beringharjo',
      description:
        'Pasar tradisional tertua di Yogyakarta dengan kuliner lengkap. Jamu tradisional, batik, dan makanan khas. Pengalaman belanja autentik.',
      type: 'wisata-kuliner',
      category: 'kuliner-tradisional',
      provinsi: 'di-yogyakarta',
      kabupatenKota: 'Yogyakarta',
      coverImage: 'https://images.unsplash.com/photo-1699628039216-2d51de425f81?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Traditional market
      images: [
        'https://images.unsplash.com/photo-1727249293947-00754cf44bdc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Market food
        'https://images.unsplash.com/photo-1599720298082-19ecae524733?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Local delicacies
        'https://images.unsplash.com/photo-1545830016-b441e357919d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Market scene
      ],
    },
    {
      name: 'Rendang Padang',
      description:
        'Menikmati rendang otentik di tanah Minang. Rumah makan Padang legendaris dengan nasi kapau. Kuliner terenak di dunia versi CNN.',
      type: 'wisata-kuliner',
      category: 'kuliner-tradisional',
      provinsi: 'sumatera-barat',
      kabupatenKota: 'Padang',
      coverImage: 'https://images.unsplash.com/photo-1620700668269-d3ad2a88f27e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Rendang
      images: [
        'https://images.unsplash.com/photo-1677921755291-c39158477b8e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Padang cuisine
        'https://images.unsplash.com/photo-1766567461692-32c352d198d4?q=80&w=749&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Beef rendang
        'https://images.unsplash.com/photo-1620700880565-cfa3b0fd22e3?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Spicy dishes
      ],
    },
    {
      name: 'Sate Madura',
      description:
        'Sate kambing dan ayam dengan bumbu kacang khas. Tradisi kuliner masyarakat Madura. Aromanya yang menggoda selera.',
      type: 'wisata-kuliner',
      category: 'kuliner-tradisional',
      provinsi: 'jawa-timur',
      kabupatenKota: 'Pamekasan',
      coverImage: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=1200&h=800&fit=crop', // Satay
      images: [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop', // Grilled satay
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop', // Peanut sauce
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop', // Street food
      ],
    },
    {
      name: 'Soto Banjar',
      description:
        'Soto khas Kalimantan dengan perkedel kentang dan telur. Kuah bening dengan rempah yang hangat. Comfort food dari tanah Banjar.',
      type: 'wisata-kuliner',
      category: 'kuliner-tradisional',
      provinsi: 'kalimantan-selatan',
      kabupatenKota: 'Banjarmasin',
      coverImage: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=1200&h=800&fit=crop', // Soto
      images: [
        'https://images.unsplash.com/photo-1677029969063-23ecbb98d0af?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Soup
        'https://images.unsplash.com/photo-1572656306390-40a9fc3899f7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Indonesian soup
        'https://images.unsplash.com/photo-1681378128359-a5c2492a3535?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Traditional dish
      ],
    },
    {
      name: 'Coto Makassar',
      description:
        'Sup daging sapi khas Sulawesi Selatan dengan bumbu kacang. Disajikan dengan ketupat dan burasa. Kuliner legendaris kota Daeng.',
      type: 'wisata-kuliner',
      category: 'kuliner-tradisional',
      provinsi: 'sulawesi-selatan',
      kabupatenKota: 'Makassar',
      coverImage: 'https://images.unsplash.com/photo-1681378128359-a5c2492a3535?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Coto Makassar
      images: [
        'https://images.unsplash.com/photo-1677029969063-23ecbb98d0af?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Beef soup
        'https://images.unsplash.com/photo-1572656306390-40a9fc3899f7?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // South Sulawesi food
        'https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Traditional soup
      ],
    },

    // ========== MORE WISATA ALAM ==========
    {
      name: 'Pulau Weh',
      description:
        'Pulau paling barat Indonesia dengan diving world-class. Tugu Kilometer Nol dan keindahan bawah laut. Sabang yang eksotis dan penuh petualangan.',
      type: 'wisata-bahari',
      category: 'pariwisata',
      provinsi: 'aceh',
      kabupatenKota: 'Sabang',
      coverImage: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&h=800&fit=crop', // Tropical island
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Underwater
        'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&h=600&fit=crop', // Beach
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', // Coastal view
      ],
    },
    {
      name: 'Belitung',
      description:
        'Pulau dengan pantai berbatu granit yang unik. Laskar Pelangi trail dan museum sastra. Keindahan alam yang instagramable.',
      type: 'wisata-bahari',
      category: 'pariwisata',
      provinsi: 'kepulauan-bangka-belitung',
      kabupatenKota: 'Belitung',
      coverImage: 'https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?w=1200&h=800&fit=crop', // Granite beach
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', // Beach rocks
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop', // Clear water
        'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop', // Island view
      ],
    },
    {
      name: 'Wakatobi',
      description:
        'Taman Nasional Laut dengan terumbu karang pristine. Diving dan snorkeling paradise. Nama dari empat pulau: Wangi-Wangi, Kaledupa, Tomia, Binongko.',
      type: 'wisata-bahari',
      category: 'pariwisata',
      provinsi: 'sulawesi-tenggara',
      kabupatenKota: 'Wakatobi',
      coverImage: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=800&fit=crop', // Coral reef
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Underwater
        'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800&h=600&fit=crop', // Marine life
        'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&h=600&fit=crop', // Diving
      ],
    },
    {
      name: 'Kepulauan Togean',
      description:
        'Kepulauan terpencil dengan keindahan bawah laut yang masih perawan. Suku Bajo yang hidup di atas laut. Off the beaten path destination.',
      type: 'wisata-bahari',
      category: 'pariwisata',
      provinsi: 'sulawesi-tengah',
      kabupatenKota: 'Tojo Una-Una',
      coverImage: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&h=800&fit=crop', // Remote island
      images: [
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Clear water
        'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&h=600&fit=crop', // Stilt houses
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', // Secluded beach
      ],
    },
    {
      name: 'Dieng Plateau',
      description:
        'Dataran tinggi dengan candi Hindu tertua di Jawa. Kawah dan telaga vulkanik yang menawan. Sunrise di atas awan yang magis.',
      type: 'wisata-alam',
      category: 'situs-sejarah',
      provinsi: 'jawa-tengah',
      kabupatenKota: 'Wonosobo',
      coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=800&fit=crop', // Misty plateau
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Temple ruins
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop', // Volcanic crater
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop', // Golden sunrise
      ],
    },
    {
      name: 'Pantai Parangtritis',
      description:
        'Pantai legendaris dengan legenda Nyi Roro Kidul. Sunset dan naik andong di tepi pantai. Pantai ikonik Yogyakarta.',
      type: 'wisata-bahari',
      category: 'pariwisata',
      provinsi: 'di-yogyakarta',
      kabupatenKota: 'Bantul',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop', // Beach sunset
      images: [
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop', // Beach scene
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Waves
        'https://images.unsplash.com/photo-1476673160081-cf065f7c6ce6?w=800&h=600&fit=crop', // Horse riding
      ],
    },
    {
      name: 'Air Terjun Madakaripura',
      description:
        'Air terjun tertinggi di Jawa dengan tebing curam. Tempat pertapaan Gajah Mada yang sakral. Hidden gem di kawasan Bromo.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'jawa-timur',
      kabupatenKota: 'Probolinggo',
      coverImage: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&h=800&fit=crop', // Waterfall
      images: [
        'https://images.unsplash.com/photo-1482685945432-29a7abf2f466?w=800&h=600&fit=crop', // Canyon waterfall
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', // Cliff
        'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop', // Forest path
      ],
    },
    {
      name: 'Taman Nasional Gunung Leuser',
      description:
        'Habitat orangutan sumatera dan flora fauna endemic. UNESCO World Heritage dengan hutan hujan tropis. Ekowisata dan trekking adventure.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'aceh',
      kabupatenKota: 'Aceh Tenggara',
      coverImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1200&h=800&fit=crop', // Orangutan
      images: [
        'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop', // Rainforest
        'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=800&h=600&fit=crop', // Jungle
        'https://images.unsplash.com/photo-1597953601374-1ff2d5640c85?w=800&h=600&fit=crop', // Wildlife
      ],
    },
    {
      name: 'Bukit Lawang',
      description:
        'Pintu masuk ke hutan orangutan dengan river tubing. Jungle trekking dan wildlife encounter. Eco-tourism yang sustainable.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'sumatera-utara',
      kabupatenKota: 'Langkat',
      coverImage: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1200&h=800&fit=crop', // Orangutan habitat
      images: [
        'https://images.unsplash.com/photo-1597953601374-1ff2d5640c85?w=800&h=600&fit=crop', // Primate
        'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&h=600&fit=crop', // Forest
        'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=800&h=600&fit=crop', // River
      ],
    },
    {
      name: 'Labuan Bajo',
      description:
        'Gerbang menuju Taman Nasional Komodo dengan sunset indah. Bukit Cinta dan Pulau Padar. Destinasi rising star Indonesia.',
      type: 'wisata-bahari',
      category: 'pariwisata',
      provinsi: 'nusa-tenggara-timur',
      kabupatenKota: 'Manggarai Barat',
      coverImage: 'https://images.unsplash.com/photo-1577632905708-68fec7ac27d3?w=1200&h=800&fit=crop', // Padar island
      images: [
        'https://images.unsplash.com/photo-1570789210967-2cac24557701?w=800&h=600&fit=crop', // Sunset view
        'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop', // Hills
        'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&h=600&fit=crop', // Boat harbor
      ],
    },

    // ========== ADDITIONAL DESTINATIONS ==========
    {
      name: 'Ubud Bali',
      description:
        'Pusat seni dan budaya Bali dengan sawah terasering. Monkey Forest dan galeri seni. Spiritual retreat dan yoga destination.',
      type: 'wisata-budaya',
      category: 'lokasi-budaya',
      provinsi: 'bali',
      kabupatenKota: 'Gianyar',
      coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&h=800&fit=crop', // Ubud rice terrace
      images: [
        'https://images.unsplash.com/photo-1558005137-d9619a5c539f?w=800&h=600&fit=crop', // Monkey forest
        'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&h=600&fit=crop', // Temple
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Art gallery
      ],
    },
    {
      name: 'Tegallalang Rice Terrace',
      description:
        'Sawah terasering ikonik dengan sistem irigasi subak tradisional. UNESCO Cultural Landscape yang indah. Photography spot yang wajib dikunjungi.',
      type: 'wisata-alam',
      category: 'lokasi-budaya',
      provinsi: 'bali',
      kabupatenKota: 'Gianyar',
      coverImage: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1200&h=800&fit=crop', // Tegallalang rice terrace
      images: [
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop', // Rice paddies
        'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Terrace view
        'https://images.unsplash.com/photo-1604999333679-b86d54738315?w=800&h=600&fit=crop', // Palm trees
      ],
    },
    {
      name: 'Desa Wae Rebo',
      description:
        'Desa adat Manggarai dengan rumah adat Mbaru Niang. Trekking melalui hutan untuk mencapai desa. Warisan budaya yang terjaga di ketinggian.',
      type: 'wisata-budaya',
      category: 'adat-istiadat',
      provinsi: 'nusa-tenggara-timur',
      kabupatenKota: 'Manggarai',
      coverImage: 'https://images.unsplash.com/photo-1578019448201-09ad2ac7995a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Traditional cone houses
      images: [
        'https://images.unsplash.com/photo-1643785879507-11a0c02205da?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Village view
        'https://images.unsplash.com/photo-1573397942508-6e4d9d97a8a0?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Mountain setting
        'https://images.unsplash.com/photo-1643785879506-ec3e637a9f2d?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Forest trail
      ],
    },
    {
      name: 'Rumah Gadang Minangkabau',
      description:
        'Arsitektur tradisional Minang dengan atap tanduk kerbau. Pusat adat dan musyawarah masyarakat. Ikon budaya Sumatera Barat.',
      type: 'wisata-budaya',
      category: 'lokasi-budaya',
      provinsi: 'sumatera-barat',
      kabupatenKota: 'Padang Panjang',
      coverImage: 'https://images.unsplash.com/photo-1653910729824-df4f32c60acf?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Minang architecture
      images: [
        'https://images.unsplash.com/photo-1606633007433-a1abd835f6cd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Traditional roof
        'https://images.unsplash.com/photo-1759742263138-44f13ba8520b?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Cultural house
        'https://plus.unsplash.com/premium_photo-1673283243936-57acf471fc0e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Village setting
      ],
    },
    {
      name: 'Rumah Tongkonan Toraja',
      description:
        'Rumah adat dengan atap melengkung seperti perahu. Ukiran dan warna yang penuh makna filosofis. Arsitektur ikonik Sulawesi Selatan.',
      type: 'wisata-budaya',
      category: 'lokasi-budaya',
      provinsi: 'sulawesi-selatan',
      kabupatenKota: 'Tana Toraja',
      coverImage: 'https://images.unsplash.com/photo-1675206362603-b3c3c3ca47c6?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tongkonan house
      images: [
        'https://images.unsplash.com/photo-1582426007790-f5a2e2392dd3?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Boat-shaped roof
        'https://images.unsplash.com/photo-1619238445475-4742e8c8ebd3?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Carved decorations
        'https://images.unsplash.com/photo-1727672100642-c8e8dfa7dca3?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Village complex
      ],
    },
    {
      name: 'Tanjung Puting',
      description:
        'Taman Nasional orangutan dengan perjalanan klotok. Camp Leakey dan rehabilitasi orangutan. Wildlife cruise yang tak terlupakan.',
      type: 'wisata-alam',
      category: 'pariwisata',
      provinsi: 'kalimantan-tengah',
      kabupatenKota: 'Kotawaringin Barat',
      coverImage: 'https://plus.unsplash.com/premium_photo-1661821205919-aa973dad0529?q=80&w=643&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Orangutan
      images: [
        'https://images.unsplash.com/photo-1612368195523-19e00a05b1cf?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Wildlife
        'https://images.unsplash.com/photo-1583753341245-5175f6acfe38?q=80&w=436&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // River cruise
        'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=800&h=600&fit=crop', // Rainforest
      ],
    },
    {
      name: 'Pulau Morotai',
      description:
        'Pulau bersejarah Perang Dunia II yang eksotis. Wreck diving dan pantai perawan. Destinasi sejarah dan bahari yang unik.',
      type: 'wisata-sejarah',
      category: 'pariwisata',
      provinsi: 'maluku-utara',
      kabupatenKota: 'Pulau Morotai',
      coverImage: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&h=800&fit=crop', // Tropical island
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', // Beach
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Underwater wreck
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop', // Historic site
      ],
    },
    {
      name: 'Banda Neira',
      description:
        'Kepulauan rempah bersejarah dengan benteng VOC. Snorkeling dengan lava flow dan gunung api aktif. Time capsule sejarah maritime.',
      type: 'wisata-sejarah',
      category: 'situs-sejarah',
      provinsi: 'maluku',
      kabupatenKota: 'Maluku Tengah',
      coverImage: 'https://images.unsplash.com/photo-1701157795877-c04cdeca7cbc?w=1200&h=800&fit=crop', // Colonial fort
      images: [
        'https://images.unsplash.com/photo-1581600140682-d4e68c8cde32?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Spice islands
        'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Dutch architecture
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Marine life
      ],
    },
    {
      name: 'Ora Beach',
      description:
        'Resort terapung di teluk dengan air jernih. Hidden paradise di Maluku yang masih perawan. Ketenangan dan keindahan alam yang luar biasa.',
      type: 'wisata-bahari',
      category: 'pariwisata',
      provinsi: 'maluku',
      kabupatenKota: 'Seram Utara',
      coverImage: 'https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200&h=800&fit=crop', // Overwater bungalow
      images: [
        'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop', // Crystal clear water
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Snorkeling
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', // Secluded beach
      ],
    },
  ]

// =============================================================================
// REVIEW TEMPLATES - Relevan dengan tipe destinasi (minimal 15 per tipe)
// =============================================================================

const reviewTemplates: Record<string, Array<{ rating: number; title: string; content: string }>> = {
  'wisata-alam': [
    { rating: 5, title: 'Pemandangan Luar Biasa!', content: 'Pemandangan alamnya sangat memukau, udara segar dan sejuk. Sangat cocok untuk refreshing dari rutinitas kota. Sangat direkomendasikan!' },
    { rating: 5, title: 'Surga Tersembunyi', content: 'Tempat ini benar-benar surga tersembunyi. Alam masih sangat asri dan terjaga. Pengalaman mendaki yang tidak terlupakan.' },
    { rating: 4, title: 'Indah Tapi Perlu Persiapan', content: 'Pemandangannya indah banget, tapi perlu persiapan fisik yang baik. Jalur pendakian cukup menantang. Sepadan dengan usahanya!' },
    { rating: 5, title: 'Pengalaman Alam Terbaik', content: 'Salah satu pengalaman alam terbaik saya di Indonesia. Flora dan fauna yang beragam, pemandangan yang spektakuler.' },
    { rating: 4, title: 'Wajib Dikunjungi', content: 'Destinasi wajib buat pecinta alam. Sunrise-nya menakjubkan! Hanya saja fasilitas masih perlu ditingkatkan.' },
    { rating: 5, title: 'Keajaiban Alam Indonesia', content: 'Bangga punya keajaiban alam seperti ini di Indonesia. Konservasi alamnya sangat baik. Semoga tetap terjaga!' },
    { rating: 4, title: 'Pengalaman Tak Terlupakan', content: 'Perjalanan yang melelahkan tapi sangat memuaskan. Pemandangan di puncak membayar semua usaha.' },
    { rating: 3, title: 'Bagus Tapi Ramai', content: 'Tempatnya indah tapi terlalu ramai saat akhir pekan. Lebih baik datang di hari biasa untuk pengalaman yang lebih tenang.' },
    { rating: 5, title: 'Kesegaran Udara Pegunungan', content: 'Udara di sini masih sangat segar dan bersih. Vegetasi hijau di mana-mana membuat mata dan pikiran rileks.' },
    { rating: 4, title: 'Pendakian Seru Banget', content: 'Jalur pendakiannya menantang tapi pemandangan sepanjang jalan sangat indah. Jangan lupa bawa bekal yang cukup!' },
    { rating: 5, title: 'Spot Foto Cantik', content: 'Setiap sudut bisa dijadikan spot foto! Latar belakang alamnya keren banget. Puas banget foto-foto di sini.' },
    { rating: 4, title: 'Cocok untuk Berkemah', content: 'Area berkemahnya bagus dan terawat. Malam hari bisa lihat bintang-bintang dengan jelas. Pengalaman berkemah terbaik!' },
    { rating: 5, title: 'Air Terjun Memukau', content: 'Air terjunnya deras dan jernih. Suara gemericik air sangat menenangkan. Spa alami yang sesungguhnya!' },
    { rating: 3, title: 'Perlu Perbaikan Jalan', content: 'Alamnya cantik tapi akses jalannya masih rusak di beberapa titik. Hati-hati kalau bawa kendaraan pribadi.' },
    { rating: 5, title: 'Keanekaragaman Hayati', content: 'Banyak sekali jenis burung dan kupu-kupu yang bisa dilihat. Surga bagi pecinta fotografi satwa liar!' },
    { rating: 4, title: 'Sunset yang Memanjakan Mata', content: 'Sunset di sini luar biasa indah! Langit berubah warna dari oranye ke ungu. Momen yang sangat romantis.' },
  ],
  'wisata-bahari': [
    { rating: 5, title: 'Surga Bawah Laut!', content: 'Menyelam dan snorkeling di sini luar biasa! Terumbu karang masih sangat sehat, ikan warna-warni sangat banyak.' },
    { rating: 5, title: 'Pantai Terindah', content: 'Pantainya bersih, airnya jernih, pasirnya putih. Sunset di sini adalah yang terbaik yang pernah saya lihat.' },
    { rating: 4, title: 'Surga yang Ditemukan', content: 'Benar-benar seperti surga! Snorkeling dengan penyu dan pari manta. Pengalaman sekali seumur hidup.' },
    { rating: 5, title: 'Surga Bawah Air', content: 'Keanekaragaman hayati lautnya luar biasa. Sebagai penyelam, ini adalah salah satu spot terbaik yang pernah saya kunjungi.' },
    { rating: 4, title: 'Pantai Impian', content: 'Pantai yang selama ini hanya ada di mimpi ternyata nyata di sini. Air laut yang hangat dan jernih.' },
    { rating: 5, title: 'Wajib untuk Penyelam', content: 'Wajib dikunjungi untuk para penyelam! Penyelaman di dinding karang yang menakjubkan dengan jarak pandang yang sangat bagus.' },
    { rating: 4, title: 'Liburan Pantai Menenangkan', content: 'Tempat yang sempurna untuk melarikan diri dari keramaian. Suasana pantai yang menenangkan dan pemandangan yang damai.' },
    { rating: 3, title: 'Indah Tapi Terpencil', content: 'Sangat indah tapi aksesnya cukup sulit. Perlu perencanaan yang matang dan biaya yang cukup.' },
    { rating: 5, title: 'Taman Karang Menakjubkan', content: 'Taman karang bawah lautnya seperti di film dokumenter! Warna-warni karang yang masih sehat dan beragam.' },
    { rating: 4, title: 'Ombak Sempurna untuk Selancar', content: 'Ombaknya konsisten dan pas untuk selancar. Ada spot untuk pemula dan yang sudah mahir. Surga berselancar!' },
    { rating: 5, title: 'Pulau Pribadi Rasanya', content: 'Pantainya sepi dan bersih, rasanya seperti punya pulau pribadi. Sangat privat dan tenang.' },
    { rating: 4, title: 'Snorkeling Seru', content: 'Banyak banget ikan badut yang bisa dilihat! Anak-anak senang sekali. Cocok untuk wisata keluarga.' },
    { rating: 5, title: 'Laguna Biru yang Nyata', content: 'Air lautnya biru toska jernih banget! Bisa lihat dasar laut dengan jelas. Seperti di film!' },
    { rating: 3, title: 'Bagus Tapi Minim Fasilitas', content: 'Pantainya cantik tapi toilet dan warung masih terbatas. Bawa perlengkapan sendiri lebih baik.' },
    { rating: 5, title: 'Melihat Lumba-lumba Luar Biasa', content: 'Beruntung bisa lihat lumba-lumba berenang bebas! Momen ajaib yang tidak terlupakan.' },
    { rating: 4, title: 'Kayak Seru', content: 'Menyusuri pantai dengan kayak sangat menyenangkan. Air tenang dan pemandangan dari laut sangat berbeda.' },
  ],
  'wisata-sejarah': [
    { rating: 5, title: 'Warisan Sejarah yang Megah', content: 'Arsitektur dan sejarahnya sangat menakjubkan. Bisa merasakan kebesaran peradaban masa lalu Indonesia.' },
    { rating: 5, title: 'Warisan Bangsa yang Memukau', content: 'Layak menjadi kebanggaan bangsa Indonesia. Detail ukiran dan relief sangat indah dan penuh makna filosofis.' },
    { rating: 4, title: 'Perjalanan ke Masa Lalu', content: 'Seperti berjalan menembus waktu ke masa kejayaan kerajaan Nusantara. Guide-nya sangat informatif.' },
    { rating: 5, title: 'Kebanggaan Indonesia', content: 'Bangga menjadi orang Indonesia melihat warisan sejarah sehebat ini. Perawatannya juga sangat baik.' },
    { rating: 4, title: 'Wisata Edukatif', content: 'Sangat edukatif! Anak-anak bisa belajar sejarah langsung di tempatnya. Recommended untuk family trip.' },
    { rating: 5, title: 'Sunrise Terbaik', content: 'Menyaksikan sunrise di sini adalah pengalaman spiritual yang luar biasa. Pemandangannya tidak ada duanya.' },
    { rating: 4, title: 'Arsitektur Menakjubkan', content: 'Arsitektur kuno yang sangat detail dan presisi. Sulit dipercaya dibangun tanpa teknologi modern.' },
    { rating: 3, title: 'Bagus Tapi Ramai', content: 'Tempatnya bagus dan bersejarah, tapi terlalu ramai pengunjung. Lebih baik datang pagi-pagi sekali.' },
    { rating: 5, title: 'Misteri Peradaban Kuno', content: 'Setiap batu punya cerita. Guide menjelaskan dengan sangat menarik tentang misteri di balik bangunan ini.' },
    { rating: 4, title: 'Koleksi Bersejarah Lengkap', content: 'Museum di sekitarnya punya koleksi benda bersejarah yang sangat lengkap. Bisa belajar banyak tentang sejarah.' },
    { rating: 5, title: 'Surga Fotografi', content: 'Surga bagi pecinta fotografi arsitektur. Setiap sudut punya nilai estetika yang tinggi.' },
    { rating: 4, title: 'Wisata Malam Seru', content: 'Berkunjung malam hari dengan pencahayaan khusus memberikan pengalaman berbeda. Suasananya lebih mistis.' },
    { rating: 5, title: 'Relief yang Menawan', content: 'Relief yang menceritakan kisah sejarah sangat detail dan indah. Karya seni tingkat tinggi!' },
    { rating: 3, title: 'Cuaca Panas', content: 'Situs sejarahnya bagus tapi sangat panas di siang hari. Disarankan datang pagi atau sore.' },
    { rating: 5, title: 'Keagungan Masa Lalu', content: 'Melihat langsung keagungan peradaban leluhur. Bangga menjadi bagian dari bangsa yang memiliki warisan ini.' },
    { rating: 4, title: 'Pemandu Wisata Membantu', content: 'Tersedia pemandu dalam berbagai bahasa dan sangat membantu memahami sejarah tempat ini.' },
  ],
  'wisata-budaya': [
    { rating: 5, title: 'Kekayaan Budaya Nusantara', content: 'Budaya yang masih sangat terjaga keasliannya. Masyarakat lokalnya ramah dan senang berbagi cerita tradisi.' },
    { rating: 5, title: 'Pengalaman Budaya Otentik', content: 'Pengalaman budaya yang otentik! Bisa melihat langsung bagaimana tradisi leluhur masih dijaga.' },
    { rating: 4, title: 'Museum Hidup', content: 'Seperti museum hidup! Tradisi dan adat istiadat masih dipraktekkan dalam kehidupan sehari-hari.' },
    { rating: 5, title: 'Arsitektur Tradisional Menawan', content: 'Arsitektur tradisionalnya sangat unik dan penuh filosofi. Setiap detail punya makna tersendiri.' },
    { rating: 4, title: 'Keramahan Penduduk', content: 'Keramahtamahan penduduk lokal sangat terasa. Mereka dengan senang hati menjelaskan budaya mereka.' },
    { rating: 5, title: 'Perlu Dilestarikan', content: 'Tempat seperti ini harus terus dilestarikan. Generasi muda perlu tahu kekayaan budaya Indonesia.' },
    { rating: 4, title: 'Pengalaman Unik', content: 'Pengalaman yang unik dan berbeda dari wisata biasa. Banyak pembelajaran tentang nilai-nilai luhur.' },
    { rating: 3, title: 'Menarik Tapi Aksesnya Sulit', content: 'Budayanya sangat menarik tapi lokasinya cukup terpencil. Perlu persiapan yang baik.' },
    { rating: 5, title: 'Rumah Adat yang Megah', content: 'Rumah adatnya sangat megah dan penuh ornamen. Setiap ukiran punya cerita dan filosofi tersendiri.' },
    { rating: 4, title: 'Belajar Tenun Tradisional', content: 'Bisa belajar langsung cara menenun kain tradisional. Pengalaman langsung yang sangat berharga.' },
    { rating: 5, title: 'Upacara Adat Sakral', content: 'Beruntung bisa menyaksikan upacara adat yang sangat sakral. Pengalaman spiritual yang mendalam.' },
    { rating: 4, title: 'Musik Tradisional Merdu', content: 'Musik tradisionalnya sangat merdu dan menenangkan. Instrumen unik yang tidak ditemukan di tempat lain.' },
    { rating: 5, title: 'Pakaian Adat Indah', content: 'Bisa mencoba pakaian adat dan berfoto. Warna dan motifnya sangat indah dan bermakna.' },
    { rating: 3, title: 'Perlu Pemandu Lokal', content: 'Lebih baik menggunakan pemandu lokal untuk memahami budaya dengan baik. Tanpa pemandu bisa kurang bermakna.' },
    { rating: 5, title: 'Gotong Royong yang Nyata', content: 'Melihat langsung semangat gotong royong masyarakat. Nilai-nilai luhur yang masih dijaga.' },
    { rating: 4, title: 'Festival Budaya Meriah', content: 'Datang saat ada festival budaya sangat meriah! Berbagai atraksi dan pertunjukan yang memukau.' },
  ],
  'wisata-religi': [
    { rating: 5, title: 'Tempat yang Sakral', content: 'Aura spiritualnya sangat terasa. Tempat yang tepat untuk kontemplasi dan menemukan ketenangan batin.' },
    { rating: 5, title: 'Keindahan Arsitektur Religi', content: 'Arsitektur religiusnya sangat indah dan megah. Perpaduan seni dan spiritualitas yang sempurna.' },
    { rating: 4, title: 'Tempat yang Damai', content: 'Sangat damai dan tenang. Cocok untuk meditasi dan mendekatkan diri dengan Sang Pencipta.' },
    { rating: 5, title: 'Simbol Toleransi', content: 'Tempat ini adalah simbol toleransi beragama di Indonesia. Sangat menginspirasi!' },
    { rating: 4, title: 'Perjalanan Spiritual', content: 'Perjalanan spiritual yang bermakna. Energi positif di tempat ini sangat kuat.' },
    { rating: 5, title: 'Tempat Ibadah Megah', content: 'Kemegahan tempat ibadah ini luar biasa. Menunjukkan kebesaran dan keagungan spiritual.' },
    { rating: 4, title: 'Situs Religius Bersejarah', content: 'Selain nilai religiusnya, sejarahnya juga sangat kaya. Wajib dikunjungi!' },
    { rating: 3, title: 'Bagus Tapi Perlu Aturan', content: 'Tempatnya bagus dan sakral, hanya saja perlu lebih banyak aturan untuk menjaga kesuciannya.' },
    { rating: 5, title: 'Ketenangan Batin', content: 'Setelah berkunjung ke sini, pikiran terasa lebih jernih dan hati lebih tenang.' },
    { rating: 4, title: 'Ornamen Religius Indah', content: 'Ornamen dan dekorasi religiusnya sangat detail dan indah. Menunjukkan dedikasi tinggi pembuatnya.' },
    { rating: 5, title: 'Sunrise Spiritual', content: 'Menyaksikan sunrise di tempat suci ini memberikan pengalaman spiritual yang luar biasa.' },
    { rating: 4, title: 'Ritual Keagamaan', content: 'Bisa menyaksikan ritual keagamaan yang masih dilakukan. Sangat khidmat dan menginspirasi.' },
    { rating: 5, title: 'Arsitektur Megah', content: 'Arsitektur tempat ibadah ini sangat megah dan detail. Menunjukkan kebesaran Tuhan.' },
    { rating: 3, title: 'Ramai saat Hari Raya', content: 'Tempatnya sangat ramai saat hari raya keagamaan. Lebih baik datang di hari biasa.' },
    { rating: 5, title: 'Meditasi dan Kontemplasi', content: 'Tempat sempurna untuk meditasi dan kontemplasi. Suasananya sangat mendukung.' },
    { rating: 4, title: 'Sejarah Keagamaan', content: 'Bisa belajar banyak tentang sejarah keagamaan di Indonesia. Sangat edukatif.' },
  ],
  'wisata-kuliner': [
    { rating: 5, title: 'Surganya Kuliner!', content: 'Makanannya otentik dan lezat! Bumbu rempahnya terasa banget. Porsinya juga pas dan harganya terjangkau.' },
    { rating: 5, title: 'Rasa Lokal Otentik', content: 'Rasa yang otentik dan tidak bisa ditemukan di tempat lain. Resep turun-temurun yang dijaga.' },
    { rating: 4, title: 'Wajib Dicoba', content: 'Wajib dicoba! Variasi makanannya banyak dan semuanya enak. Favorit saya adalah hidangan utamanya.' },
    { rating: 5, title: 'Surga Kuliner', content: 'Surga bagi pecinta kuliner! Setiap hidangan punya cita rasa unik yang khas daerah ini.' },
    { rating: 4, title: 'Makanan Lokal Terbaik', content: 'Makanan lokal terbaik yang pernah saya coba. Bahan segar dan dimasak dengan sepenuh hati.' },
    { rating: 5, title: 'Makanan yang Layak Dicari', content: 'Makanan yang layak untuk dicari walau harus jauh-jauh. Tidak heran menjadi ikon kuliner Indonesia.' },
    { rating: 4, title: 'Enak dan Terjangkau', content: 'Enak dan terjangkau! Tempatnya juga bersih dan pelayanannya ramah. Pasti balik lagi.' },
    { rating: 3, title: 'Enak Tapi Antri', content: 'Makanannya enak tapi antriannya panjang banget. Datang di luar jam makan untuk menghindari antrian.' },
    { rating: 5, title: 'Bumbu Rempah Nusantara', content: 'Rasa rempah-rempah Nusantara sangat terasa! Setiap suapan adalah ledakan rasa yang nikmat.' },
    { rating: 4, title: 'Jajanan Kaki Lima Terbaik', content: 'Jajanan kaki lima di sini juara! Murah, enak, dan banyak pilihan. Wajib coba semuanya!' },
    { rating: 5, title: 'Resep Nenek Moyang', content: 'Masakan dengan resep turun-temurun dari nenek moyang. Rasa yang tidak berubah sejak dulu.' },
    { rating: 4, title: 'Hidangan Laut Segar', content: 'Hidangan lautnya segar langsung dari laut! Diolah dengan bumbu khas yang lezat. Mantap!' },
    { rating: 5, title: 'Kue Tradisional', content: 'Jangan lewatkan kue tradisionalnya! Manis legit dan tidak terlalu mengenyangkan.' },
    { rating: 3, title: 'Tempatnya Sederhana', content: 'Tempatnya sederhana dan tidak ber-AC, tapi rasanya tidak bohong. Dijamin puas!' },
    { rating: 5, title: 'Sarapan Legendaris', content: 'Sarapan legendaris yang sudah ada sejak puluhan tahun! Selalu ramai dari pagi.' },
    { rating: 4, title: 'Minuman Tradisional', content: 'Minuman tradisionalnya segar dan unik! Cocok untuk melepas dahaga setelah jalan-jalan.' },
  ],
  'kesenian': [
    { rating: 5, title: 'Pertunjukan yang Memukau!', content: 'Pertunjukannya luar biasa! Koreografi yang indah dan musik yang menghanyutkan. Tepuk tangan meriah!' },
    { rating: 5, title: 'Pertunjukan Berkelas', content: 'Kualitasnya tidak kalah dengan pertunjukan di kota besar. Bangga dengan seni pertunjukan Indonesia.' },
    { rating: 4, title: 'Pertunjukan Budaya Menawan', content: 'Pertunjukan budaya yang luar biasa! Kostum yang indah dan skill para penampil sangat tinggi.' },
    { rating: 5, title: 'Warisan Seni yang Hidup', content: 'Seni tradisional yang masih hidup dan berkembang. Perlu dukungan untuk terus dilestarikan.' },
    { rating: 4, title: 'Pengalaman Tak Terlupakan', content: 'Pengalaman yang tidak terlupakan. Bisa merasakan langsung keindahan seni tradisional Indonesia.' },
    { rating: 5, title: 'Wajib Ditonton', content: 'Wajib ditonton! Pertunjukan yang penuh emosi dan makna. Dibawakan dengan sangat profesional.' },
    { rating: 4, title: 'Bentuk Seni yang Indah', content: 'Bentuk seni yang sangat indah. Kombinasi musik, tari, dan kostum yang harmonis.' },
    { rating: 3, title: 'Bagus Tapi Singkat', content: 'Pertunjukannya bagus tapi durasinya kurang panjang. Ingin melihat lebih banyak.' },
    { rating: 5, title: 'Gamelan yang Mengalun', content: 'Alunan gamelan sangat merdu dan menenangkan. Instrumen tradisional yang indah sekali.' },
    { rating: 4, title: 'Tari Tradisional Memukau', content: 'Gerakan tari tradisionalnya sangat anggun dan penuh makna. Penari sangat terlatih.' },
    { rating: 5, title: 'Wayang yang Hidup', content: 'Pertunjukan wayang yang sangat hidup! Dalang membawakan cerita dengan sangat menarik.' },
    { rating: 4, title: 'Belajar Kesenian', content: 'Bisa ikut belajar dan mencoba dasar-dasar kesenian tradisional. Sangat menyenangkan!' },
    { rating: 5, title: 'Kostum Spektakuler', content: 'Kostum para penampil sangat spektakuler! Detail dan warnanya luar biasa indah.' },
    { rating: 3, title: 'Suara Kurang Jelas', content: 'Pertunjukannya bagus tapi suaranya kurang optimal. Agak sulit mendengar narasi.' },
    { rating: 5, title: 'Cerita yang Mengharukan', content: 'Cerita yang dibawakan sangat mengharukan. Banyak pesan moral yang bisa dipetik.' },
    { rating: 4, title: 'Interaktif dengan Penonton', content: 'Ada sesi interaktif dengan penonton yang seru. Jadi tidak hanya menonton tapi juga berpartisipasi.' },
  ],
  'kerajinan': [
    { rating: 5, title: 'Keahlian Luar Biasa', content: 'Kerajinan tangan dengan kualitas tinggi! Detail dan ketelitiannya menakjubkan. Sangat terampil.' },
    { rating: 5, title: 'Buatan Tangan Otentik', content: 'Produk buatan tangan yang otentik dengan kualitas terbaik. Setiap karya adalah seni.' },
    { rating: 4, title: 'Dukung Pengrajin Lokal', content: 'Senang bisa mendukung pengrajin lokal. Produknya berkualitas dan penuh nilai budaya.' },
    { rating: 5, title: 'Warisan Kerajinan Indonesia', content: 'Kerajinan tradisional yang menjadi kebanggaan Indonesia. Teknik yang diturunkan generasi.' },
    { rating: 4, title: 'Oleh-oleh Unik', content: 'Tempat terbaik untuk mencari oleh-oleh unik. Setiap produk punya cerita dan makna tersendiri.' },
    { rating: 5, title: 'Belajar di Tempat Kerajinan', content: 'Bisa belajar langsung proses pembuatan kerajinan. Sangat edukatif dan menyenangkan.' },
    { rating: 4, title: 'Produk Berkualitas Tinggi', content: 'Kualitas produknya tinggi dan harganya sesuai untuk buatan tangan. Direkomendasikan!' },
    { rating: 3, title: 'Bagus Tapi Agak Mahal', content: 'Produknya bagus tapi harganya cukup mahal. Tapi memang sepadan dengan kualitasnya.' },
    { rating: 5, title: 'Batik Tulis Asli', content: 'Batik tulis asli dengan motif tradisional yang indah. Proses pembuatannya sangat teliti.' },
    { rating: 4, title: 'Ukiran Kayu Detail', content: 'Ukiran kayunya sangat detail dan halus. Menunjukkan keahlian tinggi para pengrajin.' },
    { rating: 5, title: 'Tenun Ikat Berkualitas', content: 'Tenun ikat dengan kualitas premium. Warna dan motifnya sangat khas dan indah.' },
    { rating: 4, title: 'Keramik Tradisional', content: 'Keramik tradisional dengan desain unik. Cocok untuk koleksi atau hadiah.' },
    { rating: 5, title: 'Perhiasan Perak Cantik', content: 'Perhiasan perak dengan desain tradisional yang cantik. Pengerjaan sangat halus.' },
    { rating: 3, title: 'Banyak Pilihan', content: 'Banyak sekali pilihan produk, jadi agak bingung memilih. Tapi semua berkualitas bagus.' },
    { rating: 5, title: 'Proses Pembuatan Menarik', content: 'Melihat langsung proses pembuatan kerajinan sangat menarik dan menambah apresiasi.' },
    { rating: 4, title: 'Bisa Pesan Khusus', content: 'Bisa pesan khusus sesuai keinginan. Pengrajin sangat kooperatif dan terampil.' },
  ],
  'adat-istiadat': [
    { rating: 5, title: 'Tradisi yang Sakral', content: 'Menyaksikan tradisi sakral yang sudah berlangsung ratusan tahun. Pengalaman spiritual yang mendalam.' },
    { rating: 5, title: 'Tradisi yang Hidup', content: 'Tradisi yang masih hidup dan dipraktekkan dengan penuh penghormatan. Sangat menginspirasi!' },
    { rating: 4, title: 'Budaya yang Unik', content: 'Praktik budaya yang sangat unik dan tidak ada di tempat lain. Layak untuk dikunjungi!' },
    { rating: 5, title: 'Kearifan Lokal yang Terjaga', content: 'Kearifan lokal yang masih terjaga dengan baik. Masyarakat sangat menjaga adat istiadat mereka.' },
    { rating: 4, title: 'Pengalaman yang Membuka Mata', content: 'Pengalaman yang membuka mata tentang kekayaan budaya Indonesia. Sangat mencerahkan.' },
    { rating: 5, title: 'Hormat pada Leluhur', content: 'Penghormatan terhadap leluhur yang sangat tinggi. Nilai-nilai yang perlu dipelajari.' },
    { rating: 4, title: 'Upacara Otentik', content: 'Upacara adat yang otentik dan penuh makna. Bersyukur bisa menyaksikan langsung.' },
    { rating: 3, title: 'Menarik Tapi Perlu Pemandu', content: 'Sangat menarik tapi perlu pemandu untuk memahami maknanya. Tanpa penjelasan bisa kurang paham.' },
    { rating: 5, title: 'Ritual Turun Temurun', content: 'Ritual yang sudah dilakukan turun-temurun dengan tata cara yang sama. Sangat sakral.' },
    { rating: 4, title: 'Pakaian Adat Megah', content: 'Pakaian adat yang dikenakan sangat megah dan penuh simbolisme. Setiap detail bermakna.' },
    { rating: 5, title: 'Musik Ritual Khidmat', content: 'Musik yang mengiringi ritual sangat khidmat dan menenangkan. Membawa ke suasana spiritual.' },
    { rating: 4, title: 'Persembahan Tradisional', content: 'Persembahan tradisional yang dilakukan dengan penuh kekhusyukan. Sangat berkesan.' },
    { rating: 5, title: 'Nilai Luhur Leluhur', content: 'Banyak nilai-nilai luhur dari leluhur yang bisa dipelajari. Kebijaksanaan yang abadi.' },
    { rating: 3, title: 'Butuh Waktu Tepat', content: 'Perlu datang di waktu yang tepat untuk menyaksikan upacara. Tidak setiap hari diadakan.' },
    { rating: 5, title: 'Harmoni dengan Alam', content: 'Tradisi yang menunjukkan harmoni manusia dengan alam. Filosofi hidup yang mendalam.' },
    { rating: 4, title: 'Komunitas yang Solid', content: 'Melihat bagaimana komunitas bekerja sama dalam menjaga tradisi. Solidaritas yang tinggi.' },
  ],
  'festival': [
    { rating: 5, title: 'Festival Spektakuler!', content: 'Festival yang spektakuler! Parade yang meriah, kostum yang megah, dan antusiasme yang tinggi.' },
    { rating: 5, title: 'Pengalaman Sekali Seumur Hidup', content: 'Pengalaman sekali seumur hidup! Energi festivalnya sangat positif dan menggembirakan.' },
    { rating: 4, title: 'Perayaan Budaya', content: 'Perayaan budaya yang meriah dan penuh warna. Masyarakat sangat antusias berpartisipasi.' },
    { rating: 5, title: 'Atmosfer Luar Biasa', content: 'Atmosfernya luar biasa! Musik, tarian, dan kemeriahan yang menular ke semua pengunjung.' },
    { rating: 4, title: 'Festival Berkualitas', content: 'Festival berkelas yang membanggakan! Indonesia patut berbangga dengan acara budaya seperti ini.' },
    { rating: 5, title: 'Perayaan Tak Terlupakan', content: 'Perayaan yang tidak terlupakan. Semua elemen budaya ditampilkan dengan sangat apik.' },
    { rating: 4, title: 'Acara Tahunan Seru', content: 'Acara tahunan yang sangat dinanti. Penyelenggaraannya bagus dan pertunjukannya bervariasi.' },
    { rating: 3, title: 'Seru Tapi Ramai', content: 'Sangat seru tapi sangat ramai. Perlu datang lebih awal untuk dapat tempat yang bagus.' },
    { rating: 5, title: 'Parade yang Megah', content: 'Parade-nya sangat megah dengan ratusan peserta! Kostum dan properti yang luar biasa.' },
    { rating: 4, title: 'Kuliner Festival', content: 'Banyak stand kuliner tradisional di festival. Bisa mencoba berbagai makanan khas.' },
    { rating: 5, title: 'Pertunjukan Tanpa Henti', content: 'Pertunjukan berlangsung tanpa henti dari pagi sampai malam. Tidak ada waktu untuk bosan!' },
    { rating: 4, title: 'Oleh-oleh Unik', content: 'Banyak oleh-oleh unik yang dijual. Cocok untuk cinderamata dan koleksi.' },
    { rating: 5, title: 'Kembang Api Spektakuler', content: 'Acara ditutup dengan kembang api yang spektakuler! Penutupan yang sempurna.' },
    { rating: 3, title: 'Parkir Sulit', content: 'Festival seru tapi parkir sangat sulit. Lebih baik gunakan transportasi umum.' },
    { rating: 5, title: 'Kebersamaan yang Hangat', content: 'Festival yang membawa kebersamaan. Semua orang senang dan saling berbagi kegembiraan.' },
    { rating: 4, title: 'Banyak Spot Foto', content: 'Banyak spot foto yang bagus! Latar belakang festival yang penuh warna dan meriah.' },
  ],
}

// Default reviews for types not specifically defined (16 unique reviews)
const defaultReviews: Array<{ rating: number; title: string; content: string }> = [
  { rating: 5, title: 'Pengalaman Luar Biasa!', content: 'Destinasi yang sangat direkomendasikan! Pemandangan indah dan pengalaman yang tidak terlupakan.' },
  { rating: 5, title: 'Wajib Dikunjungi', content: 'Tempat yang wajib dikunjungi saat ke Indonesia. Keindahan alam dan budayanya luar biasa.' },
  { rating: 4, title: 'Pengalaman Menyenangkan', content: 'Pengalaman yang menyenangkan. Akan kembali lagi di kesempatan berikutnya.' },
  { rating: 5, title: 'Permata Tersembunyi', content: 'Salah satu permata tersembunyi Indonesia yang patut diapresiasi. Semoga terus terjaga!' },
  { rating: 4, title: 'Layak Dikunjungi', content: 'Sangat layak untuk dikunjungi. Perjalanannya memang panjang tapi hasilnya memuaskan.' },
  { rating: 5, title: 'Kebanggaan Indonesia', content: 'Bangga memiliki destinasi seperti ini di Indonesia. Harus terus dilestarikan.' },
  { rating: 4, title: 'Tempat Rekomendasi', content: 'Tempat yang direkomendasikan untuk liburan. Cocok untuk sendiri maupun bersama keluarga.' },
  { rating: 3, title: 'Bagus Tapi Perlu Perbaikan', content: 'Tempatnya bagus tapi masih ada beberapa hal yang perlu ditingkatkan terutama fasilitasnya.' },
  { rating: 5, title: 'Keren Banget!', content: 'Keren banget tempatnya! Sesuai ekspektasi bahkan lebih. Sangat puas dengan kunjungan ini.' },
  { rating: 4, title: 'Liburan Berkesan', content: 'Liburan yang sangat berkesan bersama keluarga. Anak-anak senang dan orang tua pun puas.' },
  { rating: 5, title: 'Spot Foto Cantik', content: 'Tempatnya sangat fotogenik! Setiap sudut bisa jadi spot foto yang cantik.' },
  { rating: 4, title: 'Pelayanan Ramah', content: 'Pelayanan dari warga sekitar sangat ramah. Membuat pengalaman berkunjung makin menyenangkan.' },
  { rating: 5, title: 'Tidak Mengecewakan', content: 'Sudah dengar banyak cerita tentang tempat ini dan ternyata tidak mengecewakan sama sekali!' },
  { rating: 3, title: 'Akses Perlu Ditingkatkan', content: 'Tempatnya bagus tapi akses jalannya perlu diperbaiki. Sedikit sulit dijangkau.' },
  { rating: 5, title: 'Puas Banget', content: 'Puas banget berkunjung ke sini! Semua yang diharapkan terpenuhi. Sangat direkomendasikan!' },
  { rating: 4, title: 'Akan Kembali Lagi', content: 'Pengalaman yang menyenangkan. Pasti akan kembali lagi di lain waktu untuk jalan-jalan lebih.' },
]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateSlug(name: string, index: number): string {
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()}-${index + 1}`
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

/**
 * Normalize Unsplash URL to clean format
 * Converts long URLs with query params to simple format: https://images.unsplash.com/photo-{id}?w=800&q=80
 */
function normalizeUnsplashUrl(url: string, width: number = 800): string {
  // Extract photo ID from URL
  const match = url.match(/photo-[a-zA-Z0-9_-]+/)
  if (match) {
    const photoId = match[0]
    return `https://images.unsplash.com/${photoId}?w=${width}&q=80`
  }
  // If premium_photo URL
  const premiumMatch = url.match(/premium_photo-[a-zA-Z0-9_-]+/)
  if (premiumMatch) {
    const photoId = premiumMatch[0]
    return `https://plus.unsplash.com/${photoId}?w=${width}&q=80`
  }
  return url
}

// =============================================================================
// MAIN SEEDER FUNCTION
// =============================================================================

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('🌴 SUASANA DATABASE SEEDER')
  console.log('   Platform Wisata & Budaya Lokal Indonesia')
  console.log('='.repeat(60))

  const sqlClient = neon(process.env.DATABASE_URL!)
  const db = drizzle(sqlClient)

  try {
    // ========== STEP 1: DROP ALL DATA (Clean slate) ==========
    console.log('\n🗑️  Dropping all existing data...')
    
    // Drop in correct order (respect foreign key constraints)
    // Child tables first, then parent tables
    await db.delete(review)
    console.log('   ✓ Dropped reviews')
    
    await db.delete(vote)
    console.log('   ✓ Dropped votes')
    
    await db.delete(article)
    console.log('   ✓ Dropped articles')
    
    await db.delete(destination)
    console.log('   ✓ Dropped destinations')
    
    await db.delete(session)
    console.log('   ✓ Dropped sessions')
    
    await db.delete(account)
    console.log('   ✓ Dropped accounts')
    
    await db.delete(verification)
    console.log('   ✓ Dropped verifications')
    
    await db.delete(user)
    console.log('   ✓ Dropped users')
    
    console.log('   ✅ All data dropped successfully!')

    // ========== STEP 2: Create seed users with accounts ==========
    console.log('\n👤 Creating seed users...')
    console.log(`   Using default password: ${SEED_PASSWORD}`)
    const createdUsers: Array<{ id: string; email: string }> = []

    // Hash password once for all users
    const hashedPassword = await hashPassword(SEED_PASSWORD)

    for (const userData of seedUsers) {
      const userId = nanoid()
      const accountId = nanoid()
      try {
        // Create user
        await db.insert(user).values({
          id: userId,
          name: userData.name,
          email: userData.email,
          emailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        // Create credential account with password
        await db.insert(account).values({
          id: accountId,
          accountId: userId, // Same as user id for credential provider
          providerId: 'credential',
          userId: userId,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        createdUsers.push({ id: userId, email: userData.email })
        console.log(`   ✓ Created user: ${userData.name}`)
      } catch {
        // User might already exist, try to find them
        const [existingUser] = await db
          .select({ id: user.id, email: user.email })
          .from(user)
          .where(eq(user.email, userData.email))
          .limit(1)
        if (existingUser) {
          createdUsers.push({ id: existingUser.id, email: existingUser.email })
          console.log(`   ⚠ User exists: ${userData.name}`)
        }
      }
    }

    if (createdUsers.length === 0) {
      throw new Error('No users available for seeding destinations')
    }

    console.log(`   Total users: ${createdUsers.length}`)

    // ========== STEP 3: Create destinations ==========
    console.log('\n🏝️ Creating destinations...')
    const createdDestinations: Array<{ id: number; name: string }> = []

    for (let i = 0; i < destinationData.length; i++) {
      const dest = destinationData[i]!
      const owner = getRandomElement(createdUsers)
      const slug = generateSlug(dest.name, i)

      const [created] = await db
        .insert(destination)
        .values({
          userId: owner.id,
          slug,
          name: dest.name,
          description: dest.description,
          type: dest.type,
          category: dest.category,
          provinsi: dest.provinsi,
          kabupatenKota: dest.kabupatenKota ?? null,
          alamat: `Jl. ${dest.name} No. ${getRandomInt(1, 100)}`,
          coverImage: normalizeUnsplashUrl(dest.coverImage, 1200),
          images: JSON.stringify(dest.images.map(img => normalizeUnsplashUrl(img, 800))),

          status: 'published',
          createdAt: new Date(
            Date.now() - getRandomInt(0, 365 * 24 * 60 * 60 * 1000),
          ),
          updatedAt: new Date(),
        })
        .returning({ id: destination.id })

      if (created) {
        createdDestinations.push({ id: created.id, name: dest.name })
      }

      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(
          `   ✓ Created ${i + 1}/${destinationData.length} destinations`,
        )
      }
    }

    console.log(`   Total destinations: ${createdDestinations.length}`)

    // ========== STEP 4: Create votes ==========
    console.log('\n🗳️ Creating votes...')
    let voteCount = 0

    for (const dest of createdDestinations) {
      // Each destination gets 40-70 random votes (varied distribution)
      // Some popular destinations get more votes
      const isPopular = Math.random() > 0.7 // 30% chance to be popular
      const minVotes = 40
      const maxVotes = isPopular ? 70 : 55
      const numVotes = getRandomInt(minVotes, Math.min(createdUsers.length, maxVotes))
      const shuffledUsers = [...createdUsers].sort(() => Math.random() - 0.5)
      const voters = shuffledUsers.slice(0, numVotes)

      for (const voter of voters) {
        try {
          await db.insert(vote).values({
            userId: voter.id,
            destinationId: dest.id,
            createdAt: new Date(
              Date.now() - getRandomInt(0, 180 * 24 * 60 * 60 * 1000),
            ),
          })
          voteCount++
        } catch {
          // Duplicate vote, skip
        }
      }
    }

    console.log(`   Total votes: ${voteCount}`)

    // ========== STEP 5: Create articles ==========
    console.log('\n📝 Creating articles...')
    const articleData = [
      {
        title: 'Pesona Tersembunyi Raja Ampat',
        excerpt: 'Menjelajahi keindahan bawah laut Raja Ampat yang memukau.',
        content: `Raja Ampat, yang secara harfiah berarti "Empat Raja", merupakan kepulauan yang terdiri dari lebih dari 1.500 pulau kecil di ujung barat laut Papua. Kawasan ini dikenal sebagai pusat keanekaragaman hayati laut dunia, dengan catatan ilmiah menunjukkan keberadaan lebih dari 1.600 spesies ikan dan 537 spesies karang—sekitar 75% dari total spesies karang yang diketahui di seluruh dunia.

Bagi penyelam, Raja Ampat menawarkan pengalaman yang sulit ditandingi. Spot-spot seperti Cape Kri, Manta Sandy, dan Melissa's Garden menjadi lokasi favorit untuk menyaksikan terumbu karang yang masih pristine serta berbagai biota laut mulai dari nudibranch hingga hiu karpet (wobbegong). Arus laut yang kaya nutrisi membuat perairan ini menjadi tempat persinggahan bagi manta ray dan berbagai spesies pelagis lainnya.

Di luar aktivitas bawah laut, Raja Ampat juga menawarkan lanskap karst yang dramatis. Pulau-pulau dengan tebing batu kapur yang menjulang dari air biru kehijauan menciptakan pemandangan yang sering disebut sebagai salah satu yang terindah di planet ini. Viewpoint seperti Pianemo dan Wayag menjadi ikon yang kerap muncul dalam publikasi wisata internasional.

Masyarakat lokal di Raja Ampat, yang terdiri dari berbagai suku seperti Maya, Biak, dan Betew, telah lama menerapkan praktik sasi—sistem pengelolaan sumber daya alam tradisional yang mengatur kapan dan di mana masyarakat boleh menangkap ikan atau mengambil hasil laut. Praktik ini berkontribusi pada kelestarian ekosistem yang kita nikmati saat ini.

Akses menuju Raja Ampat umumnya melalui Sorong, kota pelabuhan yang dapat dicapai dengan penerbangan dari Jakarta, Makassar, atau Manado. Dari Sorong, perjalanan laut sekitar 2-3 jam akan membawa pengunjung ke berbagai homestay dan resort yang tersebar di kepulauan ini. Waktu terbaik untuk berkunjung adalah antara Oktober hingga April ketika kondisi laut relatif tenang.`,
        coverImage: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Warisan Budaya Candi Borobudur',
        excerpt: 'Mengungkap misteri dan keindahan Candi Borobudur.',
        content: `Candi Borobudur berdiri megah di Kabupaten Magelang, Jawa Tengah, sebagai monumen Buddha terbesar di dunia. Dibangun pada masa Dinasti Syailendra sekitar abad ke-8 hingga ke-9 Masehi, struktur ini terdiri dari sekitar 2 juta blok batu andesit yang disusun tanpa menggunakan perekat. UNESCO menetapkannya sebagai Situs Warisan Dunia pada tahun 1991, mengakui nilai arsitektur dan spiritualnya yang luar biasa.

Secara arsitektur, Borobudur dirancang sebagai mandala tiga dimensi yang merepresentasikan kosmologi Buddha. Tiga tingkatan utamanya—Kamadhatu, Rupadhatu, dan Arupadhatu—menggambarkan perjalanan spiritual dari dunia nafsu menuju pencerahan. Sebanyak 2.672 panel relief terukir di dinding candi, menceritakan ajaran Buddha dan kehidupan masyarakat Jawa kuno, menjadikannya "buku batu" yang tak ternilai bagi para sejarawan.

Stupa-stupa berlubang di tingkat atas candi, yang berjumlah 72 buah, masing-masing berisi arca Buddha dalam posisi meditasi. Stupa induk di puncak, dengan diameter 9,9 meter, konon dahulu berisi arca Buddha yang kini disimpan di museum. Desain lubang-lubang pada stupa memiliki makna filosofis terkait tahapan kesempurnaan dalam ajaran Buddha.

Fenomena sunrise di Borobudur telah menjadi daya tarik tersendiri. Banyak pengunjung memilih untuk tiba sebelum fajar, menyaksikan siluet candi yang perlahan terungkap oleh cahaya matahari pagi dengan latar belakang Gunung Merapi dan Merbabu. Punthuk Setumbu, bukit di sekitar kompleks, menawarkan sudut pandang alternatif yang populer untuk menikmati pemandangan ini.

Pengelolaan candi saat ini melibatkan pembatasan jumlah pengunjung dan larangan menyentuh relief untuk mencegah kerusakan. Penelitian dan restorasi terus dilakukan oleh Balai Konservasi Borobudur bekerja sama dengan berbagai institusi internasional. Bagi yang tertarik mempelajari lebih dalam, Museum Karmawibhangga di kompleks candi menyimpan koleksi artefak dan dokumentasi sejarah yang informatif.`,
        coverImage: 'https://images.unsplash.com/photo-1620549146396-9024d914cd99?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Keajaiban Alam Danau Toba',
        excerpt: 'Danau vulkanik terbesar di Asia Tenggara.',
        content: `Danau Toba terbentang seluas 1.130 kilometer persegi di dataran tinggi Sumatera Utara, menjadikannya danau vulkanik terbesar di Asia Tenggara dan salah satu yang terdalam di dunia dengan kedalaman mencapai 450 meter. Pembentukannya diperkirakan terjadi akibat letusan supervolcano sekitar 74.000 tahun lalu—sebuah peristiwa yang diduga berdampak signifikan pada iklim global saat itu.

Pulau Samosir, yang luasnya hampir menyamai Singapura, mengapung di tengah danau dan menjadi pusat kebudayaan Batak Toba. Di sini, rumah-rumah adat dengan atap melengkung khas yang disebut Rumah Bolon masih dapat dijumpai di desa-desa seperti Tomok, Ambarita, dan Simanindo. Ukiran-ukiran Gorga pada fasad rumah bukan sekadar ornamen, melainkan memiliki makna simbolis terkait kosmologi Batak.

Tradisi musikal Batak yang kaya tercermin dalam instrumen seperti gondang sabangunan dan hasapi. Pertunjukan Tor-Tor, tarian seremonial yang dahulu hanya dilakukan dalam upacara adat tertentu, kini dapat disaksikan oleh pengunjung sebagai atraksi budaya. Museum Batak di Tomok dan makam Raja Sidabutar menawarkan wawasan tentang sejarah dan kepercayaan masyarakat setempat.

Dari sisi aktivitas, Danau Toba menawarkan berbagai pilihan. Berenang di air danau yang jernih, bersepeda mengelilingi Samosir, atau sekadar menikmati kopi di tepi danau sambil memandang pegunungan di kejauhan menjadi cara populer menghabiskan waktu. Air terjun Sipiso-piso di sisi utara danau, dengan ketinggian 120 meter, merupakan destinasi sampingan yang layak dikunjungi.

Pengembangan infrastruktur pariwisata terus dilakukan dengan tetap memperhatikan kelestarian lingkungan. Parapat dan Tuktuk Siadong menjadi basis akomodasi utama, menawarkan berbagai pilihan dari penginapan sederhana hingga resort dengan fasilitas lengkap. Akses udara melalui Bandara Silangit yang relatif baru membuat perjalanan ke Danau Toba semakin praktis dari berbagai kota besar di Indonesia.`,
        coverImage: 'https://images.unsplash.com/photo-1642762205001-aada86f9dbe2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Festival Lembah Baliem: Pesta Budaya Papua',
        excerpt: 'Mengintip kemeriahan festival budaya suku Dani.',
        content: `Festival Lembah Baliem merupakan perayaan tahunan yang diselenggarakan di Wamena, ibu kota Kabupaten Jayawijaya, Papua. Acara yang biasanya berlangsung pada bulan Agustus ini mempertemukan berbagai suku dari pegunungan tengah Papua—Dani, Lani, dan Yali—dalam sebuah perayaan kebudayaan yang meriah. Bagi masyarakat lokal, festival ini menjadi momen untuk mempertahankan dan memperkenalkan tradisi leluhur kepada generasi muda.

Atraksi utama festival adalah mock war atau perang-perangan seremonial. Ratusan pria dari berbagai suku berkumpul di arena terbuka, mengenakan pakaian tradisional lengkap dengan hiasan bulu burung cenderawasih dan lukisan tubuh dari tanah liat berwarna. Mereka membawa tombak, panah, dan kapak batu, menampilkan formasi dan teriakan perang yang dahulu digunakan dalam konflik antarsuku.

Di luar arena perang, pengunjung dapat menyaksikan berbagai demonstrasi kehidupan sehari-hari masyarakat pegunungan Papua. Wanita Dani mempertunjukkan cara mengolah ubi dan membuat noken—tas tradisional yang dirajut dari serat kulit kayu. Ritual bakar batu, metode memasak tradisional di mana makanan dimasak dengan batu panas dalam lubang tanah, juga menjadi bagian dari festival.

Lembah Baliem sendiri merupakan wilayah yang baru "ditemukan" oleh dunia luar pada tahun 1938 ketika ekspedisi udara Amerika melihat pemukiman dan ladang terasering di antara pegunungan. Isolasi geografis selama ribuan tahun membuat budaya masyarakat di sini berkembang unik, berbeda dari wilayah pesisir Papua maupun Indonesia bagian barat.

Mengunjungi festival memerlukan perencanaan yang matang mengingat lokasi Wamena yang hanya dapat dicapai dengan pesawat kecil dari Jayapura. Kondisi cuaca pegunungan sering menyebabkan penundaan penerbangan. Namun bagi yang berhasil sampai, pengalaman menyaksikan budaya yang masih otentik ini menjadi kenangan yang tak terlupakan. Beberapa tur operator lokal menawarkan paket yang mencakup kunjungan ke desa-desa tradisional di sekitar lembah.`,
        coverImage: 'https://images.unsplash.com/photo-1608501408701-89e0429defcf?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Eksplorasi Kuliner Nusantara',
        excerpt: 'Perjalanan rasa melalui masakan tradisional Indonesia.',
        content: `Kekayaan kuliner Indonesia mencerminkan keragaman geografis dan budaya kepulauan yang membentang dari Sabang hingga Merauke. Setiap provinsi, bahkan setiap kota, memiliki spesialisasi masakan yang dikembangkan selama berabad-abad, dipengaruhi oleh hasil bumi lokal, tradisi perdagangan rempah, serta akulturasi dengan budaya pendatang dari berbagai penjuru dunia.

Rendang, hidangan daging yang dimasak perlahan dalam santan dan rempah, telah mendunia setelah dinobatkan dalam berbagai survei sebagai salah satu makanan terenak di dunia. Berasal dari Minangkabau, Sumatera Barat, rendang tradisional memerlukan waktu memasak berjam-jam hingga bumbu meresap sempurna dan daging berwarna kehitaman. Di kampung halaman asalnya, rendang bukan sekadar makanan sehari-hari melainkan memiliki peran penting dalam upacara adat dan perayaan.

Jawa menawarkan spektrum rasa yang berbeda. Gudeg Yogyakarta dengan manisnya yang khas dari nangka muda yang dimasak dengan gula jawa, kontras dengan rawon Surabaya yang hitam pekat dari kluwek. Semarang punya lumpia yang legendaris, sementara Solo dikenal dengan nasi liwet dan serabi. Masing-masing mencerminkan filosofi dan sejarah daerahnya.

Di Indonesia bagian timur, kuliner berbasis sagu dan ikan mendominasi. Papeda, bubur sagu yang lengket, disajikan dengan kuah kuning ikan yang segar di Maluku dan Papua. Ikan bakar dengan sambal colo-colo menjadi hidangan khas yang mengandalkan kesegaran hasil tangkapan hari itu. Sementara itu, Makassar terkenal dengan coto dan konro yang kaya akan bumbu kacang dan rempah.

Tradisi jajanan pasar dan street food menambah dimensi lain pada kuliner Indonesia. Dari kerak telor Betawi, sate padang, hingga martabak manis yang bervariasi di tiap kota—semuanya menawarkan pengalaman rasa yang berbeda. Banyak kota kini memiliki food tour yang mengajak pengunjung menelusuri warung-warung legendaris yang telah beroperasi selama beberapa generasi, menyajikan resep yang dijaga ketat keotentikannya.`,
        coverImage: 'https://images.unsplash.com/photo-1613653739328-e86ebd77c9c8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Trekking di Gunung Rinjani',
        excerpt: 'Petualangan mendaki gunung tertinggi kedua di Indonesia.',
        content: `Gunung Rinjani menjulang setinggi 3.726 meter di pulau Lombok, menjadikannya gunung tertinggi kedua di Indonesia setelah Puncak Jaya di Papua. Taman Nasional Gunung Rinjani yang mengelilinginya melindungi ekosistem hutan yang beragam, dari hutan hujan tropis di kaki gunung hingga vegetasi alpin di ketinggian. Bagi para pendaki, Rinjani menawarkan kombinasi tantangan fisik dan pemandangan yang membekas.

Danau Segara Anak, kaldera berair yang terletak di ketinggian sekitar 2.000 meter, menjadi salah satu pemandangan paling ikonik dari pendakian ini. Airnya yang berwarna biru kehijauan dikelilingi oleh dinding kaldera yang curam, dengan Gunung Barujari—kerucut vulkanik kecil yang masih aktif—muncul di sisinya. Sumber air panas di tepi danau menjadi tempat pemulihan yang populer bagi pendaki sebelum melanjutkan perjalanan ke puncak.

Jalur pendakian utama berangkat dari Senaru di utara atau Sembalun di timur. Rute Senaru melewati hutan yang lebih lebat dengan air terjun Sindang Gila sebagai bonus, sementara Sembalun menawarkan padang savana yang luas sebelum pendakian terjal menuju bibir kaldera. Kebanyakan pendaki memilih kombinasi kedua jalur, naik dari satu sisi dan turun dari sisi lainnya, dengan durasi 3-4 hari.

Bagi masyarakat Sasak yang mendiami Lombok, Rinjani memiliki dimensi spiritual yang dalam. Gunung ini dianggap sebagai tempat bersemayamnya roh leluhur dan menjadi lokasi ritual tahunan Mulang Pekelem, di mana sesajen dilarung ke Danau Segara Anak sebagai ungkapan syukur dan permohonan berkah. Kehadiran pendaki diharapkan tetap menghormati nilai-nilai sakral ini.

Persiapan fisik yang memadai sangat dianjurkan mengingat medan yang menantang dan perbedaan ketinggian yang signifikan. Penggunaan jasa porter dan guide lokal tidak hanya memudahkan logistik tetapi juga memberikan kontribusi ekonomi langsung kepada masyarakat sekitar. Izin pendakian dapat diurus melalui pos-pos di Senaru atau Sembalun, dengan kuota harian yang diberlakukan untuk menjaga kelestarian kawasan.`,
        coverImage: 'https://images.unsplash.com/photo-1698267703889-06c41f9acba5?q=80&w=929&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Mengenal Batik: Warisan Dunia dari Indonesia',
        excerpt: 'Sejarah dan filosofi di balik motif batik Indonesia.',
        content: `Pada tanggal 2 Oktober 2009, UNESCO secara resmi mengakui batik Indonesia sebagai Warisan Kemanusiaan untuk Budaya Lisan dan Nonbendawi. Pengakuan ini menegaskan posisi batik bukan sekadar kain bermotif, melainkan sistem pengetahuan, teknologi, dan seni yang kompleks yang telah berkembang selama berabad-abad di berbagai wilayah Nusantara.

Teknik pembuatan batik melibatkan proses pewarnaan kain dengan menggunakan lilin (malam) sebagai penahan warna. Batik tulis, yang paling tradisional, dikerjakan dengan canting—alat kecil berbentuk seperti pena yang dicelupkan ke dalam lilin cair. Satu lembar kain batik tulis halus bisa memerlukan waktu berminggu-minggu hingga berbulan-bulan untuk diselesaikan, tergantung kerumitan motifnya.

Setiap wilayah di Indonesia mengembangkan motif dan gaya batik yang khas. Batik pesisir utara Jawa seperti Pekalongan dan Cirebon cenderung berwarna cerah dengan pengaruh Tionghoa dan Arab yang kentara. Sementara itu, batik pedalaman Jawa dari Solo dan Yogyakarta mempertahankan warna-warna klasik—sogan (cokelat), indigo, dan putih—dengan motif yang sarat makna filosofis keraton.

Motif-motif tradisional batik Jawa tidak sekadar estetis tetapi memuat pesan simbolis. Parang, dengan garis diagonal berulang, melambangkan keberanian dan keteguhan. Kawung, motif berbentuk bulatan yang menyerupai buah kolang-kaling, diasosiasikan dengan kesucian dan kebijaksanaan. Motif larangan seperti Parang Rusak dahulu hanya boleh dikenakan oleh keluarga kerajaan.

Di era kontemporer, batik telah berevolusi melampaui fungsi seremonialnya. Desainer Indonesia mengintegrasikan batik ke dalam busana modern, sementara industri batik cap dan printing membuat kain bermotif batik lebih terjangkau. Desa-desa produsen batik seperti Laweyan di Solo atau Kauman di Pekalongan kini menjadi destinasi wisata yang memungkinkan pengunjung menyaksikan—atau bahkan mencoba—proses pembuatan batik secara langsung.`,
        coverImage: 'https://images.unsplash.com/photo-1586319826907-1ff4aadbaddc?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Keindahan Sunset di Tanah Lot',
        excerpt: 'Pura di atas batu karang dengan panorama sunset memukau.',
        content: `Pura Tanah Lot terletak di pesisir barat Bali, sekitar 20 kilometer dari Kuta, berdiri di atas formasi batu karang yang terpisah dari daratan saat air laut pasang. Nama "Tanah Lot" berasal dari bahasa Bali yang berarti "tanah di laut," menggambarkan posisinya yang unik. Pura ini merupakan salah satu dari tujuh pura laut yang membentuk rangkaian spiritual di sepanjang pantai selatan dan barat Bali.

Legenda setempat mengaitkan pendirian Tanah Lot dengan Dang Hyang Nirartha, seorang pendeta Hindu dari Jawa yang melakukan perjalanan ke Bali pada abad ke-16. Dikisahkan bahwa ia memilih lokasi ini karena merasakan kesuciannya, dan ular laut yang mendiami gua di dasar batu karang dipercaya sebagai penjaga yang ia tinggalkan. Hingga kini, ular-ular tersebut masih dapat dijumpai dan dianggap suci oleh masyarakat lokal.

Waktu terbaik mengunjungi Tanah Lot adalah menjelang senja. Saat matahari mulai turun ke arah cakrawala, siluet pura dan batu karang menciptakan komposisi yang dramatis dengan latar langit yang berubah warna dari oranye ke merah keunguan. Fotografer dari berbagai penjuru dunia menjadikan momen ini sebagai objek bidikan favorit, menjadikan Tanah Lot salah satu landmark paling banyak dipotret di Indonesia.

Di sekitar kompleks pura, terdapat area pengunjung yang telah dikembangkan dengan berbagai fasilitas. Kios-kios menjual oleh-oleh dan kerajinan, sementara tebing di atasnya menawarkan beberapa restoran dengan pemandangan langsung ke pura. Meskipun area luar dapat dikunjungi turis, bagian dalam pura hanya terbuka bagi umat Hindu yang hendak bersembahyang.

Kunjungan ke Tanah Lot dapat dikombinasikan dengan destinasi lain di jalur yang sama, seperti Pura Taman Ayun di Mengwi atau sawah terasering di Jatiluwih yang juga merupakan Warisan Dunia UNESCO. Akses yang mudah dari kawasan wisata utama Bali selatan menjadikan Tanah Lot salah satu destinasi yang hampir selalu masuk dalam itinerary wisatawan, baik domestik maupun mancanegara.`,
        coverImage: 'https://images.unsplash.com/photo-1533396686798-ef349f08cdb6?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Misteri Blue Fire Kawah Ijen',
        excerpt: 'Fenomena api biru yang hanya ada di dua tempat di dunia.',
        content: `Kawah Ijen terletak di perbatasan Kabupaten Banyuwangi dan Bondowoso, Jawa Timur, merupakan bagian dari kompleks vulkanik yang masih aktif. Kawah ini dikenal dunia karena dua fenomena: danau kawah asam terbesar di bumi dan blue fire—api biru yang hanya terjadi secara alami di sini dan di Islandia. Kombinasi keduanya menjadikan Ijen destinasi yang unik bagi wisatawan petualang dan fotografer.

Blue fire atau api biru bukanlah lava, melainkan hasil pembakaran gas belerang yang keluar dari rekahan vulkanik. Gas sulfurik yang terpapar udara dan terbakar pada suhu tinggi menghasilkan nyala api berwarna biru elektrik. Fenomena ini hanya terlihat dalam kegelapan, sehingga pendakian harus dilakukan pada dini hari—biasanya dimulai sekitar pukul 1 atau 2 pagi dari pos Paltuding.

Pendakian menuju bibir kawah memakan waktu sekitar 1,5-2 jam melalui jalur yang cukup terjal namun sudah tertata. Dari bibir kawah, pengunjung bisa turun ke dasar untuk melihat blue fire dari dekat, meskipun paparan gas belerang yang kuat memerlukan kewaspadaan dan sebaiknya penggunaan masker. Menjelang fajar, pemandangan berganti menjadi danau kawah berwarna toska yang kontras dengan dinding kawah berwarna kuning akibat endapan belerang.

Yang tak kalah menarik adalah aktivitas penambangan belerang tradisional yang masih berlangsung di kawah ini. Para penambang lokal, menggunakan peralatan sederhana, mengangkut bongkahan belerang seberat 70-90 kg dalam keranjang bambu, menaiki jalur curam yang sama dengan wisatawan. Pekerjaan berat ini dilakukan beberapa kali sehari, memberikan gambaran nyata tentang kehidupan dan ketangguhan masyarakat lokal.

Pengelolaan kawasan Ijen kini semakin teratur dengan pembatasan jumlah pengunjung dan jalur yang ditentukan untuk keselamatan. Basecamp di Paltuding menyediakan area parkir dan warung-warung untuk sarapan setelah pendakian. Untuk pengalaman yang lebih lengkap, banyak wisatawan mengombinasikan kunjungan ke Ijen dengan menjelajahi pantai-pantai Banyuwangi atau kawasan Baluran yang berjarak beberapa jam perjalanan.`,
        coverImage: 'https://images.unsplash.com/photo-1536146094120-8d7fcbc4c45b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        title: 'Desa Wae Rebo: Permata Tersembunyi di Flores',
        excerpt: 'Desa adat di atas awan dengan rumah kerucut tradisional.',
        content: `Desa Wae Rebo tersembunyi di ketinggian 1.100 meter di pegunungan Manggarai, Flores, hanya dapat dicapai melalui trekking selama 3-4 jam melewati hutan tropis yang lebat. Isolasi geografis ini justru menjadi kunci pelestarian arsitektur dan tradisi masyarakatnya yang nyaris tak berubah selama berabad-abad. UNESCO mengakui Wae Rebo dalam Asia-Pacific Heritage Awards pada tahun 2012.

Desa ini terdiri dari tujuh rumah adat Mbaru Niang yang tersusun melingkar di sebuah lahan datar di antara pegunungan. Rumah-rumah berbentuk kerucut dengan atap ijuk menjulang setinggi 15 meter, dirancang untuk menahan dinginnya udara pegunungan dan curah hujan tinggi. Struktur lima lantai di dalam rumah memiliki fungsi berbeda: lantai bawah untuk tempat tinggal, lantai atas untuk menyimpan padi dan benda pusaka.

Masyarakat Wae Rebo masih mempertahankan sistem kehidupan komunal yang kuat. Satu rumah Mbaru Niang dapat dihuni oleh 6-8 keluarga yang berbagi ruang dan tanggung jawab. Poso, ritual bersyukur setelah panen yang melibatkan seluruh warga desa, masih rutin dilaksanakan. Tamu yang bermalam akan merasakan keramahan ini secara langsung, tidur di dalam Mbaru Niang bersama keluarga tuan rumah.

Trekking menuju Wae Rebo sendiri merupakan bagian dari pengalaman. Jalur dimulai dari Desa Denge, melewati perkebunan kopi, hutan dengan pohon-pohon besar, dan beberapa sungai kecil. Pemandu lokal tidak hanya menunjukkan jalan tetapi juga berbagi cerita tentang tumbuhan obat dan kehidupan sehari-hari masyarakat Manggarai. Kabut yang sering menyelimuti pegunungan menambah atmosfer mistis perjalanan.

Untuk menjaga kelestarian lingkungan dan budaya, kunjungan ke Wae Rebo diatur oleh masyarakat setempat dengan sistem donasi yang mencakup akomodasi dan makan. Pengunjung diharapkan menghormati aturan adat, termasuk tidak memasuki area terlarang dan berpakaian sopan. Perjalanan ke Wae Rebo biasanya dikombinasikan dengan destinasi lain di Flores seperti Labuan Bajo, Komodo, atau danau tiga warna Kelimutu.`,
        coverImage: 'https://images.unsplash.com/photo-1643785879506-ec3e637a9f2d?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
    ]

    let articleCount = 0
    for (const art of articleData) {
      const author = getRandomElement(createdUsers)
      const slug = generateSlug(art.title, articleCount)
      const status = getRandomElement([
        'published',
        'published',
        'published',
        'draft',
      ]) as 'published' | 'draft'

      try {
        await db.insert(article).values({
          authorId: author.id,
          slug,
          title: art.title,
          excerpt: art.excerpt,
          content: art.content,
          coverImage: normalizeUnsplashUrl(art.coverImage, 1200),
          status,
          publishedAt:
            status === 'published'
              ? new Date(
                Date.now() - getRandomInt(0, 180 * 24 * 60 * 60 * 1000),
              )
              : null,
          createdAt: new Date(
            Date.now() - getRandomInt(0, 365 * 24 * 60 * 60 * 1000),
          ),
          updatedAt: new Date(),
        })
        articleCount++
      } catch (e) {
        console.log(`   ⚠ Article exists or error: ${art.title}`)
      }
    }

    console.log(`   Total articles: ${articleCount}`)

    // ========== STEP 6: Create reviews ==========
    console.log('\n⭐ Creating reviews...')
    let reviewCount = 0

    for (const dest of createdDestinations) {
      // Find the destination type to get relevant reviews
      const destData = destinationData.find((d) => d.name === dest.name)
      const destType = destData?.type ?? 'wisata-alam'

      // Get templates for this destination type
      const templates = reviewTemplates[destType] ?? defaultReviews

      // Each destination gets 10-15 random reviews with NO duplicate content
      const numReviews = getRandomInt(10, Math.min(templates.length, 15))
      const shuffledUsers = [...createdUsers].sort(() => Math.random() - 0.5)
      const reviewers = shuffledUsers.slice(0, numReviews)

      // Shuffle templates and take unique ones for this destination
      const shuffledTemplates = [...templates].sort(() => Math.random() - 0.5)
      const uniqueTemplates = shuffledTemplates.slice(0, numReviews)

      for (let i = 0; i < reviewers.length; i++) {
        const reviewer = reviewers[i]!
        // Use unique template for each reviewer (no duplicate content in same destination)
        const template = uniqueTemplates[i] ?? uniqueTemplates[0]!

        // Generate random visit date within the past year
        const visitDate = new Date(
          Date.now() - getRandomInt(30, 365) * 24 * 60 * 60 * 1000,
        )

        // Review date should be after visit date
        const reviewDate = new Date(
          visitDate.getTime() + getRandomInt(1, 30) * 24 * 60 * 60 * 1000,
        )

        try {
          await db.insert(review).values({
            userId: reviewer.id,
            destinationId: dest.id,
            rating: template.rating,
            title: template.title,
            content: template.content,
            visitDate,
            createdAt: reviewDate,
            updatedAt: reviewDate,
          })
          reviewCount++
        } catch {
          // Duplicate review (user already reviewed this destination), skip
        }
      }
    }

    console.log(`   Total reviews: ${reviewCount}`)

    // ========== SUMMARY ==========
    console.log('\n' + '='.repeat(60))
    console.log('✅ SEEDING COMPLETED SUCCESSFULLY!')
    console.log('='.repeat(60))
    console.log('\n📊 Summary:')
    console.log(`   • ${createdUsers.length} users`)
    console.log(
      `   • ${createdDestinations.length} destinations (wisata & budaya)`,
    )
    console.log(`   • ${voteCount} votes`)
    console.log(`   • ${reviewCount} reviews`)
    console.log(`   • ${articleCount} articles`)

    console.log('\n🎯 Categories seeded:')
    console.log('   • Wisata Alam & Bahari')
    console.log('   • Wisata Budaya & Sejarah')
    console.log('   • Kesenian & Kerajinan')
    console.log('   • Adat Istiadat & Festival')
    console.log('   • Kuliner Tradisional')
    console.log('   • Reviews & Ratings')
    console.log('   • Articles & Content')

    console.log('')
  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

main()
