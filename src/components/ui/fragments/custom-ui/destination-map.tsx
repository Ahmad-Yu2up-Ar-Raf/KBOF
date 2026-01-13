'use client'

import { useState } from 'react'
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from '@/components/ui/fragments/shadcn-ui/map'
import { MapIcon, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '../shadcn-ui/button'
import { Link } from '@tanstack/react-router'

export function DestinationMap() {
  const [draggableMarker] = useState({
    lng: -73.98,
    lat: 40.75,
  })

  return (
    <div className="">
      <header className="mb-4  flex justify-between w-full  ">
        <h4 className=" flex items-center gap-3 font-semibold tracking-tight">
          <span>Lokasi</span>
        </h4>
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: 'link', size: 'sm' }),
            'px-0 py-0 rounded-none text-xs',
          )}
        >
          Lihat di Peta
        </Link>
      </header>
      <div className=" rounded-2xl outline-2 p-2      ">
        <div className="  h-40 w-full overflow-hidden rounded-2xl">
          <Map center={[-73.98, 40.75]} zoom={12}>
            <MapMarker
              longitude={draggableMarker.lng}
              latitude={draggableMarker.lat}
            >
              <MarkerContent>
                <div className="cursor-move">
                  <MapPin
                    className="fill-primary stroke-primary-foreground  "
                    size={28}
                  />
                </div>
              </MarkerContent>
              <MarkerPopup>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Coordinates</p>
                  <p className="text-xs text-muted-foreground">
                    {draggableMarker.lat.toFixed(4)},{' '}
                    {draggableMarker.lng.toFixed(4)}
                  </p>
                </div>
              </MarkerPopup>
            </MapMarker>
          </Map>
        </div>
      </div>
    </div>
  )
}
