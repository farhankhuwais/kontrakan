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
  const kamarId = formData.get('kamar_id') as string | null

  if (!file || !kamarId) {
    return NextResponse.json({ error: 'File and kamar_id required' }, { status: 400 })
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${kamarId}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('kamar-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('kamar-photos')
    .getPublicUrl(fileName)

  const { data: fotoData, error: fotoError } = await supabase
    .from('kamar_foto')
    .insert({
      kamar_id: kamarId,
      foto_url: publicUrl,
      urutan: 0,
    })
    .select()
    .single()

  if (fotoError) {
    return NextResponse.json({ error: fotoError.message }, { status: 500 })
  }

  return NextResponse.json(fotoData)
}

export async function DELETE(request: Request) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { foto_id, foto_url } = await request.json()

  if (foto_url) {
    const path = foto_url.split('/').slice(-2).join('/')
    await supabase.storage.from('kamar-photos').remove([path])
  }

  if (foto_id) {
    await supabase.from('kamar_foto').delete().eq('id', foto_id)
  }

  return NextResponse.json({ success: true })
}
