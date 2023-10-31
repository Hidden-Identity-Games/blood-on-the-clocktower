import classNames from "classnames";
import React from "react";

const CircularLayoutContext = React.createContext({ width: 0, height: 0 });

interface CircularLayoutProps {
  children: React.ReactElement | React.ReactElement[];
  className?: string;
}
export function CircularLayout({ children, className }: CircularLayoutProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setWidth(width);
      setHeight(height);
    }
  }, []);

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
  const { width: parentWidth, height: parentHeight } = React.useContext(
    CircularLayoutContext,
  );

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
  const ref = React.useRef<HTMLDivElement>(null);
  const [refWidth, setRefWidth] = React.useState(0);
  const [refHeight, setRefHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setRefWidth(width);
      setRefHeight(height);
    }
  }, []);

  const center = {
    x: parentWidth / 2 - refWidth / 2,
    y: parentHeight / 2 - refHeight / 2,
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
