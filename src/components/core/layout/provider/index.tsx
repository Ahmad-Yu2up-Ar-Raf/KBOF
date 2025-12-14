'use client';
import { AnimatePresence } from 'framer-motion';
import SiteFooter from '../header/SiteFooter';
import { cn } from '@/lib/utils';
import ReactLenis from 'lenis/react';
import { ModalProvider } from './ContextProvider'; 
import { ProgressProvider } from '@bprogress/react';
// import { SiteHeader } from '../header/SiteHeader';
// import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/fragments/shadcn-ui/sonner';


const Providers = ({ children }: { children: React.ReactNode  }) => {

const disable = [   '/login'  , '/register' , '/dashboard']
const currentPath = useLocation().pathname;
    console.log(currentPath)
   const isDisabled = disable.some(prefix => currentPath.startsWith(prefix))
//  const isMobile = useIsMobile()
    return (
  <ReactLenis root>

  <ProgressProvider 
          height="2px"
          color="var(--primary)"
          options={{ 
            showSpinner: false,
            minimum: 0.3,
            easing: 'ease',
            speed: 200,
          }}
          shallowRouting
        >

            <ModalProvider>


                <AnimatePresence  >
       

 
                <Toaster/>
               
                    <div 
                        key="main-content" 
                        className={cn("relative  min-h-dvh w-full overflow-hidden  content-center" ,

                          
                        )}
                    >
                        <div className={cn("mx-auto flex flex-col gap-13   lg:gap-25   h-full w-full", 



                        ) }>
                    
            {children}
              
                
                        </div>
                    </div>
                    
              
                </AnimatePresence>
    
                { !isDisabled  && (
<>

 
   <SiteFooter/>
</>
                )}
             
          
            </ModalProvider>
        </ProgressProvider>
  </ReactLenis>
 

    );
};

export default Providers;