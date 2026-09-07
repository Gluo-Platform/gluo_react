import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import './globals.css';
import { SessionProvider } from '@/providers/Session';
import { getSessionUser } from '@/lib/server/getSessionUser';
import { QueryProvider } from '@/providers/Query';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gluo',
  // TODO: to be changed
  description: 'Awesome Social Media Platform!',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // note to self: the app is now dynamically rendered
  // need to reclaim static generation for parts that aren't
  // dependent on the cookie
  const initialUser = await getSessionUser();

  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col h-full">
        <QueryProvider>
          <SessionProvider initialUser={initialUser}>
            {children}
          </SessionProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
