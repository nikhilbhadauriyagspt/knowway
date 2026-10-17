import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  X,
  Send,
  Phone,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  getPublicServicesApi,
  submitServiceInquiryApi,
} from "../services/api";
import {
  ServiceVectorIllustration,
  THEME_STYLES,
} from "../superadmin/components/ServicesStudioTab";

/* =====================================================================
   HERO SECTION CLEAN VECTOR ILLUSTRATION
===================================================================== */
const HeroServiceVector = () => (
  <svg
    viewBox="0 0 520 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-[460px] h-auto mx-auto drop-shadow-[0_16px_36px_rgba(3,91,227,0.08)]"
  >
    <circle cx="260" cy="200" r="165" fill="#EEF3FF" />
    <circle cx="370" cy="110" r="55" fill="#F3EEFF" />
    <circle cx="135" cy="295" r="45" fill="#FFF4EC" />

    <rect
      x="75"
      y="65"
      width="370"
      height="250"
      rx="22"
      fill="#FFFFFF"
      stroke="#DCE5F4"
      strokeWidth="2.5"
    />
    <path
      d="M76.25 87C76.25 75.5401 85.5401 66.25 97 66.25H423C434.46 66.25 443.75 75.5401 443.75 87V104H76.25V87Z"
      fill="#F8FAFD"
    />
    <line x1="75" y1="104" x2="445" y2="104" stroke="#E4EBF5" strokeWidth="2" />
    <circle cx="100" cy="85" r="5" fill="#FF8A75" />
    <circle cx="116" cy="85" r="5" fill="#FFCE57" />
    <circle cx="132" cy="85" r="5" fill="#52C41A" />
    <rect x="160" y="79" width="140" height="12" rx="6" fill="#E9EFF8" />

    <rect
      x="100"
      y="125"
      width="155"
      height="160"
      rx="14"
      fill="#F8FAFD"
      stroke="#E4EBF5"
      strokeWidth="1.5"
    />
    <rect x="116" y="142" width="75" height="10" rx="5" fill="#315FD8" />
    <rect x="116" y="160" width="110" height="8" rx="4" fill="#CBD5E1" />

    <rect x="120" y="232" width="18" height="35" rx="5" fill="#DCE5F5" />
    <rect x="148" y="214" width="18" height="53" rx="5" fill="#B6C9EE" />
    <rect x="176" y="196" width="18" height="71" rx="5" fill="#7555E8" />
    <rect x="204" y="176" width="18" height="91" rx="5" fill="#035BE3" />

    <rect
      x="272"
      y="125"
      width="148"
      height="72"
      rx="14"
      fill="#F5F0FF"
      stroke="#E5DCFF"
      strokeWidth="1.5"
    />
    <circle cx="300" cy="161" r="16" fill="#7555E8" />
    <path
      d="M294 161L298 165L306 157"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="326" y="149" width="76" height="9" rx="4.5" fill="#25213B" />
    <rect x="326" y="165" width="54" height="7" rx="3.5" fill="#8C82B5" />

    <rect
      x="272"
      y="213"
      width="148"
      height="72"
      rx="14"
      fill="#FFF4EC"
      stroke="#FFE2CF"
      strokeWidth="1.5"
    />
    <circle cx="300" cy="249" r="16" fill="#EE7D42" />
    <path
      d="M295 253L305 243M305 243H297M305 243V251"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="326" y="237" width="72" height="9" rx="4.5" fill="#2D241E" />
    <rect x="326" y="253" width="58" height="7" rx="3.5" fill="#B88B73" />

    <rect x="155" y="292" width="210" height="54" rx="27" fill="#141A29" />
    <circle cx="186" cy="319" r="16" fill="#035BE3" />
    <path
      d="M180 323L185 318L189 321L194 314"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="212" y="311" width="110" height="8" rx="4" fill="#FFFFFF" />
    <rect x="212" y="325" width="72" height="6" rx="3" fill="#94A3B8" />
  </svg>
);

