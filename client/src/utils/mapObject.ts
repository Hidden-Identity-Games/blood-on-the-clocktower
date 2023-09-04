export function mapObject<OgValue, OutValue>(
  input: Record<string, OgValue>,
  cb: (key: string, value: OgValue) => [string, OutValue],
): Record<string, OutValue> {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => cb(key, value as OgValue)),
  ) as Record<string, OutValue>;
}
