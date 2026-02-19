import { getWaveData } from '@/lib/infp/queries'
import { redirect } from 'next/navigation'
import DateHeader from '@/components/infp/shared/DateHeader'
import EnergyCheckForm from '@/components/infp/wave/EnergyCheckForm'
import EnergyChart from '@/components/infp/wave/EnergyChart'
import TodayWaveLog from '@/components/infp/wave/TodayWaveLog'

export const dynamic = 'force-dynamic'

export default async function WavePage() {
  const data = await getWaveData()
  if (!data) redirect('/login')

  return (
    <>
      <DateHeader title="파도 체크" subtitle="지금 나의 에너지를 느껴보세요" />
      <EnergyChart logs={data.energyLogs} />
      <EnergyCheckForm />
      <TodayWaveLog logs={data.energyLogs} />
    </>
  )
}
