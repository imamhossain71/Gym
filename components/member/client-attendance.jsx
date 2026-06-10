'use client'
import React, { useState } from 'react'

export default function ClientAttendance({ todays = [], recent = [] }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [todayList, setTodayList] = useState(todays)

  async function checkIn() {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'manual' }),
      })
      const data = await res.json()
      if (res.status === 201) {
        setMessage('Checked in successfully')
        // prepend a synthetic record to today's list
        setTodayList((prev) => [
          {
            _id: data.attendanceId,
            checkIn: new Date().toISOString(),
            date: new Date().toISOString().slice(0, 10),
            method: 'manual',
          },
          ...prev,
        ])
      } else if (res.status === 409) {
        setMessage('Already checked in today')
      } else {
        setMessage(data?.error || 'Failed to check in')
      }
    } catch (err) {
      console.error(err)
      setMessage('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-4'>
        <button
          className='px-4 py-2 bg-blue-600 text-white rounded'
          onClick={checkIn}
          disabled={loading || todayList.length > 0}
        >
          {todayList.length > 0
            ? 'Checked In'
            : loading
              ? 'Checking...'
              : 'Check In'}
        </button>
        <div>{message}</div>
      </div>

      <div>
        <h2 className='font-medium'>Today records</h2>
        {todayList.length === 0 ? (
          <div className='text-sm text-muted-foreground'>No check-ins yet</div>
        ) : (
          <ul className='space-y-2 mt-2'>
            {todayList.map((a) => (
              <li key={a._id} className='p-2 border rounded'>
                <div className='text-sm'>
                  {new Date(a.checkIn).toLocaleTimeString()}
                </div>
                <div className='text-xs text-muted-foreground'>
                  method: {a.method}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className='font-medium'>Recent</h2>
        <ul className='space-y-2 mt-2'>
          {recent.map((a) => (
            <li key={a._id} className='p-2 border rounded'>
              <div className='text-sm'>
                {a.date} —{' '}
                {a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : '—'}
              </div>
              <div className='text-xs text-muted-foreground'>
                method: {a.method}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
