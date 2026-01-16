// FILE: src/lib/game/questions.ts — Quiz question fixtures for Indonesian destinations

import type { Question } from './types'

/**
 * Quiz questions about Indonesian destinations
 * Minimum 12 questions (4 per level)
 *
 * Image URLs use placeholder Unsplash images - replace with actual images
 */
export const QUIZ_QUESTIONS: Question[] = [
  // ============================================================================
  // EASY LEVEL QUESTIONS
  // ============================================================================
  {
    id: 'easy_1',
    level: 'easy',
    destinationId: 'borobudur',
    destinationName: 'Candi Borobudur',
    province: 'Jawa Tengah',
    category: 'wisata-sejarah',
    prompt: 'Candi Buddha terbesar di dunia yang terletak di Magelang ini adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1620549146396-9024d914cd99?w=800&q=80',
    choices: ['Candi Borobudur', 'Candi Prambanan', 'Candi Mendut', 'Candi Sewu'],
    correctIndex: 0,
    hint: 'Dibangun pada abad ke-9 oleh dinasti Syailendra',
    funFact: 'Borobudur memiliki 2.672 panel relief dan 504 arca Buddha!',
    description: 'Candi Buddha terbesar di dunia, warisan UNESCO sejak 1991',
    tags: ['UNESCO', 'candi', 'jawa-tengah', 'sejarah'],
  },
  {
    id: 'easy_2',
    level: 'easy',
    destinationId: 'bali-tanah-lot',
    destinationName: 'Tanah Lot',
    province: 'Bali',
    category: 'wisata-budaya',
    prompt: 'Pura yang berdiri di atas batu karang di tengah laut di Bali ini bernama...',
    fullImageUrl: 'https://images.unsplash.com/photo-1724568834641-c083683d15ab?w=800&q=80',
    choices: ['Tanah Lot', 'Uluwatu', 'Besakih', 'Tirta Empul'],
    correctIndex: 0,
    hint: 'Terkenal dengan pemandangan sunset yang memukau',
    funFact: 'Tanah Lot berarti "Tanah di Laut" dalam bahasa Bali!',
    description: 'Pura laut yang menjadi ikon pariwisata Bali',
    tags: ['pura', 'bali', 'sunset', 'budaya'],
  },
  {
    id: 'easy_3',
    level: 'easy',
    destinationId: 'raja-ampat',
    destinationName: 'Raja Ampat',
    province: 'Papua Barat',
    category: 'wisata-alam',
    prompt: 'Kepulauan dengan keanekaragaman hayati laut tertinggi di dunia ini adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1703769605297-cc74106244d9?w=800&q=80',
    choices: ['Raja Ampat', 'Wakatobi', 'Bunaken', 'Derawan'],
    correctIndex: 0,
    hint: 'Terletak di Papua Barat dengan 4 pulau utama',
    funFact: 'Raja Ampat memiliki 75% spesies karang dunia!',
    description: 'Surga diving dengan biodiversitas laut tertinggi',
    tags: ['diving', 'papua', 'laut', 'karang'],
  },
  {
    id: 'easy_4',
    level: 'easy',
    destinationId: 'komodo',
    destinationName: 'Taman Nasional Komodo',
    province: 'Nusa Tenggara Timur',
    category: 'wisata-alam',
    prompt: 'Habitat asli kadal terbesar di dunia, Komodo, berada di...',
    fullImageUrl: 'https://images.unsplash.com/photo-1660280274563-767dd6b56374?w=800&q=80',
    choices: ['Taman Nasional Komodo', 'Taman Nasional Lorentz', 'Taman Nasional Ujung Kulon', 'Taman Nasional Way Kambas'],
    correctIndex: 0,
    hint: 'Terletak di Nusa Tenggara Timur',
    funFact: 'Komodo bisa mencapai panjang 3 meter dan berat 70 kg!',
    description: 'Rumah bagi hewan purba Komodo, New 7 Wonders of Nature',
    tags: ['komodo', 'ntt', 'UNESCO', 'hewan'],
  },
  {
    id: 'easy_5',
    level: 'easy',
    destinationId: 'bromo',
    destinationName: 'Gunung Bromo',
    province: 'Jawa Timur',
    category: 'wisata-alam',
    prompt: 'Gunung berapi aktif dengan lautan pasir yang terkenal ini adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80',
    choices: ['Gunung Bromo', 'Gunung Merapi', 'Gunung Semeru', 'Gunung Rinjani'],
    correctIndex: 0,
    hint: 'Terkenal dengan pemandangan sunrise dari Penanjakan',
    funFact: 'Nama Bromo berasal dari nama dewa Brahma!',
    description: 'Gunung berapi aktif di kaldera Tengger',
    tags: ['gunung', 'jawa-timur', 'sunrise', 'alam'],
  },

  // ============================================================================
  // MEDIUM LEVEL QUESTIONS
  // ============================================================================
  {
    id: 'medium_1',
    level: 'medium',
    destinationId: 'toba',
    destinationName: 'Danau Toba',
    province: 'Sumatera Utara',
    category: 'wisata-alam',
    prompt: 'Danau vulkanik terbesar di dunia dengan Pulau Samosir di tengahnya adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1701697627581-bb7b0d127895?w=800&q=80',
    choices: ['Danau Toba', 'Danau Maninjau', 'Danau Singkarak', 'Danau Ranau'],
    correctIndex: 0,
    hint: 'Terbentuk dari letusan supervulkan 74.000 tahun lalu',
    funFact: 'Danau Toba adalah danau vulkanik terbesar di dunia dengan kedalaman 505 meter!',
    description: 'Danau kaldera terbesar di Asia Tenggara',
    tags: ['danau', 'sumatera', 'vulkanik', 'batak'],
    fragmentConfigs: [
      { id: 'frag_1', xPerc: 10, yPerc: 20, wPerc: 30, hPerc: 35 },
      { id: 'frag_2', xPerc: 55, yPerc: 40, wPerc: 35, hPerc: 30 },
      { id: 'frag_3', xPerc: 25, yPerc: 60, wPerc: 25, hPerc: 25 },
    ],
  },
  {
    id: 'medium_2',
    level: 'medium',
    destinationId: 'prambanan',
    destinationName: 'Candi Prambanan',
    province: 'Jawa Tengah',
    category: 'wisata-sejarah',
    prompt: 'Kompleks candi Hindu terbesar di Indonesia yang didedikasikan untuk Trimurti adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=800&q=80',
    choices: ['Candi Prambanan', 'Candi Borobudur', 'Candi Gedong Songo', 'Candi Dieng'],
    correctIndex: 0,
    hint: 'Dibangun pada abad ke-9 oleh Rakai Pikatan',
    funFact: 'Prambanan memiliki 240 candi dan candi utamanya setinggi 47 meter!',
    description: 'Kompleks candi Hindu terbesar di Indonesia',
    tags: ['candi', 'hindu', 'UNESCO', 'jawa-tengah'],
    fragmentConfigs: [
      { id: 'frag_1', xPerc: 20, yPerc: 10, wPerc: 35, hPerc: 40 },
      { id: 'frag_2', xPerc: 45, yPerc: 50, wPerc: 30, hPerc: 35 },
      { id: 'frag_3', xPerc: 5, yPerc: 55, wPerc: 28, hPerc: 30 },
    ],
  },
  {
    id: 'medium_3',
    level: 'medium',
    destinationId: 'labuan-bajo',
    destinationName: 'Labuan Bajo',
    province: 'Nusa Tenggara Timur',
    category: 'wisata-alam',
    prompt: 'Kota pelabuhan yang menjadi gerbang menuju Taman Nasional Komodo adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1589309736404-2e142a2acdf0?w=800&q=80',
    choices: ['Labuan Bajo', 'Maumere', 'Ende', 'Kupang'],
    correctIndex: 0,
    hint: 'Terletak di ujung barat Pulau Flores',
    funFact: 'Labuan Bajo dulunya adalah desa nelayan kecil sebelum menjadi destinasi wisata premium!',
    description: 'Gerbang menuju Taman Nasional Komodo',
    tags: ['labuan-bajo', 'flores', 'ntt', 'pelabuhan'],
    fragmentConfigs: [
      { id: 'frag_1', xPerc: 15, yPerc: 15, wPerc: 32, hPerc: 38 },
      { id: 'frag_2', xPerc: 50, yPerc: 35, wPerc: 28, hPerc: 32 },
      { id: 'frag_3', xPerc: 30, yPerc: 58, wPerc: 30, hPerc: 28 },
    ],
  },
  {
    id: 'medium_4',
    level: 'medium',
    destinationId: 'toraja',
    destinationName: 'Tana Toraja',
    province: 'Sulawesi Selatan',
    category: 'wisata-budaya',
    prompt: 'Daerah dengan tradisi pemakaman unik dan rumah adat Tongkonan adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1727672100642-c8e8dfa7dca3?w=800&q=80',
    choices: ['Tana Toraja', 'Makassar', 'Bone', 'Gowa'],
    correctIndex: 0,
    hint: 'Terkenal dengan upacara Rambu Solo',
    funFact: 'Di Toraja, jenazah tidak langsung dikubur dan tetap dianggap sebagai orang sakit!',
    description: 'Tanah dengan budaya pemakaman yang unik',
    tags: ['toraja', 'sulawesi', 'budaya', 'tongkonan'],
    fragmentConfigs: [
      { id: 'frag_1', xPerc: 8, yPerc: 25, wPerc: 35, hPerc: 35 },
      { id: 'frag_2', xPerc: 55, yPerc: 20, wPerc: 30, hPerc: 38 },
      { id: 'frag_3', xPerc: 25, yPerc: 62, wPerc: 32, hPerc: 28 },
    ],
  },
  {
    id: 'medium_5',
    level: 'medium',
    destinationId: 'kawah-ijen',
    destinationName: 'Kawah Ijen',
    province: 'Jawa Timur',
    category: 'wisata-alam',
    prompt: 'Kawah vulkanik dengan fenomena blue fire yang langka ini adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1555058170-94d5f5016a2c?w=800&q=80',
    choices: ['Kawah Ijen', 'Kawah Putih', 'Kawah Ratu', 'Kawah Tangkuban Perahu'],
    correctIndex: 0,
    hint: 'Terletak di perbatasan Banyuwangi dan Bondowoso',
    funFact: 'Blue fire di Ijen adalah salah satu dari dua yang ada di dunia!',
    description: 'Kawah dengan fenomena api biru yang menakjubkan',
    tags: ['kawah', 'jawa-timur', 'blue-fire', 'vulkanik'],
    fragmentConfigs: [
      { id: 'frag_1', xPerc: 12, yPerc: 18, wPerc: 33, hPerc: 36 },
      { id: 'frag_2', xPerc: 52, yPerc: 42, wPerc: 30, hPerc: 32 },
      { id: 'frag_3', xPerc: 20, yPerc: 60, wPerc: 28, hPerc: 26 },
    ],
  },

  // ============================================================================
  // HARD LEVEL QUESTIONS
  // ============================================================================
  {
    id: 'hard_1',
    level: 'hard',
    destinationId: 'dieng',
    destinationName: 'Dataran Tinggi Dieng',
    province: 'Jawa Tengah',
    category: 'wisata-alam',
    prompt: 'Dataran tinggi dengan candi-candi Hindu tertua di Jawa dan fenomena embun upas adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1600141133141-e9b1ceb9c2d6?w=800&q=80',
    choices: ['Dataran Tinggi Dieng', 'Dataran Tinggi Malino', 'Dataran Tinggi Kintamani', 'Dataran Tinggi Gayo'],
    correctIndex: 0,
    funFact: 'Dieng berarti "Tempat Tinggal Para Dewa" dalam bahasa Kawi!',
    description: 'Dataran tinggi vulkanik dengan candi tertua di Jawa',
    tags: ['dieng', 'jawa-tengah', 'candi', 'dataran-tinggi'],
    fragmentConfigs: [{ id: 'frag_1', xPerc: 30, yPerc: 25, wPerc: 22, hPerc: 24 }],
  },
  {
    id: 'hard_2',
    level: 'hard',
    destinationId: 'wakatobi',
    destinationName: 'Wakatobi',
    province: 'Sulawesi Tenggara',
    category: 'wisata-alam',
    prompt: 'Kepulauan yang namanya adalah singkatan dari empat pulau utamanya adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1602144586078-7d95c8d7808c?w=800&q=80',
    choices: ['Wakatobi', 'Togean', 'Banda', 'Kei'],
    correctIndex: 0,
    funFact: 'Wakatobi singkatan dari Wangi-wangi, Kaledupa, Tomia, dan Binongko!',
    description: 'Taman nasional laut dengan terumbu karang pristine',
    tags: ['wakatobi', 'sulawesi', 'diving', 'karang'],
    fragmentConfigs: [{ id: 'frag_1', xPerc: 40, yPerc: 35, wPerc: 20, hPerc: 22 }],
  },
  {
    id: 'hard_3',
    level: 'hard',
    destinationId: 'belitung',
    destinationName: 'Pulau Belitung',
    province: 'Kepulauan Bangka Belitung',
    category: 'wisata-alam',
    prompt: 'Pulau dengan formasi batu granit raksasa dan pantai Tanjung Tinggi adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1551597233-14838addbcc5?w=800&q=80',
    choices: ['Pulau Belitung', 'Pulau Bangka', 'Pulau Bintan', 'Pulau Natuna'],
    correctIndex: 0,
    funFact: 'Belitung terkenal setelah film Laskar Pelangi yang syuting di sana!',
    description: 'Pulau dengan batu granit ikonik dan pantai berpasir putih',
    tags: ['belitung', 'bangka', 'pantai', 'granit'],
    fragmentConfigs: [{ id: 'frag_1', xPerc: 25, yPerc: 40, wPerc: 18, hPerc: 20 }],
  },
  {
    id: 'hard_4',
    level: 'hard',
    destinationId: 'wae-rebo',
    destinationName: 'Wae Rebo',
    province: 'Nusa Tenggara Timur',
    category: 'wisata-budaya',
    prompt: 'Desa adat dengan rumah kerucut Mbaru Niang di puncak gunung Flores adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1643785879506-ec3e637a9f2d?w=800&q=80',
    choices: ['Wae Rebo', 'Bena', 'Todo', 'Ruteng'],
    correctIndex: 0,
    funFact: 'Wae Rebo menerima UNESCO Award of Excellence tahun 2012!',
    description: 'Desa tradisional dengan arsitektur rumah kerucut unik',
    tags: ['wae-rebo', 'flores', 'ntt', 'UNESCO'],
    fragmentConfigs: [{ id: 'frag_1', xPerc: 35, yPerc: 30, wPerc: 20, hPerc: 22 }],
  },
  {
    id: 'hard_5',
    level: 'hard',
    destinationId: 'derawan',
    destinationName: 'Kepulauan Derawan',
    province: 'Kalimantan Timur',
    category: 'wisata-alam',
    prompt: 'Kepulauan dengan danau ubur-ubur tidak menyengat dan penyu hijau adalah...',
    fullImageUrl: 'https://images.unsplash.com/photo-1758653000057-34adac6ac623?w=800&q=80',
    choices: ['Kepulauan Derawan', 'Kepulauan Seribu', 'Kepulauan Karimunjawa', 'Kepulauan Anambas'],
    correctIndex: 0,
    funFact: 'Danau Kakaban di Derawan memiliki ubur-ubur yang tidak menyengat karena evolusi jutaan tahun!',
    description: 'Surga bahari dengan ubur-ubur jinak dan penyu hijau',
    tags: ['derawan', 'kalimantan', 'diving', 'penyu'],
    fragmentConfigs: [{ id: 'frag_1', xPerc: 45, yPerc: 38, wPerc: 18, hPerc: 20 }],
  },
]

/**
 * Get questions by level
 */
export function getQuestionsByLevel(level: Question['level']): Question[] {
  return QUIZ_QUESTIONS.filter((q) => q.level === level)
}

/**
 * Get all unique destinations from questions
 */
export function getUniqueDestinations(): string[] {
  return [...new Set(QUIZ_QUESTIONS.map((q) => q.destinationName))]
}

/**
 * Get question count by level
 */
export function getQuestionCountByLevel(): Record<Question['level'], number> {
  return {
    easy: getQuestionsByLevel('easy').length,
    medium: getQuestionsByLevel('medium').length,
    hard: getQuestionsByLevel('hard').length,
  }
}
