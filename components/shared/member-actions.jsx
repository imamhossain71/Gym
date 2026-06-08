'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function MemberActions({ memberId, currentStatus }) {
  const [loading, setLoading] = useState(false)

  async function updateStatus(newStatus) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update')
      // Ideally we'd revalidate or update local state; keep simple: reload
      location.reload()
    } catch (e) {
      console.error(e)
      alert('Unable to update member status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {currentStatus !== 'suspended' && (
        <Button
          size='sm'
          variant='outline'
          onClick={() => updateStatus('suspended')}
          disabled={loading}
        >
          Suspend
        </Button>
      )}
      {currentStatus === 'suspended' && (
        <Button
          size='sm'
          variant='default'
          onClick={() => updateStatus('active')}
          disabled={loading}
        >
          Activate
        </Button>
      )}
    </>
  )
}
