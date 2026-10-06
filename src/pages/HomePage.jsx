import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import MarqueeSection from '../components/MarqueeSection'
import PackagesSection from '../components/PackagesSection'
import AboutSection from '../components/AboutSection'
import WhyChooseUsSection from '../components/WhyChooseUsSection'
import TeamSection from '../components/TeamSection'
import FAQSection from '../components/FAQSection'
import AppShowcaseSection from '../components/AppShowcaseSection'
import HowItWorksSection from '../components/HowItWorksSection'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Header Component */}
      <Header />

      {/* 2. Hero Component */}
      <Hero />

      {/* 3. Soft Minimal Study Marquee Section */}
      <MarqueeSection />

      {/* 4. Tiered Packages Section */}
      <PackagesSection />

      {/* 5. About Us Mission & Pillars Section */}
      <AboutSection />

      {/* 6. Dark Teal/Green Mobile Showcase Section (Before How It Works) */}
      <AppShowcaseSection />

      {/* 7. How It Works 4-Step Process Section */}
      <HowItWorksSection />

      {/* 8. Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* 9. Meet The Team / Mentors Section */}
      <TeamSection />

      {/* 10. FAQ Section */}
      <FAQSection />

      {/* 11. Footer Component */}
      <Footer />
    </div>
  )
}
