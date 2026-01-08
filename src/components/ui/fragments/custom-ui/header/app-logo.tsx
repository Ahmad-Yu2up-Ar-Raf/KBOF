import { Link } from '@tanstack/react-router'
import { Logo } from '../../../../icons/app-logo-icon'
const appName = import.meta.env.VITE_APP_NAME

export default function AppLogo() {
  return (
    <>
      <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary  ">
        <Logo
          customFill="var(--primary-foreground)"
          className="size-5    text-pink-50 "
        />
      </div>
      <div className="ml-1 grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate leading-tight font-semibold">
          {appName}
        </span>
      </div>
    </>
  )
}

export const NavbarLogo = () => {
  return (
    <Link
      to="/"
      className="relative  z-20  flex items-center space-x-1.5 lg:space-x-2   py-1 md:text-sm text-xs font-normal text-black"
    >
      <Logo className=" lg:size-8 size-6" />

      <span className="font-bold   text-sm  lg:text-lg text-accent-foreground">
        {appName}
      </span>
    </Link>
  )
}
