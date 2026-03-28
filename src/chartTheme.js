/** Recharts — high contrast on white cards (Crime Intel style) */
export const chartTooltip = {
  backgroundColor: '#ffffff',
  border: '1px solid #94a3b8',
  borderRadius: '10px',
  fontSize: '12px',
  color: '#020617',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontWeight: 600,
  boxShadow: '0 12px 32px rgba(15, 23, 42, 0.14)',
}

export const axisStroke = '#94a3b8'
export const tickFill = '#0f172a'
export const gridStroke = '#cbd5e1'

export const lineStroke = '#2563eb'
export const lineDot = '#1d4ed8'
export const lineActiveDot = '#1e40af'

export const barFill = '#2563eb'

/**
 * Victim gender — donut blue family on Victim Gender + Crime Type charts (M / F / X).
 */
export const genderMale = '#1d4ed8'
export const genderFemale = '#3b82f6'
export const genderOther = '#60a5fa'

/** Stacked gender bars (aliases) */
export const barFemale = genderFemale
export const barOther = genderOther

export const pieColors = [genderMale, genderFemale, genderOther, '#93c5fd']

/**
 * @param {string} code Raw `Victim Gender` (M, F, X, Unknown, …)
 */
export function fillForVictimGender(code) {
  const g = String(code ?? '')
    .trim()
    .toUpperCase()
  if (g === 'M' || g === 'MALE') return genderMale
  if (g === 'F' || g === 'FEMALE') return genderFemale
  return genderOther
}
