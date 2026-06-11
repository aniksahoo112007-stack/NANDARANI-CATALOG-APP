// NANDARANI Catalog — premium product catalog section
import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import { normalizePhone, SHOP_MAP, SHOPS, WHATSAPP_NUMBER } from './business'
import { shopWaNumber, useShops } from './ShopsContext'
import SectionTitle from './components/SectionTitle'
import {
  CheckIcon,
  CloseIcon,
  CopyIcon,
  SearchIcon,
  ShareIcon,
  ShirtIcon,
  WhatsAppIcon,
} from './components/icons'

interface Product {
  id: string
  name: string
  selling_price: number
  barcode: string
  stock_quantity: number
  shop_id: string
  image_url: string | null
  category?: string | null
  size?: string | null
  color?: string | null
  created_at?: string | null
}

const NEW_ARRIVAL_DAYS = 14
const LOW_STOCK_THRESHOLD = 5

type SortOrder = '' | 'asc' | 'desc'

function buildInquiryLink(p: Product, shopLabel: string, waNumber: string): string {
  const message = [
    'Hello, I am interested in this product.',
    `Product: ${p.name}`,
    `Price: ₹${p.selling_price}`,
    `Barcode: ${p.barcode}`,
    `Shop: ${shopLabel}`,
  ].join('\n')
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
}

function isNewArrival(p: Product): boolean {
  if (!p.created_at) return false
  const created = new Date(p.created_at).getTime()
  if (Number.isNaN(created)) return false
  return Date.now() - created < NEW_ARRIVAL_DAYS * 24 * 60 * 60 * 1000
}

function isLowStock(p: Product): boolean {
  return p.stock_quantity > 0 && p.stock_quantity <= LOW_STOCK_THRESHOLD
}

/* ---------- Small building blocks ---------- */

function ProductImage({ product, large }: { product: Product; large?: boolean }) {
  const [failed, setFailed] = useState(false)
  if (!product.image_url || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-royal-950/60 to-[#0d1126] text-slate-600">
        <ShirtIcon />
        <span className="text-xs tracking-widest uppercase">No Image</span>
      </div>
    )
  }
  return (
    <img
      className={`h-full w-full object-cover ${large ? '' : 'transition-transform duration-500 group-hover:scale-105'}`}
      src={product.image_url}
      alt={product.name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}

function StockBadge({ qty }: { qty: number }) {
  if (qty <= 0) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-red-400 ring-1 ring-red-500/30">
        Out of Stock
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
      In Stock: {qty}
    </span>
  )
}

function ShopBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-royal-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-royal-300 ring-1 ring-royal-400/30">
      {name}
    </span>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center backdrop-blur-sm">
      <div className="font-display text-2xl font-bold text-gold-400 sm:text-3xl">{value}</div>
      <div className="mt-1 text-[11px] tracking-[0.2em] text-slate-400 uppercase">{label}</div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#11162e]">
      <div className="aspect-[4/5] animate-pulse bg-white/5" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="h-8 w-full animate-pulse rounded-lg bg-white/5" />
      </div>
    </div>
  )
}

/* ---------- Modal ---------- */

