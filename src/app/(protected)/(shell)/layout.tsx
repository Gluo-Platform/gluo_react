import AppShell from '@/components/AppShell';
import { ReactNode } from 'react';

export const instant = false;

export default function ShellLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
