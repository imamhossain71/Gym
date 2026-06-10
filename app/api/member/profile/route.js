import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireUser } from '@/lib/session'
import Member from '@/models/Member'
import User from '@/models/User'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

export async function GET(req) {
  try {
    const user = await requireUser(['member'])
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const member = await Member.findOne({ userId: user.id }).lean()
    if (!member)
      return NextResponse.json(
        { error: 'Member profile not found' },
        { status: 404 },
      )

    // return combined user + member data (serialize ObjectIds)
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
      },
      member: {
        ...member,
        _id: member._id.toString(),
        userId: member.userId?.toString(),
        gymId: member.gymId?.toString(),
        trainerId: member.trainerId?.toString(),
      },
    })
  } catch (err) {
    console.error('GET /api/member/profile', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const user = await requireUser(['member'])
    if (!user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      height,
      weight,
      age,
      gender,
      goal,
      emergencyContact,
      name,
      phone,
      photoDataUri,
    } = body

    await connectDB()

    const member = await Member.findOne({ userId: user.id })
    if (!member)
      return NextResponse.json(
        { error: 'Member profile not found' },
        { status: 404 },
      )

    // update member fields
    if (height !== undefined) member.height = height
    if (weight !== undefined) member.weight = weight
    if (age !== undefined) member.age = age
    if (gender !== undefined) member.gender = gender
    if (goal !== undefined) member.goal = goal
    if (emergencyContact !== undefined)
      member.emergencyContact = emergencyContact

    // update user fields (name, phone) and photo via cloudinary
    const u = await User.findById(user.id)
    if (!u)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (name !== undefined) u.name = name
    if (phone !== undefined) u.phone = phone

    if (photoDataUri) {
      // upload and set photo; remove old one if present (assumes publicId stored in photo as cloudinary url - we don't store publicId currently)
      try {
        const { url } = await uploadImage(photoDataUri, 'fithub/members')
        u.photo = url
      } catch (e) {
        console.error('Cloudinary upload error', e)
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 },
        )
      }
    }

    await u.save()
    await member.save()

    return NextResponse.json({
      message: 'Profile updated',
      user: { name: u.name, phone: u.phone, photo: u.photo },
    })
  } catch (err) {
    console.error('PATCH /api/member/profile', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
