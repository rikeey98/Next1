'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CleanupAnchorsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const handleCleanup = async () => {
    setIsLoading(true)
    setResult('')

    try {
      const response = await fetch('/api/cleanup-anchors', {
        method: 'POST',
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`에러: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>앵커 중복 제거</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            중복된 앵커를 확인하고 제거합니다. 같은 텍스트의 앵커는 하나만 남기고 삭제됩니다.
          </p>

          <Button
            onClick={handleCleanup}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? '처리 중...' : '중복 앵커 제거'}
          </Button>

          {result && (
            <pre className="mt-4 rounded-lg bg-slate-100 p-4 text-xs overflow-auto">
              {result}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
