import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock,
  HelpCircle,
  ShieldCheck,
  Headphones,
  ArrowRight,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getPublicSettingsApi, submitContactInquiryApi } from "../services/api";

export default function ContactPage() {
  const [settings, setSettings] = useState({
    site_name: "Knowway",
    contact_email: "support@knowway.in",
    contact_phone: "+91 98765 43210",
    contact_address: "Knowway EdTech Tower, Tech Zone 4, Greater Noida, UP - 201306",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch live contact settings configured in Super Admin
  useEffect(() => {
    getPublicSettingsApi()
      .then((res) => {
        if (res && res.success && res.settings) {
          setSettings((prev) => ({ ...prev, ...res.settings }));
        }
      })
      .catch((err) => console.warn("Notice loading contact settings:", err.message));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await submitContactInquiryApi(formData);
      if (res && res.success) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        setErrorMessage(res?.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFCFF] text-[#141A29] font-sans antialiased flex flex-col justify-between selection:bg-[#035BE3] selection:text-white">
      <div>
        <Header />

        {/* ======================================================== */}
        {/* HERO SECTION MATCHING HOMEPAGE & COURSES PAGE THEME */}
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

          {/* Container */}
          <div className="relative z-10 mx-auto w-full max-w-[1420px] px-5 sm:px-8 lg:px-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white/90 px-4 py-2 shadow-[0_2px_5px_rgba(20,35,70,.04)]">
                <Sparkles size={13} className="text-[#315FD8]" />
                <span className="text-[12px] font-semibold text-[#58657D]">
                  24/7 Dedicated Learner Support
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] font-bold leading-[1.08] tracking-[-0.04em] text-[#141A29]">
                We're Here to Help You{" "}
                <span className="inline-block rounded-[12px] bg-[#DED1FF] px-3 py-0.5 text-[#171B29]">
                  Succeed.
                </span>
              </h1>

              <p className="text-sm sm:text-base text-[#5D6B82] max-w-2xl mx-auto leading-relaxed">
                Have questions about our course packages, affiliate commissions, certification, or need technical help? Send us a message and our support mentors will respond quickly.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* MAIN CONTACT CARDS & FORM CONTAINER */}
        {/* ======================================================== */}
        <section className="relative z-10 pb-20 px-5 sm:px-8 lg:px-12 max-w-[1420px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT 5 COLS: DYNAMIC ADMIN CONTACT DETAILS */}
            <div className="lg:col-span-5 space-y-5">
              <div className="rounded-[28px] border border-[#E4EBF5] bg-white p-7 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#141A29]">Get in Touch</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Reach out to our official support desk directly or visit our office headquarters.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email */}
                  {settings.contact_email && (
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="group flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFD] border border-[#E9EFF8] hover:border-[#035BE3]/40 hover:bg-[#F0F5FF] transition"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-[#E2E8F0] text-[#035BE3] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-[#8A99AD] uppercase tracking-wider block">Official Email</span>
                        <p className="text-sm font-bold text-[#161B29] group-hover:text-[#035BE3] transition truncate mt-0.5">
                          {settings.contact_email}
                        </p>
                        <span className="text-[11px] text-[#64748B]">Average response within 2-4 hours</span>
                      </div>
                    </a>
                  )}

                  {/* Phone */}
                  {settings.contact_phone && (
                    <a
                      href={`tel:${settings.contact_phone}`}
                      className="group flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFD] border border-[#E9EFF8] hover:border-emerald-500/40 hover:bg-emerald-50/40 transition"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-[#E2E8F0] text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-[#8A99AD] uppercase tracking-wider block">Call / WhatsApp</span>
                        <p className="text-sm font-bold text-[#161B29] group-hover:text-emerald-700 transition mt-0.5">
                          {settings.contact_phone}
                        </p>
                        <span className="text-[11px] text-[#64748B]">Mon – Sat: 10:00 AM – 7:00 PM IST</span>
                      </div>
                    </a>
                  )}

                  {/* Office Address */}
                  {settings.contact_address && (
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#F8FAFD] border border-[#E9EFF8]">
                      <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-[#E2E8F0] text-amber-500 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-[#8A99AD] uppercase tracking-wider block">Headquarters</span>
                        <p className="text-xs sm:text-sm font-medium text-[#334155] leading-relaxed mt-0.5">
                          {settings.contact_address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-[#F0F4FA] grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-[#475569]">
                    <ShieldCheck className="w-4 h-4 text-[#035BE3] shrink-0" />
                    <span>Verified Platform</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#475569]">
                    <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant Alert to Admin</span>
                  </div>
                </div>
              </div>

              {/* Quick FAQ Card */}
              <div className="rounded-[28px] border border-[#E4EBF5] bg-gradient-to-br from-[#EFF6FF] to-[#FAF5FF] p-6 space-y-2">
                <div className="flex items-center gap-2 text-[#035BE3]">
                  <HelpCircle className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Need Instant Answers?</h4>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Looking for quick information regarding course activation, certificate downloads, or affiliate payments? Check our FAQ section.
                </p>
                <div className="pt-1">
                  <Link
                    to="/#faq"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#035BE3] hover:underline"
                  >
                    <span>Browse Frequently Asked Questions</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            {/* RIGHT 7 COLS: FORM SUBMISSION CARD */}
            <div className="lg:col-span-7">
              <div className="rounded-[28px] border border-[#E4EBF5] bg-white p-7 sm:p-10 shadow-lg shadow-blue-900/5">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#141A29]">Send Us a Message</h2>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Fill out the form below and our team will get back to you with the solution.
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="py-12 px-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-[#141A29]">Message Sent Successfully!</h3>
                      <p className="text-sm text-[#64748B] max-w-md mx-auto">
                        Thank you for contacting Knowway. Our administration and support team have received your query and will reply via email shortly.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="px-6 py-2.5 rounded-full bg-[#035BE3] text-white text-xs font-bold hover:bg-[#024bc0] transition cursor-pointer shadow-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {errorMessage && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                        ⚠️ {errorMessage}
                      </div>
                    )}

                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#161B29] mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="w-full h-11 rounded-xl border border-[#DCE5F5] bg-white px-4 text-xs font-medium text-[#161B29] outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#161B29] mb-1.5">
                          Mobile / WhatsApp No.
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full h-11 rounded-xl border border-[#DCE5F5] bg-white px-4 text-xs font-medium text-[#161B29] outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-[#161B29] mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full h-11 rounded-xl border border-[#DCE5F5] bg-white px-4 text-xs font-medium text-[#161B29] outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-[#161B29] mb-1.5">
                        Inquiry Topic / Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full h-11 rounded-xl border border-[#DCE5F5] bg-white px-4 text-xs font-medium text-[#161B29] outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10 cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Course Access & Playback">Course Access & Playback</option>
                        <option value="Affiliate & Commission Payout">Affiliate & Commission Payout</option>
                        <option value="Payment & Invoice Receipt">Payment & Invoice Receipt</option>
                        <option value="Certificate Verification">Certificate Verification</option>
                        <option value="Partnership & Mentorship">Partnership & Mentorship</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-[#161B29] mb-1.5">
                        Message / Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please write your questions or details here..."
                        className="w-full rounded-xl border border-[#DCE5F5] bg-white p-4 text-xs font-medium text-[#161B29] outline-none transition focus:border-[#035BE3] focus:ring-2 focus:ring-[#035BE3]/10 resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-full bg-[#035BE3] hover:bg-[#024bc0] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#035BE3]/20 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? "Sending Inquiry..." : "Submit Message"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
