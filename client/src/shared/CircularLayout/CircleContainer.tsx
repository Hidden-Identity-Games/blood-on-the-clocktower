import React, { useMemo } from "react";
import useResizeObserver from "use-resize-observer";
import { CircleContainerContext } from "./CircleContext";

export interface CircleContainerProps {
  children: React.ReactNode;
  totalSlices: number;
}
export function CircleContainer({
  children,
  totalSlices,
}: CircleContainerProps) {
  const { ref, width = 0, height = 0 } = useResizeObserver();
  const contextValue = useMemo(
    () => ({
      totalSlices,
      radius: Math.max(width, height) / 2,
    }),
    [width, height, totalSlices],
  );

  return (
    <CircleContainerContext.Provider value={contextValue}>
      <div className="grid h-full flex-1 place-items-center" ref={ref}>
        <div className="absolute h-0 w-0">{children}</div>
      </div>
    </CircleContainerContext.Provider>
  );
}
