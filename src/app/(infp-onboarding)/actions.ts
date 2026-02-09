'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function completeOnboardingAction(anchors: { text: string; sort_order: number }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Insert anchors
  const { error: anchorsError } = await supabase.from('anchors').insert(
    anchors.map((a) => ({
      user_id: user.id,
      text: a.text,
      sort_order: a.sort_order,
    }))
  )

  if (anchorsError) {
    console.error('Failed to insert anchors:', anchorsError)
    throw anchorsError
  }

  // Update onboarding_completed
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id)

  if (profileError) {
    console.error('Failed to update profile:', profileError)
    throw profileError
  }

  console.log('Onboarding completed successfully for user:', user.id)

  // Redirect to morning page
  redirect('/morning')
}
