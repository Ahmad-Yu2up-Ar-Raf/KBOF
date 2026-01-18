'use client'

import { useState } from 'react'
import { MapIcon, MapPin } from 'lucide-react'
import { buttonVariants } from '../shadcn-ui/button'
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from '@/components/ui/fragments/shadcn-ui/map'
import { cn } from '@/lib/utils'

type DestinationMapProps = {
  destinationName?: string
  address?: string
  coordinates?: { lat: number; lng: number }
}

export function DestinationMap({
  destinationName,
  address,
  coordinates,
}: DestinationMapProps) {
  // Google returned "-3.1007891119169773, 119.78311336014957" (lat, lng)
  // Ensure `lat` is the latitude (between -90 and 90) and `lng` is longitude.
  const [draggableMarker] = useState({
    lat: -6.606261535753248,
    lng: 106.79941662468647,
  })

  const markerPos = coordinates
    ? { lng: coordinates.lng, lat: coordinates.lat }
    : draggableMarker

  const center: [number, number] = [markerPos.lng, markerPos.lat]

  const googleQuery = coordinates
    ? `${coordinates.lat},${coordinates.lng}`
    : encodeURIComponent(`${destinationName ?? ''} ${address ?? ''}`.trim())

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${googleQuery}`

  return (
    <div className="">
      <header className="mb-4  flex justify-between w-full  ">
        <h4 className=" flex items-center gap-3 font-semibold tracking-tight">
          <span>Lokasi</span>
        </h4>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: 'link', size: 'sm' }),
            'px-0 py-0 rounded-none text-xs',
          )}
        >
          Lihat di Peta
        </a>
      </header>
      <div className=" rounded-2xl outline-2 p-1     ">
        <div className="  h-60 w-full overflow-hidden rounded-2xl">
          <Map center={center} zoom={12}>
            <MapMarker longitude={markerPos.lng} latitude={markerPos.lat}>
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
