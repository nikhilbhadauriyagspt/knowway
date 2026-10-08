import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  ShieldCheck,
  Calendar,
  FileText,
  ArrowLeft,
  Lock,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { getPublicPageBySlugApi } from "../services/api";

export default function CustomPolicyPage({ defaultSlug }) {
  const { slug } = useParams();
  const location = useLocation();

  // Determine effective slug from url or props
  let effectiveSlug = defaultSlug || slug;
  if (!effectiveSlug) {
    if (location.pathname.includes("privacy")) effectiveSlug = "privacy-policy";
    else if (location.pathname.includes("terms")) effectiveSlug = "terms-and-conditions";
    else if (location.pathname.includes("refund")) effectiveSlug = "refund-policy";
    else if (location.pathname.includes("disclaimer")) effectiveSlug = "disclaimer";
  }

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getPublicPageBySlugApi(effectiveSlug)
      .then((res) => {
        if (res && res.success && res.page && isMounted) {
          setPage(res.page);
        } else if (isMounted) {
          setError(res?.message || "Page not found.");
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load page content.");
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [effectiveSlug]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFE] text-slate-900 font-sans">
      <Header />

      <main className="flex-1 pb-20">
        {/* Top Hero Banner */}
        <div className="bg-gradient-to-b from-[#F0F5FF] to-white border-b border-[#E2E8F0] py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B] mb-4">
              <Link to="/" className="hover:text-[#035BE3] transition">
                Home
              </Link>
              <span>/</span>
              <span className="text-[#035BE3]">Legal & Information</span>
            </div>

            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-8 bg-blue-200/60 rounded-xl w-2/3" />
                <div className="h-4 bg-slate-200 rounded-lg w-1/3" />
              </div>
            ) : error ? (
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Information Page
                </h1>
                <p className="text-sm text-red-500 mt-2">{error}</p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#035BE3]/10 text-[#035BE3] text-xs font-bold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Official Knowway Policy</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
                  {page.title}
                </h1>
                {page.updated_at && (
                  <div className="flex items-center gap-2 mt-4 text-xs text-[#64748B]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Last Updated:{" "}
                      {new Date(page.updated_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="mx-auto max-w-4xl px-5 sm:px-8 py-10 sm:py-12">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-slate-100 rounded w-full" />
              <div className="h-4 bg-slate-100 rounded w-5/6" />
              <div className="h-4 bg-slate-100 rounded w-4/6" />
              <div className="h-32 bg-slate-100 rounded-2xl w-full mt-6" />
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#E2E8F0] p-8 shadow-xs">
              <HelpCircle className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
              <h2 className="text-lg font-bold text-[#0F172A]">Page Not Available</h2>
              <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
                The requested policy or document might have been updated or moved by the administrator.
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="px-5 py-2.5 bg-[#035BE3] text-white rounded-full text-xs font-bold hover:bg-[#024bc0] transition inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[28px] border border-[#E2E8F0] p-6 sm:p-10 shadow-xs">
              <div
                className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-[#0F172A] prose-headings:tracking-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-li:text-slate-600 prose-li:text-sm sm:prose-li:text-base prose-a:text-[#035BE3] prose-a:font-semibold"
                dangerouslySetInnerHTML={{ __html: page.content }}
              />

              {/* Legal Notice Footer */}
              <div className="mt-12 pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#64748B]">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Legal Document & Terminology</span>
                </div>
                <Link
                  to="/"
                  className="text-[#035BE3] font-bold hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Back to Homepage</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
