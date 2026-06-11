import { cleanWhatsappNumber, formatBusinessHours, whatsappChatLink, telLink } from '../business'
import { shopWaNumber, useShops } from '../ShopsContext'
import SectionTitle from './SectionTitle'
import { ClockIcon, MapPinIcon, PhoneIcon, StoreIcon, WhatsAppIcon } from './icons'

function ShopCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#11162e] p-3 sm:p-4">
      <div className="aspect-video animate-pulse rounded-2xl bg-white/5" />
      <div className="space-y-3 p-3">
        <div className="h-5 w-2/3 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-white/5" />
        <div className="h-9 w-full animate-pulse rounded-xl bg-white/5" />
      </div>
    </div>
  )
}

export default function ShopShowcase() {
  const { shops, status, error } = useShops()

  return (
    <section id="shops" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <SectionTitle
          eyebrow="Our Stores"
          title="Visit Our Shops"
          subtitle="Walk in or reach us on WhatsApp."
        />

        {status === 'loading' && (
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            <ShopCardSkeleton />
            <ShopCardSkeleton />
          </div>
        )}

        {status === 'error' && (
          <div className="mx-auto max-w-lg rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <div className="text-lg font-bold text-red-400">Could not load shop details</div>
            <p className="mt-2 text-sm break-words text-red-300/90">{error}</p>
          </div>
        )}

        {status === 'done' && shops.length === 0 && (
          <p className="text-center text-sm text-slate-400">
            No shops are currently visible in the catalog.
          </p>
        )}

        {status === 'done' && shops.length > 0 && (
          <div
            className={`mx-auto grid max-w-5xl grid-cols-1 gap-8 lg:gap-10 ${shops.length > 1 ? 'lg:grid-cols-2' : 'lg:max-w-2xl'}`}
          >
            {shops.map(shop => {
              const waNumber = shopWaNumber(shop)
              const hoursLines = formatBusinessHours(shop.business_hours)
              return (
                <div
                  key={shop.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#11162e] shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-2xl hover:shadow-gold-500/10"
                >
                  {/* Shop photo block (16:9) — shop_photo_url from POS settings */}
                  <div className="relative m-3 aspect-video overflow-hidden rounded-2xl border border-white/10 sm:m-4">
                    {shop.shop_photo_url ? (
                      <>
                        <img
                          src={shop.shop_photo_url}
                          alt={shop.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0e1f]/80 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-royal-900/70 via-royal-950/70 to-[#0d1126]">
                        <div
                          className="pointer-events-none absolute inset-0 opacity-[0.12]"
                          style={{
                            backgroundImage:
                              'radial-gradient(rgba(212,175,55,0.5) 1px, transparent 1px)',
                            backgroundSize: '20px 20px',
                          }}
                        />
                        <div className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-2xl transition-all duration-500 group-hover:bg-gold-500/20" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0e1f]/70 via-transparent to-transparent" />

                        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/30 bg-white/5 text-gold-400/80">
                          <StoreIcon className="h-8 w-8" />
                        </span>
                        <span className="relative text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
                          Shop photo coming soon
                        </span>
                      </div>
                    )}

                    <span className="pointer-events-none absolute top-2.5 left-2.5 h-5 w-5 rounded-tl-lg border-t-2 border-l-2 border-gold-500/50" />
                    <span className="pointer-events-none absolute top-2.5 right-2.5 h-5 w-5 rounded-tr-lg border-t-2 border-r-2 border-gold-500/50" />
                    <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-gold-500/50" />
                    <span className="pointer-events-none absolute right-2.5 bottom-2.5 h-5 w-5 rounded-br-lg border-r-2 border-b-2 border-gold-500/50" />
                  </div>

                  <div className="flex flex-1 flex-col gap-3 px-5 pb-5 sm:px-6 sm:pb-6">
                    <h3 className="font-display text-xl font-bold text-white">{shop.name}</h3>

                    <div className="space-y-2 text-sm text-slate-400">
                      {/* Address */}
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0 text-royal-300">
                          <MapPinIcon />
                        </span>
                        {shop.address || <span className="italic">Address not added</span>}
                      </div>

                      {/* WhatsApp / phone number */}
                      {waNumber ? (
                        <a
                          href={telLink(waNumber)}
                          className="flex items-center gap-2.5 transition-colors hover:text-gold-300"
                        >
                          <span className="shrink-0 text-royal-300">
                            <PhoneIcon />
                          </span>
                          +{cleanWhatsappNumber(waNumber)}
                        </a>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <span className="shrink-0 text-royal-300">
                            <PhoneIcon />
                          </span>
                          <span className="italic">WhatsApp number not added</span>
                        </div>
                      )}

                      {/* Business hours */}
                      <div className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0 text-royal-300">
                          <ClockIcon />
                        </span>
                        {hoursLines.length > 0 ? (
                          <span>
                            {hoursLines.map((line, i) => (
                              <span key={i} className="block">
                                {line}
                              </span>
                            ))}
                          </span>
                        ) : (
                          <span className="italic">Business hours not added</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto flex gap-2.5 pt-3">
                      {shop.google_maps_url ? (
                        <a
                          href={shop.google_maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-royal-400/40 px-3 py-2.5 text-xs font-semibold text-royal-300 transition-all duration-200 hover:scale-[1.03] hover:bg-royal-500/10 active:scale-95"
                        >
                          <MapPinIcon className="h-3.5 w-3.5" />
                          Directions
                        </a>
                      ) : (
                        <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-slate-500 italic">
                          Map link not added
                        </span>
                      )}
                      {waNumber ? (
                        <a
                          href={whatsappChatLink(
                            `Hello! I have a question about ${shop.name}.`,
                            waNumber,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25d366] px-3 py-2.5 text-xs font-bold text-[#06281a] transition-all duration-200 hover:scale-[1.03] hover:bg-[#3ae07a] active:scale-95"
                        >
                          <WhatsAppIcon className="h-3.5 w-3.5" />
                          WhatsApp
                        </a>
                      ) : (
                        <span className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-slate-500 italic">
                          WhatsApp not added
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
