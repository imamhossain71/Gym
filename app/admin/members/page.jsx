import Link from 'next/link'
import { requireUser } from '@/lib/session'
import { connectDB } from '@/lib/db'
import Member from '@/models/Member'
import User from '@/models/User'
import Trainer from '@/models/Trainer'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import MemberActions from '@/components/shared/member-actions'

export const dynamic = 'force-dynamic'

export default async function AdminMembersPage() {
  const user = await requireUser(['super_admin', 'gym_admin'])
  await connectDB()

  const gymId = user.gymId
  if (!gymId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>No gym associated with your account.</CardContent>
      </Card>
    )
  }

  const members = await Member.find({ gymId }).sort({ createdAt: -1 }).lean()

  // Preload user and trainer names
  const userIds = members.map((m) => m.userId).filter(Boolean)
  const trainerIds = members.map((m) => m.trainerId).filter(Boolean)
  const users = await User.find({ _id: { $in: userIds } })
    .select('name email')
    .lean()
  const trainers = await Trainer.find({ _id: { $in: trainerIds } })
    .select('_id')
    .lean()
  const userMap = new Map(users.map((u) => [u._id.toString(), u]))
  const trainerMap = new Map(trainers.map((t) => [t._id.toString(), t]))

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Members</h1>
        <p className='text-muted-foreground'>Manage your gym members.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member list</CardTitle>
        </CardHeader>

        <CardContent className='p-0'>
          <div className='overflow-auto'>
            <table className='w-full table-auto'>
              <thead className='text-left text-xs text-muted-foreground'>
                <tr>
                  <th className='px-4 py-2'>Name</th>
                  <th className='px-4 py-2'>Plan</th>
                  <th className='px-4 py-2'>Status</th>
                  <th className='px-4 py-2'>Expiry</th>
                  <th className='px-4 py-2'>Trainer</th>
                  <th className='px-4 py-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const u = userMap.get(m.userId?.toString())
                  const t = m.trainerId
                    ? trainerMap.get(m.trainerId.toString())
                    : null
                  return (
                    <tr key={m._id} className='border-t'>
                      <td className='px-4 py-3'>
                        <div className='font-medium'>{u?.name || '—'}</div>
                        <div className='text-xs text-muted-foreground'>
                          {u?.email || '—'}
                        </div>
                      </td>
                      <td className='px-4 py-3'>{m.membershipPlan}</td>
                      <td className='px-4 py-3 capitalize'>{m.status}</td>
                      <td className='px-4 py-3'>
                        {m.expiryDate ? formatDate(m.expiryDate) : '—'}
                      </td>
                      <td className='px-4 py-3'>
                        {t ? t._id.toString() : '—'}
                      </td>
                      <td className='px-4 py-3'>
                        <div className='flex items-center gap-2'>
                          <Link
                            href={`/admin/members/${m._id}`}
                            className='text-sm text-primary'
                          >
                            View
                          </Link>
                          <MemberActions
                            memberId={m._id}
                            currentStatus={m.status}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
