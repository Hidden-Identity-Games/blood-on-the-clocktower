import { useRef } from "react";
import { v4 } from "uuid";

export function useSecretKey() {
  const currentSecretKey = useRef<string | null>(
    localStorage.getItem("secretKey"),
  );
  if (!currentSecretKey.current) {
    currentSecretKey.current = v4();
    localStorage.setItem("secretKey", currentSecretKey.current);
  }
  return currentSecretKey.current;
}
