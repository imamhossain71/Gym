import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Utensils,
  Star,
} from 'lucide-react'
import { requireUser } from '@/lib/session'
import { DashboardShell } from '@/components/shared/dashboard-shell'

const NAV = [
  { href: '/trainer', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/trainer/members', label: 'My Members', icon: 'Users' },
  { href: '/trainer/diet-plans', label: 'Diet Plans', icon: 'Utensils' },
  { href: '/trainer/schedule', label: 'Schedule', icon: 'CalendarCheck' },
  { href: '/trainer/reviews', label: 'Reviews', icon: 'Star' },
]

export default async function TrainerLayout({ children }) {
  const user = await requireUser(['super_admin', 'trainer'])
  return (
    <DashboardShell nav={NAV} user={user} areaLabel='Trainer'>
      {children}
    </DashboardShell>
  )
}
