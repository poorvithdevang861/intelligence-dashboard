import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { chartTooltip, axisStroke, tickFill, gridStroke, barFill } from '../../chartTheme'

const VictimAgeChart = ({ data }) => {
  const chartData = useMemo(() => {
    const ageGroups = {
      '0-18': 0,
      '19-35': 0,
      '36-50': 0,
      '51-65': 0,
      '65+': 0,
    }

    data.forEach((record) => {
      const age = parseInt(record['Victim Age']) || 0
      if (age >= 0 && age <= 18) ageGroups['0-18']++
      else if (age >= 19 && age <= 35) ageGroups['19-35']++
      else if (age >= 36 && age <= 50) ageGroups['36-50']++
      else if (age >= 51 && age <= 65) ageGroups['51-65']++
      else if (age > 65) ageGroups['65+']++
    })

    const total = data.length
    return Object.entries(ageGroups).map(([ageGroup, count]) => ({
      ageGroup,
      count,
      percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
    }))
  }, [data])

  const total = data.length
  const topAgeGroup = [...chartData].sort((a, b) => b.count - a.count)[0]

  return (
    <div className="flex h-full w-full max-w-full min-h-[200px] flex-col">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 font-body text-[clamp(0.7rem,0.9vw,0.85rem)]">
        <div className="text-slate-900">
          Total Victims: <strong className="font-extrabold text-slate-950">{total.toLocaleString()}</strong>
        </div>
        {topAgeGroup && (
          <div className="text-slate-900">
            Most Affected: <strong className="font-extrabold text-blue-900">{topAgeGroup.ageGroup}</strong> (
            {topAgeGroup.percentage}%)
          </div>
        )}
      </div>
      <div className="min-h-0 min-w-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="ageGroup" stroke={axisStroke} tick={{ fill: tickFill, fontSize: 11, fontFamily: 'Inter' }} />
            <YAxis stroke={axisStroke} tick={{ fill: tickFill, fontSize: 11, fontFamily: 'Inter' }} />
            <Tooltip
              contentStyle={chartTooltip}
              formatter={(value, _name, props) => [
                `${value} victims (${props.payload.percentage}%)`,
                props.payload.ageGroup,
              ]}
              cursor={{ fill: 'rgba(43, 74, 203, 0.06)' }}
            />
            <Bar dataKey="count" fill={barFill} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default VictimAgeChart
