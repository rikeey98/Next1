'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { formatKoreanDate } from '@/lib/infp/utils'
import type { Anchor, EnergyLog, MicroAction } from '@/types/database'

interface DailyRecord {
  date: string
  anchor?: Anchor
  reflection?: string
  energyLogs: EnergyLog[]
  completedActions: MicroAction[]
}

interface DailyRecordListProps {
  records: DailyRecord[]
}

export default function DailyRecordList({ records }: DailyRecordListProps) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null)

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-muted-foreground">아직 기록이 없어요</p>
        <p className="text-xs text-muted-foreground mt-1">매일 조금씩 발자국을 남겨보세요</p>
      </div>
    )
  }

  const toggleExpand = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date)
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">최근 30일 기록</h2>
      {records.map((record) => {
        const isExpanded = expandedDate === record.date
        const hasContent = record.anchor || record.reflection || record.energyLogs.length > 0 || record.completedActions.length > 0

        return (
          <Card key={record.date} className="overflow-hidden">
            <CardContent className="p-0">
              <button
                onClick={() => hasContent && toggleExpand(record.date)}
                className="w-full p-4 text-left hover:bg-accent/50 transition-colors"
                disabled={!hasContent}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{formatKoreanDate(record.date)}</p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {record.anchor && (
                        <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                          {record.anchor.text}
                        </Badge>
                      )}
                      {record.completedActions.length > 0 && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          완료 {record.completedActions.length}
                        </Badge>
                      )}
                      {record.energyLogs.length > 0 && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          에너지 {record.energyLogs.length}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {hasContent && (
                    isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )
                  )}
                </div>
              </button>

              {isExpanded && hasContent && (
                <div className="border-t bg-slate-50 p-4 space-y-3">
                  {record.reflection && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">회고</p>
                      <p className="text-sm text-slate-700">&ldquo;{record.reflection}&rdquo;</p>
                    </div>
                  )}

                  {record.completedActions.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">완료한 행동</p>
                      <div className="space-y-1">
                        {record.completedActions.map((action) => (
                          <div key={action.id} className="text-sm text-slate-700">
                            • {action.text}
                            {action.completion_rate && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({action.completion_rate}%)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {record.energyLogs.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">에너지 기록</p>
                      <div className="flex gap-1">
                        {record.energyLogs.map((log) => (
                          <span key={log.id} className="text-lg">
                            {'⚡'.repeat(log.level)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
