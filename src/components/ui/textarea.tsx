import * as React from "react";
import { cn } from "@/lib/utils";

// Extend default <textarea> props with extra functionality
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isRequired?: boolean; // flag for required fields
  isError?: boolean; // flag for error styling
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, isRequired = false, isError = false, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-required={isRequired}
        aria-invalid={isError}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isError && "border-red-600 focus-visible:ring-red-600", // error state styling
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
