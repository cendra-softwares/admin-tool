"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { Button } from "@/components/ui/button";
import { markAttendance, markTokenAsUsed } from "@/lib/supabase/mutations";
import { getUser, getLatestAttendanceToken } from "@/lib/supabase/queries";

export default function AttendancePage() {
  const [user, setUser] = React.useState<any>(null);
  const [scannedToken, setScannedToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

  const handleScan = async (type: "check-in" | "check-out") => {
    if (!user) {
      alert("You must be logged in to mark attendance.");
      return;
    }
    if (!scannedToken) {
      alert("Please scan the QR code first.");
      return;
    }
    try {
      const latestToken = await getLatestAttendanceToken();
      if (latestToken && latestToken.token === scannedToken) {
        await markAttendance(user.id, scannedToken, type);
        await markTokenAsUsed(latestToken.id, user.id);
        alert(`Successfully marked attendance as ${type}`);
        setScannedToken(null); // Reset after successful scan
      } else {
        alert("Invalid or expired token.");
      }
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      alert("Failed to mark attendance.");
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Attendance" />
        <div className="flex flex-1 items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Scan for Attendance</CardTitle>
              <CardDescription>
                Click "Simulate Scan", then select check-in or check-out.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <QRCodeDisplay onScan={setScannedToken} />
              {scannedToken && (
                <p className="text-green-500 text-sm">Token ready!</p>
              )}
              <div className="flex gap-4">
                <Button onClick={() => handleScan("check-in")}>
                  Check In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleScan("check-out")}
                >
                  Check Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}