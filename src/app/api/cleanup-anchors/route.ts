import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get all anchors for the user
    const { data: anchors, error: fetchError } = await supabase
      .from('anchors')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (fetchError) {
      throw fetchError
    }

    if (!anchors || anchors.length === 0) {
      return NextResponse.json({
        message: '앵커가 없습니다.',
        anchors: []
      })
    }

    // Find duplicates by text
    const seenTexts = new Map<string, string>() // text -> first anchor id
    const duplicateIds: string[] = []

    for (const anchor of anchors) {
      if (seenTexts.has(anchor.text)) {
        // This is a duplicate
        duplicateIds.push(anchor.id)
      } else {
        // First occurrence
        seenTexts.set(anchor.text, anchor.id)
      }
    }

    if (duplicateIds.length === 0) {
      return NextResponse.json({
        message: '중복된 앵커가 없습니다.',
        totalAnchors: anchors.length,
        uniqueAnchors: anchors.map(a => ({ id: a.id, text: a.text }))
      })
    }

    // Delete duplicates
    const { error: deleteError } = await supabase
      .from('anchors')
      .delete()
      .in('id', duplicateIds)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({
      message: '중복 제거 완료',
      totalAnchors: anchors.length,
      deletedCount: duplicateIds.length,
      remainingCount: anchors.length - duplicateIds.length,
      deletedAnchors: anchors
        .filter(a => duplicateIds.includes(a.id))
        .map(a => ({ id: a.id, text: a.text })),
      remainingAnchors: anchors
        .filter(a => !duplicateIds.includes(a.id))
        .map(a => ({ id: a.id, text: a.text }))
    })
  } catch (error) {
    console.error('Failed to cleanup anchors:', error)
    return NextResponse.json({
      error: 'Failed to cleanup anchors',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
