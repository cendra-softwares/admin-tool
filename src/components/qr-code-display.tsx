"use client";

import React from "react";
import QRCode from "react-qr-code";
import { Skeleton } from "@/components/ui/skeleton";

export function QRCodeDisplay({
  onScan,
}: {
  onScan: (token: string) => void;
}) {
  const [token, setToken] = React.useState<string | null>(null);
  const [expiresAt, setExpiresAt] = React.useState<Date | null>(null);
  const [countdown, setCountdown] = React.useState<string>("00:00");
  const [isPulsing, setIsPulsing] = React.useState<boolean>(false);

  const pulse = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 1000);
  };

  const generateNewToken = async () => {
    const { createNewAttendanceToken } = await import(
      "@/lib/supabase/mutations"
    );
    const data = await createNewAttendanceToken();
    if (data) {
      setToken(data.token);
      setExpiresAt(new Date(new Date(data.created_at).getTime() + 3 * 60 * 1000));
      pulse();
    }
  };

  const checkLatestToken = async () => {
    const { getLatestAttendanceToken } = await import(
      "@/lib/supabase/queries"
    );
    const latestToken = await getLatestAttendanceToken();

    if (
      !latestToken ||
      latestToken.used_by_id ||
      new Date(latestToken.created_at).getTime() + 3 * 60 * 1000 < Date.now()
    ) {
      await generateNewToken();
    } else {
      setToken(latestToken.token);
      setExpiresAt(
        new Date(new Date(latestToken.created_at).getTime() + 3 * 60 * 1000)
      );
    }
  };

  React.useEffect(() => {
    checkLatestToken();
  }, []);

  React.useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        checkLatestToken();
        return;
      }

      const minutes = Math.floor((diff / 1000) / 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`p-4 bg-white rounded-lg transition-all duration-500 ${
          isPulsing ? "scale-105 shadow-lg" : "scale-100 shadow-md"
        }`}
        style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}
      >
        {token ? (
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={token}
            viewBox={`0 0 256 256`}
          />
        ) : (
          <Skeleton className="w-64 h-64" />
        )}
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Next refresh in:</p>
        <p className="text-2xl font-bold tracking-widest">{countdown}</p>
      </div>
      <button
        onClick={() => token && onScan(token)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Get Token
      </button>
    </div>
  );
}