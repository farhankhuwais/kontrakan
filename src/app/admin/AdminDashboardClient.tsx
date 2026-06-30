'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { KosProfile, Kamar } from '@/lib/types'

type Tab = 'kamar' | 'profil'

export default function AdminDashboardClient() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('kamar')
  const [profil, setProfil] = useState<KosProfile | null>(null)
  const [kamarList, setKamarList] = useState<Kamar[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [profilRes, kamarRes] = await Promise.all([
        fetch('/api/profil'),
        fetch('/api/kamar'),
      ])
      if (profilRes.ok) setProfil(await profilRes.json())
      if (kamarRes.ok) setKamarList(await kamarRes.json())
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleLogout() {
    const supabase = (await import('@/lib/supabase/client')).createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm/30">
      {/* Top Nav */}
      <nav className="bg-white border-b border-secondary/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <h1 className="font-display font-bold text-brand-text">
              Admin {profil?.nama_kos ?? 'Achi Kosan'}
            </h1>
            <div className="hidden sm:flex gap-1">
              <button
                onClick={() => setTab('kamar')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  tab === 'kamar'
                    ? 'bg-dark text-white'
                    : 'text-brand-muted hover:text-dark'
                }`}
              >
                Kamar
              </button>
              <button
                onClick={() => setTab('profil')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  tab === 'profil'
                    ? 'bg-dark text-white'
                    : 'text-brand-muted hover:text-dark'
                }`}
              >
                Profil Kos
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-muted hidden sm:block">
              {profil?.no_whatsapp && `+${profil.no_whatsapp.slice(1)}`}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-brand-danger hover:underline"
            >
              Logout
            </button>
          </div>
        </div>
        {/* Mobile tabs */}
        <div className="sm:hidden flex gap-1 px-4 pb-2">
          <button
            onClick={() => setTab('kamar')}
            className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors text-center ${
              tab === 'kamar'
                ? 'bg-dark text-white'
                : 'text-brand-muted'
            }`}
          >
            Kamar
          </button>
          <button
            onClick={() => setTab('profil')}
            className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors text-center ${
              tab === 'profil'
                ? 'bg-dark text-white'
                : 'text-brand-muted'
            }`}
          >
            Profil Kos
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'kamar' && (
          <KamarManager
            kamarList={kamarList}
            onRefresh={fetchData}
            profil={profil}
          />
        )}
        {tab === 'profil' && (
          <ProfilEditor profil={profil} onRefresh={fetchData} />
        )}
      </div>
    </div>
  )
}

/* ─────────────── KAMAR MANAGER ─────────────── */

