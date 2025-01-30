import { useDialog } from "@/stores/dialog"
import { Modal } from "@shopify/polaris"
import { useState, useEffect } from "react"

export function DialogHandler() {
    const { queue, removeDialog } = useDialog()
    const [isClosing, setIsClosing] = useState(false)
    const [visibleDialog, setVisibleDialog] = useState(queue[queue.length - 1])

    // Update visible dialog when queue changes (new dialog added)
    useEffect(() => {
        if (queue.length > 0) {
            setVisibleDialog(queue[queue.length - 1])
            setIsClosing(false)
        }
    }, [queue])

    if (queue.length === 0 && !isClosing) return null

    const { onClose, primaryAction, secondaryActions, ...currentDialog } = visibleDialog || {}

    const handleClose = async () => {
        setIsClosing(true)
        onClose?.()

        // Wait for the Polaris Modal animation
        setTimeout(() => {
            removeDialog()
            setIsClosing(false)
        }, 250) // Polaris Modal animation duration
    }

    // Wrap the primary action to handle undefined onAction
    const wrappedPrimaryAction = primaryAction ? {
        ...primaryAction,
        onAction: async () => {
            await primaryAction.onAction?.()
            handleClose()
        }
    } : primaryAction

    // Wrap the secondary actions to handle undefined onAction
    const wrappedSecondaryActions = secondaryActions?.map(action => ({
        ...action,
        onAction: async () => {
            await action.onAction?.()
            handleClose()
        }
    }))

    return (
        <div className={`dialog-handler fixed inset-0 flex items-center justify-center`}>
            {visibleDialog && (
                <Modal
                    open={!isClosing}
                    onClose={handleClose}
                    primaryAction={wrappedPrimaryAction}
                    secondaryActions={wrappedSecondaryActions}
                    {...currentDialog}
                >
                    <Modal.Section>
                        {currentDialog.children}
                    </Modal.Section>
                </Modal>
            )}
        </div>
    )
}
