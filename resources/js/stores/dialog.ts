import { create } from 'zustand'
import { ModalProps } from '@shopify/polaris'

interface DialogProps extends Omit<ModalProps, 'open' | 'onClose'> {
    open?: boolean
    onClose?: () => void
}

interface DialogState {
    queue: DialogProps[]
    addDialog: (dialog: DialogProps) => void
    removeDialog: () => void
}

export const useDialog = create<DialogState>((set) => ({
    queue: [],
    addDialog: (dialog: DialogProps) => set((state) => ({ queue: [...state.queue, dialog] })),
    removeDialog: () => set((state) => ({ queue: state.queue.slice(0, -1) })),
}))
