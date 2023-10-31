import classNames from "classnames";
import React from "react";
import useResizeObserver from "use-resize-observer";

const CircularLayoutContext = React.createContext({ width: 0, height: 0 });

interface CircularLayoutProps {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}
export function CircularLayout({ children, className }: CircularLayoutProps) {
  const { ref, width = 0, height = 0 } = useResizeObserver();

  return (
    <CircularLayoutContext.Provider value={{ width, height }}>
      <div className={classNames("relative", className)} ref={ref}>
        {children}
      </div>
    </CircularLayoutContext.Provider>
  );
}

interface PlaceInCircleProps {
  index: number;
  totalCountInCircle: number;
  children: React.ReactNode;
}
export function PlaceInCircle({
  index,
  totalCountInCircle,
  children,
}: PlaceInCircleProps) {
  const { width: _parentWidth, height: _parentHeight } = React.useContext(
    CircularLayoutContext,
  );

  const parentWidth = Math.min(_parentHeight, _parentWidth);
  const parentHeight = Math.min(_parentHeight, _parentWidth);

  const width = (1.8 * parentHeight) / totalCountInCircle;
  const height = (1.8 * parentHeight) / totalCountInCircle;

  const angle = ((2 * Math.PI) / totalCountInCircle) * index;
  const containerRadius = {
    X: parentWidth / 2 - width / 2,
    Y: parentHeight / 2 - height / 2,
  };
  const position = {
    x: containerRadius.X * -Math.sin(angle) + containerRadius.X,
    y: containerRadius.Y * -Math.cos(angle) + containerRadius.Y,
  };

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        height,
        width,
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
  const { width: parentWidth, height: parentHeight } = React.useContext(
    CircularLayoutContext,
  );

  const { ref, width = 0, height = 0 } = useResizeObserver();
  const radius = Math.min(parentWidth, parentHeight);

  const center = {
    x: radius / 2 - width / 2,
    y: radius / 2 - height / 2,
  };

  return (
    <div
      ref={ref}
      className="absolute"
      style={{ left: center.x, top: center.y }}
    >
      {children}
    </div>
  );
}
