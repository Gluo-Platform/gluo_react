import { ReactNode } from 'react';

export default function Overlay({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-8"
      onClick={onClose}
    >
      <div
        className="bg-background rounded-lg p-6 w-full h-[90vh] md:max-w-150 md:max-h-125"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
