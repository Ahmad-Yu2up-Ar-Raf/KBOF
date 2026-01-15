import BorderSvg from '@/components/icons/border-icon'

function SiteBorder() {
  return (
    <div className=" fixed inset-0 z-99 md:z-99    [&_svg]:fill-primary [&_svg]:size-15 [&_svg]:md:size-22 pointer-events-none  flex flex-col justify-between  h-full w-full p-2">
      <div className="flex justify-between  w-full h-fit ">
        <BorderSvg className="   -rotate-90 left-2   " />
        <BorderSvg className="     right-2  " />
      </div>
      <div className="flex justify-between  w-full h-fit ">
        <BorderSvg className=" rotate-180 left-2   " />
        <BorderSvg className="rotate-90      right-2  " />
      </div>
    </div>
  )
}

export default SiteBorder
