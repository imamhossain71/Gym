import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Gym from '@/models/Gym'

// Public: used by the signup form so members/trainers can pick a gym to join.
export async function GET() {
  try {
    await connectDB()
    const gyms = await Gym.find({ isActive: true })
      .select('name address rating')
      .sort({ name: 1 })
      .lean()

    return NextResponse.json({
      gyms: gyms.map((g) => ({
        id: g._id.toString(),
        name: g.name,
        address: g.address,
        rating: g.rating,
      })),
    })
  } catch (err) {
    console.error('List gyms error:', err)
    // Return error details in dev to aid debugging
    const payload = { error: 'Failed to load gyms' }
    if (process.env.NODE_ENV !== 'production' && err && err.message) {
      payload.detail = err.message
    }
    return NextResponse.json(payload, { status: 500 })
  }
}
