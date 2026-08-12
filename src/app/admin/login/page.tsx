'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) router.push('/admin')
      })
      .catch(() => {})
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Login gagal')
      }

      router.push('/admin')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm/30 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-brand-text">
            Admin Achi Kosan
          </h1>
          <p className="text-brand-muted text-sm mt-2">
            Masuk untuk mengelola konten
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-card shadow-sm border border-secondary/30 p-6 space-y-4"
        >
          {error && (
            <div className="bg-red-50 text-brand-danger text-sm p-3 rounded-card">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-brand-text mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-brand-text mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-secondary/50 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-btn text-white font-semibold rounded-card transition-all disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          <Link
            href="/"
            className="block text-center text-sm text-brand-muted hover:text-dark transition-colors"
          >
            &larr; Kembali ke beranda
          </Link>
        </form>
      </div>
    </div>
  )
}
