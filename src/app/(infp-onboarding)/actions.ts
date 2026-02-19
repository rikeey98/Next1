'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeOnboardingAction(anchors: { text: string; sort_order: number }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  console.log('[Server Action] Starting onboarding completion for user:', user.id)

  // Check if profile exists, if not create it
  const { data: existingProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('id, onboarding_completed')
    .eq('id', user.id)
    .maybeSingle()

  console.log('[Server Action] Existing profile:', existingProfile, 'Error:', fetchError)

  if (!existingProfile) {
    console.log('[Server Action] Profile not found, creating...')
    const { error: createError } = await supabase
      .from('profiles')
      .insert({ id: user.id, onboarding_completed: false })

    if (createError) {
      console.error('[Server Action] Failed to create profile:', createError)
      throw createError
    }
  }

  // Check if anchors already exist (prevent duplicates)
  const { data: existingAnchors } = await supabase
    .from('anchors')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  if (existingAnchors && existingAnchors.length > 0) {
    console.log('[Server Action] Anchors already exist, skipping insertion')
  } else {
    // Insert anchors
    const { error: anchorsError } = await supabase.from('anchors').insert(
      anchors.map((a) => ({
        user_id: user.id,
        text: a.text,
        sort_order: a.sort_order,
      }))
    )

    if (anchorsError) {
      console.error('[Server Action] Failed to insert anchors:', anchorsError)
      throw anchorsError
    }

    console.log('[Server Action] Anchors inserted successfully')
  }

  // Update onboarding_completed
  const { data: updatedProfile, error: profileError } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id)
    .select()

  if (profileError) {
    console.error('[Server Action] Failed to update profile:', profileError)
    throw profileError
  }

  console.log('[Server Action] Profile updated:', updatedProfile)
  console.log('[Server Action] Onboarding completed successfully, redirecting to /infp/morning')

  // Redirect to morning page
  redirect('/infp/morning')
}
