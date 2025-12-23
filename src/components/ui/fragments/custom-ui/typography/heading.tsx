import { LucideIcon } from 'lucide-react'

export default function Heading({
  title,
  description,
  Icon,
}: {
  title: string
  description?: string
  Icon?: LucideIcon
}) {
  return (
    <header className=" flex-col mb-8 md:flex-row text-center md:text-left  flex gap-3 md:gap-5 content-center items-center ">
      {Icon && (
        <Icon className=" bg-primary  text-primary-foreground content-center p-2 t rounded-xl size-10" />
      )}
      <div className="  m-auto w-full items-center content-center md:gap-2 ">
        <h1 className=" text-2xl m-auto w-full md:text-3xl font-bold   gap-5 tracking-tighter ">
          {title}
        </h1>
        <p className="text-muted-foreground ">{description}</p>
      </div>
    </header>
  )
}
