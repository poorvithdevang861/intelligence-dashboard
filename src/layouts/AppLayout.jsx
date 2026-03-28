import { useState, useMemo, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import FilterSidebar from '../components/FilterSidebar'

const initialFilters = {
  city: 'All',
  crimeType: 'All',
  year: 'All',
  weapon: 'All',
  gender: 'All',
  ageGroup: 'All',
}

export default function AppLayout() {
  const [filters, setFilters] = useState(initialFilters)
  const [crimeData, setCrimeData] = useState(null)
  const [loadError, setLoadError] = useState(null)

  /** Load JSON from `public/data/` (not bundled). URL is relative so it works with `…/Intelligence-dashboard/` or lowercase. */
  useEffect(() => {
    let cancelled = false
    const url = `${import.meta.env.BASE_URL}data/crime-data.json`
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load dataset (${r.status})`)
        return r.json()
      })
      .then((data) => {
        if (!cancelled) setCrimeData(Array.isArray(data) ? data : [])
      })
      .catch((e) => {
        if (!cancelled) setLoadError(e?.message ?? 'Failed to load crime data')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filterOptions = useMemo(() => {
    if (!crimeData?.length) {
      return { cities: [], crimeTypes: [], weapons: [], genders: [], years: [] }
    }
    const cities = [...new Set(crimeData.map((d) => d.City))].sort()
    const crimeTypes = [...new Set(crimeData.map((d) => d['Crime Description']))].sort()
    const weapons = [...new Set(crimeData.map((d) => d['Weapon Used']))].sort()
    const genders = [...new Set(crimeData.map((d) => d['Victim Gender']))].sort()

    const yearSet = new Set()
    crimeData.forEach((d) => {
      const date = new Date(d['Date of Occurrence'])
      if (!isNaN(date.getTime())) {
        yearSet.add(date.getFullYear())
      }
    })
    const years = Array.from(yearSet)
      .map((y) => parseInt(y))
      .sort((a, b) => a - b)

    return { cities, crimeTypes, weapons, genders, years }
  }, [crimeData])

  const filteredData = useMemo(() => {
    if (!crimeData?.length) return []
    return crimeData.filter((record) => {
      if (filters.city !== 'All' && record.City !== filters.city) return false
      if (filters.crimeType !== 'All' && record['Crime Description'] !== filters.crimeType) return false
      if (filters.weapon !== 'All' && record['Weapon Used'] !== filters.weapon) return false
      if (filters.gender !== 'All' && record['Victim Gender'] !== filters.gender) return false

      if (filters.year !== 'All') {
        const recordYear = new Date(record['Date of Occurrence']).getFullYear()
        if (recordYear !== parseInt(filters.year)) return false
      }

      if (filters.ageGroup !== 'All') {
        const age = parseInt(record['Victim Age'])
        if (filters.ageGroup === '0-18' && (age < 0 || age > 18)) return false
        if (filters.ageGroup === '19-35' && (age < 19 || age > 35)) return false
        if (filters.ageGroup === '36-50' && (age < 36 || age > 50)) return false
        if (filters.ageGroup === '51-65' && (age < 51 || age > 65)) return false
        if (filters.ageGroup === '65+' && age < 65) return false
      }

      return true
    })
  }, [filters, crimeData])

  const layoutContext = {
    filters,
    setFilters,
    filterOptions,
    filteredData,
    crimeData: crimeData ?? [],
    initialFilters,
    onReset: () => setFilters(initialFilters),
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-lg">
          <p className="font-headline text-lg font-extrabold text-slate-900">Could not load data</p>
          <p className="mt-2 font-body text-sm text-slate-600">{loadError}</p>
          <p className="mt-3 font-body text-xs text-slate-500">
            Ensure <code className="rounded bg-slate-100 px-1">public/data/crime-data.json</code> is deployed.
          </p>
        </div>
      </div>
    )
  }

  if (crimeData === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-[#2563eb] border-t-transparent"
          aria-hidden
        />
        <p className="font-body text-sm font-semibold text-slate-700">Loading crime dataset…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <FilterSidebar {...layoutContext} />

      <main className="custom-scrollbar fixed inset-0 z-10 box-border min-h-0 min-w-0 overflow-x-hidden overflow-y-auto bg-slate-50 px-4 pb-8 pt-4 md:left-[280px] md:px-6 md:pt-5 lg:px-8 lg:pt-6">
        <Outlet context={layoutContext} />

        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 py-6 md:mt-16 md:flex-row md:py-8">
          <div className="flex items-center gap-2 text-slate-600">
            <span className="material-symbols-outlined text-sm text-primary">verified_user</span>
            <span className="font-body text-xs font-bold uppercase tracking-widest text-slate-700">
              Crime Intel · Secure analytics
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 font-body text-[10px] font-bold uppercase tracking-widest text-slate-600">
            <span className="cursor-default hover:text-primary">Privacy</span>
            <span className="cursor-default hover:text-primary">API status</span>
            <span className="cursor-default hover:text-primary">v4.2.0</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
