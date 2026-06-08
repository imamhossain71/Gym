'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { registerSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const ROLE_HOME = {
  gym_admin: '/admin',
  trainer: '/trainer',
  member: '/member',
}

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [gyms, setGyms] = useState([])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'member', gymPlan: 'free' },
  })

  const role = watch('role')

  useEffect(() => {
    fetch('/api/gyms')
      .then((r) => r.json())
      .then((d) => setGyms(d.gyms || []))
      .catch(() => {})
  }, [])

  async function onSubmit(values) {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()

      if (!res.ok) {
        console.error('Register failed response:', res.status, data)
        toast.error(data.error || 'Registration failed')
        return
      }

      toast.success('Account created! Signing you in…')
      const login = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (login?.error) {
        toast.error('Account created — please sign in manually')
        router.push('/login')
        return
      }
      router.push(ROLE_HOME[values.role] || '/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='border-none shadow-none lg:border lg:shadow-sm'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl'>Create account</CardTitle>
        <CardDescription>Join FitHub in less than a minute</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='role'>I am a…</Label>
            <Select id='role' {...register('role')}>
              <option value='member'>Member — I want to join a gym</option>
              <option value='trainer'>Trainer — I coach members</option>
              <option value='gym_admin'>Gym Owner — I manage a gym</option>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='name'>Full name</Label>
            <Input id='name' placeholder='John Doe' {...register('name')} />
            {errors.name && (
              <p className='text-sm text-destructive'>{errors.name.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='you@example.com'
              {...register('email')}
            />
            {errors.email && (
              <p className='text-sm text-destructive'>{errors.email.message}</p>
            )}
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                {...register('password')}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone (optional)</Label>
              <Input
                id='phone'
                placeholder='01XXXXXXXXX'
                {...register('phone')}
              />
            </div>
          </div>
          {errors.password && (
            <p className='text-sm text-destructive'>
              {errors.password.message}
            </p>
          )}

          {role === 'gym_admin' && (
            <div className='space-y-2'>
              <Label htmlFor='gymName'>Gym name</Label>
              <Input
                id='gymName'
                placeholder='Iron Paradise Fitness'
                {...register('gymName')}
              />
              {errors.gymName && (
                <p className='text-sm text-destructive'>
                  {errors.gymName.message}
                </p>
              )}
            </div>
          )}

          {role === 'gym_admin' && (
            <div className='space-y-2'>
              <Label htmlFor='gymPlan'>Gym plan</Label>
              <Select id='gymPlan' {...register('gymPlan')}>
                <option value='free'>Free (basic)</option>
                <option value='starter'>Starter</option>
                <option value='pro'>Pro</option>
                <option value='enterprise'>Enterprise</option>
              </Select>
              {errors.gymPlan && (
                <p className='text-sm text-destructive'>
                  {errors.gymPlan.message}
                </p>
              )}
            </div>
          )}

          {(role === 'member' || role === 'trainer') && (
            <div className='space-y-2'>
              <Label htmlFor='gymId'>Select gym</Label>
              <Select id='gymId' {...register('gymId')}>
                <option value=''>— Choose a gym —</option>
                {gyms.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                    {g.address ? ` · ${g.address}` : ''}
                  </option>
                ))}
              </Select>
              {gyms.length === 0 && (
                <p className='text-xs text-muted-foreground'>
                  No gyms yet — ask a gym owner to register first.
                </p>
              )}
              {errors.gymId && (
                <p className='text-sm text-destructive'>
                  {errors.gymId.message}
                </p>
              )}
            </div>
          )}

          <Button type='submit' className='w-full' disabled={loading}>
            {loading && <Loader2 className='h-4 w-4 animate-spin' />}
            Create account
          </Button>
        </form>

        <p className='mt-6 text-center text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='font-medium text-primary hover:underline'
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
