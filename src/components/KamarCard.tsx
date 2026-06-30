'use client'

import { useState } from 'react'
import type { Kamar } from '@/lib/types'
import Image from 'next/image'

const badgeStyles: Record<string, string> = {
  tersedia: 'bg-green-50 text-green-600',
  penuh: 'bg-red-50/80 text-red-500',
}

const badgeLabels: Record<string, string> = {
  tersedia: 'Tersedia',
  penuh: 'Penuh',
}

interface KamarCardProps {
  kamar: Kamar
  noWhatsapp: string
  alamat: string
  mapsEmbedUrl: string | null
}

export default function KamarCard({ kamar, noWhatsapp, alamat, mapsEmbedUrl }: KamarCardProps) {
  const tersedia = kamar.status === 'tersedia'
  const fotoList = kamar.foto?.sort((a, b) => a.urutan - b.urutan) ?? []
  const [fotoIdx, setFotoIdx] = useState(0)

  const waUrl = `https://wa.me/${noWhatsapp}?text=${encodeURIComponent(
    `Halo, saya tertarik dengan kamar ${kamar.nama_kamar}`
  )}`

  const alamatTampil = kamar.alamat || alamat
  const linkMaps = kamar.maps_url || mapsEmbedUrl
  const mapsUrl = linkMaps
    ? linkMaps.replace('/embed', '')
    : `https://www.google.com/maps/search/${encodeURIComponent(alamatTampil)}`

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100 flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {fotoList.length > 0 ? (
          <>
            <Image
              src={fotoList[fotoIdx].foto_url}
              alt={`${kamar.nama_kamar} - Foto ${fotoIdx + 1}`}
              fill
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {fotoList.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFotoIdx((fotoIdx - 1 + fotoList.length) % fotoList.length)
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-dark flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity hover:bg-white shadow-sm"
                  aria-label="Foto sebelumnya"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFotoIdx((fotoIdx + 1) % fotoList.length)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 text-dark flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 opacity-100 transition-opacity hover:bg-white shadow-sm"
                  aria-label="Foto berikutnya"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {fotoList.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation()
                        setFotoIdx(i)
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === fotoIdx
                          ? 'bg-white w-3'
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Foto ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-dark-muted/40">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${badgeStyles[kamar.status] || 'bg-primary-light text-dark-muted'}`}>
          {badgeLabels[kamar.status] || kamar.status}
        </span>

        {fotoList.length > 1 && (
          <span className="absolute top-4 right-4 px-2 py-0.5 rounded bg-black/40 text-white text-[10px] font-medium">
            {fotoIdx + 1}/{fotoList.length}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-display font-bold text-dark">
          {kamar.nama_kamar}
        </h3>
        <p className="text-xl font-bold text-dark mt-1">
          Rp {kamar.harga.toLocaleString('id-ID')}
          <span className="text-sm font-normal text-dark-muted"> /bulan</span>
        </p>

        <p className="text-sm text-dark-muted mt-2 leading-relaxed line-clamp-2">
          {kamar.deskripsi}
        </p>

        {alamatTampil && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1.5 text-xs text-dark-muted/70 hover:text-dark transition-colors"
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{alamatTampil}</span>
          </a>
        )}

        <div className="flex-1" />

        <a
          href={tersedia ? waUrl : undefined}
          target={tersedia ? '_blank' : undefined}
          rel={tersedia ? 'noopener noreferrer' : undefined}
          className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            tersedia
              ? 'bg-btn text-white hover:bg-btn-hover shadow-sm hover:shadow-md'
              : 'bg-primary-light/60 text-dark-muted/50 cursor-not-allowed'
          }`}
          onClick={(e) => { if (!tersedia) e.preventDefault() }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {tersedia ? 'Hubungi via WhatsApp' : 'Tidak tersedia'}
        </a>
      </div>
    </div>
  )
}
