import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  Dumbbell,
  Star,
  BarChart3,
} from 'lucide-react'
import { requireUser } from '@/lib/session'
import { DashboardShell } from '@/components/shared/dashboard-shell'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/members', label: 'Members', icon: 'Users' },
  { href: '/admin/attendance', label: 'Attendance', icon: 'CalendarCheck' },
  { href: '/admin/payments', label: 'Payments', icon: 'CreditCard' },
  { href: '/admin/trainers', label: 'Trainers', icon: 'Dumbbell' },
  { href: '/admin/reviews', label: 'Reviews', icon: 'Star' },
  { href: '/admin/reports', label: 'Reports', icon: 'BarChart3' },
]

export default async function AdminLayout({ children }) {
  const user = await requireUser(['super_admin', 'gym_admin'])
  return (
    <DashboardShell nav={NAV} user={user} areaLabel='Admin'>
      {children}
    </DashboardShell>
  )
}
