export type ModalDataMap = {
  createPost: undefined;
  newFeed: undefined;
  settings: undefined;
};

export type ModalType = keyof ModalDataMap;
export type ModalState =
  | { modalType: null; modalData: null }
  | {
      [K in ModalType]: { modalType: K; modalData: ModalDataMap[K] };
    }[ModalType];

export type ModalContextValue = ModalState & {
  openModal: <T extends ModalType>(
    ...args: ModalDataMap[T] extends undefined
      ? [type: T]
      : [type: T, data: ModalDataMap[T]]
  ) => void;
  closeModal: () => void;
};
