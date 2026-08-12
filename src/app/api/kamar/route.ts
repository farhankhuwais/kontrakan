import { createClient } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'

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
  foto: { id: string; kamar_id: string; foto_url: string; urutan: number }[] | null
}

export async function GET() {
  const db = createClient()
  const rows = await db<KamarRow[]>`
    select k.*,
      coalesce(
        json_agg(
          json_build_object('id', f.id, 'kamar_id', f.kamar_id, 'foto_url', f.foto_url, 'urutan', f.urutan)
          order by f.urutan
        ) filter (where f.id is not null),
        '[]'
      ) as foto
    from kamar k
    left join kamar_foto f on f.kamar_id = k.id
    group by k.id
    order by k.urutan
  `

  const data = rows.map((r) => ({
    ...r,
    harga: Number(r.harga),
    created_at: r.created_at.toISOString(),
    updated_at: r.updated_at.toISOString(),
  }))

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const db = createClient()

  const rows = await db`
    insert into kamar (nama_kamar, harga, deskripsi, alamat, maps_url, status, urutan, is_visible)
    values (
      ${String(body.nama_kamar ?? '')},
      ${Number(body.harga ?? 0)},
      ${String(body.deskripsi ?? '')},
      ${String(body.alamat ?? '')},
      ${body.maps_url ? String(body.maps_url) : null},
      ${String(body.status ?? 'tersedia')},
      ${Number(body.urutan ?? 0)},
      ${body.is_visible !== false}
    )
    returning *
  `

  const row = rows[0] as KamarRow
  return NextResponse.json({
    ...row,
    harga: Number(row.harga),
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
    foto: [],
  })
}
