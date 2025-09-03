import * as React from "react";
import { cn } from "@/lib/utils";

// Extend the default HTML <label> props
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  isRequired?: boolean; // optional flag for required fields
  isError?: boolean; // optional flag to style error states
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    { className, children, isRequired = false, isError = false, ...props },
    ref
  ) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        isError && "text-red-600", // error state styling
        className
      )}
      {...props}
    >
      {children}
      {isRequired && <span className="ml-1 text-red-500">*</span>}{" "}
      {/* required field indicator */}
    </label>
  )
);

Label.displayName = "Label";

export { Label };
