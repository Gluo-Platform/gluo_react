import ModalRoot from '@/components/ModalRoot';
import { ModalProvider } from '@/providers/Modal';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      {children}
      <ModalRoot />
    </ModalProvider>
  );
}
