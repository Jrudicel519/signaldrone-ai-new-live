"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(30);
  const secondsRef = useRef(30);

  useEffect(() => {
    const timer = setInterval(() => {
      secondsRef.current = secondsRef.current - 1;

      if (secondsRef.current <= 0) {
        secondsRef.current = 30;
        setSecondsLeft(30);
        router.refresh();
        return;
      }

      setSecondsLeft(secondsRef.current);
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-full border border-cyan-500/30 bg-slate-950/90 px-4 py-2 text-xs font-semibold text-cyan-300 shadow-xl">
      Auto-update in {secondsLeft}s
    </div>
  );
}
