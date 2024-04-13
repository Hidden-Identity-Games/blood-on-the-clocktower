import { useEffect, useState } from "react";

export function TimeSince({ startTime }: { startTime: number }) {
  const [timeDiff, setTimeDiff] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const difference = Math.max(0, currentTime - startTime);
      setTimeDiff(difference);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return <>{formatTime(timeDiff)}</>;
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
