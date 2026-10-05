import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const topPackages = [
    {
      name: 'Lite Package',
      tag: 'Starter Skills',
      price: '₹2,499',
      popular: false,
      courses: [
        'Canva Design Mastery',
        'Social Media Fundamentals',
        'Spoken English & Communication',
        'Certificate of Completion',
      ],
      badgeColor: 'bg-slate-100 text-slate-700',
      btnColor: 'bg-slate-900 hover:bg-slate-800 text-white',
    },
    {
      name: 'Pro Skill Package',
      tag: 'Most Popular',
      price: '₹4,999',
      popular: true,
      courses: [
        'Complete Video Editing (Premiere Pro & CapCut)',
        'Digital Marketing & Meta Ads',
        'SEO & Website Basics',
        'Freelancing & Client Closing',
        'Weekly Live Mentorship',
      ],
      badgeColor: 'bg-blue-100 text-blue-700 font-bold',
      btnColor: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20',
    },
    {
      name: 'Supreme Elite Package',
      tag: 'All-Inclusive',
      price: '₹9,999',
      popular: false,
      courses: [
        'All Pro & Lite Courses Included',
        'Stock Market & Technical Analysis',
        'AI Tools & Web Development',
        '1-on-1 Mentorship Sessions',
        'VIP Community & Placement Support',
      ],
      badgeColor: 'bg-amber-100 text-amber-800 font-bold',
      btnColor: 'bg-slate-900 hover:bg-slate-800 text-white',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Header */}
      <Header />

      {/* 2. Hero Component */}
      <Hero />

      {/* 3. Featured Packages / Courses Section */}
      <section id="packages" className="py-20 bg-slate-50/60 border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Bundles</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Choose Your Learning Package
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Practical curriculum designed to take you from beginner to job-ready or successful freelancer.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {topPackages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-3xl p-8 bg-white border transition-all duration-300 flex flex-col justify-between ${
                  pkg.popular
                    ? 'border-blue-600 shadow-xl ring-2 ring-blue-600/20 md:-translate-y-2'
                    : 'border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${pkg.badgeColor}`}>
                      {pkg.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{pkg.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">{pkg.price}</span>
                    <span className="text-xs text-slate-400 font-medium">/ One-time fee</span>
                  </div>

                  {/* Checklist */}
                  <ul className="mt-8 space-y-3.5">
                    {pkg.courses.map((c) => (
                      <li key={c} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 font-medium">
                        <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Link
                    to="/signup"
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${pkg.btnColor}`}
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Footer Component */}
      <Footer />
    </div>
  )
}
