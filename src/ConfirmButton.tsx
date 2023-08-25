import { Button } from "@radix-ui/themes";
import React from "react";

function ConfirmButton({ children, handleConfirm }) {
  const [confirm, setConfirm] = React.useState(false);

  return confirm ? (
    <Button
      onBlur={() => setConfirm(false)}
      onClick={() => {
        setConfirm(false);
        handleConfirm();
      }}
    >
      Confirm?
    </Button>
  ) : (
    <Button onClick={() => setConfirm(true)}>{children}</Button>
  );
}

export default ConfirmButton;
