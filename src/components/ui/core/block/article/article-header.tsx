'use client'
import { ANIMATION_DURATION } from '@/lib/game/constants'
import { ArrowLeft, PlusCircle, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { parseAsString, useQueryState } from 'nuqs'

import { cn } from '@/lib/utils'
import {
  Button,
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'
import { Input } from '@/components/ui/fragments/shadcn-ui/input'
import VerticalCutReveal from '@/components/ui/fragments/custom-ui/animate-ui/vertical-cut'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { authClient } from '@/lib/auth/auth-client'
import CreateArticleSheet from '../../feature/data-table/article/create-article-sheet'


const DEBOUNCE_DELAY = 400 // ms

const ArticleHeader = () => {
  // URL state with nuqs - clean URLs (no default values in URL)
  const [searchParam, setSearchParam] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  )

  // Local state for instant UI updates
  const [inputValue, setInputValue] = useState(searchParam)

  // Sync local state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setInputValue(searchParam)
  }, [searchParam])

  // Debounced URL update
  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    void setSearchParam(value || null) // null clears from URL
  }, DEBOUNCE_DELAY)

  const handleSearchChange = (value: string) => {
    setInputValue(value) // Update UI immediately
    debouncedSetSearch(value) // Update URL after debounce
  }

  const handleClear = () => {
    setInputValue('')
    void setSearchParam(null)
  }
  const { data: session } = authClient.useSession()

  return (
    <div className="  pt-0       container ">
     
      <div className="  flex flex-col md:gap-4  md:justify-between gap-6">
        <header className="w-full md:items-center flex-col md:flex-row flex justify-between m-auto">
          <h1 className="xl:text-[6rem] font-medium  tracking-tight lg:leading-30 lg:text-8xl text-7xl lg:-space-y-10 -space-y-6">
            <VerticalCutReveal
              splitBy="characters"
              staggerDuration={0.05}
              staggerFrom="first"
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 21,
              }}
            >
              Suara
            </VerticalCutReveal>
            <VerticalCutReveal
              splitBy="characters"
              staggerDuration={0.05}
              containerClassName="lg:pl-32 md:pl-16 pl-6 leading-[140%]"
              staggerFrom="first"
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 21,
              }}
            >
              Lokal*
            </VerticalCutReveal>
          </h1>

          <div className="sm:w-96 space-y-1.5 sm:pt-0 pt-2">
            <p className="text-sm font-semibold text-end">
              Setiap tempat punya cerita.
            </p>

            <VerticalCutReveal
              splitBy="words"
              containerClassName=" md:justify-end "
              staggerDuration={0.1}
              staggerFrom="first"
              reverse={true}
              wordLevelClassName="text-sm text-muted-foreground lg:text-base text-justify"
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0,
              }}
            >
              Dengarkan suara hati lokal melalui artikel-artikel inspiratif yang
              menghubungkan budaya, cerita, dan ide-ide segar.
            </VerticalCutReveal>
          </div>
        </header>

        <div className="w-full md:flex  items-center justify-between gap-4 ">
          <div className="relative w-full md:max-w-md">
            <Input
              type="text"
              placeholder="Cari artikel..."
              value={inputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              leftIcon={<Search />}
              clearable
              onClear={handleClear}
              size="lg"
              className="w-full"
            />
          </div>

          {/* Stats */}
          {session ? (
            <>
              <CreateArticleSheet>
                <Button
                  className={cn(
                    ' m-auto md:mr-0 text-sm  mt-3 w-full md:max-w-3xs ',
                  )}
                >
                  Suarakan Ceritamu
                  <PlusCircle />
                </Button>
              </CreateArticleSheet>
            </>
          ) : (
            <Link
              to={'/login'}
              className={cn(
                buttonVariants({ variant: 'default' }),
                ' m-auto md:mr-0 text-sm  mt-3 w-full md:max-w-3xs ',
              )}
            >
              Suarakan Ceritamu
              <PlusCircle />
            </Link>
          )}
        </div>
      </div>

      {/* Search Section */}
    </div>
  )
}

export default ArticleHeader
