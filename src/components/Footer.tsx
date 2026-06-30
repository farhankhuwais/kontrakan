interface FooterProps {
  namaKos: string
  alamat: string
  noWhatsapp: string
}

export default function Footer({ namaKos, alamat, noWhatsapp }: FooterProps) {
  return (
    <footer className="bg-dark text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3 tracking-tight">{namaKos}</h3>
            <p className="text-sm text-secondary leading-relaxed">{alamat}</p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 tracking-tight">Kontak</h3>
            <p className="text-sm text-secondary">
              {noWhatsapp.startsWith('62')
                ? `+${noWhatsapp.slice(1)}`
                : noWhatsapp}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3 tracking-tight">Navigasi</h3>
            <div className="flex flex-col gap-2">
              <a href="#kamar" className="text-sm text-secondary hover:text-white transition-colors">
                Kamar
              </a>
              <a href="#fasilitas" className="text-sm text-secondary hover:text-white transition-colors">
                Fasilitas
              </a>
              <a href="#kontak" className="text-sm text-secondary hover:text-white transition-colors">
                Kontak
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-muted/50 mt-8 pt-6 text-center text-sm text-secondary/60">
          &copy; {new Date().getFullYear()} {namaKos}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
