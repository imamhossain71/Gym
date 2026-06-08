import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireUser } from '@/lib/session'
import Member from '@/models/Member'
import User from '@/models/User'

export async function PATCH(req, ctx) {
  try {
    const user = await requireUser(['super_admin', 'gym_admin'])
    if (!user.gymId)
      return NextResponse.json({ error: 'No gym' }, { status: 403 })

    const body = await req.json()
    const { memberId, status, membershipPlan, trainerId } = body
    if (!memberId)
      return NextResponse.json({ error: 'Missing memberId' }, { status: 400 })

    await connectDB()

    const m = await Member.findById(memberId)
    if (!m)
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    if (m.gymId.toString() !== user.gymId.toString()) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (status) m.status = status
    if (membershipPlan) m.membershipPlan = membershipPlan
    if (trainerId !== undefined) m.trainerId = trainerId || null

    await m.save()

    return NextResponse.json({ message: 'Updated' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
