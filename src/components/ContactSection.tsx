import {
  formatBusinessHours,
  formatPhoneDisplay,
  normalizePhone,
  telLink,
  whatsappChatLink,
} from '../business'
import { shopWaNumber, useShops } from '../ShopsContext'
import SectionTitle from './SectionTitle'
import { ClockIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from './icons'

export default function ContactSection() {
  const { shops, status, error } = useShops()

  const primaryShop = shops.find(s => normalizePhone(shopWaNumber(s))) ?? shops[0]
  const primaryDigits = normalizePhone(shopWaNumber(primaryShop))
  const shopsWithHours = shops
    .map(shop => ({ shop, lines: formatBusinessHours(shop.business_hours) }))
    .filter(({ lines }) => lines.length > 0)

  return (
    <section id="contact" className="scroll-mt-24 border-t border-white/5 bg-[#0d1126]/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <SectionTitle
          eyebrow="Get In Touch"
          title="Contact & Visit"
          subtitle="Call, message, or drop by — we are happy to help you find the perfect garment."
        />

        {status === 'error' && (
          <div className="mx-auto mb-8 max-w-lg rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center">
            <p className="text-sm break-words text-red-300/90">
              Could not load shop settings: {error}
            </p>
          </div>
        )}

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {/* Business hours — from shops.business_hours */}
          <div className="rounded-2xl border border-white/10 bg-[#11162e] p-6">
            <div className="mb-4 flex items-center gap-2.5 text-gold-400">
              <ClockIcon className="h-5 w-5" />
              <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                Business Hours
              </h3>
            </div>
            {shopsWithHours.length > 0 ? (
              <div className="space-y-4 text-sm">
                {shopsWithHours.map(({ shop, lines }) => (
                  <div key={shop.id}>
                    {shopsWithHours.length > 1 && (
                      <div className="mb-1 text-[11px] font-semibold tracking-wider text-gold-500/80 uppercase">
                        {shop.name}
                      </div>
                    )}
                    <ul className="space-y-1.5">
                      {lines.map((line, i) => (
                        <li key={i} className="text-slate-300">
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">
                {status === 'loading' ? 'Loading hours…' : 'Business hours not added'}
              </p>
            )}
          </div>

          {/* Phone / WhatsApp — from shops.whatsapp / shops.phone */}
          <div className="rounded-2xl border border-white/10 bg-[#11162e] p-6">
            <div className="mb-4 flex items-center gap-2.5 text-gold-400">
              <PhoneIcon className="h-5 w-5" />
              <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                Call or Message
              </h3>
            </div>
            {primaryDigits ? (
              <div className="flex flex-col gap-3">
                <a
                  href={telLink(primaryDigits)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-royal-400/40 px-4 py-2.5 text-sm font-semibold text-royal-300 transition-all duration-200 hover:scale-[1.03] hover:bg-royal-500/10 active:scale-95"
                >
                  <PhoneIcon />
                  {formatPhoneDisplay(primaryDigits)}
                </a>
                <a
                  href={whatsappChatLink(
                    'Hello! I am contacting you from the NANDARANI Catalog website.',
                    primaryDigits,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25d366] px-4 py-2.5 text-sm font-bold text-[#06281a] transition-all duration-200 hover:scale-[1.03] hover:bg-[#3ae07a] active:scale-95"
                >
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">
                {status === 'loading' ? 'Loading…' : 'WhatsApp number not added'}
              </p>
            )}
            <p className="mt-4 text-[11px] text-slate-600 italic">
              Fastest reply on WhatsApp during business hours.
            </p>
          </div>

          {/* Directions — from shops.google_maps_url */}
          <div className="rounded-2xl border border-white/10 bg-[#11162e] p-6 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center gap-2.5 text-gold-400">
              <MapPinIcon className="h-5 w-5" />
              <h3 className="text-sm font-bold tracking-wider text-white uppercase">
                Find Us
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {shops.length > 0 ? (
                shops.map(shop =>
                  shop.google_maps_url ? (
                    <a
                      key={shop.id}
                      href={shop.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-royal-400/40 px-4 py-2.5 text-xs font-semibold text-royal-300 transition-all duration-200 hover:scale-[1.03] hover:bg-royal-500/10 active:scale-95"
                    >
                      <MapPinIcon className="h-3.5 w-3.5" />
                      {shop.name}
                    </a>
                  ) : (
                    <span
                      key={shop.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs text-slate-500 italic"
                    >
                      {shop.name}: Map link not added
                    </span>
                  ),
                )
              ) : (
                <p className="text-sm text-slate-400 italic">
                  {status === 'loading' ? 'Loading…' : 'Map link not added'}
                </p>
              )}
            </div>
            <p className="mt-4 text-[11px] text-slate-600 italic">
              Opens Google Maps directions.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-center sm:px-6 lg:px-8">
          <div className="font-display text-lg font-bold tracking-wide text-white">
            NANDARANI <span className="text-gold-400">COLLECTION</span>
          </div>
          {shops.length > 0 && (
            <div className="text-xs tracking-widest text-slate-600 uppercase">
              {shops.map(s => s.name).join(' · ')}
            </div>
          )}
          <div className="text-[11px] text-slate-700">
            © {new Date().getFullYear()} NANDARANI. All rights reserved.
          </div>
        </div>
      </footer>
    </section>
  )
}
