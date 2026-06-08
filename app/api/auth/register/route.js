import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import { registerSchema } from '@/lib/validations'
import { addMonths, PLAN_DURATIONS } from '@/lib/utils'
import User from '@/models/User'
import Gym from '@/models/Gym'
import Member from '@/models/Member'
import Trainer from '@/models/Trainer'

export async function POST(req) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      )
    }

    const { name, email, password, phone, role, gymName, gymId, gymPlan } =
      parsed.data

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 },
      )
    }

    const hashed = await bcrypt.hash(password, 12)

    // Create the base user first (gymId attached below depending on role).
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      phone: phone || '',
      role,
    })

    try {
      if (role === 'gym_admin') {
        const gym = await Gym.create({
          name: gymName,
          ownerId: user._id,
          email: user.email,
          phone: phone || '',
          plan: gymPlan || 'free',
        })
        user.gymId = gym._id
        await user.save()
      } else {
        // member / trainer must join an existing gym
        const gym = await Gym.findById(gymId)
        if (!gym) {
          await User.findByIdAndDelete(user._id)
          return NextResponse.json(
            { error: 'Selected gym was not found' },
            { status: 404 },
          )
        }
        user.gymId = gym._id
        await user.save()

        if (role === 'member') {
          await Member.create({
            userId: user._id,
            gymId: gym._id,
            joinDate: new Date(),
            expiryDate: addMonths(new Date(), PLAN_DURATIONS.monthly),
          })
        } else if (role === 'trainer') {
          await Trainer.create({
            userId: user._id,
            gymId: gym._id,
          })
        }
      }
    } catch (inner) {
      // Roll back the orphaned user if profile creation failed.
      await User.findByIdAndDelete(user._id)
      throw inner
    }

    return NextResponse.json(
      {
        message: 'Account created successfully',
        userId: user._id.toString(),
      },
      { status: 201 },
    )
  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
