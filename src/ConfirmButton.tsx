import { Button } from "@radix-ui/themes";
import React, { ReactNode } from "react";

interface ConfirmButtonProps {
  children: ReactNode;
  handleConfirm: () => void;
  disabled?: boolean;
}

function ConfirmButton({
  children,
  handleConfirm,
  disabled = false,
}: ConfirmButtonProps) {
  const [confirm, setConfirm] = React.useState(false);

  return confirm ? (
    <Button
      disabled={disabled}
      onBlur={() => setConfirm(false)}
      onClick={() => {
        setConfirm(false);
        handleConfirm();
      }}
    >
      Confirm?
    </Button>
  ) : (
    <Button disabled={disabled} onClick={() => setConfirm(true)}>
      {children}
    </Button>
  );
}

export default ConfirmButton;
