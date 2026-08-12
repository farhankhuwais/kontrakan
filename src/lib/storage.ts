import { mkdir, writeFile, unlink } from 'fs/promises'
import path from 'path'

export const UPLOAD_DIR = process.env.UPLOAD_DIR || '/data/uploads'

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  heic: 'image/heic',
}

export function mimeFor(filename: string): string {
  const ext = path.extname(filename).slice(1).toLowerCase()
  return MIME_TYPES[ext] ?? 'application/octet-stream'
}

export async function saveUpload(file: File, category: string): Promise<string> {
  const ext = path.extname(file.name).slice(1).toLowerCase() || 'bin'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const dir = path.join(UPLOAD_DIR, category)
  await mkdir(dir, { recursive: true })
  const buf = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(dir, filename), buf)
  return `/api/files/${category}/${filename}`
}

export async function deleteUpload(url: string): Promise<void> {
  // url berbentuk: /api/files/<kategori>/<nama-file>
  const m = url.match(/^\/api\/files\/(.+)$/)
  if (!m) return
  const full = path.join(UPLOAD_DIR, m[1])
  const root = path.resolve(UPLOAD_DIR)
  if (!full.startsWith(root)) return
  try {
    await unlink(full)
  } catch {
    // file sudah tidak ada — abaikan
  }
}
