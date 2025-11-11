import React from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ConfirmPopupProps {
  open: boolean;
  title?: string;
  message?: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  open,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Transparent overlay */}
          <motion.div
            className="fixed inset-0 w-fit h-fit z-50"
            style={{ background: "rgba(0,0,0,0.00)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 32 }}
            className="fixed z-50 bg-white p-6 rounded-xl shadow-xl w-[90vw] max-w-md"
          >
            {title && <div className="text-lg font-semibold mb-2">{title}</div>}
            {message && <div className="mb-6">{message}</div>}
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-3 py-2 rounded border bg-gray-100 hover:bg-gray-200"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
