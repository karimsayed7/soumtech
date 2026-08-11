"use client";

import { useEffect, useState } from "react";

type Props = {
  initialSeconds: number;
  size?: "sm" | "lg";
};

function format(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);

  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: Math.floor(s % 60),
  };
}

export function AuctionCountdown({
  initialSeconds,
  size = "sm",
}: Props) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const styles = {
    sm: {
      container: "h-12 p-2 py-1",
      value: "text-lg",
      label: "text-sm",
      colon: "text-xl",
      gap: "gap-3",
    },
    lg: {
      container: "h-16 px-5 py-3",
      value: "text-2xl",
      label: "text-base",
      colon: "text-3xl",
      gap: "gap-5",
    },
  };

  const ui = styles[size];

  const { days, hours, minutes, seconds: s } = format(seconds);

  const units = [
    { label: "يوم", value: days },
    { label: "ساعة", value: hours },
    { label: "دقيقة", value: minutes },
    { label: "ثانية", value: s },
  ];

  return (
    <div
      className={`flex items-center justify-between rounded-lg border-2 ${ui.container}`}
    >
      {units.map((unit, index) => (
        <div key={unit.label} className={`flex items-center ${ui.gap}`}>
          <div className="flex flex-col items-center">
            <span className={`${ui.value} font-bold text-[#171D5B]`}>
              {String(unit.value).padStart(2, "0")}
            </span>

            <span className={`${ui.label} text-muted-foreground -mt-1`}>
              {unit.label}
            </span>
          </div>

          {index < units.length - 1 && (
            <span
              className={`${ui.colon} self-start mr-2 -mt-0.5 font-semibold text-muted-foreground`}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}