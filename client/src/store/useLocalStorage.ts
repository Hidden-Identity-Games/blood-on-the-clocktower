import { useEffect, useState } from "react";

const localStorageCache: Record<
  string,
  ReturnType<typeof createLocalStorage>
> = {};

type CB = (value: string | null) => void;

function createLocalStorage(key: string) {
  const value: { current: string | null } = {
    current: localStorage.getItem(key),
  };
  let callbacks: CB[] = [];
  function subscribe(cb: CB) {
    callbacks = [...callbacks, cb];
    return () => {
      callbacks = callbacks.filter((curr) => curr !== cb);
    };
  }
  function update(nextValue: string | null) {
    if (nextValue) {
      localStorage.setItem(key, nextValue);
    } else {
      localStorage.removeItem(key);
    }
    value.current = nextValue;
    callbacks.forEach((cb) => {
      try {
        cb(value.current);
      } catch (e) {
        console.error(e);
      }
    });
  }
  return { subscribe, update, value };
}

export function useLocalStorage(key: string) {
  if (!localStorageCache[key]) {
    localStorageCache[key] = createLocalStorage(key);
  }
  const [value, setValue] = useState<string | null>(
    localStorageCache[key].value.current,
  );
  useEffect(() => {
    return localStorageCache[key].subscribe((nextValue) => {
      setValue(nextValue);
    });
  }, [key]);

  return [value, localStorageCache[key].update] as const;
}
