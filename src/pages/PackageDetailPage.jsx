import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  BookOpen,
  Clock,
  Play,
  Sparkles,
  Users,
  Award,
  Tag,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPackageBySlugApi } from "../services/api";

// Fallback Courses
const fallbackCourses = [
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
];

const fallbackPackagesMap = {
  pro: {
    name: "Pro",
    slug: "pro",
    tagline: "Our step-by-step, skill-focused, and practical growth package. Specially designed for people who want to learn high-income digital skills and start their freelancing journey.",
    image_url: "/images/packages/pro.png",
    mrp_price: 11800,
    promo_price: 7999,
    mrp_note: "Full access to 9 value-packed courses, ideal for beginners, freelancers, content creators",
    promo_note: "Launch your Freelance career with 9+ High Value courses + lifetime access, tools, and community.",
    total_hours: "25+ Hours",
    enrolled_students: "45K+ Students Enrolled",
    overview_heading: "Unlock lifetime access, certification, and community support to grow, earn, and thrive confidently.",
    overview_desc: "A complete ecosystem designed for individuals who are serious about building their freelance career that leads to real results.",
    what_you_will_learn: [
      "Learn Artificial Intelligence tools to improve productivity and work smarter.",
      "Master Video Editing with Premiere Pro, Filmora, and create engaging content.",
      "Learn freelancing skills to find clients and start earning online.",
      "Design professional graphics using Canva for personal and business needs.",
      "Grow your Instagram presence with effective growth strategies.",
      "Understand Content Marketing and create content that attracts audiences.",
      "Create short-form videos that engage viewers and build digital presence.",
    ],
    faqs: [
      {
        question: "What’s included in this package?",
        answer: "The Pro package includes full lifetime access to 9+ in-demand courses covering Freelancing, Video Editing, AI Tools, Graphic Design, Canva, and Social Media Marketing. You also get accredited completion certificates, downloadable project files, and access to our private community.",
      },
      {
        question: "Who is this package ideal for?",
        answer: "Perfect for students and beginners who are exploring online earning or freelancing for the first time.",
      },
      {
        question: "Will I get lifetime access to the content?",
        answer: "Yes! You receive 100% lifetime access to all included courses, future video lessons, assignments, and downloadable resources.",
      },
      {
        question: "Can I upgrade to a higher package later?",
        answer: "Yes, you can easily upgrade to Supreme, Premium, or Premium Plus packages from your student dashboard at any time by paying only the upgrade difference.",
      },
      {
        question: "What kind of certificate or recognition will I receive?",
        answer: "Upon scoring 60% or higher in the module quiz assessment, you will receive an official ISO-certified, verifiable digital certificate with unique QR code verification to add directly to your LinkedIn, resume, or client proposals.",
      },
    ],
    courses: fallbackCourses,
  },
  supreme: {
    name: "Supreme",
    slug: "supreme",
    tagline: "Go deeper with advanced learning paths designed for digital growth and business skills. Master high-converting digital marketing, client scaling, and business workflows.",
    image_url: "/images/packages/supreme.png",
    mrp_price: 14800,
    promo_price: 9999,
    mrp_note: "Complete access to performance marketing, sales funnels, and growth strategies",
    promo_note: "Grow your client pipeline with Meta Ads, Google Ads, and high-ticket client acquisition.",
    total_hours: "40+ Hours",
    enrolled_students: "28K+ Students Enrolled",
    overview_heading: "Scale your revenue with advanced paid media, sales funnel architecture, and outreach strategies.",
    overview_desc: "Designed for intermediate to advanced freelancers and entrepreneurs wanting to close 4-5 figure retainers.",
    what_you_will_learn: [
      "Meta Ads Manager from beginner to advanced scaling workflows.",
      "Google Ads search and display campaign architectures.",
      "High-converting landing page creation and lead generation funnels.",
      "Client outreach templates for cold email, LinkedIn, and Instagram.",
      "Closing sales calls and managing client retainer objections effortlessly.",
    ],
    faqs: [
      {
        question: "Is Pro package included in Supreme?",
        answer: "Yes! Supreme package includes everything inside Pro, plus all advanced marketing and growth tracks.",
      },
      {
        question: "Are there practical ad campaigns included?",
        answer: "Yes, you will build live ad campaigns, pixel tracking, and custom conversion events step-by-step.",
      },
    ],
    courses: fallbackCourses,
  },
  premium: {
    name: "Premium",
    slug: "premium",
    tagline: "Learn how digital commerce works and explore the skills behind building an online business. End-to-end frontend development, digital product selling, and practical monetization.",
    image_url: "/images/packages/premium.png",
    mrp_price: 18800,
    promo_price: 12999,
    mrp_note: "Full tech & digital commerce suite with 1-on-1 mentorship sessions",
    promo_note: "Build custom web portals, design brand identities, and launch digital storefronts.",
    total_hours: "60+ Hours",
    enrolled_students: "18K+ Students Enrolled",
    overview_heading: "End-to-end fullstack web development, design systems, and digital product monetization.",
    overview_desc: "For developers, creators, and agency owners who want comprehensive tech mastery.",
    what_you_will_learn: [
      "Complete frontend and web application foundations.",
      "Digital storefront setup and automated payment gateway integrations.",
      "Full stack architecture, database models, and API integrations.",
      "Brand identity design and responsive user interface creation.",
    ],
    faqs: [
      {
        question: "Do I need coding background for Premium?",
        answer: "No, the modules start from foundational web concepts and guide you to production development.",
      },
    ],
    courses: fallbackCourses,
  },
  "premium-plus": {
    name: "Premium Plus",
    slug: "premium-plus",
    tagline: "Explore content creation, personal branding, AI automation, and VIP founder community access.",
    image_url: "/images/packages/premium-plus.png",
    mrp_price: 24800,
    promo_price: 16999,
    mrp_note: "VIP all-access lifetime pass to every course, live workshop, and mentorship",
    promo_note: "Direct founder community access with weekly live coaching calls and deal review.",
    total_hours: "100+ Hours",
    enrolled_students: "9.5K+ Students Enrolled",
    overview_heading: "The ultimate VIP all-inclusive learning track for visionary builders and high-income consultants.",
    overview_desc: "Master everything from AI pipelines to premium client closing and personal branding.",
    what_you_will_learn: [
      "Complete access to every course and future releases on KnowWay.",
      "Weekly live Q&A webinars and masterclasses with industry practitioners.",
      "Direct founder mastermind network and private deal flow community.",
      "Personal branding playbooks for multi-channel audience growth.",
    ],
    faqs: [
      {
        question: "Does Premium Plus include all future courses?",
        answer: "Yes, you receive permanent VIP access to all present and upcoming courses without extra charge.",
      },
    ],
    courses: fallbackCourses,
  },
};

