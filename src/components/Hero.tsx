import Image from 'next/image'

interface HeroProps {
  namaKos: string
  deskripsi: string
  alamat: string
  fotoHero: string | null
  mitra?: string[]
}

export default function Hero({ namaKos, deskripsi, alamat, fotoHero, mitra }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-24 lg:pt-28 bg-gradient-to-br from-primary-light to-white">
      {/* Blob decoration */}
      <div
        aria-hidden
        className="absolute -left-20 -top-10 -z-10 h-[640px] w-[680px] opacity-40"
        style={{
          background: '#93afc2',
          borderRadius: '62% 38% 55% 45% / 50% 60% 40% 50%',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-6 pb-20 lg:pb-32 lg:pt-16">
          {/* Left */}
          <div className="relative flex flex-col items-start gap-6 py-8 lg:py-16">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.05] text-dark tracking-tight">
              {namaKos}
            </h1>
            <p className="max-w-md text-base lg:text-lg text-dark-muted leading-relaxed">
              {deskripsi}
            </p>
            <div className="flex items-center gap-2 text-dark-muted/70">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">{alamat}</span>
            </div>

            <a
              href="#kamar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-btn text-white font-semibold rounded-xl hover:bg-btn-hover transition-all shadow-md hover:shadow-lg"
            >
              Lihat Kamar Tersedia
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>

            {mitra && mitra.length > 0 && (
            <div className="mt-4">
              <p className="mb-4 text-sm font-semibold text-dark-muted">Kemitraan Kami</p>
              <div className="flex flex-wrap items-center gap-3">
                {mitra.map((p) => (
                  <span
                    key={p}
                    className="rounded-md bg-white/70 px-3 py-1.5 text-sm font-semibold text-dark shadow-sm border border-secondary"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            )}
          </div>

          {/* Right image */}
          <div className="relative">
            <div
              className="overflow-hidden"
              style={{ borderRadius: '40% 60% 55% 45% / 50% 45% 55% 50%' }}
            >
              {fotoHero ? (
                <Image
                  src={fotoHero}
                  alt={namaKos}
                  width={1280}
                  height={1280}
                  unoptimized
                  className="h-[420px] lg:h-[600px] w-full object-cover"
                  priority
                />
              ) : (
                <div className="h-[420px] lg:h-[600px] w-full bg-gradient-to-br from-secondary/60 to-primary-light flex items-center justify-center">
                  <svg className="w-20 h-20 text-dark-muted/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
