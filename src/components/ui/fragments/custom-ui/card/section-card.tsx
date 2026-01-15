import { Badge } from '../../shadcn-ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card'
import { cn } from '@/lib/utils'
import { DataCard } from '@/types'

type componentsProps = {
  dataCards: DataCard[]
}

export function SectionCards({ dataCards }: componentsProps) {
  return (
    <div
      className={cn(
        ' grid grid-cols-1 gap-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs  @xl/main:grid-cols-2 ',
        `@5xl/main:grid-cols-4`,
      )}
    >
      {dataCards.map((card, index) => (
        <Card key={index} className="@container/card">
          <CardHeader>
            <CardDescription className="  line-clamp-1">
              {card.title}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <card.icon className="size-4" />
                {card.label}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col  items-start  text-sm">
            <p className="line-clamp-1     font-medium ">{card.description}</p>
            <p className="text-muted-foreground line-clamp-1">
              Tambahkan data {card.label} lagi
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