function KamarManager({
  kamarList,
  onRefresh,
  profil,
}: {
  kamarList: Kamar[]
  onRefresh: () => void
  profil: KosProfile | null
}) {
  const [editing, setEditing] = useState<Kamar | null>(null)
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-brand-text">
          Daftar Kamar
        </h2>
        <button
          onClick={() => {
            setEditing(null)
            setShowForm(true)
          }}
          className="px-4 py-2 bg-btn text-white text-sm font-semibold rounded-card transition-all"
        >
          + Tambah Kamar
        </button>
      </div>

      {showForm && (
        <KamarForm
          kamar={editing}
          onClose={() => {
            setShowForm(false)
            setEditing(null)
          }}
          onSaved={onRefresh}
        />
      )}

      <div className="bg-white rounded-card shadow-sm border border-secondary/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-warm/30 text-brand-muted text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nama</th>
                <th className="text-left px-4 py-3 font-medium">Harga</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Tampil</th>
                <th className="text-left px-4 py-3 font-medium">Foto</th>
                <th className="text-right px-4 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/30">
              {kamarList.map((k) => (
                <tr key={k.id} className="hover:bg-warm/30/50">
                  <td className="px-4 py-3 font-medium text-brand-text">
                    {k.nama_kamar}
                  </td>
                  <td className="px-4 py-3 text-brand-muted">
                    Rp {k.harga.toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        k.status === 'tersedia'
                          ? 'bg-brand-accent/10 text-dark'
                          : 'bg-brand-danger/10 text-brand-danger'
                      }`}
                    >
                      {k.status === 'tersedia' ? 'Tersedia' : 'Penuh'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {k.is_visible ? (
                      <span className="text-dark text-xs font-medium">
                        Ya
                      </span>
                    ) : (
                      <span className="text-brand-muted text-xs font-medium">
                        Tidak
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <FotoThumbnail kamarId={k.id} foto={k.foto} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditing(k)
                          setShowForm(true)
                        }}
                        className="text-dark hover:underline text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            !confirm(
                              `Hapus ${k.nama_kamar}? Semua foto akan ikut terhapus.`
                            )
                          )
                            return
                          await fetch(`/api/kamar/${k.id}`, {
                            method: 'DELETE',
                          })
                          onRefresh()
                        }}
                        className="text-brand-danger hover:underline text-xs font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {kamarList.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-brand-muted"
                  >
                    Belum ada kamar. Klik &quot;+ Tambah Kamar&quot; untuk
                    memulai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/* ─────────────── FOTO THUMBNAIL ─────────────── */

function FotoThumbnail({
  kamarId,
  foto,
}: {
  kamarId: string
  foto?: { id: string; foto_url: string }[]
}) {
  const [uploading, setUploading] = useState(false)
  const inputId = `upload-${kamarId}`

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('kamar_id', kamarId)

    await fetch('/api/upload', { method: 'POST', body: formData })

    setUploading(false)
    window.location.reload()
  }

  async function handleDelete(fotoId: string, fotoUrl: string) {
    if (!confirm('Hapus foto ini?')) return
    await fetch('/api/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foto_id: fotoId, foto_url: fotoUrl }),
    })
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-2">
      {foto && foto.length > 0
        ? foto.map((f) => (
            <div key={f.id} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.foto_url}
                alt=""
                className="w-10 h-10 rounded object-cover"
              />
              <button
                onClick={() => handleDelete(f.id, f.foto_url)}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-danger text-white rounded-full text-[10px] leading-none opacity-0 group-hover:opacity-100 transition-opacity"
              >
                &times;
              </button>
            </div>
          ))
        : null}
      <label
        htmlFor={inputId}
        className="w-10 h-10 rounded border-2 border-dashed border-secondary/50 flex items-center justify-center cursor-pointer hover:border-dark transition-colors text-brand-muted"
      >
        {uploading ? (
          <span className="animate-ping w-2 h-2 bg-dark rounded-full" />
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
    </div>
  )
}

/* ─────────────── KAMAR FORM ─────────────── */

function KamarForm({
  kamar,
  onClose,
  onSaved,
}: {
  kamar: Kamar | null
  onClose: () => void
  onSaved: () => void
}) {
  const [namaKamar, setNamaKamar] = useState(kamar?.nama_kamar ?? '')
  const [harga, setHarga] = useState(kamar?.harga.toString() ?? '')
  const [deskripsi, setDeskripsi] = useState(kamar?.deskripsi ?? '')
  const [alamat, setAlamat] = useState(kamar?.alamat ?? '')
  const [mapsUrl, setMapsUrl] = useState(kamar?.maps_url ?? '')
  const [status, setStatus] = useState(kamar?.status ?? 'tersedia')
  const [isVisible, setIsVisible] = useState(kamar?.is_visible ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const body = {
      nama_kamar: namaKamar,
      harga: parseInt(harga.replace(/[^0-9]/g, '')) || 0,
      deskripsi,
      alamat,
      maps_url: mapsUrl || null,
      status,
      is_visible: isVisible,
      urutan: kamar?.urutan ?? 0,
    }

    try {
      const res = kamar
        ? await fetch(`/api/kamar/${kamar.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })
        : await fetch('/api/kamar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan')
      }

      onSaved()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-card shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-secondary/30">
          <h3 className="font-display font-bold text-brand-text">
            {kamar ? 'Edit Kamar' : 'Tambah Kamar'}
          </h3>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-text">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-50 text-brand-danger text-sm p-3 rounded-card">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              Nama Kamar
            </label>
            <input
              type="text"
              required
              value={namaKamar}
              onChange={(e) => setNamaKamar(e.target.value)}
              className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
              placeholder="Kamar A1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              Harga / Bulan (Rp)
            </label>
            <input
              type="text"
              required
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
              placeholder="850000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              Deskripsi
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark resize-none"
              placeholder="Deskripsi kamar..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              Alamat (opsional — khusus kamar ini)
            </label>
            <input
              type="text"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
              placeholder="Jl. Merdeka No. 123, Bandung"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              Link Google Maps (opsional)
            </label>
            <input
              type="url"
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
              placeholder="https://maps.app.goo.gl/xxx  atau  https://www.google.com/maps/place/..."
            />
            <p className="text-xs text-brand-muted mt-1">
              Link Google Maps untuk kamar ini. Kalau dikosongin, pake alamat teks.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'tersedia' | 'penuh')}
                className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
              >
                <option value="tersedia">Tersedia</option>
                <option value="penuh">Penuh</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                Tampilkan
              </label>
              <select
                value={isVisible ? 'ya' : 'tidak'}
                onChange={(e) => setIsVisible(e.target.value === 'ya')}
                className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
              >
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-brand-muted hover:text-brand-text transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-btn text-white text-sm font-semibold rounded-card transition-all disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : kamar ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─────────────── PROFIL EDITOR ─────────────── */