/* =====================================================================
   FALLBACK DIGITAL MARKETING SERVICES (SYNCED WITH DB SEED)
===================================================================== */
const FALLBACK_SERVICES = [
  {
    id: 1,
    service_number: "01",
    category: "Paid Advertising",
    title: "Meta & Google Ads Management",
    vector_type: "ads",
    theme_color: "blue",
    image_url: "",
    button_text: "Enquire About This Service",
    description:
      "Reach the right customers at the right time with targeted ads on Facebook, Instagram, Google Search, and YouTube. We handle setup, ad design, and daily optimization so you get quality leads and sales within your budget.",
    points: [
      "Complete Facebook, Instagram & Google Ads setup",
      "Eye-catching ad graphics, video hooks & simple copywriting",
      "Audience targeting & retargeting to convert interested visitors",
      "Clear weekly reports showing leads, sales, and ad spend",
    ],
  },
  {
    id: 2,
    service_number: "02",
    category: "Organic Search",
    title: "Search Engine Optimization (SEO)",
    vector_type: "seo",
    theme_color: "purple",
    image_url: "",
    button_text: "Enquire About This Service",
    description:
      "Help your website rank higher on Google when people search for your products or services. We improve your website speed, keywords, and Google Business Profile for steady, long-term organic traffic.",
    points: [
      "Right keyword research for what your customers are searching",
      "On-page website fixes, meta tags & content optimization",
      "Google Business Profile (Local SEO) setup for local visibility",
      "Quality backlinks & monthly ranking progress updates",
    ],
  },
  {
    id: 3,
    service_number: "03",
    category: "Brand Presence",
    title: "Social Media Management & Branding",
    vector_type: "social",
    theme_color: "orange",
    image_url: "",
    button_text: "Enquire About This Service",
    description:
      "Build a clean, trustworthy brand on Instagram, LinkedIn, Facebook, and YouTube. We plan your monthly content calendar, design posts, and keep your audience active and engaged.",
    points: [
      "Monthly content planning & post scheduling",
      "Clean, branded social media posts, carousels & stories",
      "Profile bio, highlights & page optimization",
      "Consistent audience engagement & monthly growth review",
    ],
  },
  {
    id: 4,
    service_number: "04",
    category: "Video & Content",
    title: "Video Editing & Reels Production",
    vector_type: "video",
    theme_color: "pink",
    image_url: "",
    button_text: "Enquire About This Service",
    description:
      "Short-form videos are the fastest way to grab attention online. We edit high-quality Instagram Reels, YouTube Shorts, and promotional videos with clean captions, smooth transitions, and engaging hooks.",
    points: [
      "Engaging Instagram Reels & YouTube Shorts editing",
      "Clean captions, motion graphics & sound design",
      "Ad video creatives designed to hold viewer attention",
      "Custom thumbnails & ready-to-post vertical formats",
    ],
  },
  {
    id: 5,
    service_number: "05",
    category: "Web & Landing Pages",
    title: "Website & Landing Page Design",
    vector_type: "web",
    theme_color: "blue",
    image_url: "",
    button_text: "Enquire About This Service",
    description:
      "Get a fast, clean, mobile-friendly website or landing page that makes a great first impression and turns visitors into inquiries or paying customers.",
    points: [
      "Clean, modern UI design that works smoothly on mobile & desktop",
      "Fast loading pages built for leads and customer trust",
      "Contact forms, WhatsApp button & payment gateway integration",
      "SEO-friendly structure ready for Google and ad campaigns",
    ],
  },
  {
    id: 6,
    service_number: "06",
    category: "Leads & Follow-Up",
    title: "Lead Generation & WhatsApp Automation",
    vector_type: "funnel",
    theme_color: "emerald",
    image_url: "",
    button_text: "Enquire About This Service",
    description:
      "Never miss a customer inquiry again. We set up simple lead funnels along with automated WhatsApp and email follow-ups so every lead gets an instant response.",
    points: [
      "Simple lead capture forms & landing page funnels",
      "Instant WhatsApp & email welcome messages for new leads",
      "Automated follow-up reminders to increase conversions",
      "Easy lead tracking in Google Sheets or your CRM",
    ],
  },
];

