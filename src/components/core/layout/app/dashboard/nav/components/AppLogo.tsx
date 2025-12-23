import { Logo } from '../../../../../../icons/AppLogoIcon'

export default function AppLogo() {
  const appName = import.meta.env.VITE_APP_NAME
  return (
    <>
      <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-sidebar-primary  ">
        <Logo
          fillCustom="var(--primary-foreground)"
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
