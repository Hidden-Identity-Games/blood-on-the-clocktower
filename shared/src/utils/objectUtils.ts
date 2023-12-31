export type TypedTuple<Obj> = {
  [K in keyof Obj]: [K, Obj[K]];
}[keyof Obj];

export function toEntries<Key extends string, Value>(
  object: Record<Key, Value>,
): TypedTuple<Record<Key, Value>>[] {
  return Object.entries(object) as TypedTuple<Record<Key, Value>>[];
}

export function toKeys<Key extends string | number | symbol>(
  object: Record<Key, unknown>,
): Key[] {
  return Object.keys(object) as Key[];
}

export function removeKey<
  Key extends string | number,
  Obj extends Record<Key, unknown>,
>(obj: Obj, key: Key): Omit<Obj, Key> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [key]: _, ...next } = obj;
  return next;
}

export function mapObject<OgValue, OutValue>(
  input: Record<string, OgValue>,
  cb: (key: string, value: OgValue) => [string, OutValue] | null,
): Record<string, OutValue> {
  return Object.fromEntries(
    Object.entries(input)
      .map(([key, value]) => cb(key, value))
      .filter((v): v is [string, OutValue] => !!v),
  ) as Record<string, OutValue>;
}

export function filterObject<OgValue extends Record<string, unknown>>(
  input: OgValue,
  filter: (arg: [key: keyof OgValue, value: OgValue[keyof OgValue]]) => boolean,
): Partial<OgValue> {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    Object.entries(input).filter(filter as any),
  ) as Partial<OgValue>;
}

export function filterFalsy<T>(arg: T | null | undefined): arg is T {
  return !!arg;
}

export function groupBy<
  KeyBy extends string | number,
  Values extends { [K in KeyBy]: string | number },
>(baseList: Array<Values>, keyBy: KeyBy): Record<Values[KeyBy], Values[]> {
  return baseList.reduce<Record<Values[KeyBy], Values[]>>(
    (next, value) => {
      const keyOfNext = value[keyBy];
      if (!next[keyOfNext]) {
        next[keyOfNext] = [];
      }
      next[keyOfNext].push(value);
      return next;
    },
    {} as Record<Values[KeyBy], Values[]>,
  );
}
