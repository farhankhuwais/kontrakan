import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('kamar')
    .select('*, foto:kamar_foto(*)')
    .order('urutan')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const { data, error } = await supabase
    .from('kamar')
    .insert({
      nama_kamar: body.nama_kamar,
      harga: body.harga,
      deskripsi: body.deskripsi ?? '',
      alamat: body.alamat ?? '',
      maps_url: body.maps_url ?? null,
      status: body.status ?? 'tersedia',
      urutan: body.urutan ?? 0,
      is_visible: body.is_visible ?? true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
