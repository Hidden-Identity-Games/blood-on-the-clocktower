import { useCallback, useContext, useId } from "react";
import { GlobalSheetContext, SheetContext } from "./SheetContext";
import React from "react";

export interface SheetTriggerProps {
  children: React.ReactNode;
}

export function SheetTrigger({ children }: SheetTriggerProps) {
  const { setActiveSheet } = useContext(GlobalSheetContext);
  const sheetId = useContext(SheetContext);
  const onClick = useCallback(() => {
    setActiveSheet(sheetId);
  }, [setActiveSheet, sheetId]);
  const child = React.Children.only(children) as React.ReactElement;
  return React.cloneElement(child, {
    onClick: (e: unknown) => {
      onClick();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (child as any).props.onClick(e);
    },
  });
}

export interface SheetRootProps {
  children: React.ReactNode;
}

export function SheetRoot({ children }: SheetRootProps) {
  const id = useId();
  return <SheetContext.Provider value={id}>{children}</SheetContext.Provider>;
}

export interface SheetCloseProps {
  children: React.ReactNode;
}
export function SheetClose({ children }: SheetCloseProps) {
  const { setActiveSheet } = useContext(GlobalSheetContext);
  const onClick = useCallback(() => {
    setActiveSheet("");
  }, [setActiveSheet]);
  const child = React.Children.only(children) as React.ReactElement;
  return React.cloneElement(child, {
    onClick: (e: unknown) => {
      onClick();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (child as any).props.onClick(e);
    },
  });
}
