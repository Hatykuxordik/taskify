import * as React from "react";
import { cn } from "@/lib/utils";

// Extend the default HTML <input> props
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean; // optional flag to style error states
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", isError = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={isError || undefined} // accessibility support
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isError && "border-red-500 focus-visible:ring-red-500", // error styles
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
