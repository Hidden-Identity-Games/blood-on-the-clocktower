import { useCircleContext, useSliceContext } from "./CircleContext";

interface PepperoniProps {
  children: React.ReactNode;
}
export function Pepperoni({ children }: PepperoniProps) {
  const rotationInRadians = useSliceContext();
  const { radius, totalSlices } = useCircleContext();
  return (
    <div
      style={{
        transform: `rotate(${-rotationInRadians}rad)`,
        height: (radius / totalSlices) * 4,
      }}
    >
      {children}
    </div>
  );
}
