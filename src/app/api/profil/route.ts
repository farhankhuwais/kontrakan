import { createClient } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'

type ProfilRow = {
  id: string
  nama_kos: string
  alamat: string
  deskripsi: string
  no_whatsapp: string
  maps_embed_url: string | null
  fasilitas: string[]
  fasilitas_foto: string[]
  mitra: string[]
  foto_hero: string | null
  favicon: string | null
  created_at: Date
  updated_at: Date
}

function mapProfil(r: ProfilRow) {
  return {
    ...r,
    fasilitas: Array.isArray(r.fasilitas) ? r.fasilitas : [],
    fasilitas_foto: Array.isArray(r.fasilitas_foto) ? r.fasilitas_foto : [],
    mitra: Array.isArray(r.mitra) ? r.mitra : [],
    created_at: r.created_at.toISOString(),
    updated_at: r.updated_at.toISOString(),
  }
}

export async function GET() {
  const db = createClient()
  const rows = await db<ProfilRow[]>`select * from kos_profile limit 1`
  if (!rows[0]) {
    return NextResponse.json({ error: 'Profil belum ada' }, { status: 404 })
  }
  return NextResponse.json(mapProfil(rows[0]))
}

export async function PUT(request: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const db = createClient()

  const rows = await db`
    update kos_profile set
      nama_kos = ${String(body.nama_kos ?? '')},
      alamat = ${String(body.alamat ?? '')},
      deskripsi = ${String(body.deskripsi ?? '')},
      no_whatsapp = ${String(body.no_whatsapp ?? '')},
      foto_hero = ${body.foto_hero ? String(body.foto_hero) : null},
      maps_embed_url = ${body.maps_embed_url ? String(body.maps_embed_url) : null},
      fasilitas = ${body.fasilitas ?? []},
      fasilitas_foto = ${body.fasilitas_foto ?? []},
      mitra = ${body.mitra ?? []}
    where id = ${String(body.id)}
    returning *
  `

  if (!rows[0]) {
    return NextResponse.json({ error: 'Profil tidak ditemukan' }, { status: 404 })
  }

  return NextResponse.json(mapProfil(rows[0] as ProfilRow))
}
