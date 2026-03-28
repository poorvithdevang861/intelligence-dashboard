import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { chartTooltip, axisStroke, tickFill, gridStroke, barFill } from '../../chartTheme'

const ROW_PX = 26
const CHART_PAD = 72

const CrimeHotspotsChart = ({ data }) => {
  const chartData = useMemo(() => {
    const cityCounts = {}
    data.forEach((record) => {
      const city = record.City
      cityCounts[city] = (cityCounts[city] || 0) + 1
    })

    const total = data.length
    return Object.entries(cityCounts)
      .map(([city, count]) => ({
        city,
        count,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.count - a.count)
  }, [data])

  const totalCrimes = data.length
  const topCity = chartData[0]

  const maxCityLen = chartData.reduce((m, d) => Math.max(m, d.city?.length ?? 0), 0)
  const yAxisWidth = Math.min(168, Math.max(88, 12 + maxCityLen * 7))

  const chartHeight = Math.max(200, chartData.length * ROW_PX + CHART_PAD)

  return (
    <div className="flex h-full w-full max-w-full min-h-[200px] flex-col">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1 font-body text-[clamp(0.7rem,0.9vw,0.85rem)]">
        <div className="text-slate-900">
          Total: <strong className="font-extrabold text-slate-950">{totalCrimes.toLocaleString()}</strong>
        </div>
        {topCity && (
          <div className="text-slate-900">
            Top: <strong className="font-extrabold text-blue-900">{topCity.city}</strong> ({topCity.percentage}%)
          </div>
        )}
        {chartData.length > 0 && (
          <div className="w-full text-slate-700 sm:w-auto">
            <span className="font-semibold text-slate-900">{chartData.length}</span> cities
          </div>
        )}
      </div>
      <div
        className="custom-scrollbar min-h-0 min-w-0 w-full flex-1 overflow-x-auto overflow-y-auto pr-1"
        style={{ maxHeight: 'min(28rem, 55vh)' }}
      >
        <div style={{ height: chartHeight, minWidth: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 4, bottom: 8 }}
              barCategoryGap="12%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis type="number" stroke={axisStroke} tick={{ fill: tickFill, fontSize: 11, fontFamily: 'Inter' }} />
              <YAxis
                dataKey="city"
                type="category"
                stroke={axisStroke}
                tick={{ fill: tickFill, fontSize: 10, fontFamily: 'Inter' }}
                width={yAxisWidth}
                interval={0}
              />
              <Tooltip
                contentStyle={chartTooltip}
                formatter={(value, _name, props) => [`${value} crimes (${props.payload.percentage}%)`, props.payload.city]}
                cursor={{ fill: 'rgba(43, 74, 203, 0.08)' }}
              />
              <Bar dataKey="count" fill={barFill} radius={[0, 8, 8, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default CrimeHotspotsChart
