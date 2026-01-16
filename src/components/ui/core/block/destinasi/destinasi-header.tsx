'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, PlusCircle, Search } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useQueryState, parseAsString } from 'nuqs'

import { cn } from '@/lib/utils'
import {
  Button,
  buttonVariants,
} from '@/components/ui/fragments/shadcn-ui/button'
import { Input } from '@/components/ui/fragments/shadcn-ui/input'
import VerticalCutReveal from '@/components/ui/fragments/custom-ui/animate-ui/vertical-cut'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { authClient } from '@/lib/auth/auth-client'
import CreateDestinationSheet from '../../feature/data-table/destination/create-destination-sheet'

const DEBOUNCE_DELAY = 400 // ms

const HeaderDestinasi = () => {
  // URL state with nuqs - clean URLs (no default values in URL)
  const [searchParam, setSearchParam] = useQueryState(
    'search',
    parseAsString.withDefault(''),
  )

  // Local state for instant UI updatesq
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
    <div className=" space-y-2    sm:pt-0   container ">
      <div className="  flex flex-col md:gap-4  md:justify-between gap-5">
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
              Suasana
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
              Ruang Destinasi Suasana Lokal
            </p>

            <VerticalCutReveal
              splitBy="words"
              containerClassName=" md:justify-end "
              staggerDuration={0.1}
              staggerFrom="first"
              reverse={true}
              wordLevelClassName="text-sm text-muted-foreground text-rigth lg:text-base text-justify"
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 30,
                delay: 0,
              }}
            >
              Temukan destinasi wisata unik, rasakan kehangatan budaya lokal,
              dan jelajahi pesona tersembunyi di setiap sudut Nusantara.
            </VerticalCutReveal>
          </div>
        </header>

        <div className="w-full md:flex items-center justify-between gap-4 ">
          <div className="relative w-full text-right md:max-w-md">
            <Input
              type="text"
              placeholder="Cari destinasi..."
              value={inputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              leftIcon={<Search />}
              clearable
              onClear={handleClear}
              size="lg"
              className="w-full"
            />
          </div>
          {session ? (
            <CreateDestinationSheet>
              <Button
                className={cn(
                  ' m-auto md:mr-0 text-sm  mt-3 w-full md:max-w-3xs ',
                )}
              >
                Ajukan Destinasi Lokal
                <PlusCircle />
              </Button>
            </CreateDestinationSheet>
          ) : (
            <Link
              to={'/login'}
              className={cn(
                buttonVariants({ variant: 'default' }),
                ' m-auto md:mr-0 text-sm  mt-3 w-full md:max-w-3xs ',
              )}
            >
              Ajukan Destinasi Lokal
              <PlusCircle />
            </Link>
          )}
          {/* Stats */}
        </div>
      </div>

      {/* Search Section */}
    </div>
  )
}

export default HeaderDestinasi
