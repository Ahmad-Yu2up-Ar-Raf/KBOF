"use client"; 
import { cn } from "@/lib/utils";
import { useLottie } from "lottie-react";
import * as React from "react";
import { Logo } from "../header/app-logo";
import animationData from "@/config/assets/animations/Phoenix.json";
import { ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/fragments/shadcn-ui/button";
import { Link } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/fragments/shadcn-ui/spinner";
import { Icons } from "@/components/ui/fragments/svg/brand-icon";
import { signInGoogle } from "@/hooks/actions/auth/use-auth-form";
 
type AuthLayoutProps = {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  quote?: string;
  loading?: boolean;
  className?: string;
  numberOfIterations?: number;
  formType?: "login" | "register";
  signInGoogleButton? :  boolean
};

const AuthLayoutTemplate = ({
  formType,
  numberOfIterations,
  className,
  loading = false,
  signInGoogleButton = true,
  title = `Selamat Datang`,
  quote = `Gagasmu bukan cuma wacana — jadikan aksi.`,
  description = `Perjalanan akan segera dimulai `,
  ...props
}: AuthLayoutProps) => {
  const formTypeLabel = formType == "register" ? "login" : "register";
  const formTypeLink = formType == "register" ? "login" : "register";
    
      const lottieOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };
      const style = { width:  "100%", height: "100%" , margin: "auto"  , }; // atur sesuai kebutuhan
   const { View } = useLottie(lottieOptions, style);
 
  return (
    <>
         
    <div className=" relative min-h-lvh h-lvh flex items-center justify-center overflow-hidden ">
      <div
        className={cn(
          "  w-full relative max-w-lg  overflow-hidden flex flex-col  lg:flex-row shadow-xl lg:max-w-none h-lvh",
          className
        )}>
           <nav
      
      
              className='z-999999  left-7  absolute  top-4 bg-background/95 backdrop-blur   flex items-center   '>
      
              <Link to="/" className={cn(buttonVariants({ variant: "link" }), '  flex   has-[>svg]:px-0   w-fit py-2 md:flex  text-base items-center gap-3 px-0  group transition-colors')}>
                <ArrowLeft className=" size-5  group-hover:-translate-x-1  group-hover:transform transition-all ease-out duration-300" />
                <span className=''>Kembali </span>
              </Link>
              
            </nav>
   

        <main
          className={cn(
            "p-8 lg:w-1/2 justify-center items-center  lg:m-auto h-full content-center relative bg-background z-100 text-secondary-foreground overflow-visible "
          )}>
          <div className=" justify-center  max-w-sm flex m-auto flex-col h-full">
            <div className="flex text-center flex-col   items-left mb-4">
             
             <div className="  m-auto  w-50 h-42 ">
              {  View}
              </div> 

              <div className={cn("relative sr-only  hidden lg:inline-flex mb-6 md:ml-0 m-auto")}>
               
                <Logo className="size-12 opacity-0 transition-transform ease-in-out duration-500 dark:opacity-100" />
              </div>
          

              <h2 className=" text-xl lg:text-2xl mt-3 mb-1 font-medium  tracking-tight">
                {title}
              </h2>
              <p className=" line-clamp-1 text-sm opacity-80">{description}</p>
            </div>
    
          {
            signInGoogleButton && (
              <>
      <Button onClick={signInGoogle} variant="ghost" type="button" className="border border-input/80" disabled={loading}>
      {loading ? (
          <Spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
       <div className="relative my-4 ">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Atau lanjutkan dengan
          </span>
        </div>
      </div>
              </>
            )
          }
            {/* Form content area */}
            {props.children}
         
              <>

              </>
     
            {formType && (
              <div className="text-center cursor-target  mt-4 text-muted-foreground text-sm">
                {formType == "register"
                  ? `Sudah punya akun? `
                  : "Belum punya akun? "}
                <Link
                  aria-disabled={loading}
                  tabIndex={!loading ? -1 : undefined}
                  to={`/${formTypeLink}`}
                  className={cn(
                    "text-secondary-foreground capitalize font-medium underline",
                    loading
                      ? "pointer-events-none cursor-none text-foreground/50"
                      : ""
                  )}>
                  {formTypeLabel}
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
    
    </>
  );
};

export default AuthLayoutTemplate;