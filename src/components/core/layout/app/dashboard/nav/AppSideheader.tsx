'use client'
import { SidebarTrigger } from '@/components/ui/fragments/shadcn-ui/sidebar'

import React from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/fragments/shadcn-ui/breadcrumb'
import { Separator } from '@/components/ui/fragments/shadcn-ui/separator'
import { useLocation } from '@tanstack/react-router'

type TBreadCrumbProps = {
  capitalizeLinks?: boolean
}

export default function DashboardLayoutHeader({
  capitalizeLinks = true,
}: TBreadCrumbProps) {
  const paths = useLocation().pathname
  const pathNames = paths.split('/').filter((path) => path)

  return (
    <header
      className="flex h-15 sticky md:relative top-0 z-40 w-full items-center gap-2 border-b lg:border-b-foreground/10 bg-background/90
px-4 justify-between"
    >
      <div className="flex   bg-none   md:w-max items-center gap-2  ">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <Breadcrumb className="inline-flex">
          <BreadcrumbList>
            {pathNames.map((link, index) => {
              const href = `/${pathNames.slice(0, index + 1).join('/')}`
              const isLast = pathNames.length === index + 1
              const itemLink = capitalizeLinks
                ? link[0].toUpperCase() + link.slice(1, link.length)
                : link
              return (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{itemLink}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} text={itemLink} />
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className="block" />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
