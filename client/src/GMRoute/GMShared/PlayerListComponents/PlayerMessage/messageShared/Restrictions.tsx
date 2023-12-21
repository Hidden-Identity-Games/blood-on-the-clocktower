import { type Restriction } from "@hidden-identity/shared";

interface RestrictionsProps {
  restrictions?: Restriction;
}
export function Restrictions({ restrictions }: RestrictionsProps) {
  return (
    <>
      {Object.entries(restrictions ?? {})
        .map(([name, value]) => `${name}: ${value}`)
        .join(", ")}
    </>
  );
}
