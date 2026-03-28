import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { chartTooltip, fillForVictimGender, genderFemale, genderMale, genderOther } from '../../chartTheme'

const VictimGenderChart = ({ data }) => {
  const chartData = useMemo(() => {
    const genderCounts = {}
    data.forEach((record) => {
      const gender = record['Victim Gender'] || 'Unknown'
      genderCounts[gender] = (genderCounts[gender] || 0) + 1
    })

    const total = data.length
    return Object.entries(genderCounts)
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  const total = data.length
  const dominantGender = chartData[0]

  return (
    <div className="flex h-full w-full max-w-full min-h-[200px] flex-col">
      <div className="mb-2 flex flex-wrap items-center justify-center gap-3 font-body text-[clamp(0.7rem,0.9vw,0.85rem)]">
        <div className="text-slate-900">
          Total: <strong className="font-extrabold text-slate-950">{total.toLocaleString()}</strong>
        </div>
        {dominantGender && (
          <div className="text-slate-900">
            Dominant: <strong className="font-extrabold text-blue-900">{dominantGender.name}</strong> (
            {dominantGender.percentage}%)
          </div>
        )}
      </div>
      <div className="mb-2 flex flex-wrap justify-center gap-3 font-body text-[10px] font-extrabold uppercase tracking-widest text-slate-800">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: genderMale }} />
          Male
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: genderFemale }} />
          Female
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: genderOther }} />
          Other
        </span>
      </div>
      <div className="min-h-0 min-w-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
              label={({ name, percent, x, y, textAnchor }) => (
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fill="#020617"
                  fontSize={11}
                  fontWeight={700}
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {`${name}: ${(percent * 100).toFixed(0)}%`}
                </text>
              )}
              innerRadius="48%"
              outerRadius="72%"
              fill="#ffffff"
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={fillForVictimGender(entry.name)} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={chartTooltip}
              formatter={(value, _name, props) => [
                `${value} crimes (${props.payload.percentage}%)`,
                props.payload.name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default VictimGenderChart
