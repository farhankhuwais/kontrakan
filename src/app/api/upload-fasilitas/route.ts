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
  const indexStr = formData.get('index') as string | null

  if (!file) {
    return NextResponse.json({ error: 'File required' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('kos_profile')
    .select('id, fasilitas_foto')
    .limit(1)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `fasilitas/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('kamar-photos')
    .upload(fileName, file, { cacheControl: '3600', upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('kamar-photos')
    .getPublicUrl(fileName)

  const currentFotos: string[] = (existing.fasilitas_foto as string[]) ?? []
  const newFotos = indexStr !== null
    ? currentFotos.map((f, i) => i === parseInt(indexStr) ? publicUrl : f)
    : [...currentFotos, publicUrl]

  const { data: profil, error: profilError } = await supabase
    .from('kos_profile')
    .update({ fasilitas_foto: newFotos })
    .eq('id', existing.id)
    .select()
    .single()

  if (profilError) {
    return NextResponse.json({ error: profilError.message }, { status: 500 })
  }

  return NextResponse.json(profil)
}

export async function DELETE(request: Request) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { foto_url } = await request.json()

  const { data: profil } = await supabase
    .from('kos_profile')
    .select('id, fasilitas_foto')
    .limit(1)
    .single()

  if (!profil) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (foto_url) {
    const path = foto_url.split('/').slice(-2).join('/')
    await supabase.storage.from('kamar-photos').remove([path])
  }

  const currentFotos: string[] = (profil.fasilitas_foto as string[]) ?? []
  const newFotos = currentFotos.filter((f) => f !== foto_url)

  await supabase
    .from('kos_profile')
    .update({ fasilitas_foto: newFotos })
    .eq('id', profil.id)

  return NextResponse.json({ success: true })
}
