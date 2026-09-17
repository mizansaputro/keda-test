import { createFileRoute } from '@tanstack/react-router'
import { Navbar } from '@/components/layout/navbar'
import { SkipLink } from '@/components/layout/skip-link'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/features/hero/hero-section'
import { FeaturesSection } from '@/features/features/features-section'
import { AboutSection } from '@/features/about/about-section'
import { PricingSection } from '@/features/pricing/pricing-section'
import { AnalyticsSection } from '@/features/analytics/analytics-section'
import { ContactSection } from '@/features/contact/contact-section'
import { CtaSection } from '@/features/cta/cta-section'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <>
      <SkipLink targetId="main-content" />
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <FeaturesSection />
        <AboutSection />
        <PricingSection />
        <AnalyticsSection />
        <ContactSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
