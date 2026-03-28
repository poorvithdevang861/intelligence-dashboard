import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  chartTooltip,
  axisStroke,
  tickFill,
  gridStroke,
  genderMale,
  genderFemale,
  genderOther,
} from '../../chartTheme'

const CrimeTypeDistributionChart = ({ data }) => {
  const chartData = useMemo(() => {
    const crimeTypeGenderCounts = {}

    data.forEach((record) => {
      const type = record['Crime Description']
      const gender = record['Victim Gender'] || 'Unknown'

      if (!crimeTypeGenderCounts[type]) {
        crimeTypeGenderCounts[type] = { M: 0, F: 0, X: 0, Unknown: 0 }
      }
      crimeTypeGenderCounts[type][gender] = (crimeTypeGenderCounts[type][gender] || 0) + 1
    })

    const total = data.length
    const crimeTypeTotals = Object.entries(crimeTypeGenderCounts)
      .map(([type, counts]) => ({
        type,
        total: Object.values(counts).reduce((sum, val) => sum + val, 0),
        ...counts,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8)

    return crimeTypeTotals.map(({ type, total: typeTotal, ...genders }) => ({
      type: type.length > 12 ? type.substring(0, 12) + '...' : type,
      fullType: type,
      total: typeTotal,
      percentage: total > 0 ? ((typeTotal / total) * 100).toFixed(1) : 0,
      Male: genders.M || 0,
      Female: genders.F || 0,
      Other: (genders.X || 0) + (genders.Unknown || 0),
    }))
  }, [data])

  const topCrime = chartData[0]

  return (
    <div className="flex h-full w-full max-w-full min-h-[200px] flex-col">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2 px-1 font-body text-[clamp(0.7rem,0.9vw,0.85rem)]">
        <div className="text-slate-900">
          Total Types: <strong className="font-extrabold text-slate-950">{chartData.length}</strong>
        </div>
        {topCrime && (
          <div className="text-slate-900">
            Top: <strong className="font-extrabold text-blue-900">{topCrime.total}</strong> ({topCrime.percentage}%)
          </div>
        )}
      </div>
      <div className="min-h-0 min-w-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis
              dataKey="type"
              angle={-45}
              textAnchor="end"
              height={70}
              stroke={axisStroke}
              tick={{ fill: tickFill, fontSize: 9, fontFamily: 'Inter' }}
            />
            <YAxis stroke={axisStroke} tick={{ fill: tickFill, fontSize: 11, fontFamily: 'Inter' }} />
            <Tooltip
              contentStyle={chartTooltip}
              formatter={(value, name) => [`${value} crimes`, name]}
              cursor={{ fill: 'rgba(43, 74, 203, 0.06)' }}
            />
            <Bar dataKey="Male" fill={genderMale} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Female" fill={genderFemale} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Other" fill={genderOther} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CrimeTypeDistributionChart
