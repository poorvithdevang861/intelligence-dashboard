import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  chartTooltip,
  axisStroke,
  tickFill,
  gridStroke,
  lineStroke,
  lineDot,
  lineActiveDot,
} from '../../chartTheme'

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const MonthlyTrendChart = ({ data, selectedYear }) => {
  const isAllYears = selectedYear === 'All'

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    if (isAllYears) {
      const yearlyCounts = {}
      data.forEach((record) => {
        const date = new Date(record['Date of Occurrence'])
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear()
          yearlyCounts[year] = (yearlyCounts[year] || 0) + 1
        }
      })

      return Object.entries(yearlyCounts)
        .map(([year, count]) => ({
          label: year.toString(),
          year: parseInt(year),
          count,
        }))
        .sort((a, b) => a.year - b.year)
    }

    const monthlyTemplate = monthLabels.map((label, index) => ({
      label,
      monthIndex: index,
      count: 0,
    }))

    data.forEach((record) => {
      const date = new Date(record['Date of Occurrence'])
      if (!isNaN(date.getTime())) {
        const monthIdx = date.getMonth()
        if (monthlyTemplate[monthIdx]) {
          monthlyTemplate[monthIdx].count += 1
        }
      }
    })

    return monthlyTemplate
  }, [data, isAllYears])

  const totalCrimes = data.length
  const avgValue = chartData.length > 0 ? (totalCrimes / chartData.length).toFixed(0) : 0
  const avgLabel = isAllYears ? 'Avg/Year' : 'Avg/Month'
  const peakPoint =
    chartData.length > 0 ? chartData.reduce((max, item) => (item.count > max.count ? item : max), chartData[0]) : null
  const peakLabel = isAllYears ? 'Peak Year' : 'Peak Month'

  const xAxisProps = isAllYears
    ? { angle: 0, height: 30, textAnchor: 'middle', fontSize: 11 }
    : { angle: -45, height: 60, textAnchor: 'end', fontSize: 10 }

  return (
    <div className="flex h-full w-full max-w-full min-h-[200px] flex-col">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 font-body text-[clamp(0.7rem,0.9vw,0.85rem)]">
        <div className="text-slate-900">
          {avgLabel}: <strong className="font-extrabold text-slate-950">{avgValue}</strong>
        </div>
        {peakPoint && (
          <div className="text-slate-900">
            {peakLabel}: <strong className="font-extrabold text-blue-900">{peakPoint.label}</strong> ({peakPoint.count}{' '}
            crimes)
          </div>
        )}
      </div>
      <div className="min-h-0 min-w-0 w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: isAllYears ? 30 : 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="label" stroke={axisStroke} tick={{ fill: tickFill, fontSize: 11, fontFamily: 'Inter' }} {...xAxisProps} />
            <YAxis stroke={axisStroke} tick={{ fill: tickFill, fontSize: 11, fontFamily: 'Inter' }} />
            <Tooltip
              contentStyle={chartTooltip}
              formatter={(value, _name, props) => [
                `${value} crimes`,
                isAllYears ? props.payload.label : props.payload.label,
              ]}
              cursor={{ stroke: lineStroke, strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke={lineStroke}
              strokeWidth={3}
              dot={{ fill: lineDot, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: lineActiveDot }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MonthlyTrendChart
