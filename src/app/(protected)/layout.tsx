import { getSessionUser } from '@/lib/server/getSessionUser';
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

async function RedirectIfUnauthed() {
  const user = await getSessionUser();
  if (!user) redirect('/');
  return <></>;
}

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense>
        <RedirectIfUnauthed />
      </Suspense>
      {children}
    </>
  );
}
