import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'File required' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('kos_profile')
    .select('id, foto_hero')
    .limit(1)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `hero/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('kamar-photos')
    .upload(fileName, file, { cacheControl: '3600', upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('kamar-photos')
    .getPublicUrl(fileName)

  if (existing.foto_hero) {
    const oldPath = existing.foto_hero.split('/').slice(-2).join('/')
    await supabase.storage.from('kamar-photos').remove([oldPath])
  }

  const { data: profil, error: profilError } = await supabase
    .from('kos_profile')
    .update({ foto_hero: publicUrl })
    .eq('id', existing.id)
    .select()
    .single()

  if (profilError) {
    return NextResponse.json({ error: profilError.message }, { status: 500 })
  }

  return NextResponse.json(profil)
}

export async function DELETE() {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profil } = await supabase
    .from('kos_profile')
    .select('id, foto_hero')
    .limit(1)
    .single()

  if (!profil) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (profil.foto_hero) {
    const path = profil.foto_hero.split('/').slice(-2).join('/')
    await supabase.storage.from('kamar-photos').remove([path])
  }

  await supabase
    .from('kos_profile')
    .update({ foto_hero: null })
    .eq('id', profil.id)

  return NextResponse.json({ success: true })
}
