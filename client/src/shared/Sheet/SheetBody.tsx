import { LockOpen1Icon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import classNames from "classnames";
import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import React from "react";
import { CgChevronDown, CgChevronUp } from "react-icons/cg";

import { useIsHiddenView, useSheetExpanded } from "../../store/url";

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
  const [sheetExpanded, setSheetExpanded] = useSheetExpanded();
  const [isHiddenView] = useIsHiddenView();
  return (
    <button
      className={classNames(
        "box-content flex h-[64px] w-full min-w-0 border-y border-gray-400 bg-[--color-background] pointer-events-auto shrink-0 items-center",
        // helps the drag animation for the sheet
        "z-10",
      )}
      onClick={() => !isHiddenView && setSheetExpanded(!sheetExpanded)}
    >
      <div className="flex-1 overflow-hidden whitespace-nowrap">{children}</div>
      {!isHiddenView && (
        <div className="ml-1 flex aspect-square h-full items-center justify-around">
          {sheetExpanded ? <CgChevronDown /> : <CgChevronUp />}
        </div>
      )}
    </button>
  );
}

export function SheetContent({ children }: SheetHeaderProps) {
  const startThumb = useRef<number>(0);
  const [currentDiff, setCurrentDiff] = useState(0);
  const [sheetExpanded, setSheetExpanded] = useSheetExpanded();

  return (
    <motion.div
      onTouchStart={(e) => {
        if (e.currentTarget.scrollTop <= 4) {
          startThumb.current = e.touches[0].clientY;
        }
      }}
      onTouchMove={(e) => {
        // scrolltop never quite gets to 0, it just gets REALLY small, so 4px is good enough
        if (e.currentTarget.scrollTop >= 4) {
          startThumb.current = 0;
          return;
        }
        if (!startThumb.current) {
          startThumb.current = e.touches[0].clientY;
        } else {
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
      className="pointer-events-auto relative z-50 w-full overflow-y-scroll bg-[--color-background] px-2"
    >
      {children}
    </motion.div>
  );
}

export interface SheetCollapseProps {
  children: React.ReactNode;
}
export function SheetCollapse({ children }: SheetCollapseProps) {
  const [sheetExpanded, setSheetExpanded] = useSheetExpanded();
  const onClick = useCallback(() => {
    setSheetExpanded(!sheetExpanded);
  }, [setSheetExpanded, sheetExpanded]);
  return React.Children.map(children, (Child) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    React.cloneElement(Child as any, { onClick }),
  );
}

export function LockedSheetHeader() {
  const [_, setIsHiddenView] = useIsHiddenView();

  return (
    <div className="flex h-full w-full items-center justify-between px-3">
      <span className="h-full items-center text-3xl font-bold">
        <LockKeyhole className="inline-block pr-2" size="1em" />
        <span>Locked</span>
      </span>
      <IconButton
        variant="surface"
        onClick={() => setIsHiddenView(false)}
        size="1"
      >
        <LockOpen1Icon />
      </IconButton>
    </div>
  );
}
