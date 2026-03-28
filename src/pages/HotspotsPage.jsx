import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import KPITiles from '../components/KPITiles'
import ChartCard from '../components/ChartCard'
import CrimeHotspotsChart from '../components/Charts/CrimeHotspotsChart'
import CityCrimeHeatmap from '../components/Charts/CityCrimeHeatmap'

export default function HotspotsPage() {
  const { filters, filterOptions, filteredData, crimeData } = useOutletContext()

  const yearLabel =
    filters.year === 'All'
      ? `${filterOptions.years[0] ?? '—'} – ${filterOptions.years[filterOptions.years.length - 1] ?? '—'}`
      : String(filters.year)

  const cityRankings = useMemo(() => {
    const counts = {}
    filteredData.forEach((r) => {
      const city = r.City
      counts[city] = (counts[city] || 0) + 1
    })
    const total = filteredData.length
    const max = Math.max(1, ...Object.values(counts))
    return Object.entries(counts)
      .map(([city, count]) => ({
        city,
        count,
        pct: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0',
        barPct: (count / max) * 100,
      }))
      .sort((a, b) => b.count - a.count)
  }, [filteredData])

  const hotspotStats = useMemo(() => {
    const total = cityRankings.reduce((s, r) => s + r.count, 0)
    const citiesWithIncidents = cityRankings.length
    const top = cityRankings[0]
    const topShare = top && total > 0 ? ((top.count / total) * 100).toFixed(1) : '0.0'
    return {
      citiesCovered: citiesWithIncidents,
      topCity: top?.city ?? '—',
      topCityCount: top?.count ?? 0,
      topShare,
      total,
    }
  }, [cityRankings])

  return (
    <>
      <header className="mb-5 flex flex-col justify-between gap-4 md:mb-6 md:flex-row md:items-end md:gap-6">
        <div className="min-w-0">
          <nav className="mb-2 flex flex-wrap items-center gap-2 font-body text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-700 md:text-xs">
            <span>Overview</span>
            <span className="material-symbols-outlined text-[10px] text-slate-500">chevron_right</span>
            <span className="text-[#2563eb]">Hotspots</span>
          </nav>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl lg:text-[2.5rem] lg:leading-tight">
            Crime hotspots
          </h2>
          <p className="mt-2 max-w-2xl font-body text-sm font-semibold leading-relaxed text-slate-800 md:text-base">
            City-level concentration from the same filtered dataset as the overview.{' '}
            <span className="text-slate-900">
              {hotspotStats.citiesCovered} cities
            </span>{' '}
            with incidents; top concentration{' '}
            <span className="font-bold text-slate-950">
              {hotspotStats.topCity} ({hotspotStats.topShare}%)
            </span>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white/60 px-4 py-2.5 font-body text-xs font-bold text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_6px_20px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] md:px-5 md:py-3 md:text-sm">
            <span className="material-symbols-outlined text-base text-slate-700 md:text-lg">calendar_today</span>
            {yearLabel}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white/60 px-4 py-2.5 font-body text-xs font-bold text-slate-800 md:px-5 md:py-3 md:text-sm">
            <span className="material-symbols-outlined text-base text-slate-700 md:text-lg">filter_alt</span>
            {filteredData.length.toLocaleString()} records
          </div>
        </div>
      </header>

      <KPITiles data={filteredData} allData={crimeData} />

      <section className="grid grid-cols-12 gap-5 md:gap-6 lg:gap-8">
        <ChartCard
          className="col-span-12"
          title="Crime hotspots by city"
          subtitle="Ranked incident volume — updates with sidebar filters"
        >
          <div className="h-64 min-h-[16rem] w-full min-w-0 md:h-72 lg:h-80">
            <CrimeHotspotsChart data={filteredData} />
          </div>
        </ChartCard>

        <ChartCard
          className="col-span-12 lg:col-span-7"
          contentFlush
          title="City concentration table"
          subtitle="Share of filtered incidents per city"
        >
          <div className="custom-scrollbar max-h-[min(28rem,55vh)] min-h-0 w-full flex-1 overflow-auto">
            <table className="w-full min-w-[280px] border-collapse text-left font-body text-sm">
              <thead className="sticky top-0 z-[1] bg-slate-50/95 backdrop-blur-sm">
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-800">
                  <th className="px-4 py-3 font-headline">#</th>
                  <th className="px-4 py-3 font-headline">City</th>
                  <th className="px-4 py-3 text-right font-headline">Incidents</th>
                  <th className="px-4 py-3 text-right font-headline">Share</th>
                </tr>
              </thead>
              <tbody>
                {cityRankings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center font-semibold text-slate-700">
                      No records match the current filters.
                    </td>
                  </tr>
                ) : (
                  cityRankings.map((row, i) => (
                    <tr
                      key={row.city}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50/80"
                    >
                      <td className="px-4 py-3 font-bold text-slate-800">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-headline font-extrabold text-slate-950">{row.city}</div>
                        <div className="mt-1.5 h-1.5 w-full max-w-[12rem] overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-[#2563eb] transition-all"
                            style={{ width: `${row.barPct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-900">
                        {row.count.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-800">{row.pct}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <ChartCard
          className="col-span-12 lg:col-span-5"
          title="City vs crime type density"
          subtitle="Where types cluster across municipalities"
        >
          <div className="custom-scrollbar max-h-[min(28rem,55vh)] min-h-[200px] min-w-0 overflow-auto">
            <CityCrimeHeatmap data={filteredData} />
          </div>
        </ChartCard>
      </section>
    </>
  )
}