function ProductModal({
  product,
  shopLabel,
  waNumber,
  onClose,
}: {
  product: Product
  shopLabel: string
  waNumber: string
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const copyBarcode = async () => {
    try {
      await navigator.clipboard.writeText(product.barcode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  const shareProduct = async () => {
    const text = `${product.name} — ₹${product.selling_price}\nBarcode: ${product.barcode}\nShop: ${shopLabel}`
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text })
      } else {
        await navigator.clipboard.writeText(text)
        setShared(true)
        setTimeout(() => setShared(false), 1500)
      }
    } catch {
      /* user cancelled or unsupported */
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#11162e] shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-slate-300 transition-colors hover:bg-black/60 hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="aspect-square w-full shrink-0 overflow-hidden md:w-[46%] md:rounded-l-2xl">
            <ProductImage product={product} large />
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-2 flex flex-wrap gap-2">
              {isNewArrival(product) && (
                <span className="inline-flex items-center rounded-full bg-gold-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-gold-400 ring-1 ring-gold-500/40">
                  New Arrival
                </span>
              )}
              {isLowStock(product) && (
                <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 ring-1 ring-amber-500/30">
                  Low Stock
                </span>
              )}
            </div>

            <h2 className="font-display pr-8 text-2xl font-bold text-white">{product.name}</h2>
            <div className="mt-2 text-3xl font-extrabold text-gold-400">
              ₹{product.selling_price}
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-[11px] tracking-wider text-slate-500 uppercase">
                  Barcode
                </span>
                <button
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-300 transition-colors hover:border-gold-500/40 hover:text-gold-300"
                  onClick={copyBarcode}
                  title="Copy barcode"
                >
                  {product.barcode}
                  {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
                {copied && <span className="text-xs text-emerald-400">Copied!</span>}
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-[11px] tracking-wider text-slate-500 uppercase">
                  Stock
                </span>
                <StockBadge qty={product.stock_quantity} />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-[11px] tracking-wider text-slate-500 uppercase">
                  Shop
                </span>
                <ShopBadge name={shopLabel} />
              </div>

              {product.category && (
                <div className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-[11px] tracking-wider text-slate-500 uppercase">
                    Category
                  </span>
                  <span className="text-slate-200">{product.category}</span>
                </div>
              )}

              {product.size && (
                <div className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-[11px] tracking-wider text-slate-500 uppercase">
                    Size
                  </span>
                  <span className="text-slate-200">{product.size}</span>
                </div>
              )}

              {product.color && (
                <div className="flex items-center gap-3">
                  <span className="w-20 shrink-0 text-[11px] tracking-wider text-slate-500 uppercase">
                    Color
                  </span>
                  <span className="text-slate-200">{product.color}</span>
                </div>
              )}
            </div>

            <div className="mt-auto flex flex-col gap-2.5 pt-6">
              <a
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25d366] px-4 py-2.5 text-sm font-bold text-[#06281a] transition-colors hover:bg-[#3ae07a]"
                href={buildInquiryLink(product, shopLabel, waNumber)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon />
                Inquire on WhatsApp
              </a>
              <button
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-royal-400/40 px-4 py-2.5 text-sm font-semibold text-royal-300 transition-colors hover:bg-royal-500/10"
                onClick={shareProduct}
              >
                {shared ? <CheckIcon /> : <ShareIcon />}
                {shared ? 'Copied to clipboard!' : 'Share Product'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- Main catalog section ---------- */

export default function ProductList() {
  const { shops } = useShops()
  const [products, setProducts] = useState<Product[]>([])
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  // Live shop name/number lookups (fallback to static names only)
  const getShopName = (shopId: string): string =>
    shops.find(s => s.id === shopId)?.name ?? SHOP_MAP[shopId] ?? shopId
  const getShopWhatsapp = (shopId: string): string =>
    normalizePhone(shopWaNumber(shops.find(s => s.id === shopId))) || WHATSAPP_NUMBER
  const shopOptions = shops.length > 0 ? shops.map(s => ({ id: s.id, name: s.name })) : SHOPS

  // Filters
  const [selectedShopId, setSelectedShopId] = useState('')
  const [search, setSearch] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOrder>('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    setStatus('loading')

    let query = supabase.from('catalog_products').select('*').limit(1000)

    if (selectedShopId) {
      query = query.eq('shop_id', selectedShopId)
    }

    query.then(({ data, error }) => {
      if (error) {
        setError(error.message)
        setStatus('error')
      } else {
        setProducts((data as Product[]) || [])
        setStatus('done')
      }
    })
  }, [selectedShopId])

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const p of products) {
      if (p.category && String(p.category).trim()) set.add(String(p.category).trim())
    }
    return Array.from(set).sort()
  }, [products])

  const visibleProducts = useMemo(() => {
    let list = products

    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        p =>
          p.name?.toLowerCase().includes(q) ||
          p.barcode?.toLowerCase().includes(q) ||
          (p.category && String(p.category).toLowerCase().includes(q)),
      )
    }
    if (inStockOnly) {
      list = list.filter(p => p.stock_quantity > 0)
    }
    if (selectedCategory) {
      list = list.filter(p => p.category && String(p.category).trim() === selectedCategory)
    }
    if (sortOrder) {
      list = [...list].sort((a, b) =>
        sortOrder === 'asc' ? a.selling_price - b.selling_price : b.selling_price - a.selling_price,
      )
    }
    return list
  }, [products, search, inStockOnly, selectedCategory, sortOrder])

  const inStockCount = useMemo(
    () => products.filter(p => p.stock_quantity > 0).length,
    [products],
  )

  const hasActiveFilters =
    selectedShopId !== '' || search !== '' || inStockOnly || sortOrder !== '' || selectedCategory !== ''

  const resetFilters = () => {
    setSelectedShopId('')
    setSearch('')
    setInStockOnly(false)
    setSortOrder('')
    setSelectedCategory('')
  }

  const selectClass =
    'cursor-pointer rounded-xl border border-white/10 bg-[#11162e] px-3 py-2 text-sm text-slate-200 transition-colors hover:border-royal-400/40 focus:border-royal-400 focus:outline-none'

  return (
    <section id="products" className="scroll-mt-24">
      {/* Section header + stats */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-24">
        <SectionTitle
          eyebrow="The Collection"
          title="Product Catalog"
          subtitle="Search, filter and inquire about any product directly on WhatsApp."
        />
        <div className="mx-auto mb-10 grid max-w-xl grid-cols-3 gap-3 sm:mb-12 sm:gap-4">
          <StatCard label="Products" value={status === 'done' ? products.length : '—'} />
          <StatCard label="In Stock" value={status === 'done' ? inStockCount : '—'} />
          <StatCard label="Shops" value={shops.length > 0 ? shops.length : SHOPS.length} />
        </div>
      </div>

      {/* Sticky filter bar (sticks only while catalog section is in view) */}
      <div className="sticky top-0 z-40 border-y border-white/10 bg-[#0a0e1f]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2.5 px-4 py-3 sm:px-6 lg:px-8">
          <div className="relative min-w-[180px] flex-1 sm:max-w-xs">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500">
              <SearchIcon />
            </span>
            <input
              type="search"
              className="w-full rounded-xl border border-white/10 bg-[#11162e] py-2 pr-3 pl-9 text-sm text-slate-200 placeholder-slate-500 transition-colors focus:border-royal-400 focus:outline-none"
              placeholder="Search name, barcode, category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search products"
            />
          </div>

          <select
            className={selectClass}
            value={selectedShopId}
            onChange={e => setSelectedShopId(e.target.value)}
            aria-label="Filter by shop"
          >
            <option value="">All Shops</option>
            {shopOptions.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {categories.length > 0 && (
            <select
              className={selectClass}
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}

          <select
            className={selectClass}
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as SortOrder)}
            aria-label="Sort by price"
          >
            <option value="">Sort: Default</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-300 select-none">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer accent-gold-500"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
            />
            In stock only
          </label>

          {hasActiveFilters && (
            <button
              className="cursor-pointer rounded-xl border border-gold-500/40 bg-gold-500/10 px-3.5 py-2 text-xs font-bold text-gold-400 transition-colors hover:bg-gold-500 hover:text-gold-950"
              onClick={resetFilters}
            >
              Reset
            </button>
          )}

          {status === 'done' && (
            <span className="ml-auto text-xs whitespace-nowrap text-slate-500">
              {visibleProducts.length} product{visibleProducts.length === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </div>

      {/* Product grid */}
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        {status === 'loading' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <div className="mx-auto max-w-lg rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-center">
            <div className="text-lg font-bold text-red-400">Something went wrong</div>
            <p className="mt-2 text-sm break-words text-red-300/90">{error}</p>
          </div>
        )}

        {status === 'done' && visibleProducts.length === 0 && (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#11162e] p-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-royal-500/10 text-royal-300">
              <ShirtIcon />
            </div>
            <div className="mt-4 text-lg font-bold text-white">No products found.</div>
            <p className="mt-1 text-sm text-slate-400">
              Try adjusting your search or filters.
            </p>
            {hasActiveFilters && (
              <button
                className="mt-5 cursor-pointer rounded-xl border border-gold-500/40 bg-gold-500/10 px-4 py-2 text-sm font-bold text-gold-400 transition-colors hover:bg-gold-500 hover:text-gold-950"
                onClick={resetFilters}
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {status === 'done' && visibleProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map(p => (
              <div
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#11162e] shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/30 hover:shadow-xl hover:shadow-gold-500/5"
                key={p.id}
                onClick={() => setSelectedProduct(p)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedProduct(p)
                  }
                }}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ProductImage product={p} />
                  <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
                    {isNewArrival(p) && (
                      <span className="rounded-full bg-gold-500 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-gold-950 uppercase shadow-md">
                        New Arrival
                      </span>
                    )}
                    {isLowStock(p) && (
                      <span className="rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-amber-950 uppercase shadow-md">
                        Low Stock
                      </span>
                    )}
                    {p.stock_quantity <= 0 && (
                      <span className="rounded-full bg-red-500/90 px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide text-white uppercase shadow-md">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="line-clamp-2 text-[15px] leading-snug font-semibold text-white">
                    {p.name}
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xl font-extrabold text-gold-400">
                      ₹{p.selling_price}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">{p.barcode}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <StockBadge qty={p.stock_quantity} />
                    <ShopBadge name={getShopName(p.shop_id)} />
                    {p.category && (
                      <span className="inline-flex items-center rounded-full bg-gold-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-gold-400/90 ring-1 ring-gold-500/25">
                        {p.category}
                      </span>
                    )}
                  </div>

                  {(p.size || p.color) && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
                      {p.size && <span>Size: {p.size}</span>}
                      {p.color && <span>Color: {p.color}</span>}
                    </div>
                  )}

                  <div className="mt-auto flex gap-2 pt-2">
                    <a
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25d366] px-3 py-2 text-xs font-bold text-[#06281a] transition-colors hover:bg-[#3ae07a]"
                      href={buildInquiryLink(p, getShopName(p.shop_id), getShopWhatsapp(p.shop_id))}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                    >
                      <WhatsAppIcon />
                      WhatsApp
                    </a>
                    <button
                      className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-xl border border-royal-400/40 px-3 py-2 text-xs font-semibold text-royal-300 transition-colors hover:bg-royal-500/10"
                      onClick={e => {
                        e.stopPropagation()
                        setSelectedProduct(p)
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          shopLabel={getShopName(selectedProduct.shop_id)}
          waNumber={getShopWhatsapp(selectedProduct.shop_id)}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  )
}
