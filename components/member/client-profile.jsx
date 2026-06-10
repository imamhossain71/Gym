'use client'
import React, { useState } from 'react'
import Image from 'next/image'

function fileToDataUri(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (err) => reject(err)
    reader.readAsDataURL(file)
  })
}

export default function ClientProfile({ user = {}, member = {} }) {
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    height: member?.height || '',
    weight: member?.weight || '',
    age: member?.age || '',
    gender: member?.gender || 'male',
    goal: member?.goal || 'Maintenance',
    emergencyContact: member?.emergencyContact || '',
  })
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(user.photo || '')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  function onChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      let photoDataUri = null
      if (photoFile) {
        photoDataUri = await fileToDataUri(photoFile)
      }

      const payload = { ...form }
      if (photoDataUri) payload.photoDataUri = photoDataUri

      const res = await fetch('/api/member/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        setMsg('Saved')
        if (data.user?.photo) setPhotoPreview(data.user.photo)
      } else {
        setMsg(data.error || 'Failed')
      }
    } catch (err) {
      console.error(err)
      setMsg('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className='space-y-4 max-w-xl'>
      <div className='flex items-center gap-4'>
        <div className='relative w-24 h-24'>
          {photoPreview ? (
            <Image
              src={photoPreview}
              alt='photo'
              fill
              style={{ objectFit: 'cover' }}
              className='rounded-full'
            />
          ) : (
            <Image
              src='/favicon.ico'
              alt='photo'
              fill
              style={{ objectFit: 'cover' }}
              className='rounded-full'
            />
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <input
            type='file'
            accept='image/*'
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) {
                setPhotoFile(f)
                setPhotoPreview(URL.createObjectURL(f))
              }
            }}
          />
          <div className='text-sm text-muted-foreground'>
            Profile photo (optional)
          </div>
        </div>
      </div>

      <div>
        <label className='block text-sm'>Name</label>
        <input
          name='name'
          value={form.name}
          onChange={onChange}
          className='w-full p-2 border rounded'
        />
      </div>

      <div>
        <label className='block text-sm'>Phone</label>
        <input
          name='phone'
          value={form.phone}
          onChange={onChange}
          className='w-full p-2 border rounded'
        />
      </div>

      <div className='grid grid-cols-3 gap-2'>
        <div>
          <label className='block text-sm'>Height (cm)</label>
          <input
            name='height'
            value={form.height}
            onChange={onChange}
            type='number'
            className='w-full p-2 border rounded'
          />
        </div>
        <div>
          <label className='block text-sm'>Weight (kg)</label>
          <input
            name='weight'
            value={form.weight}
            onChange={onChange}
            type='number'
            className='w-full p-2 border rounded'
          />
        </div>
        <div>
          <label className='block text-sm'>Age</label>
          <input
            name='age'
            value={form.age}
            onChange={onChange}
            type='number'
            className='w-full p-2 border rounded'
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div>
          <label className='block text-sm'>Gender</label>
          <select
            name='gender'
            value={form.gender}
            onChange={onChange}
            className='w-full p-2 border rounded'
          >
            <option value='male'>Male</option>
            <option value='female'>Female</option>
            <option value='other'>Other</option>
          </select>
        </div>
        <div>
          <label className='block text-sm'>Goal</label>
          <select
            name='goal'
            value={form.goal}
            onChange={onChange}
            className='w-full p-2 border rounded'
          >
            <option>Maintenance</option>
            <option>Weight Loss</option>
            <option>Muscle Gain</option>
          </select>
        </div>
      </div>

      <div>
        <label className='block text-sm'>Emergency Contact</label>
        <input
          name='emergencyContact'
          value={form.emergencyContact}
          onChange={onChange}
          className='w-full p-2 border rounded'
        />
      </div>

      <div className='flex items-center gap-3'>
        <button
          type='submit'
          disabled={loading}
          className='px-4 py-2 bg-blue-600 text-white rounded'
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
        <div>{msg}</div>
      </div>
    </form>
  )
}
