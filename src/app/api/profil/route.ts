import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('kos_profile')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: Request) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('kos_profile')
    .update({
      nama_kos: body.nama_kos,
      alamat: body.alamat,
      deskripsi: body.deskripsi,
      no_whatsapp: body.no_whatsapp,
      foto_hero: body.foto_hero ?? null,
      maps_embed_url: body.maps_embed_url ?? null,
      fasilitas: body.fasilitas ?? [],
      fasilitas_foto: body.fasilitas_foto ?? [],
      mitra: body.mitra ?? [],
    })
    .eq('id', body.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
