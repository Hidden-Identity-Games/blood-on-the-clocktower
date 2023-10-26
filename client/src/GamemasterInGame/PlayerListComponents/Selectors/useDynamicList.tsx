import { useEffect, useState } from "react";
import { pluck } from "../../../utils/shuffleList";

export interface DynamicListArgs<T> {
  recommended: T[];
  mustInclude?: T[];
  defaultCount: number;
}
export function useDynamicList<T>(
  all: T[],
  { recommended, mustInclude = [], defaultCount }: DynamicListArgs<T>,
): {
  value: T[];
  replace: (replaceValue: T | null, index: number) => void;
  add: () => void;
  overwrite: (nextValue: T[]) => void;
} {
  const initialState = () => {
    const ideal = [
      ...mustInclude,
      ...recommended,
      ...all.filter(
        (k) => !(mustInclude.includes(k) || recommended.includes(k)),
      ),
    ].slice(0, defaultCount);
    const leftover = Math.max(ideal.length - defaultCount, 0);
    return [
      ...ideal,
      ...all.filter((k) => !ideal.includes(k)).slice(0, leftover),
    ];
  };
  const [value, setValue] = useState<T[]>(initialState);

  useEffect(() => {
    setValue(initialState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...mustInclude, ...recommended]);
  return {
    value,
    replace: (replaceValue, index) => {
      const nextValue = [...value];
      nextValue[index] = replaceValue!;
      setValue(nextValue.filter(Boolean));
    },
    add: () =>
      setValue((last) => {
        return [
          ...last,
          pluck(recommended.filter((k) => !value.includes(k))) ??
            all.find((k) => !value.includes(k)) ??
            recommended[0],
        ];
      }),
    overwrite: setValue,
  };
}