function ProfilEditor({
  profil,
  onRefresh,
}: {
  profil: KosProfile | null
  onRefresh: () => void
}) {
  const [namaKos, setNamaKos] = useState(profil?.nama_kos ?? '')
  const [alamat, setAlamat] = useState(profil?.alamat ?? '')
  const [deskripsi, setDeskripsi] = useState(profil?.deskripsi ?? '')
  const [noWhatsapp, setNoWhatsapp] = useState(profil?.no_whatsapp ?? '')
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState(
    profil?.maps_embed_url ?? ''
  )
  const [fasilitasInput, setFasilitasInput] = useState(
    (profil?.fasilitas as string[])?.join(', ') ?? ''
  )
  const [mitraInput, setMitraInput] = useState(
    (profil?.mitra as string[])?.join(', ') ?? ''
  )
  const [fasilitasFotos, setFasilitasFotos] = useState<string[]>(
    (profil?.fasilitas_foto as string[]) ?? []
  )
  const [uploadingFasilitas, setUploadingFasilitas] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const fasilitas = fasilitasInput
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)

    const mitra = mitraInput
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean)

    try {
      const res = await fetch('/api/profil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: profil?.id,
          nama_kos: namaKos,
          alamat,
          deskripsi,
          no_whatsapp: noWhatsapp,
          foto_hero: profil?.foto_hero ?? null,
          maps_embed_url: mapsEmbedUrl || null,
          fasilitas,
          mitra,
          fasilitas_foto: fasilitasFotos,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Gagal menyimpan')
      }

      setSuccess(true)
      onRefresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-display font-bold text-brand-text mb-6">
        Edit Profil Kos
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-card shadow-sm border border-secondary/30 p-6 space-y-4 max-w-2xl"
      >
        {error && (
          <div className="bg-red-50 text-brand-danger text-sm p-3 rounded-card">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-primary-light text-dark text-sm p-3 rounded-card">
            Profil berhasil disimpan!
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              Nama Kos
            </label>
            <input
              type="text"
              required
              value={namaKos}
              onChange={(e) => setNamaKos(e.target.value)}
              className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              No. WhatsApp
            </label>
            <input
              type="text"
              required
              value={noWhatsapp}
              onChange={(e) => setNoWhatsapp(e.target.value)}
              className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
              placeholder="6281234567890"
            />
            <p className="text-xs text-brand-muted mt-1">
              Format: 62xxxxxxxxxx (tanpa +)
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">
            Alamat
          </label>
          <textarea
            required
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">
            Deskripsi
          </label>
          <textarea
            required
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark resize-none"
          />
        </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              Fasilitas (pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={fasilitasInput}
              onChange={(e) => setFasilitasInput(e.target.value)}
              className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
              placeholder="WiFi, Parkir Motor, AC, CCTV"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-1">
              Mitra / Partner (pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={mitraInput}
              onChange={(e) => setMitraInput(e.target.value)}
              className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
              placeholder="Traveloka, tiket.com, Airbnb, Tripadvisor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              Foto Fasilitas
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {fasilitasFotos.map((url, idx) => (
                <div key={idx} className="relative w-24 h-20 rounded-card overflow-hidden border border-secondary/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Fasilitas ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch('/api/upload-fasilitas', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ foto_url: url }),
                      })
                      setFasilitasFotos((prev) => prev.filter((f) => f !== url))
                    }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-danger text-white rounded-full text-[10px] leading-none flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <label className="cursor-pointer w-24 h-20 rounded-card border-2 border-dashed border-secondary/50 flex items-center justify-center text-brand-muted hover:border-dark transition-colors">
                {uploadingFasilitas ? (
                  <span className="animate-ping w-2 h-2 bg-dark rounded-full" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingFasilitas}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setUploadingFasilitas(true)
                    const formData = new FormData()
                    formData.append('file', file)
                    const res = await fetch('/api/upload-fasilitas', { method: 'POST', body: formData })
                    if (res.ok) {
                      const data = await res.json()
                      setFasilitasFotos(data.fasilitas_foto ?? [])
                    }
                    setUploadingFasilitas(false)
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              Foto Hero
            </label>
          <div className="flex items-center gap-4">
            {profil?.foto_hero && (
              <div className="relative w-32 h-24 rounded-card overflow-hidden border border-secondary/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profil.foto_hero}
                  alt="Foto Hero"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetch('/api/upload-hero', { method: 'DELETE' })
                    if (res.ok) {
                      const supabase = (await import('@/lib/supabase/client')).createClient()
                      const { data: fresh } = await supabase.from('kos_profile').select('*').limit(1).single()
                      if (fresh) {
                        window.location.reload()
                      }
                    }
                  }}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-danger text-white rounded-full text-xs leading-none flex items-center justify-center"
                >
                  &times;
                </button>
              </div>
            )}
            <label className="cursor-pointer px-4 py-2 border-2 border-dashed border-secondary/50 rounded-card text-sm text-brand-muted hover:border-dark transition-colors">
              {profil?.foto_hero ? 'Ganti Foto' : 'Upload Foto Hero'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const formData = new FormData()
                  formData.append('file', file)
                  await fetch('/api/upload-hero', { method: 'POST', body: formData })
                  window.location.reload()
                }}
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-1">
            Google Maps Embed URL (opsional)
          </label>
          <input
            type="url"
            value={mapsEmbedUrl}
            onChange={(e) => setMapsEmbedUrl(e.target.value)}
            className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-btn text-white font-semibold rounded-card transition-all disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </div>
      </form>
    </div>
  )
}
