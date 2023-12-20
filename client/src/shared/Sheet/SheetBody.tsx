import { CgChevronDown, CgChevronUp } from "react-icons/cg";
import { useCallback, useContext, useRef, useState } from "react";
import React from "react";
import { GlobalSheetContext, SheetContext } from "./SheetContext";
import classNames from "classnames";
import { sheetPortalElement } from ".";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

export interface SheetContentProps {
  children: React.ReactNode;
  title: React.ReactNode;
}

export function SheetContent({ children, title }: SheetContentProps) {
  const sheetId = useContext(SheetContext);
  const startThumb = useRef<number>(0);
  const [currentDiff, setCurrentDiff] = useState(0);
  const { activeSheet, sheetExpanded, setSheetExpanded } =
    useContext(GlobalSheetContext);

  return sheetId === activeSheet
    ? ReactDOM.createPortal(
        <SheetBody>
          <motion.div
            onTouchStart={(e) => {
              console.log("start");
              if (e.currentTarget.scrollTop <= 4) {
                startThumb.current = e.touches[0].clientY;
              }
            }}
            onTouchMove={(e) => {
              // scrolltop never quite gets to 0, it just gets REALLY small, so 4px is good enough
              if (e.currentTarget.scrollTop >= 4) {
                console.log("blocked", e.currentTarget.scrollTop);
                startThumb.current = 0;
                return;
              }
              if (!startThumb.current) {
                startThumb.current = e.touches[0].clientY;
                console.log("set");
              } else {
                console.log("calc");
                const currentDiff = startThumb.current
                  ? e.touches[0].clientY - startThumb.current
                  : 0;
                setCurrentDiff(currentDiff);
                if (currentDiff > 250) {
                  setSheetExpanded(false);
                }
              }
            }}
            onTouchEnd={() => {
              startThumb.current = 0;
              setCurrentDiff(0);
            }}
            initial={{ height: "0%" }}
            animate={{
              height: sheetExpanded ? "100%" : "0%",
              y: Math.max(currentDiff, 0),
            }}
            className="pointer-events-auto w-full overflow-y-scroll bg-[--color-background] px-2"
          >
            {children}
          </motion.div>
          <SheetHeader>{title}</SheetHeader>
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
        "box-content flex h-6 w-full min-w-0 border-y border-gray-400 bg-[--color-background] pointer-events-auto shrink-0",
        // helps the drag animation for the sheet
        "z-10",
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
