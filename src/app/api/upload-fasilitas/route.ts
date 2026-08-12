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
  const indexStr = formData.get('index') as string | null

  if (!file) {
    return NextResponse.json({ error: 'File required' }, { status: 400 })
  }

  const db = createClient()
  const rows = await db`select id, fasilitas_foto from kos_profile limit 1`
  const existing = rows[0]
  if (!existing) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const url = await saveUpload(file, 'fasilitas')

  const currentFotos: string[] = Array.isArray(existing.fasilitas_foto)
    ? existing.fasilitas_foto
    : []

  let newFotos: string[]
  if (indexStr !== null) {
    const idx = parseInt(indexStr, 10)
    // Hapus file lama yang diganti
    if (currentFotos[idx]) {
      await deleteUpload(currentFotos[idx])
    }
    newFotos = currentFotos.map((f, i) => (i === idx ? url : f))
  } else {
    newFotos = [...currentFotos, url]
  }

  const updated = await db`
    update kos_profile set fasilitas_foto = ${newFotos}
    where id = ${existing.id}
    returning *
  `

  return NextResponse.json(updated[0])
}

export async function DELETE(request: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { foto_url } = await request.json()
  const db = createClient()

  const rows = await db`select id, fasilitas_foto from kos_profile limit 1`
  const profil = rows[0]
  if (!profil) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (foto_url) {
    await deleteUpload(foto_url)
  }

  const currentFotos: string[] = Array.isArray(profil.fasilitas_foto)
    ? profil.fasilitas_foto
    : []
  const newFotos = currentFotos.filter((f) => f !== foto_url)

  await db`update kos_profile set fasilitas_foto = ${newFotos} where id = ${profil.id}`
  return NextResponse.json({ success: true })
}
