import Hero from './components/Hero'
import ShopShowcase from './components/ShopShowcase'
import QrSection from './components/QrSection'
import ContactSection from './components/ContactSection'
import ProductList from './ProductList'
import Reveal from './components/Reveal'
import { ShopsProvider } from './ShopsContext'

function SectionDivider() {
  return (
    <div className="mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-gold-500/25 to-transparent" />
  )
}

function App() {
  return (
    <ShopsProvider>
      <div className="page-fade min-h-screen">
        <Hero />
        <Reveal>
          <ShopShowcase />
        </Reveal>
        <Reveal>
          <QrSection />
        </Reveal>
        <SectionDivider />
        {/* ProductList is not wrapped in Reveal: its sticky filter bar
            must not have a transformed ancestor */}
        <ProductList />
        <Reveal>
          <ContactSection />
        </Reveal>
      </div>
    </ShopsProvider>
  )
}

export default App
