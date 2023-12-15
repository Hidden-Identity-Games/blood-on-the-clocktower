import React, { useContext } from "react";
import { createContext } from "react";

export const SliceContext = createContext(0);

export function useSliceContext() {
  return useContext(SliceContext);
}

export const CircleContainerContext = React.createContext({
  radius: 0,
  totalSlices: 0,
});

export function useCircleContext() {
  return useContext(CircleContainerContext);
}
