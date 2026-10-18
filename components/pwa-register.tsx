"use client"

import { useEffect } from "react"

export default function PwaRegister(): null {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    if (process.env.NODE_ENV === "development") {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister()
        }
      })
      if ("caches" in window) {
        caches.keys().then((cacheNames) => {
          for (const name of cacheNames) {
            caches.delete(name)
          }
        })
      }
      return
    }

    const handleLoad = (): void => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration: ServiceWorkerRegistration) => {
          registration.update()
        })
        .catch((error: Error) => {
          console.error("PWA Service Worker registration failed:", error)
        })
    }

    window.addEventListener("load", handleLoad)
    return () => {
      window.removeEventListener("load", handleLoad)
    }
  }, [])

  return null
}
