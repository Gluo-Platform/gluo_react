'use client';

import {
  ModalContextValue,
  ModalDataMap,
  ModalState,
  ModalType,
} from '@/types/modal';
import { createContext, ReactNode, useContext, useState } from 'react';

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({
    modalType: null,
    modalData: null,
  });

  const openModal = <T extends ModalType>(
    modalType: T,
    modalData?: ModalDataMap[T],
  ) => {
    setState({ modalType, modalData });
  };

  const closeModal = () => {
    setState({ modalType: null, modalData: null });
  };

  return (
    <ModalContext.Provider value={{ ...state, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error(`Missing wrapper provider: ${ModalProvider.name}`);
  return ctx;
}
