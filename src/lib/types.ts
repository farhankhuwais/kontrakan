export interface KosProfile {
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
  created_at: string
  updated_at: string
}

export interface Kamar {
  id: string
  nama_kamar: string
  harga: number
  deskripsi: string
  alamat: string
  maps_url: string | null
  status: 'tersedia' | 'penuh'
  urutan: number
  is_visible: boolean
  created_at: string
  updated_at: string
  foto: KamarFoto[]
}

export interface KamarFoto {
  id: string
  kamar_id: string
  foto_url: string
  urutan: number
}

export interface AdminUser {
  id: string
  email: string
}
