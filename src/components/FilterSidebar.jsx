import { NavLink } from 'react-router-dom'

const selectClass =
  'w-full rounded-xl border-0 bg-white text-sm font-semibold text-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.06),0_4px_14px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/35 h-10 px-3 font-body'

const navLinkClass = ({ isActive }) =>
  [
    'group flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 text-sm transition-all',
    isActive
      ? 'border-[#2563eb] bg-[#eff6ff] font-semibold text-[#2563eb]'
      : 'border-transparent font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ')

const FilterSidebar = ({ filters, setFilters, filterOptions, onReset }) => {
  const ageGroups = ['All', '0-18', '19-35', '36-50', '51-65', '65+']

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <aside className="sidebar-noise fixed left-0 top-0 z-40 hidden h-screen w-[280px] flex-col bg-white px-6 py-6 shadow-[4px_0_32px_rgba(15,23,42,0.06)] md:flex">
      <div className="mb-6 flex shrink-0 items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb] shadow-[0_4px_14px_rgba(37,99,235,0.35)]">
          <span className="material-symbols-outlined font-semibold text-white">query_stats</span>
        </div>
        <div>
          <h1 className="font-headline text-lg font-extrabold leading-none tracking-tight text-slate-900">
            Crime Intelligence
          </h1>
          <p className="mt-1 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#2563eb]">
            All access
          </p>
          <p className="mt-0.5 font-body text-[10px] font-medium text-slate-600">2020–2024 dataset</p>
        </div>
      </div>

      <nav className="custom-scrollbar flex flex-1 flex-col space-y-1 overflow-y-auto">
        <div className="px-2 py-3">
          <p className="mb-3 ml-1 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">
            Main Dashboard
          </p>
          <NavLink end to="/" className={navLinkClass}>
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-0.5">
              dashboard
            </span>
            Dashboard
          </NavLink>
          <NavLink to="/hotspots" className={({ isActive }) => `${navLinkClass({ isActive })} mt-1`}>
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-0.5">
              location_on
            </span>
            Hotspots
          </NavLink>
        </div>

        <div className="border-t border-slate-100 px-2 py-4">
          <p className="mb-3 ml-1 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">
            Quick Filters
          </p>
          <div className="space-y-4 px-1">
            <div className="space-y-1.5">
              <label className="ml-1 font-body text-xs font-semibold text-slate-700">City</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className={selectClass}
              >
                <option value="All">All Cities</option>
                {filterOptions.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 font-body text-xs font-semibold text-slate-700">Crime Type</label>
              <select
                value={filters.crimeType}
                onChange={(e) => handleFilterChange('crimeType', e.target.value)}
                className={selectClass}
              >
                <option value="All">All Crime Types</option>
                {filterOptions.crimeTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 font-body text-xs font-semibold text-slate-700">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className={selectClass}
              >
                <option value="All">All Years</option>
                {filterOptions.years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 font-body text-xs font-semibold text-slate-700">Weapon</label>
              <select
                value={filters.weapon}
                onChange={(e) => handleFilterChange('weapon', e.target.value)}
                className={selectClass}
              >
                <option value="All">All Weapons</option>
                {filterOptions.weapons.map((weapon) => (
                  <option key={weapon} value={weapon}>
                    {weapon}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 font-body text-xs font-semibold text-slate-700">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className={selectClass}
              >
                <option value="All">All Genders</option>
                {filterOptions.genders.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 font-body text-xs font-semibold text-slate-700">Age Group</label>
              <select
                value={filters.ageGroup}
                onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                className={selectClass}
              >
                {ageGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-3.5 font-body text-xs font-bold uppercase tracking-widest text-white shadow-[0_4px_16px_rgba(37,99,235,0.38)] transition-all hover:bg-[#1d4ed8] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-sm">filter_list_off</span>
              Reset Filters
            </button>
          </div>
        </div>
      </nav>
    </aside>
  )
}

export default FilterSidebar
