import { type ReactNode, useEffect, useState } from "react";

export function LoadingExperience({
  children,
  delayInMs = 1000,
}: {
  children: ReactNode;
  delayInMs?: number;
}) {
  const [delayMet, setDelayMet] = useState(false);
  useEffect(() => {
    const delay = setTimeout(() => setDelayMet(true), delayInMs);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return delayMet ? children : null;
}
