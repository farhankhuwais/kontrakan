import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { createClient } from "@/lib/db";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

export async function generateMetadata(): Promise<Metadata> {
  let namaKos: string | null = null
  let favicon: string | null = null

  try {
    const db = createClient()
    const rows = await db<{ nama_kos: string; favicon: string | null }[]>`
      select nama_kos, favicon from kos_profile limit 1
    `
    namaKos = rows[0]?.nama_kos ?? null
    favicon = rows[0]?.favicon ?? null
  } catch {
    // DB belum siap (mis. saat build) — pakai default
  }

  return {
    title: namaKos
      ? `${namaKos} - Kamar Nyaman untuk Mahasiswa & Pekerja`
      : "Achi Kosan - Kamar Nyaman untuk Mahasiswa & Pekerja",
    description:
      "Temukan kamar kos nyaman dan terjangkau. Lingkungan bersih, aman, dan dekat dengan kampus serta pusat kota.",
    icons: favicon ? { icon: favicon } : undefined,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakartaSans.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
