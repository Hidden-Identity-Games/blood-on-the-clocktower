import React, { ReactNode } from "react";
import { Button } from "@radix-ui/themes";
import "./ShareButton.css";

interface ShareProps {
  children: ReactNode;
  url: string;
  text: string;
  title: string;
}

function ShareButton({ children, url, text, title }: ShareProps) {
  const [showSnackbar, setShowSnackbar] = React.useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url, title, text });
      } catch (error) {
        console.log("Failed to share.");
      }
    } else {
      navigator.clipboard.writeText(url);
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 2000);
    }
  };

  return (
    <>
      <Button onClick={handleShare}>
        <span>{children}</span>
      </Button>
      <div id="snackbar" className={showSnackbar ? "show" : ""}>
        Link copied to clipboard.
      </div>
    </>
  );
}

export { ShareButton };
