interface SectionTitleProps {
  eyebrow: string
  title: string
  subtitle?: string
}

export default function SectionTitle({ eyebrow, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-10 text-center sm:mb-12">
      <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.35em] text-gold-500/80 uppercase">
        <span className="h-px w-8 bg-gold-500/50" />
        {eyebrow}
        <span className="h-px w-8 bg-gold-500/50" />
      </div>
      <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">{subtitle}</p>}
    </div>
  )
}
