// =============================================================================
// INFINITE SCROLL CONTEXT - SUASANA
// =============================================================================
// Context to share infinite scroll state with layout components (footer)
// Footer will only show when all data is loaded (hasNextPage = false)
// =============================================================================

import React, { createContext, useCallback, useContext, useState } from 'react'

interface InfiniteScrollContextValue {
  /** Whether there's more data to load */
  hasMoreData: boolean
  /** Whether data is currently loading */
  isLoading: boolean
  /** Register page as having infinite scroll */
  registerInfiniteScroll: (hasMore: boolean, loading: boolean) => void
  /** Unregister when leaving the page */
  unregisterInfiniteScroll: () => void
  /** Whether a page with infinite scroll is currently active */
  isInfiniteScrollPage: boolean
}

const InfiniteScrollContext = createContext<
  InfiniteScrollContextValue | undefined
>(undefined)

export function InfiniteScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [hasMoreData, setHasMoreData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInfiniteScrollPage, setIsInfiniteScrollPage] = useState(false)

  const registerInfiniteScroll = useCallback(
    (hasMore: boolean, loading: boolean) => {
      setHasMoreData(hasMore)
      setIsLoading(loading)
      setIsInfiniteScrollPage(true)
    },
    [],
  )

  const unregisterInfiniteScroll = useCallback(() => {
    setHasMoreData(false)
    setIsLoading(false)
    setIsInfiniteScrollPage(false)
  }, [])

  return (
    <InfiniteScrollContext.Provider
      value={{
        hasMoreData,
        isLoading,
        registerInfiniteScroll,
        unregisterInfiniteScroll,
        isInfiniteScrollPage,
      }}
    >
      {children}
    </InfiniteScrollContext.Provider>
  )
}

export function useInfiniteScrollContext() {
  const context = useContext(InfiniteScrollContext)
  if (!context) {
    throw new Error(
      'useInfiniteScrollContext must be used within InfiniteScrollProvider',
    )
  }
  return context
}

/**
 * Hook to check if footer should be shown
 * Returns true if:
 * - Not on an infinite scroll page, OR
 * - On infinite scroll page but all data is loaded (hasNextPage = false)
 */
export function useShouldShowFooter() {
  const { hasMoreData, isLoading, isInfiniteScrollPage } =
    useInfiniteScrollContext()

  // Show footer if:
  // 1. Not an infinite scroll page
  // 2. OR all data is loaded (no more data and not loading)
  if (!isInfiniteScrollPage) return true
  return !hasMoreData && !isLoading
}
