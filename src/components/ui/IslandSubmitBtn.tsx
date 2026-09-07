'use client';

import { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export function IslandSubmitBtn({
  staticText,
  loadingText,
  className,
}: {
  staticText: ReactNode;
  loadingText: ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={className}
    >
      {pending ? loadingText : staticText}
    </button>
  );
}
