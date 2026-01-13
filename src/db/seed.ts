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
  destination,
  vote,
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
]

// Comprehensive destination data - Wisata & Budaya Indonesia
const destinationData: Array<{
  name: string
  description: string
  type: (typeof destinationType.enumValues)[number]
  category: (typeof destinationCategory.enumValues)[number]
  provinsi: (typeof provinsiIndonesia.enumValues)[number]
  kabupatenKota?: string
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
  },
  {
    name: 'Raja Ampat',
    description:
      'Surga bawah laut dunia dengan keanekaragaman hayati laut tertinggi di planet. Lebih dari 1.500 spesies ikan dan 75% spesies karang dunia ada di sini. Paradise for divers.',
    type: 'wisata-bahari',
    category: 'pariwisata',
    provinsi: 'papua-barat',
    kabupatenKota: 'Raja Ampat',
  },
  {
    name: 'Gunung Bromo',
    description:
      'Gunung berapi aktif yang ikonik dengan pemandangan matahari terbit spektakuler. Lautan pasir dan kawah yang mengeluarkan asap menjadi daya tarik utama. Salah satu destinasi foto terbaik Indonesia.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'jawa-timur',
    kabupatenKota: 'Probolinggo',
  },
  {
    name: 'Kawah Ijen',
    description:
      'Kawah vulkanik dengan blue fire fenomenal dan danau asam terbesar di dunia. Penambang belerang tradisional menjadi pemandangan unik. Pendakian malam untuk melihat api biru yang memukau.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'jawa-timur',
    kabupatenKota: 'Banyuwangi',
  },
  {
    name: 'Taman Nasional Komodo',
    description:
      'Habitat asli komodo, kadal terbesar di dunia. UNESCO World Heritage Site dengan savana, pantai pink, dan perairan yang kaya biota laut. Petualangan wildlife yang tak terlupakan.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'nusa-tenggara-timur',
    kabupatenKota: 'Manggarai Barat',
  },
  {
    name: 'Pantai Pink Lombok',
    description:
      'Salah satu dari 7 pantai pink di dunia. Pasir berwarna merah muda unik berasal dari pecahan karang merah yang bercampur pasir putih. Keajaiban alam yang instagramable.',
    type: 'wisata-bahari',
    category: 'pariwisata',
    provinsi: 'nusa-tenggara-barat',
    kabupatenKota: 'Lombok Timur',
  },
  {
    name: 'Gili Trawangan',
    description:
      'Pulau kecil tanpa kendaraan bermotor dengan pantai pasir putih dan terumbu karang. Snorkeling dengan penyu laut dan sunset yang romantic. Party island yang terkenal hingga mancanegara.',
    type: 'wisata-bahari',
    category: 'pariwisata',
    provinsi: 'nusa-tenggara-barat',
    kabupatenKota: 'Lombok Utara',
  },
  {
    name: 'Taman Nasional Bunaken',
    description:
      'Taman laut dengan terumbu karang terbaik di Indonesia. 390 spesies karang dan ribuan spesies ikan warna-warni. Wall diving yang menantang dan snorkeling yang mudah diakses.',
    type: 'wisata-bahari',
    category: 'pariwisata',
    provinsi: 'sulawesi-utara',
    kabupatenKota: 'Manado',
  },
  {
    name: 'Kepulauan Derawan',
    description:
      'Kepulauan tropis dengan ubur-ubur tidak menyengat di Danau Kakaban. Penyu hijau bertelur, manta ray, dan pari manta. Surga diving tersembunyi di Kalimantan.',
    type: 'wisata-bahari',
    category: 'pariwisata',
    provinsi: 'kalimantan-timur',
    kabupatenKota: 'Berau',
  },
  {
    name: 'Danau Kelimutu',
    description:
      'Tiga danau kawah dengan warna berbeda yang bisa berubah-ubah. Dipercaya sebagai tempat bersemayamnya arwah. Keajaiban alam yang mistis dan spektakuler.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'nusa-tenggara-timur',
    kabupatenKota: 'Ende',
  },
  {
    name: 'Gunung Rinjani',
    description:
      'Gunung berapi tertinggi kedua di Indonesia dengan Segara Anak yang memukau. Pendakian menantang dengan pemandangan panorama luar biasa. Spiritual journey bagi masyarakat Sasak.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'nusa-tenggara-barat',
    kabupatenKota: 'Lombok Timur',
  },
  {
    name: 'Taman Nasional Way Kambas',
    description:
      'Pusat konservasi gajah sumatera dan badak sumatera. Safari adventure dan interaksi dengan satwa langka. Pengalaman wildlife conservation yang edukatif.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'lampung',
    kabupatenKota: 'Lampung Timur',
  },
  {
    name: 'Taman Nasional Ujung Kulon',
    description:
      'Habitat terakhir badak jawa yang hampir punah. UNESCO World Heritage dengan hutan hujan tropis dan pantai perawan. Konservasi dan petualangan alam liar.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'banten',
    kabupatenKota: 'Pandeglang',
  },
  {
    name: 'Ngarai Sianok',
    description:
      'Grand Canyon-nya Indonesia dengan tebing curam dan sawah bertingkat. Rumah Gadang di tepi ngarai menambah pesona. Trekking dan photography paradise.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'sumatera-barat',
    kabupatenKota: 'Bukittinggi',
  },
  {
    name: 'Danau Maninjau',
    description:
      'Danau vulkanik dengan 44 tikungan legendaris menuju ke sana. Pesona alam yang tenang dan damai. Tempat retreat dan refleksi yang sempurna.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'sumatera-barat',
    kabupatenKota: 'Agam',
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
  },
  {
    name: 'Candi Prambanan',
    description:
      'Kompleks candi Hindu terbesar di Indonesia. Arsitektur megah dengan relief Ramayana yang detail. Sendratari Ramayana saat malam bulan purnama.',
    type: 'wisata-sejarah',
    category: 'situs-sejarah',
    provinsi: 'di-yogyakarta',
    kabupatenKota: 'Sleman',
  },
  {
    name: 'Keraton Yogyakarta',
    description:
      'Istana kesultanan yang masih aktif dan pusat kebudayaan Jawa. Arsitektur tradisional dengan filosofi Jawa yang mendalam. Museum dan pertunjukan seni klasik.',
    type: 'wisata-budaya',
    category: 'lokasi-budaya',
    provinsi: 'di-yogyakarta',
    kabupatenKota: 'Yogyakarta',
  },
  {
    name: 'Keraton Surakarta',
    description:
      'Pusat kebudayaan Jawa Solo dengan pusaka kerajaan yang sakral. Arsitektur Jawa klasik dan tradisi yang terjaga. Pasar Klewer dan kuliner Solo di sekitarnya.',
    type: 'wisata-budaya',
    category: 'lokasi-budaya',
    provinsi: 'jawa-tengah',
    kabupatenKota: 'Surakarta',
  },
  {
    name: 'Tana Toraja',
    description:
      'Tanah leluhur dengan arsitektur Tongkonan yang ikonik. Upacara pemakaman Rambu Solo yang unik. Kubur batu tebing dan patung Tau-tau. Budaya yang menghormati leluhur.',
    type: 'wisata-budaya',
    category: 'adat-istiadat',
    provinsi: 'sulawesi-selatan',
    kabupatenKota: 'Tana Toraja',
  },
  {
    name: 'Desa Penglipuran Bali',
    description:
      'Desa tradisional Bali yang terjaga keasliannya. Tata ruang desa yang teratur dengan arsitektur seragam. Desa terbersih di dunia dengan kearifan lokal yang kuat.',
    type: 'wisata-budaya',
    category: 'lokasi-budaya',
    provinsi: 'bali',
    kabupatenKota: 'Bangli',
  },
  {
    name: 'Pura Besakih',
    description:
      'Pura terbesar dan tersucil di Bali, ibu dari semua pura. Kompleks 23 pura di lereng Gunung Agung. Pusat spiritual Hindu Bali dengan upacara megah.',
    type: 'wisata-religi',
    category: 'lokasi-budaya',
    provinsi: 'bali',
    kabupatenKota: 'Karangasem',
  },
  {
    name: 'Pura Tanah Lot',
    description:
      'Pura di atas karang tengah laut yang ikonik. Sunset spot terbaik di Bali. Arsitektur yang menyatu dengan alam dan legenda Dang Hyang Nirartha.',
    type: 'wisata-religi',
    category: 'lokasi-budaya',
    provinsi: 'bali',
    kabupatenKota: 'Tabanan',
  },
  {
    name: 'Masjid Istiqlal',
    description:
      'Masjid terbesar di Asia Tenggara dengan arsitektur modern minimalis. Simbol toleransi bersebelahan dengan Katedral Jakarta. Destinasi wisata religi internasional.',
    type: 'wisata-religi',
    category: 'situs-sejarah',
    provinsi: 'dki-jakarta',
    kabupatenKota: 'Jakarta Pusat',
  },
  {
    name: 'Lawang Sewu',
    description:
      'Gedung bersejarah peninggalan Belanda dengan seribu pintu. Arsitektur art deco yang megah. Wisata sejarah dan spot foto heritage di Semarang.',
    type: 'wisata-sejarah',
    category: 'situs-sejarah',
    provinsi: 'jawa-tengah',
    kabupatenKota: 'Semarang',
  },
  {
    name: 'Kota Tua Jakarta',
    description:
      'Kawasan bersejarah dengan bangunan kolonial Belanda. Museum Fatahillah dan café heritage. Time travel ke era VOC yang historis.',
    type: 'wisata-sejarah',
    category: 'situs-sejarah',
    provinsi: 'dki-jakarta',
    kabupatenKota: 'Jakarta Barat',
  },
  {
    name: 'Benteng Vredeburg',
    description:
      'Benteng peninggalan Belanda yang kini menjadi museum perjuangan. Arsitektur kolonial yang terawat. Diorama sejarah kemerdekaan Indonesia.',
    type: 'wisata-sejarah',
    category: 'situs-sejarah',
    provinsi: 'di-yogyakarta',
    kabupatenKota: 'Yogyakarta',
  },
  {
    name: 'Istana Maimun',
    description:
      'Istana Kesultanan Deli dengan arsitektur perpaduan Melayu, Islam, dan Eropa. Warna kuning keemasan yang megah. Simbol kemegahan Melayu Deli.',
    type: 'wisata-sejarah',
    category: 'lokasi-budaya',
    provinsi: 'sumatera-utara',
    kabupatenKota: 'Medan',
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
  },
  {
    name: 'Wayang Kulit Solo',
    description:
      'Seni pertunjukan wayang dengan dalang maestro. Cerita Mahabharata dan Ramayana semalam suntuk. Warisan budaya lisan dan visual UNESCO.',
    type: 'kesenian',
    category: 'kesenian-daerah',
    provinsi: 'jawa-tengah',
    kabupatenKota: 'Surakarta',
  },
  {
    name: 'Tari Saman',
    description:
      'Tari seribu tangan dari Aceh yang mendunia. Gerakan kompak tanpa musik instrumental. UNESCO Intangible Cultural Heritage yang membanggakan.',
    type: 'kesenian',
    category: 'kesenian-daerah',
    provinsi: 'aceh',
    kabupatenKota: 'Gayo Lues',
  },
  {
    name: 'Angklung Saung Udjo',
    description:
      'Pertunjukan angklung interaktif yang menghibur. Belajar dan bermain alat musik bambu tradisional. Edutainment budaya Sunda yang menyenangkan.',
    type: 'kesenian',
    category: 'kesenian-daerah',
    provinsi: 'jawa-barat',
    kabupatenKota: 'Bandung',
  },
  {
    name: 'Batik Pekalongan',
    description:
      'Kota batik dengan motif pesisir yang khas. Museum Batik dan workshop membatik. UNESCO Creative City dengan warisan tekstil yang kaya.',
    type: 'kerajinan',
    category: 'kesenian-daerah',
    provinsi: 'jawa-tengah',
    kabupatenKota: 'Pekalongan',
  },
  {
    name: 'Batik Yogyakarta',
    description:
      'Batik klasik dengan motif filosofis Keraton. Pakem Keraton dan batik tulis berkualitas tinggi. Sentra batik Malioboro dan Kotagede.',
    type: 'kerajinan',
    category: 'kesenian-daerah',
    provinsi: 'di-yogyakarta',
    kabupatenKota: 'Yogyakarta',
  },
  {
    name: 'Tenun Ikat Flores',
    description:
      'Kain tenun tradisional dengan motif tribal yang unik. Proses pembuatan berbulan-bulan dengan pewarna alami. Warisan budaya Manggarai dan Sikka.',
    type: 'kerajinan',
    category: 'kesenian-daerah',
    provinsi: 'nusa-tenggara-timur',
    kabupatenKota: 'Sikka',
  },
  {
    name: 'Songket Palembang',
    description:
      'Kain tenun mewah dengan benang emas dan perak. Simbol kemewahan dan status sosial. Tradisi tenun yang diwariskan turun-temurun.',
    type: 'kerajinan',
    category: 'kesenian-daerah',
    provinsi: 'sumatera-selatan',
    kabupatenKota: 'Palembang',
  },
  {
    name: 'Ukiran Jepara',
    description:
      'Pusat seni ukir kayu berkualitas ekspor. Mebel dan kerajinan dengan detail yang rumit. Tradisi R.A. Kartini dan pengrajin terampil.',
    type: 'kerajinan',
    category: 'kesenian-daerah',
    provinsi: 'jawa-tengah',
    kabupatenKota: 'Jepara',
  },
  {
    name: 'Perak Kotagede',
    description:
      'Sentra kerajinan perak dengan teknik tradisional. Perhiasan dan aksesoris berkualitas tinggi. Kampung perak di kawasan heritage Yogyakarta.',
    type: 'kerajinan',
    category: 'kesenian-daerah',
    provinsi: 'di-yogyakarta',
    kabupatenKota: 'Yogyakarta',
  },
  {
    name: 'Keramik Kasongan',
    description:
      'Desa pengrajin gerabah dan keramik tradisional. Patung, guci, dan dekorasi dari tanah liat. Wisata desa dengan workshop pottery.',
    type: 'kerajinan',
    category: 'kesenian-daerah',
    provinsi: 'di-yogyakarta',
    kabupatenKota: 'Bantul',
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
  },
  {
    name: 'Nyepi di Bali',
    description:
      'Hari raya Saka yang sunyi tanpa aktivitas. Ogoh-ogoh parade malam sebelumnya yang meriah. Refleksi spiritual dan detox digital alami.',
    type: 'adat-istiadat',
    category: 'adat-istiadat',
    provinsi: 'bali',
    kabupatenKota: 'Denpasar',
  },
  {
    name: 'Sekaten Solo',
    description:
      'Perayaan Maulid Nabi dengan gamelan sakral Keraton. Pasar malam dan kirab budaya. Perpaduan Islam dan tradisi Jawa yang harmonis.',
    type: 'festival',
    category: 'adat-istiadat',
    provinsi: 'jawa-tengah',
    kabupatenKota: 'Surakarta',
  },
  {
    name: 'Festival Lembah Baliem',
    description:
      'Festival budaya suku Dani dengan atraksi perang-perangan. Tarian tradisional dan ritual bakar batu. Kekayaan budaya Papua yang eksotis.',
    type: 'festival',
    category: 'adat-istiadat',
    provinsi: 'papua',
    kabupatenKota: 'Jayawijaya',
  },
  {
    name: 'Jember Fashion Carnaval',
    description:
      'Karnaval fashion terbesar di Asia dengan kostum spektakuler. Kreativitas anak bangsa yang mendunia. Street fashion parade yang fenomenal.',
    type: 'festival',
    category: 'kesenian-daerah',
    provinsi: 'jawa-timur',
    kabupatenKota: 'Jember',
  },
  {
    name: 'Cap Go Meh Singkawang',
    description:
      'Festival Tatung dengan atraksi mistis yang menakjubkan. Perayaan Imlek terbesar di Indonesia. Budaya Tionghoa-Dayak yang harmonis.',
    type: 'festival',
    category: 'adat-istiadat',
    provinsi: 'kalimantan-barat',
    kabupatenKota: 'Singkawang',
  },
  {
    name: 'Erau Kutai Kartanegara',
    description:
      'Festival adat Kesultanan Kutai dengan ritual sakral. Prosesi adat Melayu Kalimantan yang megah. Pesta rakyat dengan berbagai atraksi.',
    type: 'festival',
    category: 'adat-istiadat',
    provinsi: 'kalimantan-timur',
    kabupatenKota: 'Kutai Kartanegara',
  },
  {
    name: 'Pasola Sumba',
    description:
      'Ritual perang berkuda dengan lembing dari suku Sumba. Tradisi panen dan kesuburan tanah. Atraksi budaya yang mendebarkan dan sakral.',
    type: 'adat-istiadat',
    category: 'adat-istiadat',
    provinsi: 'nusa-tenggara-timur',
    kabupatenKota: 'Sumba Barat',
  },
  {
    name: 'Tabuik Pariaman',
    description:
      'Festival mengenang Husein dengan prosesi Tabuik ke laut. Perpaduan Islam dan tradisi Minangkabau. Ritual yang khidmat dan meriah.',
    type: 'festival',
    category: 'adat-istiadat',
    provinsi: 'sumatera-barat',
    kabupatenKota: 'Pariaman',
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
  },
  {
    name: 'Kuliner Malioboro',
    description:
      'Surga jajanan kaki lima Yogyakarta. Gudeg, bakpia, dan wedang ronde. Pengalaman kuliner otentik di jantung Jogja.',
    type: 'wisata-kuliner',
    category: 'kuliner-tradisional',
    provinsi: 'di-yogyakarta',
    kabupatenKota: 'Yogyakarta',
  },
  {
    name: 'Pasar Beringharjo',
    description:
      'Pasar tradisional tertua di Yogyakarta dengan kuliner lengkap. Jamu tradisional, batik, dan makanan khas. Pengalaman belanja autentik.',
    type: 'wisata-kuliner',
    category: 'kuliner-tradisional',
    provinsi: 'di-yogyakarta',
    kabupatenKota: 'Yogyakarta',
  },
  {
    name: 'Rendang Padang',
    description:
      'Menikmati rendang otentik di tanah Minang. Rumah makan Padang legendaris dengan nasi kapau. Kuliner terenak di dunia versi CNN.',
    type: 'wisata-kuliner',
    category: 'kuliner-tradisional',
    provinsi: 'sumatera-barat',
    kabupatenKota: 'Padang',
  },
  {
    name: 'Pempek Palembang',
    description:
      'Wisata kuliner pempek asli dengan cuko khas. Musi River view dan kuliner sungai. Ikon kuliner Sumatera Selatan.',
    type: 'wisata-kuliner',
    category: 'kuliner-tradisional',
    provinsi: 'sumatera-selatan',
    kabupatenKota: 'Palembang',
  },
  {
    name: 'Sate Madura',
    description:
      'Sate kambing dan ayam dengan bumbu kacang khas. Tradisi kuliner masyarakat Madura. Aromanya yang menggoda selera.',
    type: 'wisata-kuliner',
    category: 'kuliner-tradisional',
    provinsi: 'jawa-timur',
    kabupatenKota: 'Pamekasan',
  },
  {
    name: 'Babi Guling Bali',
    description:
      'Hidangan khas Bali untuk upacara dan perayaan. Bumbu rempah yang meresap dan kulit yang renyah. Kelezatan kuliner pulau dewata.',
    type: 'wisata-kuliner',
    category: 'kuliner-tradisional',
    provinsi: 'bali',
    kabupatenKota: 'Gianyar',
  },
  {
    name: 'Papeda Papua',
    description:
      'Makanan pokok khas Papua dari sagu. Disajikan dengan ikan kuah kuning. Pengalaman kuliner tradisional Indonesia Timur.',
    type: 'wisata-kuliner',
    category: 'kuliner-tradisional',
    provinsi: 'papua',
    kabupatenKota: 'Jayapura',
  },
  {
    name: 'Soto Banjar',
    description:
      'Soto khas Kalimantan dengan perkedel kentang dan telur. Kuah bening dengan rempah yang hangat. Comfort food dari tanah Banjar.',
    type: 'wisata-kuliner',
    category: 'kuliner-tradisional',
    provinsi: 'kalimantan-selatan',
    kabupatenKota: 'Banjarmasin',
  },
  {
    name: 'Coto Makassar',
    description:
      'Sup daging sapi khas Sulawesi Selatan dengan bumbu kacang. Disajikan dengan ketupat dan burasa. Kuliner legendaris kota Daeng.',
    type: 'wisata-kuliner',
    category: 'kuliner-tradisional',
    provinsi: 'sulawesi-selatan',
    kabupatenKota: 'Makassar',
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
  },
  {
    name: 'Belitung',
    description:
      'Pulau dengan pantai berbatu granit yang unik. Laskar Pelangi trail dan museum sastra. Keindahan alam yang instagramable.',
    type: 'wisata-bahari',
    category: 'pariwisata',
    provinsi: 'kepulauan-bangka-belitung',
    kabupatenKota: 'Belitung',
  },
  {
    name: 'Wakatobi',
    description:
      'Taman Nasional Laut dengan terumbu karang pristine. Diving dan snorkeling paradise. Nama dari empat pulau: Wangi-Wangi, Kaledupa, Tomia, Binongko.',
    type: 'wisata-bahari',
    category: 'pariwisata',
    provinsi: 'sulawesi-tenggara',
    kabupatenKota: 'Wakatobi',
  },
  {
    name: 'Kepulauan Togean',
    description:
      'Kepulauan terpencil dengan keindahan bawah laut yang masih perawan. Suku Bajo yang hidup di atas laut. Off the beaten path destination.',
    type: 'wisata-bahari',
    category: 'pariwisata',
    provinsi: 'sulawesi-tengah',
    kabupatenKota: 'Tojo Una-Una',
  },
  {
    name: 'Dieng Plateau',
    description:
      'Dataran tinggi dengan candi Hindu tertua di Jawa. Kawah dan telaga vulkanik yang menawan. Sunrise di atas awan yang magis.',
    type: 'wisata-alam',
    category: 'situs-sejarah',
    provinsi: 'jawa-tengah',
    kabupatenKota: 'Wonosobo',
  },
  {
    name: 'Pantai Parangtritis',
    description:
      'Pantai legendaris dengan legenda Nyi Roro Kidul. Sunset dan naik andong di tepi pantai. Pantai ikonik Yogyakarta.',
    type: 'wisata-bahari',
    category: 'pariwisata',
    provinsi: 'di-yogyakarta',
    kabupatenKota: 'Bantul',
  },
  {
    name: 'Air Terjun Madakaripura',
    description:
      'Air terjun tertinggi di Jawa dengan tebing curam. Tempat pertapaan Gajah Mada yang sakral. Hidden gem di kawasan Bromo.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'jawa-timur',
    kabupatenKota: 'Probolinggo',
  },
  {
    name: 'Taman Nasional Gunung Leuser',
    description:
      'Habitat orangutan sumatera dan flora fauna endemic. UNESCO World Heritage dengan hutan hujan tropis. Ekowisata dan trekking adventure.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'aceh',
    kabupatenKota: 'Aceh Tenggara',
  },
  {
    name: 'Bukit Lawang',
    description:
      'Pintu masuk ke hutan orangutan dengan river tubing. Jungle trekking dan wildlife encounter. Eco-tourism yang sustainable.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'sumatera-utara',
    kabupatenKota: 'Langkat',
  },
  {
    name: 'Labuan Bajo',
    description:
      'Gerbang menuju Taman Nasional Komodo dengan sunset indah. Bukit Cinta dan Pulau Padar. Destinasi rising star Indonesia.',
    type: 'wisata-bahari',
    category: 'pariwisata',
    provinsi: 'nusa-tenggara-timur',
    kabupatenKota: 'Manggarai Barat',
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
  },
  {
    name: 'Tegallalang Rice Terrace',
    description:
      'Sawah terasering ikonik dengan sistem irigasi subak tradisional. UNESCO Cultural Landscape yang indah. Photography spot yang wajib dikunjungi.',
    type: 'wisata-alam',
    category: 'lokasi-budaya',
    provinsi: 'bali',
    kabupatenKota: 'Gianyar',
  },
  {
    name: 'Desa Wae Rebo',
    description:
      'Desa adat Manggarai dengan rumah adat Mbaru Niang. Trekking melalui hutan untuk mencapai desa. Warisan budaya yang terjaga di ketinggian.',
    type: 'wisata-budaya',
    category: 'adat-istiadat',
    provinsi: 'nusa-tenggara-timur',
    kabupatenKota: 'Manggarai',
  },
  {
    name: 'Kampung Naga',
    description:
      'Desa adat Sunda yang menolak modernisasi. Kehidupan tradisional tanpa listrik yang harmonis. Kearifan lokal yang terjaga ratusan tahun.',
    type: 'wisata-budaya',
    category: 'adat-istiadat',
    provinsi: 'jawa-barat',
    kabupatenKota: 'Tasikmalaya',
  },
  {
    name: 'Rumah Gadang Minangkabau',
    description:
      'Arsitektur tradisional Minang dengan atap tanduk kerbau. Pusat adat dan musyawarah masyarakat. Ikon budaya Sumatera Barat.',
    type: 'wisata-budaya',
    category: 'lokasi-budaya',
    provinsi: 'sumatera-barat',
    kabupatenKota: 'Padang Panjang',
  },
  {
    name: 'Rumah Limas Palembang',
    description:
      'Arsitektur tradisional Palembang berlantai bertingkat. Simbol status sosial masyarakat Melayu. Warisan arsitektur Kesultanan Palembang.',
    type: 'wisata-budaya',
    category: 'lokasi-budaya',
    provinsi: 'sumatera-selatan',
    kabupatenKota: 'Palembang',
  },
  {
    name: 'Rumah Tongkonan Toraja',
    description:
      'Rumah adat dengan atap melengkung seperti perahu. Ukiran dan warna yang penuh makna filosofis. Arsitektur ikonik Sulawesi Selatan.',
    type: 'wisata-budaya',
    category: 'lokasi-budaya',
    provinsi: 'sulawesi-selatan',
    kabupatenKota: 'Tana Toraja',
  },
  {
    name: 'Rumah Panjang Dayak',
    description:
      'Rumah komunal suku Dayak yang bisa menampung puluhan keluarga. Tradisi dan ritual adat yang masih hidup. Budaya Kalimantan yang kaya.',
    type: 'wisata-budaya',
    category: 'adat-istiadat',
    provinsi: 'kalimantan-barat',
    kabupatenKota: 'Kapuas Hulu',
  },
  {
    name: 'Tanjung Puting',
    description:
      'Taman Nasional orangutan dengan perjalanan klotok. Camp Leakey dan rehabilitasi orangutan. Wildlife cruise yang tak terlupakan.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'kalimantan-tengah',
    kabupatenKota: 'Kotawaringin Barat',
  },
  {
    name: 'Pulau Morotai',
    description:
      'Pulau bersejarah Perang Dunia II yang eksotis. Wreck diving dan pantai perawan. Destinasi sejarah dan bahari yang unik.',
    type: 'wisata-sejarah',
    category: 'pariwisata',
    provinsi: 'maluku-utara',
    kabupatenKota: 'Pulau Morotai',
  },
  {
    name: 'Banda Neira',
    description:
      'Kepulauan rempah bersejarah dengan benteng VOC. Snorkeling dengan lava flow dan gunung api aktif. Time capsule sejarah maritime.',
    type: 'wisata-sejarah',
    category: 'situs-sejarah',
    provinsi: 'maluku',
    kabupatenKota: 'Maluku Tengah',
  },
  {
    name: 'Ora Beach',
    description:
      'Resort terapung di teluk dengan air jernih. Hidden paradise di Maluku yang masih perawan. Ketenangan dan keindahan alam yang luar biasa.',
    type: 'wisata-bahari',
    category: 'pariwisata',
    provinsi: 'maluku',
    kabupatenKota: 'Seram Utara',
  },
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
    // ========== STEP 1: Clean existing data ==========
    console.log('\n🧹 Cleaning existing data...')
    await db.delete(vote)
    await db.delete(destination)
    // Don't delete users - keep existing auth users
    console.log('   ✓ Cleaned votes and destinations')

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
          coverImage: `https://picsum.photos/seed/${slug}/800/600`,
          images: JSON.stringify([
            `https://picsum.photos/seed/${slug}-1/800/600`,
            `https://picsum.photos/seed/${slug}-2/800/600`,
            `https://picsum.photos/seed/${slug}-3/800/600`,
          ]),

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
      // Each destination gets random votes from random users
      const numVotes = getRandomInt(5, Math.min(createdUsers.length, 8))
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
        content:
          'Raja Ampat adalah surga bagi penyelam dengan keanekaragaman hayati laut tertinggi di dunia. Dengan lebih dari 1.500 spesies ikan dan 75% spesies karang dunia, Raja Ampat menawarkan pengalaman menyelam yang tak terlupakan. Kepulauan ini terdiri dari empat pulau besar dan ratusan pulau kecil yang menawarkan pemandangan laut yang spektakuler. Selain diving, Anda juga bisa menikmati snorkeling, island hopping, dan bertemu dengan manta ray yang ramah.',
      },
      {
        title: 'Warisan Budaya Candi Borobudur',
        excerpt: 'Mengungkap misteri dan keindahan Candi Borobudur.',
        content:
          'Candi Borobudur adalah candi Buddha terbesar di dunia dan merupakan UNESCO World Heritage Site. Dibangun pada abad ke-9 oleh Dinasti Syailendra, candi ini memiliki 2.672 panel relief dan 504 arca Buddha. Arsitektur candi yang menakjubkan menggambarkan kosmologi Buddha dengan tiga tingkat: Kamadhatu, Rupadhatu, dan Arupadhatu. Pengalaman terbaik adalah menyaksikan sunrise dari Punthuk Setumbu dengan latar belakang Borobudur yang megah.',
      },
      {
        title: 'Keajaiban Alam Danau Toba',
        excerpt: 'Danau vulkanik terbesar di Asia Tenggara.',
        content:
          'Danau Toba terbentuk dari letusan supervulkanik sekitar 74.000 tahun lalu dan merupakan danau vulkanik terbesar di Asia Tenggara. Pulau Samosir di tengah danau menyimpan warisan budaya Batak yang kaya. Anda dapat mengunjungi desa-desa tradisional Batak, menikmati Tor-Tor dance, dan melihat rumah adat Gorga. Danau ini juga menawarkan aktivitas seperti berenang, memancing, dan berkeliling dengan kapal tradisional.',
      },
      {
        title: 'Festival Lembah Baliem: Pesta Budaya Papua',
        excerpt: 'Mengintip kemeriahan festival budaya suku Dani.',
        content:
          'Festival Lembah Baliem adalah acara tahunan yang memamerkan kekayaan budaya suku Dani dan suku-suku lainnya di Papua. Festival ini menampilkan atraksi perang-perangan tradisional, tarian, dan ritual bakar batu. Pengunjung dapat menyaksikan pakaian tradisional dari bulu burung cenderawasih dan koteka. Ini adalah kesempatan langka untuk melihat budaya asli Papua yang masih terjaga keasliannya.',
      },
      {
        title: 'Eksplorasi Kuliner Nusantara',
        excerpt: 'Perjalanan rasa melalui masakan tradisional Indonesia.',
        content:
          'Indonesia memiliki kekayaan kuliner yang luar biasa dengan ribuan resep tradisional dari Sabang sampai Merauke. Rendang Padang yang dinobatkan sebagai makanan terenak di dunia, Gudeg Jogja yang manis gurih, Pempek Palembang dengan cuko yang asam pedas, dan Papeda Papua yang unik. Setiap daerah memiliki cita rasa khas yang mencerminkan budaya dan kearifan lokal masyarakatnya.',
      },
      {
        title: 'Trekking di Gunung Rinjani',
        excerpt: 'Petualangan mendaki gunung tertinggi kedua di Indonesia.',
        content:
          'Gunung Rinjani di Lombok menawarkan pengalaman pendakian yang menantang dengan pemandangan yang spektakuler. Danau Segara Anak di kawah gunung adalah hadiah bagi para pendaki yang berhasil mencapai puncak. Pendakian biasanya memakan waktu 2-4 hari tergantung rute yang dipilih. Selain keindahan alamnya, Rinjani juga memiliki nilai spiritual bagi masyarakat Sasak yang percaya bahwa gunung ini adalah tempat tinggal dewa.',
      },
      {
        title: 'Mengenal Batik: Warisan Dunia dari Indonesia',
        excerpt: 'Sejarah dan filosofi di balik motif batik Indonesia.',
        content:
          'Batik Indonesia telah diakui UNESCO sebagai Warisan Budaya Takbenda Kemanusiaan. Setiap motif batik memiliki makna filosofis yang dalam, mulai dari Parang yang melambangkan kekuatan, Kawung yang melambangkan kesucian, hingga Mega Mendung yang melambangkan kesabaran. Proses pembuatan batik tulis membutuhkan ketelitian dan kesabaran tinggi, dengan setiap lembar kain bisa memakan waktu berminggu-minggu hingga berbulan-bulan untuk diselesaikan.',
      },
      {
        title: 'Keindahan Sunset di Tanah Lot',
        excerpt: 'Pura di atas batu karang dengan panorama sunset memukau.',
        content:
          'Tanah Lot adalah salah satu pura laut paling ikonik di Bali. Terletak di atas batu karang besar di tengah laut, pura ini menawarkan pemandangan sunset yang spektakuler. Menurut legenda, pura ini didirikan oleh Dang Hyang Nirartha pada abad ke-16. Saat air laut surut, pengunjung dapat berjalan ke batu karang dan melihat ular laut suci yang dipercaya menjaga kesucian pura.',
      },
      {
        title: 'Misteri Blue Fire Kawah Ijen',
        excerpt: 'Fenomena api biru yang hanya ada di dua tempat di dunia.',
        content:
          'Kawah Ijen di Banyuwangi menawarkan fenomena alam yang langka: blue fire atau api biru. Fenomena ini terjadi karena gas belerang yang terbakar saat bersentuhan dengan udara. Untuk menyaksikan blue fire, pengunjung harus mendaki pada malam hari dan mencapai kawah sebelum matahari terbit. Selain blue fire, Anda juga dapat melihat danau asam terbesar di dunia dan penambang belerang tradisional yang bekerja dalam kondisi ekstrem.',
      },
      {
        title: 'Desa Wae Rebo: Permata Tersembunyi di Flores',
        excerpt: 'Desa adat di atas awan dengan rumah kerucut tradisional.',
        content:
          'Desa Wae Rebo adalah desa adat Manggarai yang terletak di ketinggian 1.200 meter di Flores. Untuk mencapai desa ini, pengunjung harus melakukan trekking selama 3-4 jam melalui hutan. Desa ini terkenal dengan rumah adat Mbaru Niang yang berbentuk kerucut dan dapat menampung hingga 8 keluarga. UNESCO telah mengakui Wae Rebo sebagai warisan budaya yang perlu dilestarikan.',
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
          coverImage: `https://picsum.photos/seed/article-${slug}/1200/630`,
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
    console.log(`   • ${articleCount} articles`)

    console.log('\n🎯 Categories seeded:')
    console.log('   • Wisata Alam & Bahari')
    console.log('   • Wisata Budaya & Sejarah')
    console.log('   • Kesenian & Kerajinan')
    console.log('   • Adat Istiadat & Festival')
    console.log('   • Kuliner Tradisional')
    console.log('   • Articles & Content')

    console.log('')
  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

main()
