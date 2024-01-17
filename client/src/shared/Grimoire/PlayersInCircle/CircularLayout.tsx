import classNames from "classnames";
import React, { useMemo } from "react";
import useResizeObserver from "use-resize-observer";

const CircularLayoutContext = React.createContext({ radius: 0, totalItems: 0 });

interface CircularLayoutProps {
  totalItems: number;
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}
export function CircularLayout({
  children,
  className,
  totalItems,
}: CircularLayoutProps) {
  const { ref, width = 0, height = 0 } = useResizeObserver();

  const radius = Math.min(width, height) / 2;
  const contextValue = useMemo(
    () => ({ radius, totalItems }),
    [radius, totalItems],
  );

  return (
    <CircularLayoutContext.Provider value={contextValue}>
      <div
        data-radius={contextValue.radius}
        className={classNames("relative", className)}
        style={{ marginLeft: Math.max(width - height, 0) }}
        ref={ref}
      >
        {children}
      </div>
    </CircularLayoutContext.Provider>
  );
}

interface PlaceInCircleProps {
  index: number;
  children: React.ReactNode;
  stepsIn: number;
}
export function PlaceInCircle({
  index,
  children,
  stepsIn,
}: PlaceInCircleProps) {
  const { radius, totalItems } = React.useContext(CircularLayoutContext);
  const distanceToStartOfStep = (1 - stepsIn / 5) * radius;
  // We optimize for 15, because that looks the best.  And 20 will not be broken even at this size
  const sliceAngle = (2 * Math.PI) / 15;
  const widthAtTopOfStep = distanceToStartOfStep * Math.sin(sliceAngle / 2) * 2;

  const pepperoniSize = widthAtTopOfStep;
  const pepperoniRadius = pepperoniSize / 2;

  const angle = ((2 * Math.PI) / totalItems) * index + -Math.PI / 2;
  const distanceToCenterOfPepperoni = distanceToStartOfStep - pepperoniRadius;

  const position = {
    x:
      (distanceToCenterOfPepperoni + pepperoniRadius) * -Math.sin(angle) +
      radius,
    y:
      (distanceToCenterOfPepperoni + pepperoniRadius) * -Math.cos(angle) +
      radius,
  };

  return (
    <div
      className="pointer-events-none absolute flex h-0 w-0 items-center justify-around"
      style={{
        left: position.x - pepperoniRadius,
        top: position.y - pepperoniRadius,
        height: pepperoniSize,
        width: pepperoniSize,
      }}
    >
      {children}
    </div>
  );
}

interface PlaceInCenterProps {
  children: React.ReactNode;
}
export function PlaceInCenter({ children }: PlaceInCenterProps) {
  const { radius } = React.useContext(CircularLayoutContext);

  return (
    <div
      className="flex items-center justify-around"
      style={{ height: radius * 2, width: radius * 2 }}
    >
      {children}
    </div>
  );
}
