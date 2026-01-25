const destinasi = [
  // ========== WISATA ALAM ==========
  {
    name: 'Danau Toba',
    description:
      'Danau vulkanik terbesar di Asia Tenggara dengan keindahan alam yang memukau. Pulau Samosir di tengah danau menyimpan warisan budaya Batak yang kaya. Destinasi wajib bagi pecinta alam dan budaya.',
    type: 'wisata-alam',
    category: 'pariwisata',
    provinsi: 'sumatera-utara',
    kabupatenKota: 'Toba Samosir',
    coverImage:
      'https://images.unsplash.com/photo-1642762205001-aada86f9dbe2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Danau Toba aerial
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
    coverImage:
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Raja Ampat islands
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
    coverImage:
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Bromo sunrise
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
    coverImage:
      'https://images.unsplash.com/photo-1555058170-94d5f5016a2c?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ijen blue fire
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
    coverImage:
      'https://images.unsplash.com/photo-1717238977683-5f06a9e60694?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Komodo dragon
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
    coverImage:
      'https://images.unsplash.com/photo-1562008928-6185cc645f76?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Pink beach
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
    coverImage:
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1200&h=800&fit=crop', // Gili Trawangan
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
    coverImage:
      'https://images.unsplash.com/photo-1758653000057-34adac6ac623?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Derawan jellyfish lake
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
    coverImage:
      'https://images.unsplash.com/photo-1519901246372-95385e087ff3?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Kelimutu lakes
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
    coverImage:
      'https://images.unsplash.com/photo-1621001481154-a52cbb91fcc2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Rinjani crater
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
    coverImage:
      'https://images.unsplash.com/photo-1738394595245-73dcb15bca0b?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Sumatran elephant
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
    coverImage:
      'https://images.unsplash.com/photo-1722688010304-bdb181fbda3a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tropical rainforest
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
    coverImage:
      'https://images.unsplash.com/photo-1720033787459-0eb7ea2913d5?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Canyon valley
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
    coverImage:
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=800&fit=crop', // Volcanic lake
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
    coverImage:
      'https://images.unsplash.com/photo-1645699822985-5b3389ff5b58?q=80&w=385&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Borobudur temple
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
    coverImage:
      'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200&h=800&fit=crop', // Prambanan temple
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
    coverImage:
      'https://images.unsplash.com/photo-1631681895793-4dbe543350e2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Keraton Jogja
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
    coverImage:
      'https://images.unsplash.com/photo-1707544338081-147f3608bc64?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Solo Palace
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
    coverImage:
      'https://images.unsplash.com/photo-1582426007790-f5a2e2392dd3?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Toraja Tongkonan
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
    coverImage:
      'https://images.unsplash.com/photo-1671080749889-19f8a69deb2b?q=80&w=876&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Bali village
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
    coverImage:
      'https://images.unsplash.com/photo-1593938637471-cb705e42d533?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Besakih temple
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
    coverImage:
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&h=800&fit=crop', // Tanah Lot sunset
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
    coverImage:
      'https://images.unsplash.com/photo-1636984011278-886b13d0772d?w=1200&h=800&fit=crop', // Istiqlal Mosque
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
    coverImage:
      'https://images.unsplash.com/photo-1651890053473-b25f7e1672dd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Colonial building
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
    coverImage:
      'https://images.unsplash.com/photo-1695444297714-f418f5a7507e?q=80&w=385&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Kota Tua square
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
    coverImage:
      'https://images.unsplash.com/photo-1610570534468-19a1a86a3c36?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Maimun Palace
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
    coverImage:
      'https://images.unsplash.com/photo-1718631932394-dfedda3a212f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Kecak dance
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
    coverImage:
      'https://images.unsplash.com/photo-1662793524504-bd11271b4b56?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Wayang kulit
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
    coverImage:
      'https://images.unsplash.com/photo-1741272689174-f7f03b09a0ab?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Saman dance
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
    coverImage:
      'https://images.unsplash.com/photo-1691229219602-f3634d8ff4b0?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Angklung performance
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
    coverImage:
      'https://images.unsplash.com/photo-1616125162686-770bf85622b9?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batik fabric
    images: [
      'https://images.unsplash.com/photo-1604973104381-870c92f10343?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batik process
      'https://images.unsplash.com/photo-1616125162686-770bf85622b9?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batik pattern
      'https://images.unsplash.com/photo-1609407683391-7d127a00b3e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batik workshop
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
    coverImage:
      'https://images.unsplash.com/photo-1604973104381-870c92f10343?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Batik Yogya
    images: [
      'https://images.unsplash.com/photo-1609407683391-7d127a00b3e1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Classic batik
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
    coverImage:
      'https://images.unsplash.com/photo-1593671186131-d58817e7dee0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tenun weaving
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
    coverImage:
      'https://images.unsplash.com/photo-1718938611659-fa97f0a87b9b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Songket
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
    coverImage:
      'https://images.unsplash.com/photo-1681311370373-980633672183?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Wood carving
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
    coverImage:
      'https://images.unsplash.com/photo-1511253819057-5408d4d70465?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Silver jewelry
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=600&fit=crop', // Silver crafting
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=800&h=600&fit=crop', // Silver accessories
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop', // Jewelry display
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
    coverImage:
      'https://images.unsplash.com/photo-1565619109666-b8bfe0e95ceb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Bromo ceremony
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
    coverImage:
      'https://images.unsplash.com/photo-1648172751305-2e0994739f1e?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Nyepi Bali
    images: [
      'https://images.unsplash.com/photo-1709614530058-275dcb257bf6?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1678304639537-d347f2aebc92?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1648172761966-6883c3a9897e?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    coverImage:
      'https://images.unsplash.com/photo-1756694915765-8c8271ceaff5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Fashion carnival
    images: [
      'https://images.unsplash.com/photo-1597242668604-7542df663f4c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1684716091108-70c2b19db377?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1674845566580-cfa4e699a6fd?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
    coverImage:
      'https://images.unsplash.com/photo-1682827893620-457803c24cc9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Chinese new year
    images: [
      'https://images.unsplash.com/photo-1614503719153-561f3fbcc089?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tatung parade
      'https://images.unsplash.com/photo-1637978313102-af2558d7d05a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Festival lights
      'https://images.unsplash.com/photo-1614503779931-7ad8b62a859b?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Dragon dance
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
    coverImage:
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=1200&h=800&fit=crop', // Horse riding
    images: [
      'https://images.unsplash.com/photo-1620268835770-1e9c62832a49?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Spear throwing
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
    coverImage:
      'https://images.unsplash.com/photo-1600004637343-27fc104f67b8?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Indonesian food
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
    coverImage:
      'https://images.unsplash.com/photo-1568622998407-0084ebf482b0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Malioboro street food
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
    coverImage:
      'https://images.unsplash.com/photo-1699628039216-2d51de425f81?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Traditional market
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
    coverImage:
      'https://images.unsplash.com/photo-1620700668269-d3ad2a88f27e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Rendang
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
    coverImage:
      'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=1200&h=800&fit=crop', // Satay
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
    coverImage:
      'https://images.unsplash.com/photo-1572656631137-7935297eff55?w=1200&h=800&fit=crop', // Soto
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
    coverImage:
      'https://images.unsplash.com/photo-1681378128359-a5c2492a3535?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Coto Makassar
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
    coverImage:
      'https://images.unsplash.com/photo-1683955045034-232d69e67f15?q=80&w=1106&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tropical island
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
    coverImage:
      'https://images.unsplash.com/photo-1596178060810-72f53ce9a65c?w=1200&h=800&fit=crop', // Granite beach
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
    coverImage:
      'https://images.unsplash.com/photo-1602144586078-7d95c8d7808c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Coral reef
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
    coverImage:
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1200&h=800&fit=crop', // Remote island
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
    coverImage:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=800&fit=crop', // Misty plateau
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
    coverImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop', // Beach sunset
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
    coverImage:
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&h=800&fit=crop', // Waterfall
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
    coverImage:
      'https://images.unsplash.com/photo-1583753341245-5175f6acfe38?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Orangutan
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
    coverImage:
      'https://images.unsplash.com/photo-1727004135367-05ca2ad5cad0?q=80&w=2081&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Orangutan habitat
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
    coverImage:
      'https://images.unsplash.com/photo-1554205163-e7049e5c39c0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Padar island
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
    coverImage:
      'https://images.unsplash.com/photo-1565970141934-339d18ee310d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ubud rice terrace
    images: [
      'https://images.unsplash.com/photo-1652451160984-f3d710e92cb3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Monkey forest
      'https://images.unsplash.com/photo-1557093793-d149a38a1be8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Temple
      'https://images.unsplash.com/photo-1672128558406-91187c94b33b?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Art gallery
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
    coverImage:
      'https://images.unsplash.com/photo-1480996408299-fc0e830b5db1?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tegallalang rice terrace
    images: [
      'https://images.unsplash.com/photo-1609412058473-c199497c3c5d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Rice paddies
      'https://images.unsplash.com/photo-1559628233-100c798642d4?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Terrace view
      'https://images.unsplash.com/photo-1559628233-e9eb5d83882f?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Palm trees
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
    coverImage:
      'https://images.unsplash.com/photo-1578019448201-09ad2ac7995a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Traditional cone houses
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
    coverImage:
      'https://images.unsplash.com/photo-1653910729824-df4f32c60acf?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Minang architecture
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
    coverImage:
      'https://images.unsplash.com/photo-1675206362603-b3c3c3ca47c6?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tongkonan house
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
    coverImage:
      'https://images.unsplash.com/photo-1573986923130-7c80bc543b35?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Orangutan
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
    coverImage:
      'https://images.unsplash.com/photo-1542163846-abf6a9fe52e2?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Tropical island
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
    coverImage:
      'https://images.unsplash.com/photo-1701157795877-c04cdeca7cbc?w=1200&h=800&fit=crop', // Colonial fort
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
    coverImage:
      'https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200&h=800&fit=crop', // Overwater bungalow
    images: [
      'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&h=600&fit=crop', // Crystal clear water
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop', // Snorkeling
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop', // Secluded beach
    ],
  },
]

export default destinasi
