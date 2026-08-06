import { ReactNode } from 'react';

export default function NavbarItem({
  shown,
  children,
}: {
  shown: boolean;
  children: ReactNode;
}) {
  return (
    <nav
      className={`overflow-hidden border-secondary-bg transition-transform duration-300 ${shown ? 'border-t xl:border-r p-6 w-full xl:max-w-67.5 translate-y-0 translate-x-0' : 'w-0 h-0 translate-y-full translate-x-0 xl:-translate-x-full xl:translate-y-0'}`}
    >
      <div className="flex flex-col gap-6 max-w-137.5 lg:max-w-212.5 w-full mx-auto">
        {children}
      </div>
    </nav>
  );
}