function CourseCard({ course }) {
  const cardLink = course.id ? `/courses/${course.id}` : "#";

  return (
    <article className="group min-w-0 flex flex-col justify-between">
      <Link to={cardLink} className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[16px] bg-[#F0F3FF]">
          <img
            src={course.image || course.thumbnail_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop"}
            alt={course.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.045]"
          />

          <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#215EF6] shadow-xs">
            <ArrowUpRight size={15} />
          </div>

          <div className="absolute left-3 top-3">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
              {course.category || "Skill Track"}
            </span>
          </div>
        </div>

        <div className="pt-3.5">
          <h3 className="text-[14px] font-bold leading-snug text-[#161C30] group-hover:text-[#215EF6] transition">
            {course.title}
          </h3>

          <p className="mt-1 text-xs font-semibold text-slate-500">
            {course.instructor || course.mentor_name || "KnowWay Instructor"}
          </p>
        </div>
      </Link>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
        <span>{course.duration || "2 Hours, English"}</span>
        <span className="inline-flex items-center gap-1 text-[#285FFA] font-semibold text-[11px]">
          <Play size={10} />
          Included
        </span>
      </div>
    </article>
  );
}

export default function PackageDetail() {
  const { id } = useParams();
  const currentSlug = (id || "pro").toLowerCase().trim();

  // Get fallback object for initial state
  const fallback = fallbackPackagesMap[currentSlug] || fallbackPackagesMap["pro"];

  const [packageData, setPackageData] = useState(fallback);
  const [activeFaq, setActiveFaq] = useState(0);

  // Fetch live package from MySQL API
  useEffect(() => {
    let isMounted = true;

    const fetchPackage = async () => {
      try {
        const res = await getPackageBySlugApi(currentSlug);
        if (res && res.success && res.package && isMounted) {
          setPackageData({
            ...res.package,
            // If linked courses array from DB is empty, retain fallback courses so UI stays populated
            courses: res.package.courses && res.package.courses.length > 0 ? res.package.courses : fallback.courses,
            what_you_will_learn: res.package.what_you_will_learn && res.package.what_you_will_learn.length > 0 ? res.package.what_you_will_learn : fallback.what_you_will_learn,
            faqs: res.package.faqs && res.package.faqs.length > 0 ? res.package.faqs : fallback.faqs,
          });
        }
      } catch (err) {
        console.warn("Using fallback package data:", err.message);
      }
    };

    fetchPackage();

    return () => {
      isMounted = false;
    };
  }, [currentSlug, fallback]);

  const goToCheckout = () => {
    window.location.href = `/signup?package=${packageData.slug || currentSlug}`;
  };

  const coursesList = packageData.courses || fallbackCourses;
  const learningsList = packageData.what_you_will_learn || fallback.what_you_will_learn;
  const faqsList = packageData.faqs || fallback.faqs;

  const packageMentors = useMemo(() => {
    const mentorMap = new Map();
    coursesList.forEach((c) => {
      const name = c.instructor || c.mentor_name || "Lead Instructor";
      if (!mentorMap.has(name)) {
        mentorMap.set(name, {
          name,
          role: c.mentor_role || `${c.category || "Digital Skills"} Specialist`,
          photo:
            c.mentor_photo ||
            c.image ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
          experience_badge: c.mentor_exp || "Industry Mentor",
          bio:
            c.mentor_bio ||
            "Practitioner guiding learners with hands-on, high-yield digital execution.",
          coursesCount: 1,
        });
      } else {
        mentorMap.get(name).coursesCount += 1;
      }
    });
    return Array.from(mentorMap.values());
  }, [coursesList]);

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
                <span>←</span>
                <span>Home / Packages</span>
              </Link>

              {/* Title */}
              <h1 className="text-[44px] font-black leading-[1.08] tracking-[-0.04em] sm:text-[58px] xl:text-[68px] text-[#141A29]">
                {packageData.name}<span className="text-[#155DFC]">.</span>
              </h1>

              {/* Tagline / Subtitle */}
              <p className="mt-4 max-w-2xl text-[15px] sm:text-[16px] leading-relaxed text-slate-600 font-medium">
                {packageData.tagline || fallback.tagline}
              </p>

              {/* All inclusions of this package are */}
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  All inclusions of this package are
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2.5 rounded-full border border-[#DFE6F1] bg-white px-4 py-2.5 shadow-2xs">
                    <BookOpen size={16} className="text-[#155DFC]" />
                    <span className="text-xs sm:text-sm font-bold text-[#141A29]">
                      {coursesList.length} Courses
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-full border border-[#DFE6F1] bg-white px-4 py-2.5 shadow-2xs">
                    <Clock size={16} className="text-amber-500" />
                    <span className="text-xs sm:text-sm font-bold text-[#141A29]">
                      {packageData.total_hours || "25+ Hours"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-full border border-[#DFE6F1] bg-white px-4 py-2.5 shadow-2xs">
                    <Users size={16} className="text-emerald-500" />
                    <span className="text-xs sm:text-sm font-bold text-[#141A29]">
                      {packageData.enrolled_students || "45K+ Students Enrolled"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="w-full flex items-center justify-center lg:justify-end">
              <img
                src={packageData.image_url || fallback.image_url}
                alt={`${packageData.name} Learning Package`}
                className="w-full max-w-[440px] max-h-[380px] object-contain drop-shadow-lg transition-transform hover:scale-105 duration-300"
                onError={(e) => {
                  e.currentTarget.src = fallback.image_url;
                }}
              />
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* DEDICATED ROW: DUAL PRICING WITH CENTER BUY NOW CTA */}
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
                    ₹ {Number(packageData.mrp_price || 11800).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {packageData.mrp_note || fallback.mrp_note}
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
                    ₹ {Number(packageData.promo_price || 7999).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {packageData.promo_note || fallback.promo_note}
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
                Package Overview
              </span>

              <h2 className="mt-3 text-[28px] sm:text-[36px] font-extrabold leading-tight tracking-tight text-[#141A29] max-w-3xl">
                {packageData.overview_heading || fallback.overview_heading}
              </h2>

              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-slate-500 font-medium">
                {packageData.overview_desc || fallback.overview_desc}
              </p>
            </div>

            {/* What you'll learn in this package: */}
            <div className="mt-10 rounded-[28px] border border-[#E5E9F4] bg-white p-6 sm:p-10 shadow-xs">
              <h3 className="text-lg sm:text-xl font-bold text-[#141A29] mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-[#155DFC]" />
                <span>What you'll learn in this package:</span>
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {learningsList.map((item, idx) => (
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
        {/* COURSES OFFERINGS GRID */}
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
                {coursesList.length} Total Courses Included
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {coursesList.map((course, idx) => (
                <CourseCard key={course.id || idx} course={course} />
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* MENTORS & INSTRUCTORS SECTION */}
        {/* ======================================================== */}
        {packageMentors.length > 0 && (
          <section className="py-16 lg:py-24 bg-[#FAFBFF] border-b border-[#EDF0F6]">
            <div className="mx-auto w-full max-w-[1540px] px-6 md:px-10 lg:px-16 2xl:max-w-[1700px]">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.13em] text-[#285FFA]">
                    World-Class Mentorship
                  </span>
                  <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight md:text-[40px] text-[#141A29]">
                    Learn directly from industry leaders.
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 max-w-xl">
                    Step-by-step guidance from practitioners who have built real careers and client businesses.
                  </p>
                </div>

                <div className="rounded-full border border-[#E4E9F4] bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-2xs">
                  {packageMentors.length} Expert Mentors Assigned
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {packageMentors.map((mentor, mIdx) => (
                  <div
                    key={mIdx}
                    className="rounded-[24px] border border-[#E8EDF6] bg-white p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center gap-3.5 mb-4">
                        <img
                          src={mentor.photo}
                          alt={mentor.name}
                          className="w-14 h-14 rounded-full object-cover border border-[#DFE6F1] shrink-0"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
                          }}
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-[#141A29] truncate">{mentor.name}</h3>
                          <p className="text-xs text-[#155DFC] font-semibold truncate">{mentor.role}</p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            {mentor.experience_badge}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {mentor.bio}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-slate-700">
                        {mentor.coursesCount} {mentor.coursesCount === 1 ? "Course" : "Courses"} in Bundle
                      </span>
                      <span className="text-[#155DFC] font-bold">100% Practical</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ======================================================== */}
        {/* CERTIFICATION SECTION */}
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
                      {packageData.name} Skill Package Program
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
                  href="mailto:support@knowway.com"
                  className="text-[#155DFC] font-bold underline"
                >
                  support@knowway.com
                </a>
              </p>
            </div>

            <div className="space-y-3">
              {faqsList.map((faq, index) => (
                <div
                  key={index}
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

      {/* Universal Footer */}
      <Footer />
    </>
  );
}
