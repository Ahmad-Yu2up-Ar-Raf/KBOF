# Leaderboard Feature - Implementation Summary

## 📁 Files Created/Modified

### New Files Created:

1. `src/lib/server/leaderboard/leaderboard-server-queries.ts` - Server functions
2. `src/lib/validations/leaderboard-validations.ts` - Zod schemas & nuqs parsers
3. `src/routes/leaderboard/index.tsx` - Leaderboard route with UI

### Modified Files:

1. `src/lib/query-options.ts` - Added leaderboard query keys & options
2. `src/routes/index.tsx` - Added loader for homepage top destinations
3. `src/components/ui/core/block/hero-section.tsx` - Integrated leaderboard top data

---

## 🔑 Query Keys Structure

```typescript
export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  list: (filters) => [...leaderboardKeys.all, 'list', filters] as const,
  top: (limit) => [...leaderboardKeys.all, 'top', limit] as const,
  podium: (filters) => [...leaderboardKeys.all, 'podium', filters] as const,
}
```

---

## 📊 API Response Shapes

### LeaderboardEntry

```typescript
{
  rank: number
  destinationId: number
  slug: string
  name: string
  description: string
  coverImage: string | null
  voteCount: number
  category: DestinationCategory
  type: DestinationType
  provinsi: ProvinsiIndonesia
  kabupatenKota: string | null
  user: { id: string, name: string, image: string | null }
}
```

### LeaderboardResult (paginated list)

```typescript
{
  data: LeaderboardEntry[]
  totalCount: number
  hasMore: boolean
  categoryCounts: Record<string, number>
  typeCounts: Record<string, number>
  provinceCounts: Record<string, number>
}
```

### LeaderboardTopEntry (homepage widget)

```typescript
{
  id: number
  slug: string
  name: string
  coverImage: string | null
  voteCount: number
}
```

---

## 🔗 URL Patterns (nuqs)

### Leaderboard Page

- Default: `/leaderboard`
- With filters: `/leaderboard?categories=pariwisata,lokasi-budaya&page=2`
- With type filter: `/leaderboard?types=wisata-alam,wisata-budaya`
- With province: `/leaderboard?provinces=bali,jawa-barat`
- Combined: `/leaderboard?categories=pariwisata&types=wisata-alam&provinces=bali&page=1&perPage=20`

---

## 🗃️ SQL/Drizzle Aggregation Query

```typescript
// Vote count subquery
const voteCountsSubquery = db
  .select({
    destinationId: vote.destinationId,
    voteCount: count().as('vote_count'),
  })
  .from(vote)
  .groupBy(vote.destinationId)
  .as('vote_counts')

// Main leaderboard query
const results = await db
  .select({
    destinationId: destination.id,
    slug: destination.slug,
    name: destination.name,
    coverImage: destination.coverImage,
    voteCount: sql<number>`COALESCE(${voteCountsSubquery.voteCount}, 0)`,
    // ... other fields
  })
  .from(destination)
  .leftJoin(user, eq(destination.userId, user.id))
  .leftJoin(
    voteCountsSubquery,
    eq(destination.id, voteCountsSubquery.destinationId),
  )
  .where(and(...whereConditions))
  .orderBy(desc(sql`COALESCE(${voteCountsSubquery.voteCount}, 0)`))
  .limit(limit)
  .offset(offset)
```

---

## 📇 Recommended Database Indices

```sql
-- Already exist in schema.ts (confirmed):
CREATE INDEX destination_category_idx ON destination(category);
CREATE INDEX destination_type_idx ON destination(type);
CREATE INDEX destination_provinsi_idx ON destination(provinsi);
CREATE INDEX destination_status_idx ON destination(status);
CREATE INDEX vote_destinationId_idx ON vote(destination_id);

-- Optional: For faster leaderboard queries with ordering
CREATE INDEX vote_destination_count_idx ON vote(destination_id) INCLUDE (id);
```

---

## 💡 Client Usage Examples

### Using in Route Loader (SSR Prefetch)

```typescript
export const Route = createFileRoute('/leaderboard/')({
  loader: async () => {
    await Promise.all([
      queryClient.ensureQueryData(
        getLeaderboardPodiumQueryOptions(podiumFilters),
      ),
      queryClient.ensureQueryData(getLeaderboardQueryOptions(listFilters)),
    ])
  },
  component: LeaderboardPage,
})
```

### Using in Component with useSuspenseQuery

```typescript
function LeaderboardPage() {
  const { data } = useSuspenseQuery(getLeaderboardQueryOptions(filters))
  // data is never undefined - guaranteed by loader
}
```

### Using useQuery (with loading state)

```typescript
function SomeWidget() {
  const { data, isLoading } = useQuery(getLeaderboardTopQueryOptions(4))
  if (isLoading) return <Skeleton />
  // ...
}
```

---

## 🔄 Cache Invalidation

After a vote is added/removed:

```typescript
import { invalidateAllLeaderboardQueries } from '@/lib/query-options'

// In vote mutation hook:
await invalidateAllLeaderboardQueries(queryClient)
```

---

## ✅ Testing Checklist

### 1. Top 4 on Homepage

- [ ] Navigate to `/`
- [ ] Verify floating images show top destination covers (if available)
- [ ] Check browser DevTools Network tab for `getLeaderboardTopServerFn` call

### 2. Top 3 Podium on Leaderboard

- [ ] Navigate to `/leaderboard`
- [ ] Verify podium shows 3 cards (1st larger in center)
- [ ] Check vote counts are displayed correctly

### 3. Paginated List

- [ ] Scroll below podium to see full list
- [ ] Click pagination buttons
- [ ] Verify page changes and data updates

### 4. Filter by Category

- [ ] Click category badges to toggle filter
- [ ] Verify URL updates (e.g., `?categories=pariwisata`)
- [ ] Verify results match selected category

### 5. Filter Combinations

- [ ] Apply multiple filters (category + type)
- [ ] Verify AND semantics (results match ALL filters)

### 6. Vote Invalidation

- [ ] Vote for a destination
- [ ] Navigate to leaderboard
- [ ] Verify vote count updated
- [ ] Verify ranking may have changed

### 7. Performance Check

```sql
-- Verify indices are used:
EXPLAIN ANALYZE
SELECT d.*, COUNT(v.id) as vote_count
FROM destination d
LEFT JOIN vote v ON d.id = v.destination_id
WHERE d.status = 'published'
GROUP BY d.id
ORDER BY vote_count DESC
LIMIT 10;
```

---

## 🎯 Best Practice Rationale

1. **Server-side Aggregation**: Vote counting done in SQL for performance. Avoids fetching all votes to client.

2. **Route Loader**: Prefetches data on navigation for instant page loads. Data is ready before component renders.

3. **Query Keys with Filters**: Each unique filter combination gets its own cache entry. Changing filters = new query, not stale data.

4. **Unified Query Keys Factory**: All leaderboard queries share `leaderboardKeys.all` base. Single `invalidateQueries({ queryKey: leaderboardKeys.all })` clears everything.

5. **nuqs for URL State**: Filters persist in URL. Users can share/bookmark filtered views. Browser back/forward works correctly.

---

## 🚀 Future Improvements (Optional)

1. **Pre-aggregated Tallies**: For very large datasets, maintain `total_vote` column on destination table, updated via triggers/queue.

2. **Time-based Leaderboard**: Add `scope: 'weekly' | 'monthly'` filter by adding date conditions on votes.

3. **Cursor Pagination**: Replace offset with cursor for infinite scroll on leaderboard.

4. **Real-time Updates**: Use TanStack Query's `refetchInterval` or WebSocket for live vote count updates.
