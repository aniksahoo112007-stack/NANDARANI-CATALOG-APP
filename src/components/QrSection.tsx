import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useShops } from '../ShopsContext'
import SectionTitle from './SectionTitle'
import { CheckIcon, CopyIcon, ShareIcon } from './icons'

export default function QrSection() {
  const { shops } = useShops()
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  // Prefer the catalog_url saved in POS settings; fall back to the live URL
  const catalogUrl = shops.find(s => s.catalog_url?.trim())?.catalog_url?.trim() || currentUrl

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(catalogUrl || window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  const shareLink = async () => {
    const url = catalogUrl || window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'NANDARANI Catalog',
          text: 'Browse the NANDARANI premium garment catalog:',
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        setShared(true)
        setTimeout(() => setShared(false), 1800)
      }
    } catch {
      /* user cancelled or unsupported */
    }
  }

  return (
    <section id="share" className="scroll-mt-24 border-y border-white/5 bg-[#0d1126]/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <SectionTitle
          eyebrow="Share"
          title="Scan to Open Catalog"
          subtitle="Share this catalog with customers — one link, the full collection."
        />

        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 sm:flex-row sm:justify-center sm:gap-12">
          {/* QR code card */}
          <div className="group relative shrink-0 rounded-3xl border border-gold-500/30 bg-gradient-to-b from-white/10 to-white/5 p-3 shadow-2xl shadow-black/40 transition-transform duration-300 hover:scale-[1.02]">
            <div className="rounded-2xl bg-white p-4 sm:p-5">
              {catalogUrl ? (
                <QRCodeSVG
                  value={catalogUrl}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#0a0e1f"
                  level="M"
                  aria-label="QR code for catalog link"
                />
              ) : (
                <div className="h-[200px] w-[200px] animate-pulse rounded-lg bg-slate-200" />
              )}
            </div>
            <div className="mt-2.5 pb-1 text-center text-[10px] font-semibold tracking-[0.3em] text-gold-400/90 uppercase">
              Scan Me
            </div>
          </div>

          <div className="flex max-w-xs flex-col items-center gap-4 text-center sm:items-start sm:text-left">
            <p className="text-sm leading-relaxed text-slate-400">
              Print this QR at the counter or send the link directly. Customers
              can browse every product and inquire on WhatsApp instantly.
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <button
                onClick={copyLink}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-bold text-gold-950 shadow-lg shadow-gold-500/20 transition-all duration-200 hover:scale-[1.04] hover:bg-gold-400 active:scale-95"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Link Copied!' : 'Copy Catalog Link'}
              </button>
              <button
                onClick={shareLink}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-royal-400/40 px-5 py-2.5 text-sm font-semibold text-royal-300 transition-all duration-200 hover:scale-[1.04] hover:bg-royal-500/10 active:scale-95"
              >
                {shared ? <CheckIcon /> : <ShareIcon />}
                {shared ? 'Link Copied!' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
