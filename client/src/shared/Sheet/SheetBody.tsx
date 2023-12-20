import { CgChevronDown, CgChevronUp } from "react-icons/cg";
import { useCallback, useContext } from "react";
import React from "react";
import { GlobalSheetContext, SheetContext } from "./SheetContext";
import classNames from "classnames";
import { sheetPortalElement } from ".";
import ReactDOM from "react-dom";

export interface SheetContentProps {
  children: React.ReactNode;
  title: React.ReactNode;
}

export function SheetContent({ children, title }: SheetContentProps) {
  const sheetId = useContext(SheetContext);
  const { activeSheet, sheetExpanded } = useContext(GlobalSheetContext);
  return sheetId === activeSheet
    ? ReactDOM.createPortal(
        <SheetBody>
          <SheetHeader>{title}</SheetHeader>
          {sheetExpanded && (
            <div className="pointer-events-auto w-full flex-1 overflow-y-auto bg-[--color-background] px-2">
              {children}
            </div>
          )}
        </SheetBody>,
        sheetPortalElement,
      )
    : null;
}

export interface SheetBodyProps {
  children: React.ReactNode;
}

export function SheetBody(props: SheetBodyProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
      {props.children}
    </div>
  );
}

export interface SheetHeaderProps {
  children: React.ReactNode;
}

export function SheetHeader({ children }: SheetHeaderProps) {
  const { sheetExpanded } = useContext(GlobalSheetContext);
  return (
    <div
      className={classNames(
        "box-content flex h-6 w-full min-w-0 border-b border-gray-400 bg-[--color-background] pointer-events-auto ",
        {
          "border-t": !sheetExpanded,
        },
      )}
    >
      <div className="min-w-0 flex-1 overflow-hidden">{children}</div>
      <SheetCollapse>
        <button className="ml-1 flex aspect-square h-full items-center justify-around">
          {sheetExpanded ? <CgChevronDown /> : <CgChevronUp />}
        </button>
      </SheetCollapse>
    </div>
  );
}

export interface SheetCollapseProps {
  children: React.ReactNode;
}
export function SheetCollapse({ children }: SheetCollapseProps) {
  const { setSheetExpanded, sheetExpanded } = useContext(GlobalSheetContext);
  const onClick = useCallback(() => {
    setSheetExpanded(!sheetExpanded);
  }, [setSheetExpanded, sheetExpanded]);
  return React.Children.map(children, (Child) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.cloneElement(Child as any, { onClick }),
  );
}
