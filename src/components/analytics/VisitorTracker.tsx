"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Generate or fetch a persistent visitor token
    let visitorId = "";
    try {
      visitorId = localStorage.getItem("navtej_vid") || "";
      if (!visitorId) {
        visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("navtej_vid", visitorId);
      }
    } catch {
      // Ignore localStorage errors (e.g. incognito)
    }

    // Ping visitor tracker endpoint
    fetch("/api/track-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer : "",
        visitorId,
      }),
    }).catch(() => {
      // Silent error handling for analytics
    });
  }, [pathname]);

  return null;
}
