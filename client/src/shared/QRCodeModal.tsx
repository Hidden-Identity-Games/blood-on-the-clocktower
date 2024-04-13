import { Button } from "@design-system/components/button";
import { Dialog } from "@design-system/components/ui/dialog";
import QRCode from "qrcode.react";
import { BsShare } from "react-icons/bs";

export function QRCodeModal({
  message,
  children,
  url,
}: {
  url: string;
  message: string;
  children: React.ReactNode;
}) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url, title: "Join Game", text: url });
      } catch (error) {
        console.error("Failed to share.");
      }
    } else {
      return navigator.clipboard.writeText(url);
    }
  };
  return (
    <Dialog.Root>
      <Dialog.Content>
        <Dialog.Header>{message}</Dialog.Header>
        <Dialog.Description>
          <div className="mt-4 flex flex-col items-center justify-center gap-5">
            <div className="bg-white p-1">
              <QRCode value={url} size={256} fgColor="darkred" />
            </div>
            <Button className="w-full" onClick={() => void handleShare()}>
              <BsShare className="inline" />
              Or share the link!
            </Button>
          </div>
        </Dialog.Description>
      </Dialog.Content>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
    </Dialog.Root>
  );
}
