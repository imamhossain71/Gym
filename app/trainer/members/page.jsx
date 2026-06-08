import Link from 'next/link'
import { requireUser } from '@/lib/session'
import { connectDB } from '@/lib/db'
import Trainer from '@/models/Trainer'
import Member from '@/models/Member'
import User from '@/models/User'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import MemberActions from '@/components/shared/member-actions'

export const dynamic = 'force-dynamic'

export default async function TrainerMembersPage() {
  const user = await requireUser(['super_admin', 'trainer'])
  await connectDB()

  const trainer = await Trainer.findOne({ userId: user.id }).lean()
  if (!trainer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Members</CardTitle>
        </CardHeader>
        <CardContent>No trainer profile found.</CardContent>
      </Card>
    )
  }

  const members = await Member.find({ trainerId: trainer._id })
    .sort({ createdAt: -1 })
    .lean()
  const userIds = members.map((m) => m.userId).filter(Boolean)
  const users = await User.find({ _id: { $in: userIds } })
    .select('name email')
    .lean()
  const userMap = new Map(users.map((u) => [u._id.toString(), u]))

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>My Members</h1>
        <p className='text-muted-foreground'>Members assigned to you.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned members</CardTitle>
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
                  <th className='px-4 py-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const u = userMap.get(m.userId?.toString())
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
                        <div className='flex items-center gap-2'>
                          <Link
                            href={`/trainer/members/${m._id}`}
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
