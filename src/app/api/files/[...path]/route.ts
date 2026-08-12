import { readFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { UPLOAD_DIR, mimeFor } from '@/lib/storage'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params
  const rel = segments.join('/')
  const full = path.join(UPLOAD_DIR, rel)
  const root = path.resolve(UPLOAD_DIR)

  if (!full.startsWith(root)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const buf = await readFile(full)
    return new NextResponse(buf, {
      headers: {
        'Content-Type': mimeFor(rel),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}
