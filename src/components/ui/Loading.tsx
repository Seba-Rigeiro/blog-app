type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
  className?: string;
};

export function Loading({
  message = "Cargando…",
  fullScreen = false,
  className = "",
}: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullScreen ? "min-h-[80vh]" : "min-h-[12rem]"
      } ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700"
        aria-hidden
      />
      <span className="text-sm text-gray-500">{message}</span>
    </div>
  );
}
