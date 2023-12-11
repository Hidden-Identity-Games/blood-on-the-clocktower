export type TypedTuple<Obj> = {
  [K in keyof Obj]: [K, Obj[K]];
}[keyof Obj];

export function toEntries<Key extends string, Value>(
  object: Record<Key, Value>,
): TypedTuple<Record<Key, Value>>[] {
  return Object.entries(object) as TypedTuple<Record<Key, Value>>[];
}

export function toKeys<Key extends string>(
  object: Record<Key, unknown>,
): Key[] {
  return Object.keys(object) as Key[];
}

export function removeKey<
  Key extends string | number,
  Obj extends Record<Key, unknown>,
>(obj: Obj, key: Key): Omit<Obj, Key> {
  if (!Reflect.has(obj, key)) {
    throw new Error(`Removing key ${key} but wasn't found`);
  }
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
      .map(([key, value]) => cb(key, value as OgValue))
      .filter((v): v is [string, OutValue] => !!v),
  ) as Record<string, OutValue>;
}

export function filterObject<OgValue extends Record<string, unknown>>(
  input: OgValue,
  filter: (arg: [key: keyof OgValue, value: OgValue[keyof OgValue]]) => boolean,
): Partial<OgValue> {
  return Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(input).filter(filter as any),
  ) as Partial<OgValue>;
}

export function filterFalsy<T>(arg: T | null | undefined): arg is T {
  return !!arg;
}
