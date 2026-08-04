'use client';

import { useModal } from '@/providers/ModalProvider';

export default function ModalRoot() {
  const { modalType } = useModal();

  switch (modalType) {
    case 'createPost':
      return <></>;
    // return <CreatePostModal onClose={closeModal} />;
  }
}
