import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Create new anchor
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { text } = await request.json()

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Get max sort_order
    const { data: anchors } = await supabase
      .from('anchors')
      .select('sort_order')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: false })
      .limit(1)

    const maxSortOrder = anchors?.[0]?.sort_order ?? -1

    const { data, error } = await supabase
      .from('anchors')
      .insert({
        user_id: user.id,
        text: text.trim(),
        sort_order: maxSortOrder + 1,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ anchor: data })
  } catch (error) {
    console.error('Failed to create anchor:', error)
    return NextResponse.json({
      error: 'Failed to create anchor',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// Update anchor
export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, text } = await request.json()

    if (!id || !text || !text.trim()) {
      return NextResponse.json({ error: 'ID and text are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('anchors')
      .update({ text: text.trim() })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ anchor: data })
  } catch (error) {
    console.error('Failed to update anchor:', error)
    return NextResponse.json({
      error: 'Failed to update anchor',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// Delete anchor
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('anchors')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete anchor:', error)
    return NextResponse.json({
      error: 'Failed to delete anchor',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
