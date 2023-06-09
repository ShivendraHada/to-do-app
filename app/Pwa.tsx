"use client";

import { useEffect } from "react";

export default function Pwa() {
  let sw: ServiceWorkerContainer | undefined;

  if (typeof window !== "undefined") {
    sw = window?.navigator?.serviceWorker;
  }

  useEffect(() => {
    if (sw) {
      sw.register("/sw.js", { scope: "/" })
        .then((registration) => {
          self.addEventListener("install", () => {});
          self.addEventListener("activate", () => {});
        })
        .catch((err) => {
          console.log("Service Worker registration failed: ", err);
        });
    }
  }, [sw]);

  return <></>;
}
