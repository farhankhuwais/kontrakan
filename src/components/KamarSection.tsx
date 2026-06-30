import type { Kamar } from '@/lib/types'
import KamarCard from './KamarCard'

interface KamarSectionProps {
  kamarList: Kamar[]
  noWhatsapp: string
  alamat: string
  mapsEmbedUrl: string | null
}

export default function KamarSection({ kamarList, noWhatsapp, alamat, mapsEmbedUrl }: KamarSectionProps) {
  const kamarVisible = kamarList
    .filter((k) => k.is_visible)
    .sort((a, b) => a.urutan - b.urutan)

  if (kamarVisible.length === 0) return null

  return (
    <section id="kamar" className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-dark text-center mb-4">
          Kamar Tersedia
        </h2>
        <p className="text-dark-muted text-center mb-12 max-w-md mx-auto">
          Pilih kamar yang sesuai dengan kebutuhan Anda
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {kamarVisible.map((kamar) => (
            <KamarCard key={kamar.id} kamar={kamar} noWhatsapp={noWhatsapp} alamat={alamat} mapsEmbedUrl={mapsEmbedUrl} />
          ))}
        </div>
      </div>
    </section>
  )
}
