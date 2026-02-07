import { getTimerData } from '@/lib/infp/queries'
import { redirect } from 'next/navigation'
import TimerView from '@/components/infp/timer/TimerView'

export const dynamic = 'force-dynamic'

interface TimerPageProps {
  params: Promise<{ microActionId: string }>
}

export default async function TimerPage({ params }: TimerPageProps) {
  const { microActionId } = await params
  const microAction = await getTimerData(microActionId)

  if (!microAction) {
    redirect('/morning')
  }

  return <TimerView microAction={microAction} />
}
