import { isMobile } from "react-device-detect";
import { useLocalStorage } from "./useLocalStorage";

type ViewType = "desktop" | "mobile";
export function useDesktopOrMobile() {
  const defaultValue: ViewType = isMobile ? "mobile" : "desktop";
  const [value, setValue] = useLocalStorage("device_view");

  return [
    (value as ViewType) ?? defaultValue,
    (view: ViewType) => setValue(view),
  ] as const;
}
