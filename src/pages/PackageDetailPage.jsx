import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  BookOpen,
  Clock,
  Play,
  Sparkles,
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// All 24 Course Offerings provided by user
const courses = [
  {
    title: "Freelance Course (English)",
    instructor: "Miss. Reshu Sharma",
    duration: "6.66 Hours, English",
    category: "Freelancing",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Adobe Premiere Pro Course (Tamil)",
    instructor: "Bhagavath Singh",
    duration: "8 Hours, Tamil",
    category: "Video Editing",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Freelance Course (Hindi)",
    instructor: "Mr. Shivam Singh",
    duration: "6.46 Hours, Hindi, Telugu",
    category: "Freelancing",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Google Ads (Telugu)",
    instructor: "Yaswanth Sai Palaghat",
    duration: "2.23 Hours, Telugu",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Meta Ads (Telugu)",
    instructor: "Yaswanth Sai Palaghat",
    duration: "1.53 Hours, Telugu",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Urdu Calligraphy",
    instructor: "Sualiha Khalil",
    duration: "9 Hours, Hindi",
    category: "Art & Design",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Mobile Video Editing",
    instructor: "Pari Jain",
    duration: "3 Hours, Hindi, Telugu",
    category: "Video Editing",
    image: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Mobile Video Editing (Tamil)",
    instructor: "Bhagavath Singh",
    duration: "6 Hours, Tamil",
    category: "Video Editing",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Design Smarter with Canva",
    instructor: "Diptimai Sahoo",
    duration: "5.50 Hours, Hindi, Telugu",
    category: "Design",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Design Smarter with Canva (Tamil)",
    instructor: "Saranya NM",
    duration: "2.55 Hours, Tamil",
    category: "Design",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Mobile Video Editing (Kannada)",
    instructor: "Syed Zabiulla",
    duration: "7.5 Hours, Kannada",
    category: "Video Editing",
    image: "https://images.unsplash.com/photo-1574717024453-354056aef977?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Complete Guide to Freelancing (Kannada)",
    instructor: "Tejas Girish",
    duration: "3 hours, Kannada",
    category: "Freelancing",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Complete Guide to Freelancing (Tamil)",
    instructor: "Saranya NM",
    duration: "4.5 Hours, Tamil",
    category: "Freelancing",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "The Complete Prompt Engineering (Telugu)",
    instructor: "Maneesh Bommakanti",
    duration: "4.50 Hours, Telugu",
    category: "AI Skills",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Meta Ads Beginner to Advance",
    instructor: "Saranya NM",
    duration: "6h 45m, Tamil",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Meta Ads That Sell",
    instructor: "Preet Kaur",
    duration: "9h 51m, Hindi",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Creative Suite Mastery",
    instructor: "Shikhar Gupta",
    duration: "12.73 Hours, Hindi, English, Telugu",
    category: "Design",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Mastering AI Tools for Success",
    instructor: "Kautilya Roshan",
    duration: "4.36 Hours, English",
    category: "AI Skills",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Ultimate Instagram Growth",
    instructor: "Ashutosh Pratihast",
    duration: "1 Hour 30 Min, Hindi",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Premiere Pro Unlocked",
    instructor: "Mohanish Ved",
    duration: "1.5 Hours, Hindi, English",
    category: "Video Editing",
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Content Marketing",
    instructor: "Sahil Gujral",
    duration: "1 Hour, Hindi, English",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Marketing Mindset",
    instructor: "Ashutosh Pratihast",
    duration: "52 Minutes, Hindi, Tamil, Telugu",
    category: "Mindset",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Short VideoPreneur",
    instructor: "Ashutosh Pratihast",
    duration: "1.28 Hours, Hindi",
    category: "Video Editing",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Wondershare Filmora",
    instructor: "IDigitalPreneur",
    duration: "5.78 Hours, Hindi",
    category: "Video Editing",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop",
  },
];

const learnings = [
  "Learn Artificial Intelligence tools to improve productivity and work smarter.",
  "Master Video Editing with Premiere Pro, Filmora, and create engaging content.",
  "Learn freelancing skills to find clients and start earning online.",
  "Design professional graphics using Canva for personal and business needs.",
  "Grow your Instagram presence with effective growth strategies.",
  "Understand Content Marketing and create content that attracts audiences.",
  "Create short-form videos that engage viewers and build digital presence.",
];

