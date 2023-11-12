import { type ReactNode, useEffect, useState } from "react";

export function LoadingExperience({
  children,
  delayInMs = 1000,
}: {
  children: ReactNode;
  delayInMs?: number;
}) {
  const [delayMs, setDelayMs] = useState(false);
  useEffect(() => {
    const delay = setTimeout(() => setDelayMs(true), delayInMs);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return delayMs ? children : null;
}
