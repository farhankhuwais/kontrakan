import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import KamarSection from '@/components/KamarSection'
import FasilitasSection from '@/components/FasilitasSection'
import KontakSection from '@/components/KontakSection'
import Footer from '@/components/Footer'

export default async function Home() {
  const supabase = await createClient()

  const { data: profil } = await supabase
    .from('kos_profile')
    .select('*')
    .limit(1)
    .maybeSingle()

  const { data: kamarList } = await supabase
    .from('kamar')
    .select('*, foto:kamar_foto(*)')
    .order('urutan')

  const namaKos = profil?.nama_kos ?? 'Achi Kosan'
  const alamat = profil?.alamat ?? ''
  const deskripsi = profil?.deskripsi ?? ''
  const noWhatsapp = profil?.no_whatsapp ?? ''
  const fasilitas: string[] = profil?.fasilitas ?? []
  const mapsEmbedUrl = profil?.maps_embed_url ?? null
  const fotoHero = profil?.foto_hero ?? null
  const mitra: string[] = profil?.mitra ?? []
  const gambarFasilitas: string[] = profil?.fasilitas_foto ?? []

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
        <KamarSection kamarList={kamarList ?? []} noWhatsapp={noWhatsapp} alamat={alamat} mapsEmbedUrl={mapsEmbedUrl} />
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
