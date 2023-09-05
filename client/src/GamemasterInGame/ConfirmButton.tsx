import { Button } from "@radix-ui/themes";
import React, { ReactNode } from "react";

interface ConfirmButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

function ConfirmButton({
  children,
  onClick: handleConfirm,
  disabled = false,
}: ConfirmButtonProps) {
  const [confirm, setConfirm] = React.useState(false);

  return (
    <Button
      disabled={disabled}
      onBlur={() => setConfirm(false)}
      onClick={() => {
        setConfirm(!confirm);
        if (confirm) {
          handleConfirm();
        }
      }}
    >
      {confirm ? "Confirm?" : children}
    </Button>
  );
}

export default ConfirmButton;
