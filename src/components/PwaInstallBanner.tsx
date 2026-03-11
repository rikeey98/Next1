'use client'
import { useState, useEffect } from 'react'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const DISMISS_KEY = 'pwa-banner-dismissed'

interface Props {
  appName: string
}

export default function PwaInstallBanner({ appName }: Props) {
  const { canInstall, isInstalled, isIOS, install } = usePWAInstall()
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(DISMISS_KEY)
    if (stored) {
      const dismissedAt = Number(stored)
      const oneDayMs = 24 * 60 * 60 * 1000
      if (Date.now() - dismissedAt < oneDayMs) return
    }
    setDismissed(false)
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setDismissed(true)
  }

  if (isInstalled || dismissed || (!canInstall && !isIOS)) return null

  const bgClass = appName === '마음한걸음' ? 'bg-pink-50 border-pink-200' : 'bg-stone-50 border-stone-200'
  const btnClass = appName === '마음한걸음' ? 'bg-pink-400 hover:bg-pink-500 text-white' : 'bg-stone-700 hover:bg-stone-800 text-white'

  return (
    <div className={`fixed bottom-16 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 border-t px-4 py-3 ${bgClass}`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">📱</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800">
            홈 화면에 추가하면 앱처럼 사용 가능해요
          </p>
          {isIOS && !canInstall && (
            <p className="mt-0.5 text-xs text-gray-500">
              Safari 하단 공유(↑) 버튼 → &apos;홈 화면에 추가&apos; 선택
            </p>
          )}
        </div>
        {canInstall && (
          <Button
            size="sm"
            className={`shrink-0 text-xs ${btnClass}`}
            onClick={install}
          >
            앱으로 설치하기
          </Button>
        )}
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded p-1 text-gray-400 hover:bg-black/5 hover:text-gray-600"
          aria-label="닫기"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
