import React, { Fragment, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface DrawerProps {
    children: ReactNode;
    title: string;
    description?: string;
    onClose: () => void;
    open: boolean;
    trigger?: ReactNode;
    footer?: ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({
    children,
    title,
    description,
    onClose,
    open,
    trigger,
    footer
}) => {
    return (
        <>
            {trigger}
            {createPortal(
                <Fragment>
                    <div
                        className={`fixed inset-y-0 right-0 z-50 pt-12 flex transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    >
                        <div className="min-w-[200px] w-fit bg-white shadow-xl flex flex-col h-full">
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-white border-b p-4 flex flex-col">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">{title}</h2>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                </div>
                                {description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                {children}
                            </div>

                            {/* Footer */}
                            {footer && (
                                <div className="sticky bottom-0 bg-white border-t p-4">
                                    {footer}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Backdrop */}
                    <div
                        className={`fixed inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}
                        onClick={onClose}
                    />
                </Fragment>,
                document.body
            )}
        </>
    );
};

export default Drawer;
