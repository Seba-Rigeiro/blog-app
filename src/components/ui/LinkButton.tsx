import Link from "next/link";
import type { ComponentProps } from "react";

const baseClassName =
  "inline-block rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800";

type LinkButtonProps = ComponentProps<typeof Link> & {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function LinkButton({
  href,
  children,
  className,
  ...rest
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={className ? `${baseClassName} ${className}` : baseClassName}
      {...rest}
    >
      {children}
    </Link>
  );
}
