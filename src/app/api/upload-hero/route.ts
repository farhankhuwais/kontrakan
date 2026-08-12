import { createClient } from '@/lib/db'
import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth'
import { saveUpload, deleteUpload } from '@/lib/storage'

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'File required' }, { status: 400 })
  }

  const db = createClient()
  const rows = await db`select id, foto_hero from kos_profile limit 1`
  const existing = rows[0]
  if (!existing) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const url = await saveUpload(file, 'hero')

  // Hapus foto hero lama kalau ada
  if (existing.foto_hero) {
    await deleteUpload(existing.foto_hero)
  }

  const updated = await db`
    update kos_profile set foto_hero = ${url}
    where id = ${existing.id}
    returning *
  `

  return NextResponse.json(updated[0])
}

export async function DELETE() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createClient()
  const rows = await db`select id, foto_hero from kos_profile limit 1`
  const profil = rows[0]
  if (!profil) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (profil.foto_hero) {
    await deleteUpload(profil.foto_hero)
  }

  await db`update kos_profile set foto_hero = null where id = ${profil.id}`
  return NextResponse.json({ success: true })
}
