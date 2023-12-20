import { Callout } from "@radix-ui/themes";

export interface ErrorCalloutProps {
  error: Error | string | null;
}
export function ErrorCallout({ error }: ErrorCalloutProps) {
  return error ? (
    <Callout.Root>
      <Callout.Icon />
      <Callout.Text>There was an error, please try again.</Callout.Text>
    </Callout.Root>
  ) : null;
}
