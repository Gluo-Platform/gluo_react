import ModalRoot from '@/components/ModalRoot';
import Navbar from '@/components/navbar/Navbar';
import TopBar from '@/components/TopBar';
import { ModalProvider } from '@/providers/Modal';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <ModalProvider>
      <Navbar />
      <main className="max-w-112.5 w-full h-full px-4 sm:p-0 mx-auto">
        <TopBar />
        {children}
      </main>
      {/* to be re-thought */}
      <div className="p-6 w-75 hidden absolute top-0 right-0 bottom-0 border-secondary-bg border-l xl:flex flex-col">
        <h2 className="text-2xl my-5">Friends</h2>
        <div></div>
      </div>
      {/*  */}
      <ModalRoot />
    </ModalProvider>
  );
}
