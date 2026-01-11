// =============================================================================
// DATABASE RELATIONS - SUASANA
// =============================================================================
// Definisi relasi antar tabel untuk Drizzle ORM
// =============================================================================

import { relations } from 'drizzle-orm'
import {
  user,
  session,
  account,
  destination,
  vote,
  donation,
  comment,
  review,
  article,
} from './schema'

// =============================================================================
// USER RELATIONS
// =============================================================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  destinations: many(destination),
  votes: many(vote),
  donations: many(donation),
  comments: many(comment),
  reviews: many(review),
  articles: many(article),
}))

// =============================================================================
// AUTH RELATIONS
// =============================================================================

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

// =============================================================================
// DESTINATION RELATIONS
// =============================================================================

export const destinationRelations = relations(destination, ({ one, many }) => ({
  user: one(user, {
    fields: [destination.userId],
    references: [user.id],
  }),
  votes: many(vote),
  donations: many(donation),
  comments: many(comment),
  reviews: many(review),
}))

// =============================================================================
// VOTE RELATIONS
// =============================================================================

export const voteRelations = relations(vote, ({ one }) => ({
  user: one(user, {
    fields: [vote.userId],
    references: [user.id],
  }),
  destination: one(destination, {
    fields: [vote.destinationId],
    references: [destination.id],
  }),
}))

// =============================================================================
// DONATION RELATIONS
// =============================================================================

export const donationRelations = relations(donation, ({ one }) => ({
  user: one(user, {
    fields: [donation.userId],
    references: [user.id],
  }),
  destination: one(destination, {
    fields: [donation.destinationId],
    references: [destination.id],
  }),
}))

// =============================================================================
// COMMENT RELATIONS
// =============================================================================

export const commentRelations = relations(comment, ({ one, many }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
  destination: one(destination, {
    fields: [comment.destinationId],
    references: [destination.id],
  }),
  parent: one(comment, {
    fields: [comment.parentId],
    references: [comment.id],
    relationName: 'commentReplies',
  }),
  replies: many(comment, {
    relationName: 'commentReplies',
  }),
}))

// =============================================================================
// REVIEW RELATIONS
// =============================================================================

export const reviewRelations = relations(review, ({ one }) => ({
  user: one(user, {
    fields: [review.userId],
    references: [user.id],
  }),
  destination: one(destination, {
    fields: [review.destinationId],
    references: [destination.id],
  }),
}))

// =============================================================================
// ARTICLE RELATIONS
// =============================================================================

export const articleRelations = relations(article, ({ one }) => ({
  author: one(user, {
    fields: [article.authorId],
    references: [user.id],
  }),
}))
