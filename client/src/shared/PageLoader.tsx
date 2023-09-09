import { useEffect, useState } from "react";

export function PageLoader() {
  const [delayMet, setDelayMet] = useState(false);
  useEffect(() => {
    const delay = setTimeout(() => setDelayMet(true), 1000);
    return () => clearTimeout(delay);
  }, []);
  return delayMet && <div>Loading...</div>;
}
