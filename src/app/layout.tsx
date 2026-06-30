import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient()
  const { data: profil } = await supabase
    .from('kos_profile')
    .select('nama_kos, favicon')
    .limit(1)
    .maybeSingle()

  return {
    title: profil?.nama_kos
      ? `${profil.nama_kos} - Kamar Nyaman untuk Mahasiswa & Pekerja`
      : "Achi Kosan - Kamar Nyaman untuk Mahasiswa & Pekerja",
    description:
      "Temukan kamar kos nyaman dan terjangkau. Lingkungan bersih, aman, dan dekat dengan kampus serta pusat kota.",
    icons: profil?.favicon ? { icon: profil.favicon } : undefined,
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
