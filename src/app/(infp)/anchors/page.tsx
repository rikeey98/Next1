import { getUserAnchors } from '@/lib/infp/queries'
import { redirect } from 'next/navigation'
import DateHeader from '@/components/infp/shared/DateHeader'
import AnchorManager from '@/components/infp/anchors/AnchorManager'

export const dynamic = 'force-dynamic'

export default async function AnchorsPage() {
  const anchors = await getUserAnchors()
  if (!anchors) redirect('/login')

  return (
    <>
      <DateHeader title="정체성 앵커" subtitle="나를 정의하는 앵커를 관리하세요" />
      <AnchorManager anchors={anchors} />
    </>
  )
}
