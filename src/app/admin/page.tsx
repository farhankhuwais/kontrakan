import { getSessionUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminPage() {
  const user = await getSessionUser()

  if (!user) {
    redirect('/admin/login')
  }

  return <AdminDashboardClient />
}
