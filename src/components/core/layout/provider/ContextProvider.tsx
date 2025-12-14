    // ModalContext.js
    import React, { createContext, useState, useContext } from 'react';
    type ModalPayload = { redirectTo?: string } | null;
interface ModalContextValue {
  isOpen: boolean;
  payload: ModalPayload;
  open: (payload?: ModalPayload) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | undefined>(undefined);
 
export const ModalProvider = ({ children }: { children:  React.ReactNode}) => {
     const [isOpen, setIsOpen] = useState(false);
  const [payload, setPayload] = useState<ModalPayload>(null);

  const open = (p?: ModalPayload) => {
    setPayload(p ?? null);
    setIsOpen(true);
    // lock body scroll if needed
  
  };

  const close = () => {
    setIsOpen(false);
    setPayload(null);

  };

      return (
          <ModalContext.Provider value={{ isOpen, payload, open, close }}>
      {children}
    </ModalContext.Provider>
      );
    };

 export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};