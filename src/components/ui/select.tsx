import * as React from "react";
import { cn } from "@/lib/utils";

// Extend default <select> props with extra functionality
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  isRequired?: boolean; // flag for required fields
  isError?: boolean; // flag for error styling
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, children, isRequired = false, isError = false, ...props },
    ref
  ) => {
    return (
      <select
        ref={ref}
        aria-required={isRequired}
        aria-invalid={isError}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isError && "border-red-600 focus-visible:ring-red-600", // highlight error state
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export { Select };
