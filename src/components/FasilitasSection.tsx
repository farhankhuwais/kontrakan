import Image from 'next/image'
import {
  WifiIcon,
  SparklesIcon,
  TruckIcon,
  HomeIcon,
  FireIcon,
  BoltIcon,
  BeakerIcon,
  SunIcon,
  AdjustmentsHorizontalIcon,
  TvIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline'

const iconMap: Record<string, typeof WifiIcon> = {
  wifi: WifiIcon,
  ac: SparklesIcon,
  parkir: TruckIcon,
  kamar_mandi: HomeIcon,
  dapur: FireIcon,
  listrik: BoltIcon,
  air: BeakerIcon,
  balkon: SunIcon,
  laundry: AdjustmentsHorizontalIcon,
  tv: TvIcon,
  default: RectangleStackIcon,
}

function getIconKey(f: string): string {
  const lower = f.toLowerCase()
  if (lower.includes('wifi')) return 'wifi'
  if (lower.includes('ac') || lower.includes('pendingin')) return 'ac'
  if (lower.includes('parkir')) return 'parkir'
  if (lower.includes('kamar mandi') || lower.includes('wc') || lower.includes('toilet')) return 'kamar_mandi'
  if (lower.includes('dapur')) return 'dapur'
  if (lower.includes('listrik')) return 'listrik'
  if (lower.includes('air')) return 'air'
  if (lower.includes('balkon') || lower.includes('teras')) return 'balkon'
  if (lower.includes('laundry') || lower.includes('cuci')) return 'laundry'
  if (lower.includes('tv')) return 'tv'
  return 'default'
}

const colors = [
  { bg: 'bg-sky-50', text: 'text-sky-700', icon: 'text-sky-500' },
  { bg: 'bg-violet-50', text: 'text-violet-700', icon: 'text-violet-500' },
  { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-500' },
  { bg: 'bg-rose-50', text: 'text-rose-700', icon: 'text-rose-500' },
  { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: 'text-cyan-500' },
  { bg: 'bg-lime-50', text: 'text-lime-700', icon: 'text-lime-500' },
  { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: 'text-indigo-500' },
  { bg: 'bg-pink-50', text: 'text-pink-700', icon: 'text-pink-500' },
  { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'text-orange-500' },
  { bg: 'bg-teal-50', text: 'text-teal-700', icon: 'text-teal-500' },
]

interface FasilitasSectionProps {
  fasilitas: string[]
  gambarFasilitas?: string[]
  namaKos: string
}

export default function FasilitasSection({ fasilitas, gambarFasilitas, namaKos }: FasilitasSectionProps) {
  if (!fasilitas?.length) return null

  return (
    <section id="fasilitas" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left – collage */}
          <div className="relative">
            {gambarFasilitas && gambarFasilitas.length > 0 ? (
              gambarFasilitas.length === 1 ? (
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src={gambarFasilitas[0]}
                    alt={namaKos}
                    width={800}
                    height={600}
                    unoptimized
                    className="w-full h-[420px] object-cover"
                  />
                </div>
              ) : (
                <div className={`grid gap-3 aspect-[4/3] ${gambarFasilitas.length === 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
                  <div className={`overflow-hidden rounded-2xl ${gambarFasilitas.length >= 3 ? 'col-span-2 row-span-2' : ''}`}>
                    <Image
                      src={gambarFasilitas[0]}
                      alt={namaKos}
                      width={600}
                      height={600}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {gambarFasilitas.length === 2 ? (
                    <div className="overflow-hidden rounded-2xl">
                      <Image
                        src={gambarFasilitas[1]}
                        alt={`${namaKos} 2`}
                        width={600}
                        height={600}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    gambarFasilitas.slice(1, 4).map((f, i) => (
                      <div key={i} className="overflow-hidden rounded-2xl">
                        <Image
                          src={f}
                          alt={`${namaKos} ${i + 2}`}
                          width={300}
                          height={300}
                          unoptimized
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))
                  )}
                </div>
              )
            ) : (
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-secondary/60 via-primary-light to-secondary/50 flex items-center justify-center border border-secondary">
                <div className="text-center px-8">
                  <svg className="w-16 h-16 mx-auto mb-4 text-dark-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l1.409 1.409a2.25 2.25 0 003.182 0l3.909-3.909M3.75 21h16.5M5.25 3.75v15m13.5-15v15" />
                  </svg>
                  <p className="text-dark-muted/70 text-sm">Foto fasilitas belum tersedia</p>
                </div>
              </div>
            )}

            {/* Decorative blob behind */}
            <div
              aria-hidden
              className="absolute -z-10 -bottom-6 -right-6 h-64 w-64 opacity-20"
              style={{
                background: '#e1d9d4',
                borderRadius: '53% 47% 50% 50% / 42% 48% 52% 58%',
              }}
            />
          </div>

          {/* Right – facility cards */}
          <div>
            <p className="mb-2 text-sm font-semibold tracking-widest uppercase text-dark-muted">
              Fasilitas
            </p>
            <h2 className="mb-8 text-3xl lg:text-4xl font-extrabold text-dark">
              Kenyamanan Terbaik <br />
              <span className="text-dark">Untuk Anda</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {fasilitas.map((f, idx) => {
                const c = colors[idx % colors.length]
                const iconKey = getIconKey(f)
                return (
                  <div
                    key={idx}
                    className="group flex items-start gap-4 rounded-2xl p-4 transition-all hover:shadow-md"
                  >
                    <div className={`shrink-0 rounded-xl p-3 ${c.bg} ${c.icon}`}>
                      {(() => {
                        const Icon = iconMap[iconKey] || iconMap.default
                        return <Icon className="w-6 h-6" strokeWidth={1.5} />
                      })()}
                    </div>
                    <div>
                      <p className={`font-semibold ${c.text}`}>{f}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
