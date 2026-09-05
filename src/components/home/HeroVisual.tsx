export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-brand-secondary/50 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2.25rem] bg-[#cfe5d2] p-3 shadow-[0_28px_80px_rgba(16,35,31,0.16)] ring-1 ring-white/80 sm:p-4">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_38%)]" />
        <svg viewBox="0 0 560 420" className="relative h-auto w-full" role="img" aria-labelledby="hero-visual-title">
          <title id="hero-visual-title">Original illustration of a home with rooftop solar panels under a bright sky</title>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8bc7bb" />
              <stop offset="55%" stopColor="#dcefdc" />
              <stop offset="100%" stopColor="#f8f5e7" />
            </linearGradient>
            <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#103e3c" />
              <stop offset="100%" stopColor="#1e765e" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="560" height="420" rx="28" fill="url(#sky)" />
          <circle cx="430" cy="92" r="42" fill="#F6C453" />
          <circle cx="430" cy="92" r="58" fill="#F6C453" fillOpacity="0.22" />
          <path d="M0 318c48-28 92-18 138 4 52 24 84 10 128-18 50-32 96-20 146 8 38 22 82 28 148 6v102H0V318Z" fill="#abc994" />
          <path d="M108 268 278 148l172 118v92H108v-90Z" fill="#f6f3e9" />
          <path d="M108 268 278 148l172 118-48 18-124-86-124 88 0-18Z" fill="#dce4d8" />
          <rect x="248" y="286" width="44" height="72" rx="4" fill="#176b4d" />
          <rect x="136" y="286" width="42" height="32" rx="4" fill="#b8d1cf" />
          <rect x="330" y="272" width="52" height="46" rx="4" fill="#b8d1cf" />
          <g transform="translate(168 168) rotate(-33)">
            <rect x="0" y="0" width="176" height="86" rx="8" fill="url(#panel)" />
            <path d="M0 21.5h176M0 43h176M0 64.5h176M44 0v86M88 0v86M132 0v86" stroke="white" strokeOpacity="0.28" />
          </g>
          <g transform="translate(248 196) rotate(-33)">
            <rect x="0" y="0" width="132" height="64" rx="8" fill="url(#panel)" />
            <path d="M0 16h132M0 32h132M0 48h132M33 0v64M66 0v64M99 0v64" stroke="white" strokeOpacity="0.28" />
          </g>
        </svg>
        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-[#10231f]/90 px-4 py-3 text-white shadow-sm backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-secondary">Clean energy</p>
            <p className="mt-0.5 text-sm font-medium text-white">Designed around your everyday</p>
          </div>
          <span className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 sm:inline">
            100% yours
          </span>
        </div>
      </div>
    </div>
  );
}
