export default function ChartCard({
  children,
  className = '',
  title,
  subtitle,
  legend,
  /** Table / full-bleed: no inner padding; use custom-scrollbar on scroll child */
  contentFlush = false,
}) {
  return (
    <div
      className={`glass-card glass-card--chart group relative overflow-hidden rounded-2xl p-3 md:p-4 lg:p-5 ${className}`.trim()}
    >
      <div className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col">
        {(title || subtitle || legend) && (
          <div className="mb-3 flex flex-wrap items-start justify-between gap-3 md:mb-4">
            <div className="min-w-0">
              {title && (
                <h4 className="font-headline text-base font-extrabold text-slate-900 md:text-lg">{title}</h4>
              )}
              {subtitle && (
                <p className="mt-1 font-body text-xs font-semibold leading-snug text-slate-800 md:text-sm">{subtitle}</p>
              )}
            </div>
            {legend}
          </div>
        )}
        <div
          className={`card-content-inset flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden ${contentFlush ? '' : 'p-4 md:p-5 lg:p-6'}`.trim()}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
