import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function uploadProfileImage(file: File, fileName: string): Promise<string | null> {
  const { data, error } = await supabase
    .storage
    .from('user-profile-images')  // your bucket name
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    console.error('Image upload error:', error)
    return null
  }

  // Get public URL
  const { publicUrl } = supabase
    .storage
    .from('user-profile-images')
    .getPublicUrl(fileName).data

  return publicUrl
}

export async function updateUserProfile(userId: string, imageUrl: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .update({ profile_image: imageUrl })
    .eq('id', userId)

  if (error) {
    console.error('Profile update error:', error)
    return false
  }

  return true
}