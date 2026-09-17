"use client"

import { useEffect } from "react"

export default function PwaRegister(): null {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const handleLoad = (): void => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration: ServiceWorkerRegistration) => {
            if (process.env.NODE_ENV === "development") {
              console.log("PWA Service Worker registered with scope:", registration.scope)
            }
          })
          .catch((error: Error) => {
            console.error("PWA Service Worker registration failed:", error)
          })
      }

      window.addEventListener("load", handleLoad)
      return () => {
        window.removeEventListener("load", handleLoad)
      }
    }
  }, [])

  return null
}
