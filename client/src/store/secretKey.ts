import { useEffect, useState } from "react";
import { v4 } from "uuid";

export function useSecretKey(): [string, (key: string) => void] {
  const [secretKey, setSecretKey] = useState<string>(
    localStorage.getItem("secretKey") ?? v4(),
  );

  useEffect(() => {
    localStorage.setItem("secretKey", secretKey);
  }, [secretKey]);

  return [secretKey, setSecretKey];
}
