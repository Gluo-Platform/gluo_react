import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import '../../node_modules/@fortawesome/fontawesome-free/css/all.min.css';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gluo',
  // TODO: to be changed
  description: 'Awesome Social Media Platform!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col h-full">{children}</body>
    </html>
  );
}
