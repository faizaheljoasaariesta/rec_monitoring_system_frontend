import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useEffect } from "react"

interface ChartImageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageUrl?: string
}

export function ChartImage({ open, onOpenChange, imageUrl }: ChartImageModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] md:max-w-6xl p-4">
        <DialogHeader>
          <DialogTitle>Chart Image</DialogTitle>
          <DialogDescription>
            Visualization result for this analytic record.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex items-center justify-center mt-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="chart"
              className="rounded-md max-h-[70vh] object-contain"
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              No chart image available.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
