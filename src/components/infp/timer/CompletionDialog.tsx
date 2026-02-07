'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CompletionDialogProps {
  open: boolean
  onComplete: (rate: number) => void
  onExtend: () => void
}

export default function CompletionDialog({ open, onComplete, onExtend }: CompletionDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>수고했어요!</DialogTitle>
          <DialogDescription>얼마나 완료했나요?</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Button
            onClick={() => onComplete(100)}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            100% 완료!
          </Button>
          <Button
            onClick={() => onComplete(70)}
            variant="outline"
            className="w-full"
          >
            70% 정도 했어요
          </Button>
          <Button
            onClick={onExtend}
            variant="ghost"
            className="w-full text-indigo-600"
          >
            2분 더 할래요
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
