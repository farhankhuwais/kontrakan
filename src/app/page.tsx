import { createClient } from '@/lib/db'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import KamarSection from '@/components/KamarSection'
import FasilitasSection from '@/components/FasilitasSection'
import KontakSection from '@/components/KontakSection'
import Footer from '@/components/Footer'

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
}

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
  foto: { id: string; kamar_id: string; foto_url: string; urutan: number }[]
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  const db = createClient()

  const profilRows = await db<ProfilRow[]>`select * from kos_profile limit 1`
  const profil = profilRows[0]

  const kamarRows = await db<KamarRow[]>`
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
    where k.is_visible = true
    group by k.id
    order by k.urutan
  `

  const namaKos = profil?.nama_kos ?? 'Achi Kosan'
  const alamat = profil?.alamat ?? ''
  const deskripsi = profil?.deskripsi ?? ''
  const noWhatsapp = profil?.no_whatsapp ?? ''
  const fasilitas: string[] = Array.isArray(profil?.fasilitas) ? profil!.fasilitas : []
  const mapsEmbedUrl = profil?.maps_embed_url ?? null
  const fotoHero = profil?.foto_hero ?? null
  const mitra: string[] = Array.isArray(profil?.mitra) ? profil!.mitra : []
  const gambarFasilitas: string[] = Array.isArray(profil?.fasilitas_foto) ? profil!.fasilitas_foto : []

  const kamarList = kamarRows.map((k) => ({
    ...k,
    harga: Number(k.harga),
    status: k.status as 'tersedia' | 'penuh',
    created_at: k.created_at.toISOString(),
    updated_at: k.updated_at.toISOString(),
  }))

  return (
    <>
      <Navbar namaKos={namaKos} />
      <main>
        <Hero
          namaKos={namaKos}
          deskripsi={deskripsi}
          alamat={alamat}
          fotoHero={fotoHero}
          mitra={mitra}
        />
        <KamarSection kamarList={kamarList} noWhatsapp={noWhatsapp} alamat={alamat} mapsEmbedUrl={mapsEmbedUrl} />
        <FasilitasSection fasilitas={fasilitas} namaKos={namaKos} gambarFasilitas={gambarFasilitas} />
        <KontakSection
          alamat={alamat}
          noWhatsapp={noWhatsapp}
          mapsEmbedUrl={mapsEmbedUrl}
          namaKos={namaKos}
        />
      </main>
      <Footer namaKos={namaKos} alamat={alamat} noWhatsapp={noWhatsapp} />
    </>
  )
}
