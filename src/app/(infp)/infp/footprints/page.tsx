import { getFootprintsData } from '@/lib/infp/queries'
import { redirect } from 'next/navigation'
import DateHeader from '@/components/infp/shared/DateHeader'
import StatsCards from '@/components/infp/footprints/StatsCards'
import OverlayedEnergyChart from '@/components/infp/footprints/OverlayedEnergyChart'
import DailyRecordList from '@/components/infp/footprints/DailyRecordList'

export const dynamic = 'force-dynamic'

export default async function FootprintsPage() {
  const data = await getFootprintsData()
  if (!data) redirect('/login')

  return (
    <>
      <DateHeader title="발자국" subtitle="내가 걸어온 길을 되돌아봐요" />
      <StatsCards stats={data.stats} />
      <OverlayedEnergyChart daysData={data.energyWaveData} />
      <DailyRecordList records={data.dailyRecords} />
    </>
  )
}
