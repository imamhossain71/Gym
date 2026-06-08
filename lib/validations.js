import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name is too short').max(80),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional().or(z.literal('')),
    role: z.enum(['gym_admin', 'trainer', 'member']),
    // gym_admin self-registration creates a gym:
    gymName: z.string().optional(),
    // allow selecting a subscription tier when creating a gym
    gymPlan: z.enum(['free', 'starter', 'pro', 'enterprise']).optional(),
    // members / trainers join an existing gym:
    gymId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'gym_admin' && !data.gymName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['gymName'],
        message: 'Gym name is required to create a gym account',
      })
    }
    // gymPlan is optional server-side (we default to 'free' when creating gyms).
    if ((data.role === 'member' || data.role === 'trainer') && !data.gymId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['gymId'],
        message: 'Please select a gym to join',
      })
    }
  })

export const memberProfileSchema = z.object({
  height: z.coerce.number().min(50).max(280),
  weight: z.coerce.number().min(20).max(400),
  age: z.coerce.number().min(5).max(120),
  gender: z.enum(['male', 'female', 'other']),
  goal: z.enum(['Weight Loss', 'Muscle Gain', 'Maintenance']),
})
