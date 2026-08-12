import { createClient } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { deleteUpload } from '@/lib/storage'

type KamarRow = {
  id: string
  nama_kamar: string
  harga: string
  deskripsi: string
  alamat: string
  maps_url: string | null
  status: string
  urutan: number
  is_visible: boolean
  created_at: Date
  updated_at: Date
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const db = createClient()

  const rows = await db`
    update kamar set
      nama_kamar = ${String(body.nama_kamar ?? '')},
      harga = ${Number(body.harga ?? 0)},
      deskripsi = ${String(body.deskripsi ?? '')},
      alamat = ${String(body.alamat ?? '')},
      maps_url = ${body.maps_url ? String(body.maps_url) : null},
      status = ${String(body.status ?? 'tersedia')},
      urutan = ${Number(body.urutan ?? 0)},
      is_visible = ${body.is_visible !== false}
    where id = ${id}
    returning *
  `

  if (!rows[0]) {
    return NextResponse.json({ error: 'Kamar tidak ditemukan' }, { status: 404 })
  }

  const row = rows[0] as KamarRow
  return NextResponse.json({
    ...row,
    harga: Number(row.harga),
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const db = createClient()

  // Hapus dulu file foto dari disk, baru hapus baris (cascade ke kamar_foto)
  const fotos = await db`select foto_url from kamar_foto where kamar_id = ${id}`
  for (const f of fotos) {
    await deleteUpload(f.foto_url)
  }

  await db`delete from kamar where id = ${id}`
  return NextResponse.json({ success: true })
}
