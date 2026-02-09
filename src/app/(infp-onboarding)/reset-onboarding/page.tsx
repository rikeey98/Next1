'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function ResetOnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const handleReset = async () => {
    if (!confirm('온보딩을 리셋하시겠습니까? 모든 앵커가 삭제됩니다.')) {
      return
    }

    setIsLoading(true)
    setResult('')

    try {
      const response = await fetch('/api/reset-onboarding', {
        method: 'POST',
      })
      const data = await response.json()

      if (data.success) {
        setResult('✅ ' + data.message)
        setTimeout(() => {
          router.push('/onboarding')
        }, 1500)
      } else {
        setResult('❌ ' + (data.error || '리셋 실패'))
      }
    } catch (error) {
      setResult(`❌ 에러: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>온보딩 리셋</CardTitle>
          <CardDescription>
            온보딩을 처음부터 다시 시작할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-800">
              ⚠️ <strong>주의:</strong> 모든 앵커가 삭제되고 온보딩을 처음부터 다시 진행합니다.
            </p>
          </div>

          <Button
            onClick={handleReset}
            disabled={isLoading}
            variant="destructive"
            className="w-full"
          >
            {isLoading ? '리셋 중...' : '온보딩 리셋하기'}
          </Button>

          {result && (
            <div className="mt-4 rounded-lg bg-slate-100 p-4">
              <p className="text-sm">{result}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