const faqs = [
  {
    question: "What’s included in this package?",
    answer:
      "The Pro package includes full lifetime access to 9+ in-demand courses covering Freelancing, Video Editing, AI Tools, Graphic Design, Canva, and Social Media Marketing. You also get accredited completion certificates, downloadable project files, and access to our private community.",
  },
  {
    question: "Who is this package ideal for?",
    answer:
      "Perfect for students and beginners who are exploring online earning or freelancing for the first time.",
  },
  {
    question: "Will I get lifetime access to the content?",
    answer:
      "Yes! You receive 100% lifetime access to all included courses, future video lessons, assignments, and downloadable resources.",
  },
  {
    question: "Can I upgrade to a higher package later?",
    answer:
      "Yes, you can easily upgrade to Supreme, Premium, or Premium Plus packages from your student dashboard at any time by paying only the upgrade difference.",
  },
  {
    question: "What kind of certificate or recognition will I receive?",
    answer:
      "Upon scoring 60% or higher in the module quiz assessment, you will receive an official ISO-certified, verifiable digital certificate with unique QR code verification to add directly to your LinkedIn, resume, or client proposals.",
  },
];

function CourseCard({ course }) {
  return (
    <article className="group min-w-0 flex flex-col justify-between">
      <div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-[#F0F3FF]">
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
          />

          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#215EF6] shadow-xs">
            <ArrowUpRight size={15} />
          </div>

          <div className="absolute left-3 top-3">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
              {course.category}
            </span>
          </div>
        </div>

        <div className="pt-3.5">
          <h3 className="text-[14px] font-bold leading-snug text-[#161C30] group-hover:text-[#215EF6] transition">
            {course.title}
          </h3>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            {course.instructor}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>{course.duration}</span>
        <span className="inline-flex items-center gap-1 text-[#285FFA] font-semibold text-[11px]">
          <Play size={10} />
          Included
        </span>
      </div>
    </article>
  );
}

export default function PackageDetail() {
  const [activeFaq, setActiveFaq] = useState(1);

  const goToCheckout = () => {
    window.location.href = "/signup?package=pro";
  };

  return (
    <>
      {/* 1. Header Component with Log in & Register Now */}
      <Header />

      <main className="w-full overflow-hidden bg-white text-[#171C30]">
        {/* ======================================================== */}
        {/* HERO SECTION */}
        {/* ======================================================== */}
        <section className="relative overflow-hidden bg-[#FAFBFF] border-b border-[#EDF0F6]">
          <div className="pointer-events-none absolute -left-40 top-16 h-[340px] w-[340px] rounded-full border-[65px] border-[#EDF2FF]" />
          <div className="pointer-events-none absolute -right-28 top-0 h-[320px] w-[320px] rounded-full border-[55px] border-[#F0E7FF]" />

          <div className="relative mx-auto grid w-full max-w-[1540px] items-center gap-10 px-6 py-12 md:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 lg:px-16 lg:py-16 2xl:max-w-[1700px]">
            {/* Left Column: Heading, Subtitle & Inclusions */}
            <div className="w-full">
              {/* Back Breadcrumb Arrow */}
              <Link
                to="/"
                className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#E5E9FA] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#285FFA] shadow-2xs hover:bg-[#F0F4FF] transition"
              >
                <span>↑</span>
                <span>Home / Packages</span>
              </Link>

              {/* Title */}
              <h1 className="text-[44px] font-black leading-[1.08] tracking-[-0.04em] sm:text-[58px] xl:text-[68px] text-[#141A29]">
                Pro<span className="text-[#155DFC]">.</span>
              </h1>

              {/* Tagline / Subtitle */}
              <p className="mt-4 max-w-2xl text-[15px] sm:text-[16px] leading-relaxed text-slate-600 font-medium">
                Our step-by-step, skill-focused, and practical growth package. Specially designed for people who want to learn high-income digital skills and start their freelancing journey.
              </p>

              {/* All inclusions of this course are */}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  All inclusions of this course are
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2.5 rounded-full border border-[#DFE6F1] bg-white px-4 py-2.5 shadow-2xs">
                    <BookOpen size={16} className="text-[#155DFC]" />
                    <span className="text-xs sm:text-sm font-bold text-[#141A29]">
                      9 Courses
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-full border border-[#DFE6F1] bg-white px-4 py-2.5 shadow-2xs">
                    <Clock size={16} className="text-amber-500" />
                    <span className="text-xs sm:text-sm font-bold text-[#141A29]">
                      25+ Hours
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-full border border-[#DFE6F1] bg-white px-4 py-2.5 shadow-2xs">
                    <Users size={16} className="text-emerald-500" />
                    <span className="text-xs sm:text-sm font-bold text-[#141A29]">
                      45K+ Students Enrolled
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image (Height increased slightly, clean image) */}
            <div className="w-full flex items-center justify-center lg:justify-end">
              <img
                src="/images/packages/pro.png"
                alt="Pro Learning Package"
                className="w-full max-w-[440px] max-h-[380px] object-contain drop-shadow-lg"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop";
                }}
              />
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* DEDICATED NEW ROW: DUAL PRICING WITH CENTER BUY NOW CTA */}
        {/* ======================================================== */}
        <section className="border-b border-[#EDF0F6] bg-white py-10">
          <div className="mx-auto max-w-[1540px] px-6 md:px-10 lg:px-16 2xl:max-w-[1700px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Side: MRP Price Card */}
              <div className="lg:col-span-4 rounded-[22px] border border-[#E9EDF5] bg-[#F8FAFF] p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-[#155DFC]" />
                    MRP Price
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#141A29]">
                    ₹ 11,800
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Full access to 9 value-packed courses, ideal for beginners, freelancers, content creators
                </p>
              </div>

              {/* Middle: Centered Buy Now & Explore Courses Buttons */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center gap-3 text-center">
                <button
                  onClick={goToCheckout}
                  className="w-full sm:w-auto min-w-[220px] inline-flex items-center justify-center gap-2.5 rounded-full bg-[#155DFC] hover:bg-[#104ACF] px-9 py-4 text-sm font-bold text-white transition shadow-lg shadow-blue-500/25 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <span>Buy Now</span>
                  <ArrowUpRight size={18} />
                </button>

                <a
                  href="#courses"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#24304A] hover:text-[#155DFC] transition"
                >
                  <span>Explore Courses</span>
                  <ArrowRight size={14} />
                </a>
              </div>

              {/* Right Side: With Promocode Card with Icon */}
              <div className="lg:col-span-4 rounded-[22px] border-2 border-[#155DFC] bg-[#EEF4FF] p-6 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-[#155DFC] uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={14} />
                    With Promocode
                  </span>
                  <span className="text-2xl font-black text-[#141A29]">
                    ₹ 7999
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Launch your Freelance career with 9+ High Value courses + lifetime access, tools, and community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* COURSE OVERVIEW & WHAT YOU'LL LEARN */}
        {/* ======================================================== */}
        <section className="bg-[#F8FAFF] py-16 lg:py-20 border-b border-[#EDF0F6]">
          <div className="mx-auto max-w-[1540px] px-6 md:px-10 lg:px-16 2xl:max-w-[1700px]">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.13em] text-[#285FFA]">
                Course Overview
              </span>

              <h2 className="mt-3 text-[28px] sm:text-[36px] font-extrabold leading-tight tracking-tight text-[#141A29] max-w-3xl">
                Unlock lifetime access, certification, and community support to grow, earn, and thrive confidently.
              </h2>

              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-500 font-medium">
                A complete ecosystem designed for individuals who are serious about building their freelance career that leads to real results.
              </p>
            </div>

            {/* What you'll learn in this course: */}
            <div className="mt-10 rounded-[28px] border border-[#E5E9F4] bg-white p-6 sm:p-10 shadow-xs">
              <h3 className="text-lg sm:text-xl font-bold text-[#141A29] mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-[#155DFC]" />
                <span>What you'll learn in this course:</span>
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {learnings.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl bg-[#F8FAFF] border border-[#EBEFF8] p-4"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E7EEFF] text-[#155DFC] mt-0.5">
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                    <span className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-800">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* COURSES OFFERINGS (24 COURSES) */}
        {/* ======================================================== */}
        <section id="courses" className="py-16 lg:py-24 border-b border-[#EDF0F6]">
          <div className="mx-auto w-full max-w-[1540px] px-6 md:px-10 lg:px-16 2xl:max-w-[1700px]">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.13em] text-[#285FFA]">
                  Courses Offerings
                </span>

                <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight md:text-[40px] text-[#141A29]">
                  We know the best things for You.
                  <br />
                  <span className="bg-[#EEE6FF] px-1">
                    Top picks for You.
                  </span>
                </h2>
              </div>

              <div className="rounded-full border border-[#E4E9F4] bg-[#F8FAFF] px-4 py-2 text-xs font-semibold text-slate-500">
                {courses.length} Total Courses Included
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {courses.map((course) => (
                <CourseCard key={course.title} course={course} />
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CERTIFICATION SECTION (RICH BLUE GRADIENT THEME) */}
        {/* ======================================================== */}
        <section className="py-16 bg-gradient-to-br from-[#0B256B] via-[#0F3FA6] to-[#0A2254] text-white relative overflow-hidden shadow-xl">
          <div className="pointer-events-none absolute -right-12 -top-28 h-80 w-80 rounded-full border-[48px] border-white/10" />
          <div className="pointer-events-none absolute left-10 bottom-0 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="mx-auto max-w-[1540px] px-6 md:px-10 lg:px-16 2xl:max-w-[1700px] relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                  Accredited Certification
                </span>
                <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                  Your Skills Deserve the Spotlight.
                </h2>
                <p className="mt-3 text-lg font-semibold text-blue-100">
                  Earn your certificate. Flaunt it where it counts.
                </p>
                <p className="mt-3 text-sm text-blue-200/90 max-w-md leading-relaxed">
                  Get certified upon passing your assessments. Add verifiable credentials with unique QR validation directly to your resume and LinkedIn profile.
                </p>

                <div className="mt-7">
                  <button
                    onClick={goToCheckout}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#0F3FA6] hover:bg-blue-50 transition shadow-xl cursor-pointer"
                  >
                    <span>Buy Now & Get Certified</span>
                    <ArrowUpRight size={17} />
                  </button>
                </div>
              </div>

              {/* Certificate Image Frame */}
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-md rounded-[22px] bg-white p-6 text-[#141A29] shadow-2xl border-4 border-amber-400/40 text-center">
                  <div className="border-2 border-dashed border-amber-400/50 rounded-xl p-5">
                    <Award size={36} className="text-amber-500 mx-auto mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Certificate of Achievement
                    </span>
                    <h4 className="text-base font-black text-[#141A29] mt-1">
                      KNOWWAY ACCREDITATION
                    </h4>
                    <p className="text-[11px] text-slate-500 italic mt-1">
                      This is to certify that student has completed
                    </p>
                    <h5 className="text-sm font-extrabold text-[#155DFC] my-1">
                      Pro Skill Package Program
                    </h5>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[9px] font-semibold text-slate-400">
                      <span>Verified QR Code</span>
                      <span className="text-emerald-600 font-bold">✓ ISO 9001:2015</span>
                      <span>Lifetime Valid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
        {/* ======================================================== */}
        <section id="faq" className="py-16 lg:py-24 bg-white">
          <div className="mx-auto grid max-w-[1540px] gap-12 px-6 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-16 2xl:max-w-[1700px]">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.13em] text-[#285FFA]">
                Support & Inquiries
              </span>

              <h2 className="mt-4 text-[32px] font-extrabold leading-tight tracking-tight md:text-[40px] text-[#141A29]">
                Frequently Asked
                <br />
                <span className="bg-[#EEE6FF] px-1">
                  Questions
                </span>
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-500 font-medium">
                Still you have any questions? Contact our Team via{" "}
                <a
                  href="mailto:support@idigitalpreneur.com"
                  className="text-[#155DFC] font-bold underline"
                >
                  support@idigitalpreneur.com
                </a>
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border transition ${
                    activeFaq === index
                      ? "border-[#DBE4FD] bg-[#F7F9FF]"
                      : "border-[#E9EDF5] bg-white"
                  }`}
                >
                  <button
                    onClick={() =>
                      setActiveFaq(activeFaq === index ? -1 : index)
                    }
                    aria-expanded={activeFaq === index}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#141A29]">
                      {faq.question}
                    </span>

                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-blue-600 transition-transform duration-200 ${
                        activeFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeFaq === index && (
                    <p className="px-6 pb-5 text-xs sm:text-sm leading-relaxed text-slate-500 border-t border-[#EDF2FC] pt-3">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 7. Universal Footer */}
      <Footer />
    </>
  );
}
