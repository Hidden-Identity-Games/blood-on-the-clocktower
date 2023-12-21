import { CgChevronDown, CgChevronUp } from "react-icons/cg";
import { useCallback, useContext } from "react";
import React from "react";
import { GlobalSheetContext } from "./SheetContext";
import classNames from "classnames";

export interface SheetBodyProps {
  children: React.ReactNode;
}

export function SheetBody(props: SheetBodyProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-red-500 empty:hidden">
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
