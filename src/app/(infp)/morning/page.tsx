import { getMorningData } from '@/lib/infp/queries'
import { redirect } from 'next/navigation'
import DateHeader from '@/components/infp/shared/DateHeader'
import AnchorChips from '@/components/infp/morning/AnchorChips'
import FirstActionCard from '@/components/infp/morning/FirstActionCard'
import MicroActionList from '@/components/infp/morning/MicroActionList'

export const dynamic = 'force-dynamic'

export default async function MorningPage() {
  const data = await getMorningData()
  if (!data) redirect('/login')

  return (
    <>
      <DateHeader title="좋은 아침" subtitle="오늘은 어떤 내가 되고 싶나요?" />
      <AnchorChips
        anchors={data.anchors}
        selectedAnchorId={data.dailyState?.selected_anchor_id ?? null}
      />
      <FirstActionCard yesterdayState={data.yesterdayState} />
      <MicroActionList actions={data.todayActions} />
    </>
  )
}
