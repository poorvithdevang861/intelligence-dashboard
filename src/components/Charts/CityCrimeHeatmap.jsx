import { Fragment, useMemo } from 'react'

/** Light card: slate empty cells → blue-50 → primary #2563eb (matches other charts) */
const HEAT_EMPTY = [241, 245, 249]
const HEAT_LOW = [239, 246, 255]
const HEAT_HIGH = [37, 99, 235]

function lerpChannel(a, b, t) {
  return Math.round(a + (b - a) * t)
}

function heatRgb(intensity) {
  const t = Math.max(0, Math.min(1, intensity))
  return `rgb(${lerpChannel(HEAT_LOW[0], HEAT_HIGH[0], t)},${lerpChannel(HEAT_LOW[1], HEAT_HIGH[1], t)},${lerpChannel(HEAT_LOW[2], HEAT_HIGH[2], t)})`
}

function emptyCellRgb() {
  return `rgb(${HEAT_EMPTY[0]},${HEAT_EMPTY[1]},${HEAT_EMPTY[2]})`
}

function crimeTypeAbbr(full) {
  const key = full.trim()
  const specials = {
    Burglary: 'BURG',
    'Identity Theft': 'IDTF',
    'Aggravated Assault': 'ASLT',
    Assault: 'ASLT',
    Robbery: 'ROBB',
    Theft: 'THEF',
    Homicide: 'HOM',
    Kidnapping: 'KIDN',
    Vandalism: 'VAND',
    Fraud: 'FRUD',
    Arson: 'ARSN',
    Cybercrime: 'CYBR',
    'Drug Offense': 'DRUG',
    'Sexual Assault': 'SXAS',
    Stalking: 'STLK',
    Extortion: 'EXT',
    Bribery: 'BRIB',
  }
  if (specials[key]) return specials[key]
  const parts = key.split(/[\s/-]+/).filter(Boolean)
  if (parts.length >= 2) {
    return parts
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 4)
  }
  return key
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 4)
    .toUpperCase()
    .padEnd(4, '·')
    .slice(0, 4)
}

const CityCrimeHeatmap = ({ data }) => {
  const heatmapData = useMemo(() => {
    const cityCrimeMap = {}

    data.forEach((record) => {
      const city = record.City
      const crimeType = record['Crime Description']
      const mapKey = `${city}-${crimeType}`
      cityCrimeMap[mapKey] = (cityCrimeMap[mapKey] || 0) + 1
    })

    const cityCounts = {}
    const crimeTypeCounts = {}

    data.forEach((record) => {
      cityCounts[record.City] = (cityCounts[record.City] || 0) + 1
      crimeTypeCounts[record['Crime Description']] = (crimeTypeCounts[record['Crime Description']] || 0) + 1
    })

    const topCities = Object.entries(cityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([city]) => city)

    const topCrimeTypes = Object.entries(crimeTypeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([type]) => type)

    const matrix = topCities.map((city) => {
      const row = { city }
      topCrimeTypes.forEach((crimeType) => {
        const key = `${city}-${crimeType}`
        row[crimeType] = cityCrimeMap[key] || 0
      })
      return row
    })

    const maxValue = Math.max(...Object.values(cityCrimeMap), 1)

    const abbrs = topCrimeTypes.map((t) => ({ full: t, abbr: crimeTypeAbbr(t) }))

    return { matrix, cities: topCities, crimeTypes: topCrimeTypes, abbrs, maxValue }
  }, [data])

  return (
    <div className="flex min-h-[200px] w-full max-w-full flex-col font-body">
      <div
        className="grid w-full gap-2"
        style={{
          gridTemplateColumns: `minmax(4.5rem, auto) repeat(${heatmapData.crimeTypes.length}, minmax(0, 1fr))`,
        }}
      >
        <div className="min-h-[1.25rem]" aria-hidden />

        {heatmapData.abbrs.map(({ full, abbr }) => (
          <div
            key={full}
            className="flex items-end justify-center pb-1 text-center font-body text-[10px] font-extrabold uppercase tracking-widest text-slate-600"
            title={full}
          >
            {abbr}
          </div>
        ))}

        {heatmapData.matrix.map((row) => (
          <Fragment key={row.city}>
            <div className="flex items-center pr-1 text-left text-xs font-semibold text-slate-700">{row.city}</div>
            {heatmapData.crimeTypes.map((crimeType) => {
              const value = row[crimeType]
              const t = value > 0 && heatmapData.maxValue > 0 ? value / heatmapData.maxValue : 0
              const bg = value === 0 ? emptyCellRgb() : heatRgb(t)
              const labelDark = value === 0 || t < 0.5
              return (
                <div
                  key={crimeType}
                  className="flex min-h-[2.25rem] items-center justify-center rounded-md text-xs font-bold tabular-nums text-slate-900 transition-transform hover:scale-[1.02] hover:ring-2 hover:ring-[#2563eb]/25"
                  style={{
                    backgroundColor: bg,
                    color: labelDark ? '#0f172a' : '#ffffff',
                  }}
                  title={`${row.city} — ${crimeType}: ${value}`}
                >
                  {value > 0 ? value : ''}
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-4">
        <span className="shrink-0 font-body text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
          Low density
        </span>
        <div
          className="h-1.5 min-w-0 flex-1 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${emptyCellRgb()} 0%, ${heatRgb(0.25)} 25%, ${heatRgb(0.55)} 55%, ${heatRgb(1)} 100%)`,
          }}
        />
        <span className="shrink-0 font-body text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
          High density
        </span>
      </div>
    </div>
  )
}

export default CityCrimeHeatmap
