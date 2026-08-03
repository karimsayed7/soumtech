"use client";

import { useEffect, useState } from "react";

function format(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: Math.floor(s % 60),
  };
}

export function AuctionCountdown({ initialSeconds }: { initialSeconds: number }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { days, hours, minutes, seconds: s } = format(seconds);

  const units = [
    { label: "يوم", value: days },
    { label: "ساعة", value: hours },
    { label: "دقيقة", value: minutes },
    { label: "ثانية", value: s },
  ];

  return (
    <div className="flex items-center justify-between border-2 p-2 py-1 rounded-lg h-12">
      {units.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-3">
          {/* الرقم والـ label */}
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-[#171D5B]">{String(unit.value).padStart(2, "0")}</span>
            <span className="text-sm text-muted-foreground -mt-1">{unit.label}</span>
          </div>
          
          {/* علامة `:` مرتفعة للأعلى */}
          {index < units.length - 1 && (
            <span className="text-xl font-semibold text-muted-foreground self-start mt-[-3px]">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}