export function removeKey<Key extends string | number, Obj extends Record<Key, unknown>> (obj: Obj, key: Key): Omit<Obj, Key> {
  if (!Reflect.has(obj, key)) {
    throw new Error(`Removing key ${key} but wasn't found`)
  }
  const { [key]: _, ...next } = obj
  return next
}
