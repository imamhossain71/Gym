import React from 'react'
import { requireUser } from '@/lib/session'
import { connectDB } from '@/lib/db'
import Member from '@/models/Member'
import User from '@/models/User'
import dynamic from 'next/dynamic'

const ClientProfile = dynamic(
  () => import('@/components/member/client-profile'),
  { ssr: false },
)

export default async function Page() {
  const user = await requireUser(['member'])
  if (!user) return null

  await connectDB()

  const member = await Member.findOne({ userId: user.id }).lean()
  const u = await User.findById(user.id).lean()

  const memberData = member
    ? {
        ...member,
        _id: member._id.toString(),
        userId: member.userId?.toString(),
        gymId: member.gymId?.toString(),
        trainerId: member.trainerId?.toString(),
      }
    : null
  const userData = u
    ? {
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        phone: u.phone,
        photo: u.photo,
      }
    : null

  return (
    <div className='p-6'>
      <h1 className='text-2xl mb-4'>Edit Profile</h1>
      <ClientProfile user={userData} member={memberData} />
    </div>
  )
}
