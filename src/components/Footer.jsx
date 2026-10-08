import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
  Globe,
  Send,
} from "lucide-react";
import { getPublicSettingsApi, getPublicPagesApi } from "../services/api";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const [settings, setSettings] = useState({
    site_name: "Knowway",
    site_tagline: "Simple learning paths, practical digital skills and useful knowledge designed to help you keep progressing.",
    site_logo: "/images/logo/logo.png",
    contact_email: "support@knowway.in",
    contact_phone: "+91 98765 43210",
    contact_address: "Knowway EdTech Tower, Tech Zone 4, Greater Noida, UP - 201306",
    social_instagram: "https://instagram.com/knowway",
    social_youtube: "https://youtube.com/@knowway",
    social_linkedin: "https://linkedin.com/company/knowway",
    social_telegram: "https://t.me/knowway_official",
    social_twitter: "https://twitter.com/knowway",
    copyright_text: "Knowway. All rights reserved.",
  });

  const [pages, setPages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    // 1. Fetch live branding and contact settings
    getPublicSettingsApi()
      .then((res) => {
        if (res && res.success && res.settings && isMounted) {
          setSettings((prev) => ({ ...prev, ...res.settings }));
        }
      })
      .catch((err) => console.warn("Using default footer settings:", err.message));

    // 2. Fetch live policy & custom pages
    getPublicPagesApi()
      .then((res) => {
        if (res && res.success && Array.isArray(res.pages) && isMounted) {
          setPages(res.pages);
        }
      })
      .catch((err) => console.warn("Using default pages:", err.message));

    return () => {
      isMounted = false;
    };
  }, []);

  const legalPages = pages.filter((p) => p.show_in_footer && (p.footer_category === "legal" || !p.footer_category));
  const quickLinkPages = pages.filter((p) => p.show_in_footer && p.footer_category === "quick_links");

  return (
    <footer className="border-t border-[#E7ECF3] bg-[#FBFCFF]">
      <div className="mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12">
        {/* TOP */}
        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1fr] lg:py-14">
          {/* BRAND */}
          <div className="max-w-[440px] space-y-4">
            <Link to="/" className="inline-block group">
              <img
                src={settings.site_logo || "/images/logo/logo.png"}
                alt={settings.site_name || "Logo"}
                className="h-11 sm:h-13 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/images/logo/logo.png";
                }}
              />
            </Link>

            <p className="text-[13px] leading-6 text-[#6C778A]">
              {settings.site_tagline}
            </p>

            <div className="pt-2">
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 text-[12px] font-bold text-[#035BE3] hover:text-[#FA8C03] transition-colors"
              >
                <span>Explore Skill Packages</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* QUICK EXPLORE LINKS */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8A94A6]">
              Explore
            </p>

            <div className="mt-4 space-y-2.5">
              <Link to="/" className="block text-[13px] text-[#59657A] transition hover:text-[#035BE3]">
                Home
              </Link>
              <Link to="/packages" className="block text-[13px] text-[#59657A] transition hover:text-[#035BE3]">
                Packages & Bundles
              </Link>
              <Link to="/courses" className="block text-[13px] text-[#59657A] transition hover:text-[#035BE3]">
                Masterclass Library
              </Link>
              <Link to="/affiliate" className="block text-[13px] text-[#59657A] transition hover:text-[#035BE3]">
                Affiliate Partner Program
              </Link>
              {quickLinkPages.map((page) => (
                <Link
                  key={page.id}
                  to={`/page/${page.slug}`}
                  className="block text-[13px] text-[#59657A] transition hover:text-[#035BE3]"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>

          {/* LEGAL & POLICIES (DYNAMIC FROM ADMIN CMS) */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8A94A6]">
              Policies & Legal
            </p>

            <div className="mt-4 space-y-2.5">
              {legalPages.length > 0 ? (
                legalPages.map((page) => (
                  <Link
                    key={page.id}
                    to={`/page/${page.slug}`}
                    className="block text-[13px] text-[#59657A] transition hover:text-[#035BE3]"
                  >
                    {page.title}
                  </Link>
                ))
              ) : (
                <>
                  <Link to="/page/privacy-policy" className="block text-[13px] text-[#59657A] transition hover:text-[#035BE3]">
                    Privacy Policy
                  </Link>
                  <Link to="/page/terms-and-conditions" className="block text-[13px] text-[#59657A] transition hover:text-[#035BE3]">
                    Terms of Service
                  </Link>
                  <Link to="/page/refund-policy" className="block text-[13px] text-[#59657A] transition hover:text-[#035BE3]">
                    Refund & Cancellation
                  </Link>
                  <Link to="/page/disclaimer" className="block text-[13px] text-[#59657A] transition hover:text-[#035BE3]">
                    Affiliate Disclosure
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* DYNAMIC CONTACT INFO */}
          <div className="space-y-3">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8A94A6]">
              Contact & Support
            </p>

            <div className="space-y-2.5 pt-1">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-start gap-2.5 text-[13px] text-[#59657A] hover:text-[#035BE3] transition group"
                >
                  <Mail className="w-4 h-4 text-[#035BE3] shrink-0 mt-0.5" />
                  <span className="break-all">{settings.contact_email}</span>
                </a>
              )}

              {settings.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="flex items-center gap-2.5 text-[13px] text-[#59657A] hover:text-[#035BE3] transition"
                >
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{settings.contact_phone}</span>
                </a>
              )}

              {settings.contact_address && (
                <div className="flex items-start gap-2.5 text-[12px] leading-5 text-[#6C778A]">
                  <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{settings.contact_address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 border-t border-[#E7ECF3] py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#8A94A6]">
            © {CURRENT_YEAR} {settings.copyright_text || "Knowway. All rights reserved."}
          </p>

          {/* Social Brand Icons */}
          <div className="flex items-center gap-2">
            {settings.social_instagram && (
              <a
                href={settings.social_instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E6EF] bg-white text-[#59657A] transition hover:border-[#E1306C] hover:text-[#E1306C]"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}

            {settings.social_linkedin && (
              <a
                href={settings.social_linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E6EF] bg-white text-[#59657A] transition hover:border-[#0077B5] hover:text-[#0077B5]"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 0 0-1.66 1.63 1.65 1.65 0 0 0 1.66 1.64c.9 0 1.64-.74 1.64-1.64a1.64 1.64 0 0 0-1.64-1.63" />
                </svg>
              </a>
            )}

            {settings.social_youtube && (
              <a
                href={settings.social_youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E6EF] bg-white text-[#59657A] transition hover:border-[#FF0000] hover:text-[#FF0000]"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}

            {settings.social_telegram && (
              <a
                href={settings.social_telegram}
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E6EF] bg-white text-[#59657A] transition hover:border-[#229ED9] hover:text-[#229ED9]"
              >
                <Send className="w-4 h-4 text-[#229ED9]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}