import { useOutletContext } from 'react-router-dom'
import { genderFemale, genderMale, genderOther } from '../chartTheme'
import KPITiles from '../components/KPITiles'
import ChartCard from '../components/ChartCard'
import CrimeHotspotsChart from '../components/Charts/CrimeHotspotsChart'
import CrimeTypeDistributionChart from '../components/Charts/CrimeTypeDistributionChart'
import VictimGenderChart from '../components/Charts/VictimGenderChart'
import CityCrimeHeatmap from '../components/Charts/CityCrimeHeatmap'
import VictimAgeChart from '../components/Charts/VictimAgeChart'
import MonthlyTrendChart from '../components/Charts/MonthlyTrendChart'

export default function DashboardPage() {
  const { filters, filterOptions, filteredData, crimeData } = useOutletContext()

  const yearLabel =
    filters.year === 'All'
      ? `${filterOptions.years[0] ?? '—'} – ${filterOptions.years[filterOptions.years.length - 1] ?? '—'}`
      : String(filters.year)

  const trendLegend = (
    <div className="flex flex-wrap items-center gap-3 font-body text-[10px] font-extrabold uppercase tracking-widest text-slate-800 md:gap-4">
      <div className="flex items-center gap-2 text-slate-900">
        <span className="h-3 w-3 shrink-0 rounded-full bg-primary" />
        Incidents
      </div>
      <div className="flex items-center gap-2 text-slate-800">
        <span className="h-3 w-3 shrink-0 rounded-full bg-slate-500" />
        Timeline
      </div>
    </div>
  )

  const typeLegend = (
    <div className="flex flex-wrap gap-3 font-body text-[10px] font-extrabold uppercase tracking-widest text-slate-800 md:gap-4">
      <div className="flex items-center gap-1.5 text-slate-900">
        <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: genderMale }} />
        Male
      </div>
      <div className="flex items-center gap-1.5 text-slate-900">
        <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: genderFemale }} />
        Female
      </div>
      <div className="flex items-center gap-1.5 text-slate-900">
        <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: genderOther }} />
        Other
      </div>
    </div>
  )

  return (
    <>
      <header className="mb-5 flex flex-col justify-between gap-4 md:mb-6 md:flex-row md:items-end md:gap-6">
        <div className="min-w-0">
          <nav className="mb-2 flex flex-wrap items-center gap-2 font-body text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-700 md:text-xs">
            <span>Overview</span>
            <span className="material-symbols-outlined text-[10px] text-slate-500">chevron_right</span>
            <span className="text-[#2563eb]">Intelligence Overview</span>
          </nav>
          <h2 className="font-headline text-3xl font-extrabold tracking-tight text-slate-950 md:text-4xl lg:text-[2.5rem] lg:leading-tight">
            Intelligence Overview
          </h2>
          <p className="mt-2 max-w-2xl font-body text-sm font-semibold leading-relaxed text-slate-800 md:text-base">
            Real-time crime intelligence for India (2020–2024). Use the sidebar filters to explore patterns and case
            outcomes.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 md:gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white/60 px-4 py-2.5 font-body text-xs font-bold text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_6px_20px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(15,23,42,0.08)] md:px-5 md:py-3 md:text-sm">
            <span className="material-symbols-outlined text-base text-slate-700 md:text-lg">calendar_today</span>
            {yearLabel}
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2.5 font-body text-xs font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)] transition-colors transition-shadow hover:bg-[#1d4ed8] hover:shadow-[0_6px_22px_rgba(37,99,235,0.45)] md:px-5 md:py-3 md:text-sm"
            onClick={() => window.print()}
          >
            <span className="material-symbols-outlined text-base md:text-lg">file_download</span>
            Export data
          </button>
        </div>
      </header>

      <KPITiles data={filteredData} allData={crimeData} />

      <section className="grid grid-cols-12 gap-5 md:gap-6 lg:gap-8">
        <ChartCard
          className="col-span-12 lg:col-span-8"
          title="Monthly Crime Trend"
          subtitle="Longitudinal incident mapping"
          legend={trendLegend}
        >
          <div className="h-56 min-h-[14rem] w-full min-w-0 md:h-60 lg:h-64">
            <MonthlyTrendChart data={filteredData} selectedYear={filters.year} />
          </div>
        </ChartCard>

        <ChartCard className="col-span-12 flex flex-col lg:col-span-4" title="Victim Gender" subtitle="Demographic breakdown">
          <div className="min-h-[200px] w-full min-w-0 flex-1 md:min-h-[220px] lg:min-h-[240px]">
            <VictimGenderChart data={filteredData} />
          </div>
        </ChartCard>

        <ChartCard
          className="col-span-12 lg:col-span-6"
          title="Crime Hotspots by City"
          subtitle="Volumetric ranking by municipal district"
        >
          <div className="h-56 min-h-[14rem] w-full min-w-0 md:h-60 lg:h-64">
            <CrimeHotspotsChart data={filteredData} />
          </div>
        </ChartCard>

        <ChartCard
          className="col-span-12 lg:col-span-6"
          title="Victim Age Distribution"
          subtitle="Incident frequency by age bracket"
        >
          <div className="h-56 min-h-[14rem] w-full min-w-0 md:h-60 lg:h-64">
            <VictimAgeChart data={filteredData} />
          </div>
        </ChartCard>

        <ChartCard
          className="col-span-12 lg:col-span-7"
          title="Crime Type Distribution"
          subtitle="Segmentation by gender and category"
          legend={typeLegend}
        >
          <div className="h-64 min-h-[15rem] w-full min-w-0 md:h-72 lg:h-80">
            <CrimeTypeDistributionChart data={filteredData} />
          </div>
        </ChartCard>

        <ChartCard
          className="col-span-12 lg:col-span-5"
          title="City vs Type Density"
          subtitle="Intensity heatmap of incident types"
        >
          <div className="custom-scrollbar max-h-[min(22rem,50vh)] min-h-[180px] min-w-0 overflow-auto md:max-h-[26rem] lg:max-h-[28rem]">
            <CityCrimeHeatmap data={filteredData} />
          </div>
        </ChartCard>
      </section>
    </>
  )
}
