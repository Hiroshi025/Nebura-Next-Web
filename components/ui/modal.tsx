"use client";

import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
