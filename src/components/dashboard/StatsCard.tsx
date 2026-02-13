import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  accentColor?: string
}

export default function StatsCard({ title, value, description, icon: Icon, accentColor }: StatsCardProps) {
  return (
    <Card className="border-[#e8e6dc] bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[#b0aea5] font-heading">{title}</CardTitle>
        <Icon className="h-4 w-4" style={{ color: accentColor || '#d97757' }} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#141413] font-heading">{value}</div>
        {description && (
          <p className="text-xs text-[#b0aea5]">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
