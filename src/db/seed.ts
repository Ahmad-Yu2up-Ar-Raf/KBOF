// =============================================================================
// DATABASE SEEDER - SUASANA
// =============================================================================
// Comprehensive seeder for wisata & budaya Indonesia
// Run: npm run db:seed (or npx tsx src/db/seed.ts)
// =============================================================================

import 'dotenv/config'
import { randomBytes, scrypt } from 'node:crypto'
import { promisify } from 'node:util'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import seedUsers from '@/config/data/users.json'
import articleData from '@/config/data/artikel.json'
import destinasi from '@/config/data/destinasi'
import reviewTemplates from '@/config/data/review-templates.json'
import defaultReviews from '@/config/data/default-review.json'
import {
  account,
  article,
  destination,
  review,
  session,
  user,
  verification,
  vote,
} from './schema'
import type {
  destinationCategory,
  destinationType,
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
  images: Array<string> // Gallery images (3 recommended)
}> = destinasi as Array<{
  name: string
  description: string
  type: (typeof destinationType.enumValues)[number]
  category: (typeof destinationCategory.enumValues)[number]
  provinsi: (typeof provinsiIndonesia.enumValues)[number]
  kabupatenKota?: string
  coverImage: string
  images: string[]
}>

// =============================================================================
// REVIEW TEMPLATES - Relevan dengan tipe destinasi (minimal 15 per tipe)
// =============================================================================

// Normalize imported review templates JSON which may be an array wrapping a single
// object. We want a plain Record<string, ReviewTemplate[]>
type ReviewTemplate = { rating: number; title: string; content: string }
const reviewTemplatesMap: Record<string, ReviewTemplate[]> =
  Array.isArray(reviewTemplates) && reviewTemplates.length > 0
    ? (reviewTemplates[0] as unknown as Record<string, ReviewTemplate[]>)
    : (reviewTemplates as unknown as Record<string, ReviewTemplate[]>)

const defaultReviewsTyped: ReviewTemplate[] =
  defaultReviews as unknown as ReviewTemplate[]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function generateSlug(name: string, index: number): string {
  return `${name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()}-${index + 1}-${nanoid(6)}`
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomElement<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)]
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
      const dest = destinationData[i]
      const owner = getRandomElement(createdUsers)
      const slug = generateSlug(dest.name, i)
      try {
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
            images: JSON.stringify(
              dest.images.map((img) => normalizeUnsplashUrl(img, 800)),
            ),
            status: 'published',
            createdAt: new Date(
              Date.now() - getRandomInt(0, 365 * 24 * 60 * 60 * 1000),
            ),
            publishedAt: new Date(), // Selalu waktu sekarang
            updatedAt: new Date(),
          })
          .returning({ id: destination.id })
        if (created) {
          createdDestinations.push({ id: created.id, name: dest.name })
        }
      } catch (e) {
        console.error(`   ⚠ Destination error: ${dest.name} -`, e)
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
      const numVotes = getRandomInt(
        minVotes,
        Math.min(createdUsers.length, maxVotes),
      )
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

    let articleCount = 0
    for (const art of articleData) {
      const author = getRandomElement(createdUsers)
      const slug = generateSlug(art.title, articleCount)
      const status = 'published'
      try {
        await db.insert(article).values({
          authorId: author.id,
          slug,
          title: art.title,
          excerpt: art.excerpt,
          content: art.content,
          coverImage: normalizeUnsplashUrl(art.coverImage, 1200),
          status,
          publishedAt: new Date(), // Selalu waktu sekarang
          createdAt: new Date(
            Date.now() - getRandomInt(0, 365 * 24 * 60 * 60 * 1000),
          ),
          updatedAt: new Date(),
        })
        articleCount++
      } catch (e) {
        console.error(`   ⚠ Article error: ${art.title} -`, e)
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

      // Get templates for this destination type (use the normalized map)
      const templates = reviewTemplatesMap[destType] ?? defaultReviewsTyped

      // Each destination gets 10-15 random reviews with NO duplicate content
      const numReviews = getRandomInt(10, Math.min(templates.length, 15))
      const shuffledUsers = [...createdUsers].sort(() => Math.random() - 0.5)
      const reviewers = shuffledUsers.slice(0, numReviews)

      // Shuffle templates and take unique ones for this destination
      const shuffledTemplates = [...templates].sort(() => Math.random() - 0.5)
      const uniqueTemplates = shuffledTemplates.slice(0, numReviews)

      for (let i = 0; i < reviewers.length; i++) {
        const reviewer = reviewers[i]
        // Use unique template for each reviewer (no duplicate content in same destination)
        const template = uniqueTemplates[i] ?? uniqueTemplates[0]

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
