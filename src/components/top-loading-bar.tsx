import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"

declare global {
  interface Window {
    startTopLoading: () => void
    stopTopLoading: () => void
    _topLoadingInterval?: number
  }
}

export function TopLoadingBar() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    window.startTopLoading = () => {
      setVisible(true)
      setProgress(20)

      const interval = window.setInterval(() => {
        setProgress((p) => (p < 90 ? p + 5 : p))
      }, 200)

      window._topLoadingInterval = interval
    }

    window.stopTopLoading = () => {
      setProgress(100)

      setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 400)

      if (window._topLoadingInterval) {
        clearInterval(window._topLoadingInterval)
      }
    }
  }, [])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 w-full z-9999">
      <Progress value={progress} className="h-[3px] rounded-none" />
    </div>
  )
}
