'use client'

import { useEffect } from 'react'

interface ServiceWorkerRegisterProps {
  swPath: string
  scope: string
}

export default function ServiceWorkerRegister({ swPath, scope }: ServiceWorkerRegisterProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(swPath, { scope })
        .catch((err) => console.error('[SW] 등록 실패:', err))
    }
  }, [swPath, scope])

  return null
}
