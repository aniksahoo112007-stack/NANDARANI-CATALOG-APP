import { normalizePhone, whatsappChatLink } from '../business'
import { shopWaNumber, useShops } from '../ShopsContext'
import { WhatsAppIcon } from './icons'

export default function Hero() {
  const { shops } = useShops()
  const waNumber = shopWaNumber(shops.find(s => normalizePhone(shopWaNumber(s))))

  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-royal-950 via-[#0e1433] to-[#0a0e1f]">
      {/* decorative glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-royal-500/25 blur-3xl" />
      <div className="pointer-events-none absolute top-16 right-[10%] h-56 w-56 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-[6%] h-64 w-64 rounded-full bg-royal-700/20 blur-3xl" />
      {/* dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(rgba(212,175,55,0.4) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      {/* bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#0a0e1f]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="hero-rise hero-rise-1 mb-5 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.35em] text-gold-500/80 uppercase">
          <span className="h-px w-8 bg-gold-500/50" />
          Est. Quality
          <span className="h-px w-8 bg-gold-500/50" />
        </div>

        <h1 className="hero-rise hero-rise-2 font-display bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-bold tracking-wide text-transparent sm:text-6xl lg:text-7xl">
          NANDARANI COLLECTION
        </h1>
        <p className="hero-rise hero-rise-3 mt-4 text-sm tracking-[0.3em] text-gold-400/90 uppercase sm:text-base">
          Premium Garment Catalog
        </p>
        <p className="hero-rise hero-rise-4 mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Explore our full collection of premium garments from both NANDARANI
          stores — search, filter and inquire directly on WhatsApp.
        </p>

        <div className="hero-rise hero-rise-5 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="#products"
            className="inline-flex w-full items-center justify-center rounded-xl bg-gold-500 px-7 py-3 text-sm font-bold text-gold-950 shadow-lg shadow-gold-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-gold-400 active:scale-95 sm:w-auto"
          >
            View Products
          </a>
          <a
            href={whatsappChatLink(
              'Hello! I would like to know more about NANDARANI Collection.',
              waNumber,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-7 py-3 text-sm font-bold text-emerald-400 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-emerald-500/20 active:scale-95 sm:w-auto"
          >
            <WhatsAppIcon />
            WhatsApp Us
          </a>
        </div>
      </div>
    </header>
  )
}
