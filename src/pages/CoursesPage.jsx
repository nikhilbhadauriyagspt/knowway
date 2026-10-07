import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Sparkles,
  Briefcase,
  ArrowRight,
  Clock,
  Globe,
  GraduationCap,
  Play,
  CheckCircle2,
  BookOpen,
  Filter,
  Layers3,
  ArrowUpRight,
  Flame,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getCoursesApi } from "../services/api";

// Fallback seed courses in case DB is initially empty
const fallbackCourses = [
  {
    id: 1,
    title: "Freelance Course (English)",
    slug: "freelance-course-english",
    category: "Freelancing",
    languages: "English",
    duration: "6.66 Hours",
    thumbnail_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    description: "Master freelancing with proven strategies for client acquisition, portfolio building, pricing, sales calls, proposal writing, and business growth.",
    mentor_name: "KnowWay Instructor",
    lectures_count: 14,
  },
  {
    id: 2,
    title: "Adobe Premiere Pro Course (Tamil)",
    slug: "adobe-premiere-pro-tamil",
    category: "Video Editing",
    languages: "Tamil",
    duration: "8 Hours",
    thumbnail_url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop",
    description: "Master Adobe Premiere Pro with hands-on training in video editing, color grading, motion graphics, audio editing, and professional export workflows.",
    mentor_name: "Tamil Video Editor",
    lectures_count: 18,
  },
  {
    id: 3,
    title: "Freelance Course (Hindi)",
    slug: "freelance-course-hindi",
    category: "Freelancing",
    languages: "Hindi, Telugu",
    duration: "6.46 Hours",
    thumbnail_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    description: "Learn how to build a successful freelancing career with client acquisition, pricing, portfolio building, proposal writing, and business growth strategies.",
    mentor_name: "Rahul Verma",
    lectures_count: 12,
  },
  {
    id: 4,
    title: "Google Ads (Telugu)",
    slug: "google-ads-telugu",
    category: "Google Ads",
    languages: "Telugu",
    duration: "2.23 Hours",
    thumbnail_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    description: "Learn Google Ads practically with campaign setup, keyword research, ad copywriting, conversion tracking, GA4, GTM, retargeting, and reporting.",
    mentor_name: "Telugu Ads Pro",
    lectures_count: 9,
  },
  {
    id: 5,
    title: "Meta Ads (Telugu)",
    slug: "meta-ads-telugu",
    category: "Meta Ads",
    languages: "Telugu",
    duration: "1.53 Hours",
    thumbnail_url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
    description: "Learn Meta Ads practically with campaign setup, audience targeting, creatives, Pixel tracking, retargeting, A/B testing, and optimization.",
    mentor_name: "Yaswanth Sai Palaghat",
    lectures_count: 7,
  },
  {
    id: 6,
    title: "Urdu Calligraphy",
    slug: "urdu-calligraphy",
    category: "Calligraphy & Art",
    languages: "Hindi, Urdu",
    duration: "9 Hours",
    thumbnail_url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
    description: "Learn the art of Nastaliq calligraphy with step-by-step lessons on strokes, letter formation, Takhti practice, and creative artwork on canvas.",
    mentor_name: "Ustad Calligrapher",
    lectures_count: 15,
  },
  {
    id: 7,
    title: "Advanced Instagram Course 2.0",
    slug: "advanced-instagram-course",
    category: "Digital Marketing",
    languages: "Hindi, English, Tamil",
    duration: "1h 20m",
    thumbnail_url: "https://images.unsplash.com/photo-1611262588024-d12430b98920?q=80&w=800&auto=format&fit=crop",
    description: "Learn how to grow on Instagram with proven strategies. Master reels, algorithm, content planning, and monetization to build a profitable brand.",
    mentor_name: "Growth Master",
    lectures_count: 8,
  },
  {
    id: 8,
    title: "Mobile Video Editing",
    slug: "mobile-video-editing",
    category: "Video Editing",
    languages: "Hindi, Telugu",
    duration: "3 Hours",
    thumbnail_url: "https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop",
    description: "Master mobile video editing with InShot, VN Video Editor, and CapCut. Learn cutting, transitions, effects, color grading, and AI tools.",
    mentor_name: "Mobile Creator",
    lectures_count: 11,
  },
  {
    id: 9,
    title: "AI Prompt Engineering (Hindi)",
    slug: "ai-prompt-engineering-hindi",
    category: "AI Tools & Prompt Engineering",
    languages: "Hindi",
    duration: "3.65 Hours",
    thumbnail_url: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=800&auto=format&fit=crop",
    description: "Learn prompt engineering from basics to advanced techniques. Master AI prompts, frameworks, automation, and workflows using ChatGPT and Claude.",
    mentor_name: "AI Specialist",
    lectures_count: 10,
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const languagesList = [
    "All",
    "English",
    "Tamil",
    "Hindi",
    "Telugu",
    "Kannada",
    "Malayalam",
    "Urdu",
  ];

  const categoriesList = [
    "All",
    "Digital Marketing",
    "Meta Ads",
    "Google Ads",
    "Video Editing",
    "AI Tools & Prompt Engineering",
    "Freelancing",
    "Calligraphy & Art",
  ];

  // Fetch live courses from MySQL backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCoursesApi();
        if (res?.success && Array.isArray(res.courses)) {
          setCourses(res.courses);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.warn("Error fetching live courses:", err.message);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Real-time Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search
      const matchesSearch =
        !searchQuery.trim() ||
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchQuery.toLowerCase());

      // Language
      const matchesLanguage =
        selectedLanguage === "All" ||
        (course.languages && course.languages.toLowerCase().includes(selectedLanguage.toLowerCase()));

      // Category
      const matchesCategory =
        selectedCategory === "All" ||
        (course.category && course.category.toLowerCase().includes(selectedCategory.toLowerCase()));

      return matchesSearch && matchesLanguage && matchesCategory;
    });
  }, [courses, searchQuery, selectedLanguage, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-[#141A29] font-sans antialiased flex flex-col justify-between selection:bg-[#035BE3] selection:text-white">
      <div>
        <Header />

        {/* ======================================================== */}
        {/* HOMEPAGE-MATCHING HERO BANNER SECTION */}
        {/* ======================================================== */}
        <section className="relative overflow-hidden pt-32 pb-14 sm:pt-36 sm:pb-16">
          {/* Blueprint Grid Background */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.65]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(90,109,145,.07) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(90,109,145,.07) 1px, transparent 1px)
              `,
              backgroundSize: "118px 118px",
            }}
          />

          {/* Soft Floating Color Rings */}
          <div className="pointer-events-none absolute -left-[100px] top-[100px] h-[280px] w-[280px] rounded-full border-[48px] border-[#EDF3FF]" />
          <div className="pointer-events-none absolute -right-[110px] bottom-[20px] h-[320px] w-[320px] rounded-full border-[54px] border-[#F0E9FF]" />
          <div className="absolute left-[10%] top-[20%] hidden h-[10px] w-[10px] rounded-full bg-[#FF985D] lg:block" />
          <div className="absolute right-[12%] top-[35%] hidden h-[11px] w-[11px] rounded-full bg-[#6D5CE7] lg:block" />

          {/* Container (Full Max-Width 1540px) */}
          <div className="relative z-10 mx-auto w-full max-w-[1540px] px-5 sm:px-8 lg:px-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white/90 px-4 py-2 shadow-[0_2px_5px_rgba(20,35,70,.04)]">
                <Sparkles size={13} className="text-[#315FD8]" />
                <span className="text-[12px] font-semibold text-[#58657D]">
                  KnowWay Practical Curriculum
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-bold leading-[1.08] tracking-[-0.04em] text-[#141A29]">
                What You Want to learn{" "}
                <span className="inline-block rounded-[12px] bg-[#DED1FF] px-3 py-0.5 text-[#171B29]">
                  today?
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#5D6B82] max-w-2xl mx-auto leading-relaxed">
                Discover structured, hands-on masterclasses designed by seasoned practitioners in your native regional language.
              </p>

              {/* Full Rounded Modern Search Bar */}
              <div className="pt-4 max-w-2xl mx-auto">
                <div className="bg-white p-2 sm:p-2.5 rounded-full border border-[#DCE5F5] shadow-[0_12px_30px_-8px_rgba(3,91,227,0.08)] flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:border-[#035BE3]">
                  {/* Language Selector */}
                  <div className="w-full sm:w-auto shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#F4F7FC] rounded-full border border-[#E2E7F0]">
                    <Globe className="w-4 h-4 text-[#035BE3] shrink-0" />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="bg-transparent text-xs font-bold text-[#141A29] outline-none cursor-pointer pr-2"
                    >
                      {languagesList.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang === "All" ? "Select a Language" : lang}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Search Input */}
                  <div className="flex-1 flex items-center px-4 w-full">
                    <Search className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2.5" />
                    <input
                      type="text"
                      placeholder="Find courses (e.g. Meta Ads, Video Editing)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-xs font-medium text-[#141A29] outline-none placeholder-[#94A3B8] bg-transparent"
                    />
                  </div>

                  {/* Search CTA */}
                  <button
                    type="button"
                    className="w-full sm:w-auto px-7 h-11 bg-[#035BE3] hover:bg-[#FA8C03] text-white text-xs font-bold rounded-full transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-[#035BE3]/20"
                  >
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 2 FEATURED BANNER HERO CARDS */}
            {/* ======================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              {/* Card 1: Learn AI. Build Faster. */}
              <div className="relative overflow-hidden rounded-[32px] sm:rounded-[36px] bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-8 sm:p-9 text-white border border-[#334155] flex flex-col justify-between group shadow-sm">
                <div className="space-y-3 relative z-10">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Sparkles size={13} />
                    <span>Featured Track</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Learn AI. Build Faster.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md leading-relaxed">
                    Discover practical AI courses designed for creators, video editors, and freelancers to automate workflows.
                  </p>
                </div>

                <div className="mt-8 relative z-10">
                  <button
                    onClick={() => setSelectedCategory("AI Tools & Prompt Engineering")}
                    className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    <span>Explore Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Ambient Glow */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#035BE3]/25 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* Card 2: Career Opportunities */}
              <div className="relative overflow-hidden rounded-[32px] sm:rounded-[36px] bg-gradient-to-br from-[#035BE3] to-[#023E9B] p-8 sm:p-9 text-white border border-blue-400/30 flex flex-col justify-between group shadow-sm">
                <div className="space-y-3 relative z-10">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white border border-white/30">
                    <Briefcase size={13} />
                    <span>Career Opportunities</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Every skill deserves an opportunity.
                  </h3>
                  <p className="text-xs sm:text-sm text-white/80 max-w-md leading-relaxed">
                    Here's where you find client acquisition strategies, portfolio frameworks, and certified career tracks.
                  </p>
                </div>

                <div className="mt-8 relative z-10">
                  <Link
                    to="/#packages"
                    className="inline-flex items-center gap-2 px-6 h-11 rounded-full bg-white text-[#035BE3] hover:bg-gray-100 text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    <span>Explore Jobs & Bundles</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Ambient Glow */}
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>

            {/* ======================================================== */}
            {/* CATEGORY FILTER PILLS BAR */}
            {/* ======================================================== */}
            <div className="mt-12 flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none">
              <span className="text-xs font-bold text-[#5D6B82] mr-2 shrink-0 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#035BE3]" />
                <span>Categories:</span>
              </span>
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`h-10 px-5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-[#035BE3] text-white shadow-md shadow-[#035BE3]/20"
                        : "bg-white border border-[#DCE5F5] text-[#556377] hover:border-[#035BE3] hover:text-[#035BE3]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* COURSES CATALOG GRID SECTION */}
        {/* ======================================================== */}
        <section className="pb-24 px-5 sm:px-8 lg:px-12 max-w-[1540px] mx-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#EEF2F8]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#141A29]">
                All Programs ({filteredCourses.length})
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Explore comprehensive video modules with free preview lessons & certifications.
              </p>
            </div>
            <span className="text-xs font-bold text-[#035BE3] bg-[#035BE3]/10 px-3 py-1.5 rounded-full">
              {filteredCourses.length} Active Courses
            </span>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[36px] border border-[#E2E7F0] p-8">
              <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold">No courses found matching your search</h3>
              <p className="text-xs text-[#64748B] mt-1">
                Try selecting a different language or clearing your search term.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLanguage("All");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-6 h-10 rounded-full bg-[#035BE3] text-white text-xs font-bold hover:bg-[#024bc0] transition cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
              {filteredCourses.map((course) => {
                const courseId = course.slug || course.id;
                const mentorName = course.mentor_name || course.mentor || "KnowWay Mentor";
                const mentorRole = course.category || "Masterclass";
                const mentorPhoto = course.mentor_photo || course.photo_url || null;
                const mentorInitial = mentorName ? mentorName.charAt(0).toUpperCase() : "M";

                return (
                  <Link
                    key={course.id}
                    to={`/courses/${courseId}`}
                    className="group transition-all duration-200 flex flex-col justify-between no-underline text-[#141A29]"
                  >
                    {/* Rounded image only */}
                    <div>
                      <div className="relative aspect-video w-full overflow-hidden rounded-[10px] bg-[#1E2638]">
                        <img
                          src={
                            course.thumbnail_url ||
                            course.thumbnail ||
                            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
                          }
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {course.category && (
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                            {course.category}
                          </div>
                        )}
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#035BE3] text-white text-[10px] font-bold flex items-center gap-1">
                          <Clock size={10} />
                          <span>{course.duration || "14 Hours"}</span>
                        </div>
                      </div>

                      {/* Text under image */}
                      <div className="pt-3 px-0.5">
                        <h3 className="text-base font-bold line-clamp-1 group-hover:text-[#035BE3] transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed text-[#556377]">
                          {course.description || "Practical, step-by-step digital learning curriculum."}
                        </p>

                        {/* Mentor with Image / Avatar */}
                        <div className="mt-2.5 flex items-center gap-2.5">
                          {mentorPhoto ? (
                            <img
                              src={mentorPhoto}
                              alt={mentorName}
                              className="w-7 h-7 rounded-full object-cover shrink-0 border border-gray-200"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-[#035BE3] font-bold text-xs flex items-center justify-center shrink-0">
                              {mentorInitial}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate leading-none text-[#141A29]">
                              {mentorName}
                            </p>
                            <p className="text-[10.5px] truncate mt-0.5 text-[#64748B]">
                              {mentorRole}
                            </p>
                          </div>
                        </div>

                        {/* Dual Pricing Display */}
                        <div className="mt-3 pt-2.5 border-t border-[#EEF2F8] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-[#8898AA] font-semibold block leading-none">Real Price</span>
                            <span className="text-xs text-[#94A3B8] line-through font-bold">
                              ₹{Number(course.regular_price || 2999).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10.5px] text-emerald-600 font-extrabold block leading-none">With Promocode</span>
                            <span className="text-sm font-black text-[#035BE3]">
                              ₹{Number(course.promo_price || 499).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Languages / Meta info below */}
                    <div className="pt-2 px-0.5 mt-2 flex items-center justify-between text-[11px] font-medium text-[#64748B]">
                      <span className="flex items-center gap-1 truncate max-w-[190px]">
                        <Globe size={12} className="text-[#035BE3] shrink-0" />
                        <span className="truncate">{course.languages || "Hindi, English"}</span>
                      </span>
                      <span className="text-[#035BE3] font-bold flex items-center gap-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform">
                        <span>View</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
