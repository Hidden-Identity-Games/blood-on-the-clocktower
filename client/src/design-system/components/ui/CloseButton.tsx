import classNames from "classnames";
import { X } from "lucide-react";
import React from "react";

export interface CloseButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {}

export const CloseButton = React.forwardRef(function CloseButton(
  { onClick, className, ...props }: CloseButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <button
      {...props}
      className={classNames(
        className,
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
      )}
      onClick={onClick}
      ref={ref}
    >
      <X className="h-4 w-4" />
    </button>
  );
});
