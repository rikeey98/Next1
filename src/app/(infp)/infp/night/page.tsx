import { getNightData } from '@/lib/infp/queries'
import { redirect } from 'next/navigation'
import DateHeader from '@/components/infp/shared/DateHeader'
import NightFlow from '@/components/infp/night/NightFlow'

export const dynamic = 'force-dynamic'

export default async function NightPage() {
  const data = await getNightData()
  if (!data) redirect('/login')

  return (
    <>
      <DateHeader title="밤 마무리" subtitle="오늘 하루를 되돌아보세요" />
      <NightFlow
        reflection={data.reflection}
        dailyState={data.dailyState}
        completedActions={data.completedActions}
      />
    </>
  )
}
