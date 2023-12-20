import { useCallback, useContext, useId, useMemo, useState } from "react";
import { GlobalSheetContext, SheetContext, useSheetOpen } from "./SheetContext";
import { sheetPortalElement } from ".";
import ReactDOM from "react-dom";
import React from "react";
import { SheetBody, SheetContent, SheetHeader } from "./SheetBody";

export interface SheetProps {
  children: React.ReactNode;
  title: React.ReactNode;
}

export function Sheet({ children, title }: SheetProps) {
  const sheetId = useContext(SheetContext);
  const { activeSheet, sheetExpanded } = useContext(GlobalSheetContext);
  return sheetId === activeSheet
    ? ReactDOM.createPortal(
        <SheetBody>
          <SheetHeader>{title}</SheetHeader>
          {sheetExpanded && <SheetContent>{children}</SheetContent>}
        </SheetBody>,
        sheetPortalElement,
      )
    : null;
}

export interface SheetTriggerProps {
  children: React.ReactNode;
}

export function SheetTrigger({ children }: SheetTriggerProps) {
  const { setActiveSheet } = useContext(GlobalSheetContext);
  const sheetId = useContext(SheetContext);
  const onClick = useCallback(() => {
    setActiveSheet(sheetId);
  }, [setActiveSheet, sheetId]);
  return React.Children.map(
    children,
    (Child) =>
      React.isValidElement(Child) && React.cloneElement(Child, { onClick }),
  );
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
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: (e) => {
      onClick();
      (child as any).props.onClick(e);
    },
  });
}
