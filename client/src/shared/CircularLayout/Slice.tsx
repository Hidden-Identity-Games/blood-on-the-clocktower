import { SliceContext, useCircleContext } from "./CircleContext";

export interface SliceProps {
  children: React.ReactNode;
  index: number;
}
export function Slice({ children, index }: SliceProps) {
  const { radius, totalSlices } = useCircleContext();
  const delta = (Math.PI * 2) / totalSlices;
  const startPoint = -(1 * Math.PI) / 2;
  const rotationInRadians = startPoint + index * delta;

  return (
    <SliceContext.Provider value={rotationInRadians}>
      <div
        className="flex items-end"
        style={{
          position: "absolute",
          width: radius,
          transform: `rotate(${rotationInRadians}rad)`,
          transformOrigin: "left center",
        }}
      >
        <div className="flex-1"></div>

        {children}
      </div>
    </SliceContext.Provider>
  );
}
