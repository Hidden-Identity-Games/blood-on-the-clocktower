import { Dialog } from "@design-system/components/ui/dialog";
import { Button, Flex } from "@radix-ui/themes";
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
      <Dialog.Content className="m-6">
        <Dialog.Header>
          <Flex align="center" justify="between">
            {message}
          </Flex>
        </Dialog.Header>

        <Flex mt="4" direction="column" justify="center" align="center" gap="5">
          <div className="bg-white p-1">
            <QRCode value={url} size={256} fgColor="darkred" />
          </div>
          <Button
            className="w-full"
            onClick={() => void handleShare()}
            size="4"
          >
            <BsShare className="inline" />
            Or share the link!
          </Button>
        </Flex>
      </Dialog.Content>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
    </Dialog.Root>
  );
}
