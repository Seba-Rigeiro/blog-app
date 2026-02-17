"use client";

/**
 * Toast de error presentacional. Sin contexto: el padre controla mensaje y cierre.
 */

type ErrorToastProps = {
  message: string | null;
  onDismiss: () => void;
};

export function ErrorToast({ message, onDismiss }: ErrorToastProps) {
  if (message === null) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-red-200 bg-red-50 px-4 py-3 shadow-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-red-800">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-1 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
}
