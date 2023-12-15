export interface CenterProps {
  children: React.ReactNode;
}
export function Center({ children }: CenterProps) {
  return <div>{children}</div>;
}
