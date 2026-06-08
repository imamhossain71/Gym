'use client'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
} from 'recharts'

function SimpleTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className='bg-card border p-2 text-sm'>
      <div className='font-medium'>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey}>
          {p.name || p.dataKey}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function DashboardCharts({
  revenueData = [],
  membersData = [],
  attendanceData = [],
}) {
  return (
    <div className='space-y-6'>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={revenueData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip content={<SimpleTooltip />} />
            <Legend />
            <Line
              type='monotone'
              dataKey='revenue'
              name='Revenue'
              stroke='#4f46e5'
              strokeWidth={2}
            />
            <Line
              type='monotone'
              dataKey='newMembers'
              name='New Members'
              stroke='#10b981'
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart
            data={membersData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='month' />
            <YAxis />
            <Tooltip content={<SimpleTooltip />} />
            <Bar dataKey='newMembers' name='New Members' fill='#0ea5a6' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <AreaChart
            data={attendanceData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip content={<SimpleTooltip />} />
            <Area
              type='monotone'
              dataKey='checkins'
              name='Check-ins'
              stroke='#ef4444'
              fill='#fecaca'
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
