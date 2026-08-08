'use client';

import { useModal } from '@/providers/Modal';

export default function ModalRoot() {
  const { modalType } = useModal();

  switch (modalType) {
    case 'createPost':
      return <></>;
    // return <CreatePostModal onClose={closeModal} />;
    case 'settings':
      return <></>;
    // return <SettingsModal onClose={closeModal} />;
  }
}
