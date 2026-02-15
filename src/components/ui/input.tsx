import { forwardRef, type InputHTMLAttributes } from "react";

const inputClassName =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={className ? `${inputClassName} ${className}` : inputClassName}
      {...props}
    />
  );
});
