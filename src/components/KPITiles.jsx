import { useMemo } from 'react'

const overline = 'font-body text-[10px] font-extrabold uppercase tracking-widest text-slate-800'

function KpiInsetCard({ children }) {
  return (
    <div className="glass-card group relative overflow-hidden rounded-2xl p-3 md:p-4">
      <div className="absolute -right-4 -top-4 z-0 h-24 w-24 rounded-bl-[100px] bg-primary/10 transition-all group-hover:scale-110" />
      <div className="relative z-[1] card-content-inset p-4 md:p-5">{children}</div>
    </div>
  )
}

const KPITiles = ({ data, allData }) => {
  const kpis = useMemo(() => {
    const totalCrimes = data.length

    const allDataTotal = allData?.length || data.length
    const previousPeriod = allDataTotal - totalCrimes
    const totalChange =
      previousPeriod > 0 ? (((totalCrimes - previousPeriod) / previousPeriod) * 100).toFixed(1) : '0.0'
    const isTotalIncreasing = parseFloat(totalChange) > 0

    const crimeTypeCounts = {}
    data.forEach((record) => {
      const type = record['Crime Description']
      crimeTypeCounts[type] = (crimeTypeCounts[type] || 0) + 1
    })
    const mostCommonCrime = Object.entries(crimeTypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    const mostCommonCrimeCount = crimeTypeCounts[mostCommonCrime] || 0
    const mostCommonCrimePercent = totalCrimes > 0 ? ((mostCommonCrimeCount / totalCrimes) * 100).toFixed(1) : 0

    const cityCounts = {}
    data.forEach((record) => {
      const city = record.City
      cityCounts[city] = (cityCounts[city] || 0) + 1
    })
    const highestCrimeCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    const highestCrimeCityCount = cityCounts[highestCrimeCity] || 0
    const highestCrimeCityPercent = totalCrimes > 0 ? ((highestCrimeCityCount / totalCrimes) * 100).toFixed(1) : 0

    const closedCases = data.filter((record) => record['Case Closed'] === 'Yes').length
    const closureRate = totalCrimes > 0 ? ((closedCases / totalCrimes) * 100).toFixed(1) : 0
    const closureRateNum = parseFloat(closureRate)

    const allClosedCases = allData?.filter((record) => record['Case Closed'] === 'Yes').length || closedCases
    const allClosureRate = allData?.length > 0 ? (allClosedCases / allData.length) * 100 : parseFloat(closureRate)
    const closureChange = (parseFloat(closureRate) - allClosureRate).toFixed(1)
    const isClosureIncreasing = parseFloat(closureChange) > 0

    return {
      totalCrimes,
      totalChange: Math.abs(totalChange),
      isTotalIncreasing,
      mostCommonCrime,
      mostCommonCrimePercent,
      highestCrimeCity,
      highestCrimeCityPercent,
      closureRate: `${closureRate}%`,
      closureRateNum,
      closureChange: Math.abs(closureChange),
      isClosureIncreasing,
    }
  }, [data, allData])

  const trendIcon = (up) => (
    <span className="material-symbols-outlined text-sm">{up ? 'trending_up' : 'trending_down'}</span>
  )

  return (
    <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:mb-6 lg:grid-cols-4 lg:gap-6">
      <KpiInsetCard>
        <div className="mb-4 flex items-center justify-between">
          <span className={overline}>Total Crimes</span>
          <span className="material-symbols-outlined rounded-lg bg-[#2563eb] p-2 text-xl text-white shadow-sm">
            gavel
          </span>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <h3 className="font-headline text-3xl font-extrabold text-slate-950">{kpis.totalCrimes.toLocaleString()}</h3>
          <div
            className={`flex items-center gap-0.5 pb-1 font-body text-sm font-bold ${
              kpis.isTotalIncreasing ? 'text-emerald-700' : 'text-red-700'
            }`}
          >
            {trendIcon(kpis.isTotalIncreasing)}
            <span>
              {kpis.isTotalIncreasing ? '+' : '-'}
              {kpis.totalChange}%
            </span>
          </div>
        </div>
        <p className="mt-2 font-body text-xs font-bold text-slate-800">vs. all data baseline</p>
      </KpiInsetCard>

      <KpiInsetCard>
        <div className="mb-4 flex items-center justify-between">
          <span className={overline}>Primary Type</span>
          <span className="material-symbols-outlined rounded-lg bg-[#2563eb] p-2 text-xl text-white shadow-sm">
            shield_moon
          </span>
        </div>
        <div className="flex items-end gap-3">
          <h3
            className="line-clamp-2 font-headline text-2xl font-extrabold text-slate-950 md:text-3xl"
            title={kpis.mostCommonCrime}
          >
            {kpis.mostCommonCrime}
          </h3>
        </div>
        <p className="mt-2 font-body text-xs font-bold text-slate-800">
          {kpis.mostCommonCrimePercent}% of total incidents
        </p>
      </KpiInsetCard>

      <KpiInsetCard>
        <div className="mb-4 flex items-center justify-between">
          <span className={overline}>Hotspot City</span>
          <span className="material-symbols-outlined rounded-lg bg-[#2563eb] p-2 text-xl text-white shadow-sm">
            location_city
          </span>
        </div>
        <div className="flex items-end gap-3">
          <h3 className="font-headline text-3xl font-extrabold text-slate-950">{kpis.highestCrimeCity}</h3>
        </div>
        <p className="mt-2 font-body text-xs font-bold text-slate-800">
          {kpis.highestCrimeCityPercent}% of total incidents
        </p>
      </KpiInsetCard>

      <KpiInsetCard>
        <div className="mb-4 flex items-center justify-between">
          <span className={overline}>Case Closure</span>
          <span className="material-symbols-outlined rounded-lg bg-[#2563eb] p-2 text-xl text-white shadow-sm">
            task_alt
          </span>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <h3 className="font-headline text-3xl font-extrabold text-slate-950">{kpis.closureRate}</h3>
          <div
            className={`flex items-center gap-0.5 pb-1 font-body text-sm font-bold ${
              kpis.isClosureIncreasing ? 'text-emerald-700' : 'text-red-700'
            }`}
          >
            {trendIcon(kpis.isClosureIncreasing)}
            <span>
              {kpis.isClosureIncreasing ? '+' : '-'}
              {kpis.closureChange}%
            </span>
          </div>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#2563eb] transition-all"
            style={{ width: `${Math.min(100, kpis.closureRateNum)}%` }}
          />
        </div>
        <p className="mt-2 font-body text-xs font-bold text-slate-800">vs. dataset average</p>
      </KpiInsetCard>
    </section>
  )
}

export default KPITiles
