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
  num: number;
  of: number;
  children: React.ReactNode;
}
export function PlaceInCircle({ num, of, children }: PlaceInCircleProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { width: parentWidth, height: parentHeight } = React.useContext(
    CircularLayoutContext,
  );
  const width = (1.8 * parentHeight) / of;
  const height = (1.8 * parentHeight) / of;

  const angle = ((2 * Math.PI) / of) * num;
  const containerRadius = {
    X: parentWidth / 2 - width / 2,
    Y: parentHeight / 2 - height / 2,
  };
  const position = {
    x: containerRadius.X * Math.cos(angle) + containerRadius.X,
    y: containerRadius.Y * Math.sin(angle) + containerRadius.Y,
  };

  return (
    <div
      ref={ref}
      className="hover:z-30"
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
