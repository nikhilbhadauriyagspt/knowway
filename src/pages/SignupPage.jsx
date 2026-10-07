import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Tag,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  CheckCircle2,
  Gift,
  ShieldCheck,
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    referralCode: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});

  // Validate Step 1: Name, Phone, Email, Address
  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    const phoneRegex = /^[0-9+\s\-()]{10,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 3) {
      newErrors.address = "Please enter a valid complete address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2: Password, Referral (optional), Agree terms
  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the Terms of Service & Privacy Policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setErrors({});
      setStep(2);
    }
  };

  const handleApplyPromo = () => {
    if (formData.referralCode.trim()) {
      setPromoApplied(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="relative isolate min-h-screen flex flex-col justify-between bg-[#FBFCFF] text-[#161B29] overflow-hidden">
      
      {/* ================= EXACT HERO GRID BACKGROUND ================= */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(91,111,150,.075) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(91,111,150,.075) 1px, transparent 1px)
          `,
          backgroundSize: "118px 108px",
        }}
      />

      {/* Hero Radial Center Fade */}
      <div
        className="
          pointer-events-none absolute inset-0 -z-[5]
          bg-[radial-gradient(circle_at_center,rgba(251,252,255,0.30)_0%,rgba(251,252,255,0.55)_47%,rgba(251,252,255,0.94)_100%)]
        "
      />

      {/* Hero Soft Color Rings */}
      <div
        className="
          pointer-events-none absolute
          -left-[100px] top-[100px]
          hidden h-[300px] w-[300px]
          rounded-full border-[60px] border-[#EDF3FF]
          lg:block
        "
      />

      <div
        className="
          pointer-events-none absolute
          -right-[80px] bottom-[100px]
          hidden h-[280px] w-[280px]
          rounded-full border-[55px] border-[#F3EEFF]
          lg:block
        "
      />

      {/* Hero Colored Accent Dots */}
      <div className="absolute left-[9%] top-[18%] hidden h-[11px] w-[11px] rounded-full bg-[#FF985D] lg:block" />
      <div className="absolute right-[12%] top-[34%] hidden h-[12px] w-[12px] rounded-full bg-[#6D5CE7] lg:block" />
      <div className="absolute bottom-[23%] left-[19%] hidden h-[10px] w-[10px] rounded-full bg-[#FFCE57] lg:block" />

      {/* ================= TOP NAVIGATION ================= */}
      <header className="w-full px-6 lg:px-16 pt-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center group">
          <img
            src="/images/logo/logo.png"
            alt="Logo"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DCE2ED] bg-white text-xs font-semibold text-[#293246] hover:bg-[#F8FAFD] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* ================= MAIN CENTERED SIGNUP FORM ================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 z-10">
        
        {/* Top Content Above Box */}
        <div className="text-center max-w-lg mx-auto mb-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-[8px]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EEF3FF]">
              <Sparkles size={12} className="text-[#416FE8]" />
            </span>
            <span className="text-[12px] font-semibold tracking-[0.01em] text-[#526079]">
              Join 25,000+ Active Learners
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.04em] text-[#161B29] leading-tight">
            Create your account
          </h1>

          <p className="mt-2 text-[15px] text-[#626B7C] leading-relaxed">
            2 simple steps to get started with verified courses and career tracks.
          </p>
        </div>

        {/* Wide Center Card Box */}
        <div className="w-full max-w-[580px] rounded-[24px] border border-[#E2E7F0] bg-white p-7 sm:p-10 shadow-sm">
          
          {/* ================= SUCCESS STATE ================= */}
          {isSubmitted ? (
            <div className="text-center py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF7EE] text-[#22A559] mb-5">
                <CheckCircle2 size={36} />
              </div>

              <h2 className="text-2xl font-bold text-[#161B29]">Account Created Successfully!</h2>
              <p className="mt-2 text-sm text-[#626B7C]">
                Welcome aboard, <span className="font-semibold text-[#161B29]">{formData.name}</span>! Aapka account successfully create ho gaya hai.
              </p>

              <div className="my-6 rounded-2xl border border-[#E8EEF8] bg-[#F8FAFD] p-5 text-left text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-[#7A8699]">Registered Name:</span>
                  <span className="font-semibold text-[#161B29]">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A8699]">Email Address:</span>
                  <span className="font-semibold text-[#161B29]">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A8699]">Mobile Number:</span>
                  <span className="font-semibold text-[#161B29]">{formData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A8699]">Address:</span>
                  <span className="font-semibold text-[#161B29] text-right max-w-[240px] truncate">{formData.address}</span>
                </div>
                {formData.referralCode && (
                  <div className="flex justify-between pt-1 border-t border-[#E2E8F0]">
                    <span className="text-[#7A8699]">Promo / Referral Code:</span>
                    <span className="font-bold text-[#315FD8]">{formData.referralCode.toUpperCase()} (Applied)</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="flex-1 h-[48px] rounded-full bg-[#035BE3] hover:bg-[#FA8C03] text-sm font-semibold text-white transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#035BE3]/20"
                >
                  <span>Go to Login</span>
                  <ArrowRight size={16} />
                </button>
                <Link
                  to="/"
                  className="flex-1 h-[48px] rounded-full border border-[#DCE2ED] hover:border-[#035BE3] hover:text-[#035BE3] text-sm font-semibold text-[#293246] transition-colors flex items-center justify-center"
                >
                  Back to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* ================= 2-STEP PROGRESS STEPPER ================= */}
              <div className="mb-8 pb-6 border-b border-[#F0F4FA]">
                <div className="flex items-center justify-between">
                  {/* Step 1 Indicator */}
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 2) setStep(1);
                    }}
                    className={`flex items-center gap-3 text-left transition-opacity ${
                      step === 2 ? "cursor-pointer hover:opacity-80" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        step === 1
                          ? "bg-[#035BE3] text-white shadow-md shadow-[#035BE3]/25"
                          : "bg-[#EBF7EE] text-[#22A559]"
                      }`}
                    >
                      {step > 1 ? <Check size={16} className="stroke-[3]" /> : "1"}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#929AA9]">
                        Step 1
                      </p>
                      <p className={`text-[13px] font-bold ${step === 1 ? "text-[#035BE3]" : "text-[#161B29]"}`}>
                        Personal Details
                      </p>
                    </div>
                  </button>

                  {/* Connector Line */}
                  <div className="flex-1 mx-4 h-[2px] rounded-full overflow-hidden bg-[#EDF2F7]">
                    <div
                      className={`h-full transition-all duration-300 ${
                        step > 1 ? "w-full bg-[#035BE3]" : "w-0 bg-[#035BE3]"
                      }`}
                    />
                  </div>

                  {/* Step 2 Indicator */}
                  <div className="flex items-center gap-3 text-left">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        step === 2
                          ? "bg-[#035BE3] text-white shadow-md shadow-[#035BE3]/25"
                          : "bg-[#F1F4F9] text-[#8C97A8]"
                      }`}
                    >
                      2
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#929AA9]">
                        Step 2
                      </p>
                      <p className={`text-[13px] font-bold ${step === 2 ? "text-[#035BE3]" : "text-[#7A8699]"}`}>
                        Promo & Security
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= STEP 1: PERSONAL DETAILS ================= */}
              {step === 1 && (
                <form onSubmit={handleNextStep} className="space-y-4" noValidate>
                  {/* Full Name */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#293246] mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C97A8]" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: null });
                        }}
                        className={`w-full rounded-[14px] border ${
                          errors.name ? "border-red-400 bg-red-50/20" : "border-[#DCE2ED] bg-[#FBFCFF]"
                        } pl-11 pr-4 py-3 text-[14px] text-[#161B29] placeholder-[#A0AABA] focus:border-[#315FD8] focus:bg-white focus:outline-none transition`}
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-[12px] text-red-500">{errors.name}</p>}
                  </div>

                  {/* Phone / Mobile Number */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#293246] mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C97A8]" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: null });
                        }}
                        className={`w-full rounded-[14px] border ${
                          errors.phone ? "border-red-400 bg-red-50/20" : "border-[#DCE2ED] bg-[#FBFCFF]"
                        } pl-11 pr-4 py-3 text-[14px] text-[#161B29] placeholder-[#A0AABA] focus:border-[#315FD8] focus:bg-white focus:outline-none transition`}
                      />
                    </div>
                    {errors.phone && <p className="mt-1 text-[12px] text-red-500">{errors.phone}</p>}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#293246] mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C97A8]" />
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: null });
                        }}
                        className={`w-full rounded-[14px] border ${
                          errors.email ? "border-red-400 bg-red-50/20" : "border-[#DCE2ED] bg-[#FBFCFF]"
                        } pl-11 pr-4 py-3 text-[14px] text-[#161B29] placeholder-[#A0AABA] focus:border-[#315FD8] focus:bg-white focus:outline-none transition`}
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-[12px] text-red-500">{errors.email}</p>}
                  </div>

                  {/* Complete Address */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#293246] mb-1.5">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={17} className="absolute left-4 top-3 text-[#8C97A8]" />
                      <textarea
                        rows={2}
                        required
                        placeholder="House / Flat No., Street, City, State, PIN code"
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({ ...formData, address: e.target.value });
                          if (errors.address) setErrors({ ...errors, address: null });
                        }}
                        className={`w-full rounded-[14px] border ${
                          errors.address ? "border-red-400 bg-red-50/20" : "border-[#DCE2ED] bg-[#FBFCFF]"
                        } pl-11 pr-4 py-2.5 text-[14px] text-[#161B29] placeholder-[#A0AABA] focus:border-[#315FD8] focus:bg-white focus:outline-none transition resize-none`}
                      />
                    </div>
                    {errors.address && <p className="mt-1 text-[12px] text-red-500">{errors.address}</p>}
                  </div>

                  {/* Continue Button to Step 2 */}
                  <button
                    type="submit"
                    className="w-full h-[50px] !mt-6 flex items-center justify-center gap-2 rounded-full bg-[#035BE3] hover:bg-[#FA8C03] text-[14px] font-semibold text-white transition-colors duration-200 cursor-pointer shadow-md shadow-[#035BE3]/20"
                  >
                    <span>Continue to Step 2</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              {/* ================= STEP 2: PROMO / REFERRAL & TERMS ================= */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  {/* Quick Summary Pill with Edit action */}
                  <div className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFD] px-3.5 py-2.5 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EBF1FD] text-[#035BE3]">
                        <User size={14} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-bold text-[#161B29] truncate">{formData.name}</p>
                        <p className="text-[11px] text-[#7A8699] truncate">{formData.email} • {formData.phone}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[12px] font-semibold text-[#035BE3] hover:text-[#FA8C03] hover:underline cursor-pointer shrink-0 pl-2"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#293246] mb-1.5">
                      Create Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C97A8]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (errors.password) setErrors({ ...errors, password: null });
                        }}
                        className={`w-full rounded-[14px] border ${
                          errors.password ? "border-red-400 bg-red-50/20" : "border-[#DCE2ED] bg-[#FBFCFF]"
                        } pl-11 pr-11 py-3 text-[14px] text-[#161B29] placeholder-[#A0AABA] focus:border-[#315FD8] focus:bg-white focus:outline-none transition`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C97A8] hover:text-[#161B29] transition cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-[12px] text-red-500">{errors.password}</p>}
                  </div>

                  {/* Promo / Referral Code */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[13px] font-semibold text-[#293246] flex items-center gap-1.5">
                        <Tag size={14} className="text-[#315FD8]" />
                        Promo / Referral Code
                      </label>
                      <span className="text-[11px] font-medium text-[#8C97A8]">Optional</span>
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Gift size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C97A8]" />
                        <input
                          type="text"
                          placeholder="e.g. FRIEND2024 or KNOWWAY50"
                          value={formData.referralCode}
                          onChange={(e) => {
                            setFormData({ ...formData, referralCode: e.target.value.toUpperCase() });
                            setPromoApplied(false);
                          }}
                          className="w-full uppercase rounded-[14px] border border-[#DCE2ED] bg-[#FBFCFF] pl-11 pr-4 py-3 text-[14px] font-medium tracking-wide text-[#161B29] placeholder-[#A0AABA] focus:border-[#315FD8] focus:bg-white focus:outline-none transition"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={!formData.referralCode.trim()}
                        className="px-4 py-3 rounded-[14px] text-[13px] font-semibold bg-[#FA8C03] hover:bg-[#e07b02] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#FA8C03]/20 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {promoApplied && formData.referralCode && (
                      <div className="mt-2 flex items-center gap-2 rounded-xl bg-[#EBF7EE] px-3 py-2 text-[12px] font-medium text-[#1E7E34]">
                        <CheckCircle2 size={14} />
                        <span>Code <strong>{formData.referralCode}</strong> applied successfully! Special benefits unlocked.</span>
                      </div>
                    )}
                  </div>

                  {/* Terms and Privacy Agreement */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 text-[12px] text-[#626B7C] cursor-pointer select-none leading-relaxed">
                      <input
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={(e) => {
                          setFormData({ ...formData, agreeTerms: e.target.checked });
                          if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: null });
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-[#DCE2ED] text-[#035BE3] focus:ring-0 cursor-pointer"
                      />
                      <span>
                        I agree to the{" "}
                        <a href="#terms" className="font-semibold text-[#035BE3] hover:text-[#FA8C03] hover:underline">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#privacy" className="font-semibold text-[#035BE3] hover:text-[#FA8C03] hover:underline">
                          Privacy Policy
                        </a>{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="mt-1 text-[12px] text-red-500">{errors.agreeTerms}</p>
                    )}
                  </div>

                  {/* Action Buttons: Back + Submit */}
                  <div className="flex gap-3 !mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="h-[50px] px-5 flex items-center justify-center gap-2 rounded-full border border-[#DCE2ED] bg-white hover:border-[#035BE3] hover:text-[#035BE3] text-[14px] font-semibold text-[#293246] transition-colors cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                    
                    <button
                      type="submit"
                      className="flex-1 h-[50px] flex items-center justify-center gap-2 rounded-full bg-[#035BE3] hover:bg-[#FA8C03] text-[14px] font-semibold text-white transition-colors duration-200 cursor-pointer shadow-md shadow-[#035BE3]/20"
                    >
                      <ShieldCheck size={17} />
                      <span>Complete Signup</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* Clean Separator */}
              <div className="relative my-7 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E5E9F1]" />
                </div>
                <span className="relative bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9AA3B1]">
                  Or register with
                </span>
              </div>

              {/* Social Google Button */}
              <button
                type="button"
                onClick={() => alert("Google Signup initialized")}
                className="w-full h-[48px] flex items-center justify-center gap-3 rounded-full border border-[#DCE2ED] bg-white text-[13px] font-semibold text-[#293246] hover:border-[#035BE3] hover:bg-[#F8FAFD] transition-colors cursor-pointer"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Footer Link */}
              <div className="mt-8 pt-6 border-t border-[#F0F3F8] text-center">
                <p className="text-[13px] text-[#626B7C]">
                  Already have an account?{" "}
                  <Link to="/login" className="font-bold text-[#035BE3] hover:text-[#FA8C03] hover:underline">
                    Sign in instead
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full px-6 py-6 text-center text-[12px] text-[#9AA3B1] z-10 border-t border-[#E5E9F1]">
        © {CURRENT_YEAR} LearnSpace Platform. All rights reserved. • <a href="#privacy" className="hover:underline">Privacy Policy</a> • <a href="#terms" className="hover:underline">Terms of Service</a>
      </footer>

    </div>
  );
}
