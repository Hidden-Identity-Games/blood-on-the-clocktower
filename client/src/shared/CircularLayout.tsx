import classNames from "classnames";
import React from "react";

interface CircularLayoutProps {
  children:
    | React.ReactElement<PlaceInCircleProps>
    | React.ReactElement<PlaceInCircleProps>[];
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

  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className={classNames("relative", className)} ref={ref}>
      {childArray.map((child, idx) => (
        <PlaceInCircle
          num={idx}
          of={childArray.length}
          parentWidth={width}
          parentHeight={height}
        >
          {child}
        </PlaceInCircle>
      ))}
    </div>
  );
}

interface PlaceInCircleProps {
  num: number;
  of: number;
  parentWidth: number;
  parentHeight: number;
  children: React.ReactNode;
}
function PlaceInCircle({
  num,
  of,
  parentWidth,
  parentHeight,
  children,
}: PlaceInCircleProps) {
  const ref = React.useRef<HTMLDivElement>(null);
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
