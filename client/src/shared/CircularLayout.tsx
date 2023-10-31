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
  const [thisWidth, setWidth] = React.useState(0);
  const [thisHeight, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setWidth(width);
      setHeight(height);
    }
  }, []);

  const angle = ((2 * Math.PI) / of) * num;
  const effectiveWidth = parentWidth / 2 - thisWidth / 2;
  const effectiveHeight = parentHeight / 2 - thisHeight / 2;
  const x = effectiveWidth * Math.cos(angle) + effectiveWidth;
  const y = effectiveHeight * Math.sin(angle) + effectiveHeight;

  return (
    <div ref={ref} style={{ position: "absolute", left: x, top: y }}>
      {children}
    </div>
  );
}
