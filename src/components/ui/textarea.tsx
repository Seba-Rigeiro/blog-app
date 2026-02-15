import { forwardRef, type TextareaHTMLAttributes } from "react";

const textareaClassName =
  "w-full rounded border border-gray-300 px-3 py-2 text-sm";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={
        className ? `${textareaClassName} ${className}` : textareaClassName
      }
      {...props}
    />
  );
});
