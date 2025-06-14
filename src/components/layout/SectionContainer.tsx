import React, { forwardRef } from "react";
import { cn } from "~/lib/utils";

type SectionContainerProps = {
  padded?: boolean;
  containerClassName?: string;
  minfullscreen?: boolean;
};

export const SectionContainer = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & SectionContainerProps
>(({ className, children, padded, minfullscreen, containerClassName, ...props }, ref) => {
  return (
    <div className={cn("relative h-full", containerClassName)}>
      <section
        ref={ref}
        className={cn(
          "container flex flex-col items-center lg:max-w-screen-md",
          minfullscreen &&
            "flex min-h-[calc(100vh-144px)] w-full flex-col",
          className,
          padded ? "px-4" : "",
        )}
        {...props}
      >
        {children}
      </section>
    </div>
  );
});

SectionContainer.displayName = "SectionContainer";
