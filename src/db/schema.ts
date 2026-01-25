// =============================================================================
// DATABASE SCHEMA - SUASANA
// =============================================================================
// Platform untuk memperkenalkan ekowisata & budaya lokal Indonesia
// Entitas: user, session, account, verification, category, destination,
//          vote,  comment, article
// =============================================================================

import {
  bigint,
  boolean,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

// =============================================================================
// ENUMS
// =============================================================================

/** User roles for multi-auth system */
export const userRole = pgEnum('user_role', [
  'admin', // Can manage destinations & articles
  'superAdmin', // Full access including user management
])

/** Status konten (published, draft, archived) */
export const contentStatus = pgEnum('content_status', [
  'published',
  'draft',
  'archived',
  'pending',
  'cancel',
])

/** Tipe destinasi wisata/budaya */
export const destinationType = pgEnum('destination_type', [
  'wisata-alam',
  'wisata-budaya',
  'wisata-sejarah',
  'wisata-religi',
  'wisata-kuliner',
  'wisata-bahari',
  'adat-istiadat',
  'kesenian',
  'kerajinan',
  'festival',
])

/** Kategori destinasi (Lokasi Budaya, Pariwisata, Adat Istiadat) */
export const destinationCategory = pgEnum('destination_category', [
  'lokasi-budaya',
  'pariwisata',
  'adat-istiadat',
  'kuliner-tradisional',
  'kesenian-daerah',
  'situs-sejarah',
])

/** Provinsi Indonesia */
export const provinsiIndonesia = pgEnum('provinsi_indonesia', [
  'aceh',
  'sumatera-utara',
  'sumatera-barat',
  'riau',
  'kepulauan-riau',
  'jambi',
  'sumatera-selatan',
  'kepulauan-bangka-belitung',
  'bengkulu',
  'lampung',
  'dki-jakarta',
  'jawa-barat',
  'banten',
  'jawa-tengah',
  'di-yogyakarta',
  'jawa-timur',
  'bali',
  'nusa-tenggara-barat',
  'nusa-tenggara-timur',
  'kalimantan-barat',
  'kalimantan-tengah',
  'kalimantan-selatan',
  'kalimantan-timur',
  'kalimantan-utara',
  'sulawesi-utara',
  'gorontalo',
  'sulawesi-tengah',
  'sulawesi-selatan',
  'sulawesi-barat',
  'sulawesi-tenggara',
  'maluku',
  'maluku-utara',
  'papua',
  'papua-barat',
  'papua-barat-daya',
  'papua-tengah',
  'papua-pegunungan',
  'papua-selatan',
])

// =============================================================================
// AUTH TABLES (Better Auth Compatible)
// =============================================================================

export const user = pgTable(
  'user',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    image: text('image'),

    // =============================================================================
    // ROLE & AUTHENTICATION
    // =============================================================================
    /** User role for access control */
    role: userRole('role').default('admin').notNull(),
    /** Whether user is banned */
    banned: boolean('banned').default(false),
    /** Reason for ban */
    banReason: text('ban_reason'),
    /** Ban expiration date */
    banExpires: timestamp('ban_expires'),

    // =============================================================================
    // ONBOARDING STATUS & PROFILE
    // =============================================================================
    /** Whether user has completed onboarding */
    hasCompletedOnboarding: boolean('has_completed_onboarding')
      .default(false)
      .notNull(),

    // Profile Info (Onboarding Step 1 - Required)
    /** Full name of user */
    fullName: text('full_name'),
    /** Unique username */
    username: text('username'),
    /** User avatar URL */
    avatar: text('avatar'),
    /** Short bio */
    bio: text('bio'),

    // Local Info (Onboarding Step 2 - Optional)
    /** Province of origin */
    province: text('province'),
    /** City/Kabupaten of origin */
    city: text('city'),
    /** User hobbies (JSON array) */
    hobbies: text('hobbies'), // JSON array of strings
    /** User expertise areas (JSON array) */
    expertise: text('expertise'), // JSON array of strings
    /** Motivation for joining */
    motivation: text('motivation'),

    // Preferences (Onboarding Step 3 - Optional)
    /** Favorite destination categories (JSON array) */
    favoriteCategories: text('favorite_categories'), // JSON array
    /** Interested destination types (JSON array) */
    interestedTypes: text('interested_types'), // JSON array
    /** Notification preferences (JSON object) */
    notificationPreferences: text('notification_preferences'), // JSON object

    // =============================================================================
    // TIMESTAMPS
    // =============================================================================
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('user_email_key').on(table.email),
    unique('user_username_key').on(table.username),
    index('user_role_idx').on(table.role),
  ],
)

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
)

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
)

