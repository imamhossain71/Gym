import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Attendance from '@/models/Attendance'
import Member from '@/models/Member'
import { requireUser } from '@/lib/session'

export async function POST(req) {
  try {
    const user = await requireUser(['super_admin', 'member', 'trainer'])
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { method = 'manual' } = body

    await connectDB()

    // member must have a Member profile
    const member = await Member.findOne({ userId: user._id })
    if (!member) {
      return NextResponse.json(
        { error: 'Member profile not found' },
        { status: 404 },
      )
    }

    const date = new Date().toISOString().slice(0, 10)

    // Create attendance if not already checked in today
    try {
      const att = await Attendance.create({
        memberId: member._id,
        gymId: member.gymId,
        date,
        method,
        checkIn: new Date(),
      })
      return NextResponse.json(
        { message: 'Checked in', attendanceId: att._id.toString() },
        { status: 201 },
      )
    } catch (e) {
      // duplicate key means already checked in today
      return NextResponse.json(
        { error: 'Already checked in today' },
        { status: 409 },
      )
    }
  } catch (err) {
    console.error('Attendance POST error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
