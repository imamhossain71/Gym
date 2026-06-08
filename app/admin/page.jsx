import { Users, CreditCard, CalendarCheck, AlertCircle } from 'lucide-react'
import { requireUser } from '@/lib/session'
import { connectDB } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'
import { StatCard } from '@/components/shared/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Member from '@/models/Member'
import Payment from '@/models/Payment'
import Attendance from '@/models/Attendance'
import mongoose from 'mongoose'
import dynamic from 'next/dynamic'

// Client-only chart component (dynamic import ensures it's client bundle)
const DashboardCharts = dynamic(
  () => import('@/components/admin/dashboard-charts'),
  {
    ssr: false,
  },
)

async function getStats(gymId) {
  await connectDB()
  const today = new Date().toISOString().slice(0, 10)
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [
    totalMembers,
    activeMembers,
    todayAttendance,
    duePayments,
    revenueAgg,
  ] = await Promise.all([
    Member.countDocuments({ gymId }),
    Member.countDocuments({ gymId, status: 'active' }),
    Attendance.countDocuments({ gymId, date: today }),
    Payment.countDocuments({ gymId, status: { $in: ['due', 'overdue'] } }),
    Payment.aggregate([
      {
        $match: {
          gymId,
          status: 'paid',
          paidDate: { $gte: monthStart },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
  ])

  return {
    totalMembers,
    activeMembers,
    todayAttendance,
    duePayments,
    monthlyRevenue: revenueAgg[0]?.total || 0,
  }
}

export default async function AdminDashboard() {
  const user = await requireUser(['super_admin', 'gym_admin'])
  const stats = user.gymId
    ? await getStats(user.gymId)
    : {
        totalMembers: 0,
        activeMembers: 0,
        todayAttendance: 0,
        duePayments: 0,
        monthlyRevenue: 0,
      }

  // Build chart datasets (server-side aggregations)
  let revenueSeries = []
  let membersSeries = []
  let attendanceSeries = []

  if (user.gymId) {
    await connectDB()
    let gymObjectId = user.gymId
    try {
      // ensure we pass an ObjectId for aggregation when appropriate
      gymObjectId = new mongoose.Types.ObjectId(user.gymId)
    } catch (e) {
      // leave as string — mongoose will attempt to cast where possible
      gymObjectId = user.gymId
    }

    // Revenue: last 6 months by YYYY-MM
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const revenueAggSeries = await Payment.aggregate([
      {
        $match: {
          gymId: gymObjectId,
          status: 'paid',
          paidDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$paidDate' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Member signups: last 6 months by YYYY-MM
    const membersAgg = await Member.aggregate([
      { $match: { gymId: gymObjectId, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Attendance: last 7 days by date string
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const attendanceAgg = await Attendance.aggregate([
      {
        $match: {
          gymId: gymObjectId,
          date: { $gte: sevenDaysAgo.toISOString().slice(0, 10) },
        },
      },
      { $group: { _id: '$date', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])

    // Normalize series to include empty months/days
    // Months array for last 6 months
    const months = []
    const mDate = new Date(sixMonthsAgo)
    for (let i = 0; i < 6; i++) {
      const key = `${mDate.getFullYear()}-${String(mDate.getMonth() + 1).padStart(2, '0')}`
      months.push(key)
      mDate.setMonth(mDate.getMonth() + 1)
    }

    const revenueMap = new Map(revenueAggSeries.map((r) => [r._id, r.total]))
    const membersMap = new Map(membersAgg.map((r) => [r._id, r.count]))

    revenueSeries = months.map((k) => ({
      month: k,
      revenue: revenueMap.get(k) || 0,
    }))
    membersSeries = months.map((k) => ({
      month: k,
      newMembers: membersMap.get(k) || 0,
    }))

    // Attendance days for last 7 days
    const days = []
    const dDate = new Date(sevenDaysAgo)
    for (let i = 0; i < 7; i++) {
      const dayKey = dDate.toISOString().slice(0, 10)
      days.push(dayKey)
      dDate.setDate(dDate.getDate() + 1)
    }
    const attendanceMap = new Map(attendanceAgg.map((a) => [a._id, a.count]))
    attendanceSeries = days.map((d) => ({
      date: d,
      checkins: attendanceMap.get(d) || 0,
    }))
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Welcome back, {user.name} 👋</h1>
        <p className='text-muted-foreground'>
          Here&apos;s what&apos;s happening at your gym today.
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          label='Total Members'
          value={stats.totalMembers}
          hint={`${stats.activeMembers} active`}
          icon={Users}
        />
        <StatCard
          label="Today's Check-ins"
          value={stats.todayAttendance}
          icon={CalendarCheck}
          accent='green'
        />
        <StatCard
          label='Monthly Revenue'
          value={formatCurrency(stats.monthlyRevenue)}
          icon={CreditCard}
          accent='accent'
        />
        <StatCard
          label='Pending Dues'
          value={stats.duePayments}
          icon={AlertCircle}
          accent='red'
        />
      </div>
      {/* Charts section */}
      <div className='grid gap-4 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Member growth</CardTitle>
            </CardHeader>
            <CardContent>
              <DashboardCharts
                revenueData={revenueSeries}
                membersData={membersSeries}
                attendanceData={attendanceSeries}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Getting started</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2 text-sm text-muted-foreground'>
              <p>
                ✅ Your gym account is live. This is the Phase 1 foundation:
                authentication, role-based routing, and the data layer are wired
                up.
              </p>
              <p>
                Next modules to build out: Member CRUD, Attendance check-in,
                Payment recording, BMI/Diet generator, charts, and the trainer
                &amp; review systems — the models and APIs scaffold is already
                in place.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
