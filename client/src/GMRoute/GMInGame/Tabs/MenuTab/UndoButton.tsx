import { Button } from "@radix-ui/themes";

import { ErrorCallout } from "../../../../shared/ErrorCallout";
import { useUndo } from "../../../../store/actions/gmActions";

export function UndoButton() {
  const [error, loading, , undo] = useUndo();
  return (
    <>
      <ErrorCallout error={error} />
      <Button disabled={loading} onClick={() => void undo()}>
        Undo
      </Button>
    </>
  );
}