// =============================================================================
// DESTINATION TABLE (Wisata & Budaya Lokal)
// =============================================================================

export const destination = pgTable(
  'destination',
  {
    id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
      name: 'destination_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    // Owner - setiap user punya destinations sendiri
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    // Basic info
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    // Type & Category
    type: destinationType('type').default('wisata-alam').notNull(),
    category: destinationCategory('category').default('pariwisata').notNull(),
    // Location - using enum for provinsi
    provinsi: provinsiIndonesia('provinsi').default('jawa-tengah').notNull(),
    kabupatenKota: text('kabupaten_kota'),
    alamat: text('alamat'),
    // Media
    coverImage: text('cover_image').notNull(),
    images: text('images').default('[]'), // JSON array of image URLs
    // Note: totalVote, totalReview, averageRating are calculated from relations (vote, review tables)

    // Status
    status: contentStatus('status').default('pending').notNull(),
    // Published timestamp - set when superAdmin publishes
    publishedAt: timestamp('published_at', { withTimezone: true }),
    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('destination_slug_key').on(table.slug),
    index('destination_userId_idx').on(table.userId),
    index('destination_type_idx').on(table.type),
    index('destination_category_idx').on(table.category),
    index('destination_provinsi_idx').on(table.provinsi),
    index('destination_status_idx').on(table.status),
  ],
)

// =============================================================================
// VOTE TABLE
// =============================================================================

export const vote = pgTable(
  'vote',
  {
    id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
      name: 'vote_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    destinationId: bigint('destination_id', { mode: 'number' })
      .notNull()
      .references(() => destination.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    unique('vote_user_destination_key').on(table.userId, table.destinationId),
    index('vote_userId_idx').on(table.userId),
    index('vote_destinationId_idx').on(table.destinationId),
  ],
)

// =============================================================================
// COMMENT TABLE
// =============================================================================

export const comment = pgTable(
  'comment',
  {
    id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
      name: 'comment_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    destinationId: bigint('destination_id', { mode: 'number' })
      .notNull()
      .references(() => destination.id, { onDelete: 'cascade' }),
    parentId: bigint('parent_id', { mode: 'number' }),
    content: text('content').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('comment_userId_idx').on(table.userId),
    index('comment_destinationId_idx').on(table.destinationId),
    index('comment_parentId_idx').on(table.parentId),
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'comment_parent_fkey',
    })
      .onUpdate('cascade')
      .onDelete('cascade'),
  ],
)

// =============================================================================
// REVIEW TABLE
// =============================================================================

export const review = pgTable(
  'review',
  {
    id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
      name: 'review_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    destinationId: bigint('destination_id', { mode: 'number' })
      .notNull()
      .references(() => destination.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(), // 1-5 stars
    title: text('title'),
    content: text('content'),
    visitDate: timestamp('visit_date', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('review_user_destination_key').on(table.userId, table.destinationId),
    index('review_userId_idx').on(table.userId),
    index('review_destinationId_idx').on(table.destinationId),
    index('review_rating_idx').on(table.rating),
  ],
)

// =============================================================================
// ARTICLE TABLE
// =============================================================================

export const article = pgTable(
  'article',
  {
    id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity({
      name: 'article_id_seq',
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    coverImage: text('cover_image'),
    status: contentStatus('status').default('draft').notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique('article_slug_key').on(table.slug),
    index('article_authorId_idx').on(table.authorId),
    index('article_status_idx').on(table.status),
  ],
)

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert

export type Session = typeof session.$inferSelect
export type Account = typeof account.$inferSelect
export type Verification = typeof verification.$inferSelect

export type Destination = typeof destination.$inferSelect
export type NewDestination = typeof destination.$inferInsert
export type DestinationType = (typeof destinationType.enumValues)[number]
export type DestinationCategory =
  (typeof destinationCategory.enumValues)[number]
export type DestinationStatus = (typeof contentStatus.enumValues)[number]
export type ProvinsiIndonesia = (typeof provinsiIndonesia.enumValues)[number]
export type UserRoleType = (typeof userRole.enumValues)[number]

export type Vote = typeof vote.$inferSelect
export type NewVote = typeof vote.$inferInsert

export type Review = typeof review.$inferSelect
export type NewReview = typeof review.$inferInsert

export type Comment = typeof comment.$inferSelect
export type NewComment = typeof comment.$inferInsert

export type Article = typeof article.$inferSelect
export type NewArticle = typeof article.$inferInsert
