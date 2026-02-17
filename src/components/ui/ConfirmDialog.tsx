"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" para acciones destructivas (ej. eliminar) */
  variant?: "default" | "danger";
  /** Evita cerrar al hacer clic fuera o Escape si está cargando */
  isLoading?: boolean;
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const handleCancel = () => handleClose();

  const handleConfirm = () => {
    if (isLoading) return;
    onConfirm();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isLoading) e.preventDefault();
  };

  if (!open) return null;

  const isDanger = variant === "danger";
  const confirmClass = isDanger
    ? "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
    : "bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50";

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/20"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      <div className="p-6">
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold text-gray-900"
        >
          {title}
        </h2>
        <p id="confirm-dialog-desc" className="mt-2 text-sm text-gray-600">
          {message}
        </p>
      </div>
      <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={isLoading}
          className={`rounded px-4 py-2 text-sm ${confirmClass}`}
        >
          {isLoading ? "Espera…" : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
