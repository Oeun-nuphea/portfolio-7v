"use client"

import { Download, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function PwaInstallPrompt(): React.ReactNode {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isDismissed, setIsDismissed] = useState<boolean>(true)
  const [isInstalled, setIsInstalled] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if already running in standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true

    if (isStandalone) {
      setIsInstalled(true)
      return
    }

    const dismissed = sessionStorage.getItem("pwa_install_dismissed") === "true"
    if (!dismissed) {
      setIsDismissed(false)
    }

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent): void => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    const handleAppInstalled = (): void => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async (): Promise<void> => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choiceResult = await deferredPrompt.userChoice
    if (choiceResult.outcome === "accepted") {
      setDeferredPrompt(null)
      setIsInstalled(true)
    }
  }

  const handleDismiss = (): void => {
    setIsDismissed(true)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pwa_install_dismissed", "true")
    }
  }

  if (isInstalled || isDismissed || !deferredPrompt) {
    return null
  }

  return (
    <aside
      aria-label="Install App"
      className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-w-sm rounded-3xl glass-panel p-5 shadow-[0_16px_50px_rgba(15,23,42,0.12)] transition-all duration-300 sm:bottom-6 sm:left-auto sm:right-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 border border-white text-foreground shadow-sm">
            <Download size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Install App</h3>
            <p className="text-xs text-muted-foreground">
              Add to your home screen or desktop for fast offline access.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="rounded-full p-1.5 text-muted-foreground transition hover:bg-white/80 hover:text-foreground"
          aria-label="Dismiss install prompt"
        >
          <X size={15} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          onClick={handleDismiss}
          className="glass-button rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          Not now
        </button>
        <button
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-all duration-200 shadow-sm hover:opacity-90 active:scale-95"
        >
          <Download size={13} />
          <span>Install</span>
        </button>
      </div>
    </aside>
  )
}
