import React from 'react'
import { requireUser } from '@/lib/session'
import Attendance from '@/models/Attendance'
import Member from '@/models/Member'
import { connectDB } from '@/lib/db'
import dynamic from 'next/dynamic'

const ClientAttendance = dynamic(
  () => import('@/components/member/client-attendance'),
  { ssr: false },
)

export default async function Page() {
  const user = await requireUser(['member'])
  if (!user) return null

  await connectDB()

  const member = await Member.findOne({ userId: user._id })
  if (!member) return <div className='p-6'>No member profile found.</div>

  const today = new Date().toISOString().slice(0, 10)

  const todaysDocs = await Attendance.find({
    memberId: member._id,
    date: today,
  })
    .sort({ createdAt: -1 })
    .lean()

  const recentDocs = await Attendance.find({ memberId: member._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean()

  const todays = todaysDocs.map((d) => ({
    _id: d._id.toString(),
    checkIn: d.checkIn ? d.checkIn.toISOString() : null,
    checkOut: d.checkOut ? d.checkOut.toISOString() : null,
    date: d.date,
    method: d.method || null,
  }))

  const recent = recentDocs.map((d) => ({
    _id: d._id.toString(),
    checkIn: d.checkIn ? d.checkIn.toISOString() : null,
    checkOut: d.checkOut ? d.checkOut.toISOString() : null,
    date: d.date,
    method: d.method || null,
  }))

  return (
    <div className='p-6'>
      <h1 className='text-2xl mb-4'>Attendance</h1>
      <ClientAttendance todays={todays} recent={recent} />
    </div>
  )
}
