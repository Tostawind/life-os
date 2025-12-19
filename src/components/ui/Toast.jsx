
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

import { createPortal } from "react-dom";

export default function Toast({ toast, onClose }) {
    const [isExiting, setIsExiting] = React.useState(false);

    // Reset exit state when toast changes
    useEffect(() => {
        setIsExiting(false);
    }, [toast]);

    // Handle closing with animation
    const handleClose = React.useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 300); // Match animation duration
    }, [onClose]);

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(handleClose, 4000);
        return () => clearTimeout(timer);
    }, [toast, handleClose]);

    if (!toast) return null;

    const styles = {
        success: 'border-emerald-500 text-emerald-800 bg-emerald-50/50',
        error: 'border-rose-500 text-rose-800 bg-rose-50/50',
        info: 'border-blue-500 text-blue-800 bg-blue-50/50',
    };

    const icons = {
        success: <CheckCircle className="w-8 h-8 text-emerald-500" />,
        error: <AlertCircle className="w-8 h-8 text-rose-500" />,
        info: <Info className="w-8 h-8 text-blue-500" />,
    };

    return createPortal(
        <div className="fixed top-6 left-0 w-full flex justify-center md:justify-end md:px-6 z-[9999] pointer-events-none">
            <div
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl bg-white shadow-2xl border-l-[6px] backdrop-blur-sm pointer-events-auto w-[calc(100%-32px)] md:w-auto md:max-w-sm transition-all duration-300 ${isExiting ? 'animate-toast-out' : 'animate-toast-in'} ${styles[toast.type] || styles.info}`}
            >
                <div className="shrink-0">
                    {icons[toast.type] || icons.info}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm">{toast.type === 'error' ? '¡Ups!' : toast.type === 'success' ? '¡Éxito!' : 'Información'}</p>
                    <p className="text-sm font-medium opacity-90">{toast.message}</p>
                </div>
                <button
                    onClick={handleClose}
                    className="ml-2 opacity-40 hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded-full shrink-0"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>,
        document.body
    );
}