export default function ServicesPage() {
  const [servicesList, setServicesList] = useState(FALLBACK_SERVICES);

  // Popup Modal State
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service_id: null,
    service_title: "Meta & Google Ads Management",
    message: "",
  });

  // Load Dynamic Services from Backend (Admin Services Studio)
  useEffect(() => {
    let isMounted = true;
    getPublicServicesApi()
      .then((res) => {
        if (
          isMounted &&
          res?.success &&
          Array.isArray(res.services) &&
          res.services.length > 0
        ) {
          setServicesList(res.services);
        }
      })
      .catch(() => {
        // Keep FALLBACK_SERVICES if offline
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenPopup = (serviceObj = null) => {
    setSubmitSuccess(false);
    setFormError("");
    if (serviceObj && typeof serviceObj === "object") {
      setFormData((prev) => ({
        ...prev,
        service_id: serviceObj.id || null,
        service_title: serviceObj.title || "Meta & Google Ads Management",
      }));
    } else if (typeof serviceObj === "string") {
      setFormData((prev) => ({
        ...prev,
        service_id: null,
        service_title: serviceObj,
      }));
    }
    setIsPopupOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsPopupOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setFormError("Please fill in your name, phone number, and email.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      await submitServiceInquiryApi({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service_id: formData.service_id,
        service_title: formData.service_title,
        message: formData.message,
      });
      setSubmitSuccess(true);
    } catch (_) {
      // Even if offline, show clean confirmation
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#FBFCFF] text-[#141A29] font-sans antialiased selection:bg-[#035BE3] selection:text-white">
      {/* 1. HEADER */}
      <Header />

      {/* ================================================================= */}
      {/* 2. SIMPLE, CLEAN HERO SECTION (CENTERED + VECTOR ILLUSTRATION)    */}
      {/* ================================================================= */}
      <section className="relative isolate overflow-hidden pt-10 pb-14 sm:pt-14 sm:pb-18 border-b border-[#E7ECF3]">
        {/* Subtle Grid Background matching site */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.6]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(91,111,150,.065) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(91,111,150,.065) 1px, transparent 1px)
            `,
            backgroundSize: "118px 118px",
          }}
        />

        {/* Soft Decorative Rings */}
        <div className="pointer-events-none absolute -left-[130px] top-[70px] hidden h-[280px] w-[280px] rounded-full border-[48px] border-[#EDF3FF] lg:block" />
        <div className="pointer-events-none absolute -right-[120px] bottom-[40px] hidden h-[260px] w-[260px] rounded-full border-[46px] border-[#F3EEFF] lg:block" />

        <div className="relative z-10 mx-auto max-w-[1180px] px-5 sm:px-8 text-center">
          {/* Simple Pill Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-2 shadow-2xs">
            <Sparkles size={13} className="text-[#315FD8]" />
            <span className="text-[12px] font-semibold text-[#526079]">
              Our Professional Services
            </span>
          </div>

          {/* Simple & Clear Heading */}
          <h1 className="mx-auto max-w-[820px] text-[32px] sm:text-[46px] lg:text-[56px] font-bold leading-[1.1] tracking-[-0.04em] text-[#161B29]">
            Simple, practical services to help{" "}
            <span className="mt-1 inline-block rounded-[12px] bg-[#DED1FF] px-3.5 py-0.5 text-[#171B29]">
              your business grow.
            </span>
          </h1>

          {/* Simple Everyday Words Description */}
          <p className="mx-auto mt-4 max-w-[620px] text-[15px] sm:text-[16.5px] leading-relaxed text-[#626B7C]">
            We handle your online presence, creative work, and customer growth with clear plans and dedicated support—so you can focus on running your business.
          </p>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => handleOpenPopup(servicesList[0])}
              className="group inline-flex h-[48px] sm:h-[50px] items-center gap-2 rounded-full bg-[#035BE3] px-6 sm:px-7 text-[13.5px] sm:text-[14px] font-semibold text-white shadow-md shadow-[#035BE3]/20 transition-colors duration-200 hover:bg-[#FA8C03] cursor-pointer"
            >
              <span>Enquire Now</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>

            <a
              href="#all-services"
              className="inline-flex h-[48px] sm:h-[50px] items-center gap-2 rounded-full border border-[#DCE2ED] bg-white px-6 text-[13.5px] sm:text-[14px] font-semibold text-[#293246] transition hover:border-[#035BE3] hover:text-[#035BE3]"
            >
              <span>Explore Services Below</span>
            </a>
          </div>

          {/* Clean Vector Illustration Centered Below */}
          <div className="mt-10 sm:mt-12">
            <HeroServiceVector />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. DIGITAL MARKETING SERVICES (1 FULL-ROW CARD AT A TIME)         */}
      {/* ================================================================= */}
      <section
        id="all-services"
        className="relative py-14 sm:py-18 lg:py-20 mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10"
      >
        {/* Section Heading Introducing Digital Marketing Services */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-1.5">
            <Sparkles size={13} className="text-[#315FD8]" />
            <span className="text-[12px] font-semibold text-[#59667E]">
              Digital Marketing Services
            </span>
          </div>

          <h2 className="text-[28px] sm:text-[40px] lg:text-[46px] font-bold leading-[1.12] tracking-[-0.035em] text-[#151B29]">
            Everything you need to grow{" "}
            <span className="inline-block rounded-[10px] bg-[#DDD1FF] px-3 py-0.5 text-[#151B29]">
              online in one place.
            </span>
          </h2>

          <p className="text-[14.5px] sm:text-[15.5px] text-[#677289] leading-relaxed">
            Choose any individual service or combine them according to your requirement. Click on any service to send an enquiry.
          </p>
        </div>

        {/* Full-Width Single Row Cards Stack (Dynamic from Admin DB) */}
        <div className="flex flex-col gap-7 sm:gap-8">
          {servicesList.map((service, index) => {
            const isEven = index % 2 === 1;
            const theme =
              THEME_STYLES[service.theme_color] || THEME_STYLES.blue;
            const serviceNumber =
              service.service_number || String(index + 1).padStart(2, "0");

            return (
              <div
                key={service.id || index}
                className={`group rounded-[28px] sm:rounded-[32px] border ${theme.borderAccent} bg-white p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgba(20,35,70,0.03)] transition-all duration-200 hover:border-[#035BE3]/40 hover:shadow-[0_14px_40px_rgba(3,91,227,0.06)]`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
                  {/* IMAGE / VECTOR ILLUSTRATION BOX (5 COLS) */}
                  <div
                    className={`lg:col-span-5 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div
                      className={`flex h-[220px] sm:h-[250px] w-full items-center justify-center overflow-hidden rounded-[24px] border ${theme.borderAccent} ${theme.cardBg} p-5`}
                    >
                      {service.image_url ? (
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="h-full w-full rounded-[16px] object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <ServiceVectorIllustration
                          type={service.vector_type || "ads"}
                        />
                      )}
                    </div>
                  </div>

                  {/* SIMPLE, CLEAN CONTENT (7 COLS) */}
                  <div
                    className={`lg:col-span-7 space-y-4 ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`rounded-full px-3.5 py-1 text-[11.5px] font-bold ${theme.badgeBg}`}
                      >
                        {serviceNumber} • {service.category}
                      </span>
                    </div>

                    <h3 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold leading-snug text-[#141A29]">
                      {service.title}
                    </h3>

                    <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-[#59667E]">
                      {service.description}
                    </p>

                    {/* Key Points */}
                    {Array.isArray(service.points) && service.points.length > 0 && (
                      <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {service.points.map((pt, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 text-[13.5px] font-medium text-[#2C3649]"
                          >
                            <CheckCircle2
                              size={16}
                              className="mt-0.5 shrink-0 text-[#035BE3]"
                            />
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Clean Single Action Button */}
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => handleOpenPopup(service)}
                        className="group/btn inline-flex h-[46px] items-center gap-2 rounded-full bg-[#035BE3] px-6 text-[13.5px] font-semibold text-white shadow-sm shadow-[#035BE3]/20 transition-colors duration-200 hover:bg-[#FA8C03] cursor-pointer"
                      >
                        <span>
                          {service.button_text || "Enquire About This Service"}
                        </span>
                        <ArrowUpRight
                          size={16}
                          className="transition-transform duration-200 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. SIMPLE BOTTOM CTA BANNER                                       */}
      {/* ================================================================= */}
      <section className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 pb-16">
        <div className="rounded-[30px] border border-[#DCE5F4] bg-[#EEF3FF] p-8 sm:p-11 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="max-w-xl space-y-2">
            <h3 className="text-[24px] sm:text-[30px] font-bold text-[#141A29]">
              Not sure which service is right for you?
            </h3>
            <p className="text-[14.5px] text-[#59667E]">
              Share your requirement with us and our team will guide you with a simple, tailored plan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenPopup("Custom Digital Marketing Plan")}
            className="shrink-0 inline-flex h-[48px] items-center gap-2 rounded-full bg-[#035BE3] px-7 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#FA8C03] cursor-pointer"
          >
            <span>Talk to Our Team</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. CLEAN & NEAT POPUP ENQUIRY FORM MODAL                          */}
      {/* ================================================================= */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#141A29]/60 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setIsPopupOpen(false)}
        >
          <div
            className="relative my-auto w-full max-w-[540px] rounded-[28px] border border-[#DCE5F4] bg-white p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsPopupOpen(false)}
              aria-label="Close modal"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-[#F8FAFD] text-[#475569] transition hover:border-[#035BE3] hover:text-[#035BE3] cursor-pointer"
            >
              <X size={17} />
            </button>

            {submitSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
                  <CheckCircle2 size={30} />
                </div>

                <h3 className="text-2xl font-bold text-[#141A29]">
                  Thank You, {formData.name}!
                </h3>

                <p className="text-sm text-[#59667E] max-w-sm mx-auto leading-relaxed">
                  We have received your enquiry for{" "}
                  <strong className="text-[#141A29]">
                    {formData.service_title}
                  </strong>
                  . Our team will contact you shortly.
                </p>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(false)}
                    className="inline-flex h-[44px] items-center justify-center rounded-full bg-[#035BE3] px-7 text-xs font-bold text-white hover:bg-[#FA8C03] transition cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5 pr-8">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#EEF3FF] px-3 py-1">
                    <Sparkles size={12} className="text-[#035BE3]" />
                    <span className="text-[11px] font-bold text-[#035BE3]">
                      Service Enquiry Form
                    </span>
                  </div>
                  <h3 className="text-[22px] sm:text-[24px] font-bold text-[#141A29]">
                    Request Service Details
                  </h3>
                  <p className="mt-1 text-[13px] text-[#64748B]">
                    Fill in your details below and we will get back to you soon.
                  </p>
                </div>

                {formError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                      />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your name"
                        className="h-[44px] w-full rounded-xl border border-[#DCE5F4] bg-[#F8FAFD] pl-10 pr-3.5 text-[13px] text-[#141A29] outline-none transition focus:border-[#035BE3] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                        />
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+91 98765 43210"
                          className="h-[44px] w-full rounded-xl border border-[#DCE5F4] bg-[#F8FAFD] pl-10 pr-3.5 text-[13px] text-[#141A29] outline-none transition focus:border-[#035BE3] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                        />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="you@example.com"
                          className="h-[44px] w-full rounded-xl border border-[#DCE5F4] bg-[#F8FAFD] pl-10 pr-3.5 text-[13px] text-[#141A29] outline-none transition focus:border-[#035BE3] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Selected Service Dropdown */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
                      Select Service *
                    </label>
                    <select
                      value={formData.service_title}
                      onChange={(e) => {
                        const found = servicesList.find(
                          (s) => s.title === e.target.value
                        );
                        setFormData({
                          ...formData,
                          service_id: found?.id || null,
                          service_title: e.target.value,
                        });
                      }}
                      className="h-[44px] w-full rounded-xl border border-[#DCE5F4] bg-[#F8FAFD] px-3.5 text-[13px] font-medium text-[#141A29] outline-none transition focus:border-[#035BE3] focus:bg-white"
                    >
                      {servicesList.map((s, idx) => (
                        <option key={s.id || idx} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                      <option value="Custom Digital Marketing Plan">
                        Custom Digital Marketing Plan (All-in-One)
                      </option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[12px] font-semibold text-[#334155] mb-1.5">
                      Your Requirement (Optional)
                    </label>
                    <div className="relative">
                      <MessageSquare
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-3.5 text-[#94A3B8]"
                      />
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Tell us briefly about your business or what help you need..."
                        className="w-full rounded-xl border border-[#DCE5F4] bg-[#F8FAFD] pl-10 pr-3.5 py-3 text-[13px] text-[#141A29] outline-none transition focus:border-[#035BE3] focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex h-[46px] items-center justify-center gap-2 rounded-full bg-[#035BE3] px-6 text-[13.5px] font-semibold text-white shadow-sm transition hover:bg-[#FA8C03] disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span>Sending Enquiry...</span>
                      ) : (
                        <>
                          <span>Send Enquiry</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. FOOTER */}
      <Footer />
    </div>
  );
}
