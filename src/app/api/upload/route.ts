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
  const kamarId = formData.get('kamar_id') as string | null

  if (!file || !kamarId) {
    return NextResponse.json({ error: 'File and kamar_id required' }, { status: 400 })
  }

  const url = await saveUpload(file, 'kamar')
  const db = createClient()

  const rows = await db`
    insert into kamar_foto (kamar_id, foto_url, urutan)
    values (${kamarId}, ${url}, 0)
    returning *
  `

  return NextResponse.json(rows[0])
}

export async function DELETE(request: Request) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { foto_id, foto_url } = await request.json()

  if (foto_url) {
    await deleteUpload(foto_url)
  }

  if (foto_id) {
    const db = createClient()
    await db`delete from kamar_foto where id = ${foto_id}`
  }

  return NextResponse.json({ success: true })
}
