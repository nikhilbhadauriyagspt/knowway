import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import {
  getPublicSettingsApi,
  getPublicPagesApi,
  isUserAuthenticated,
  isUserHasPurchasedPackage,
  openPackageRequiredModal,
} from "../services/api";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  const [settings, setSettings] = useState({
    site_name: "The Skillpreneur",
    site_tagline:
      "Simple learning paths, practical digital skills and useful knowledge designed to help you keep progressing.",
    site_logo: "/images/logo/logo.png",
    contact_email: "support@theskillpreneur.com",
    contact_phone: "+91 98765 43210",
    contact_address:
      "The Skillpreneur EdTech Tower, Tech Zone 4, Greater Noida, UP - 201306",
    social_instagram: "https://instagram.com/theskillpreneur",
    social_youtube: "https://youtube.com/@theskillpreneur",
    social_linkedin: "https://linkedin.com/company/theskillpreneur",
    social_telegram: "https://t.me/theskillpreneur_official",
    social_twitter: "https://twitter.com/theskillpreneur",
    copyright_text: "The Skillpreneur. All rights reserved.",
  });

  const [pages, setPages] = useState([]);

  useEffect(() => {
    let isMounted = true;

    getPublicSettingsApi()
      .then((res) => {
        if (res && res.success && res.settings && isMounted) {
          setSettings((prev) => ({ ...prev, ...res.settings }));
        }
      })
      .catch((err) =>
        console.warn("Using default footer settings:", err.message)
      );

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

  const legalPages = pages.filter(
    (p) =>
      p.show_in_footer &&
      (p.footer_category === "legal" || !p.footer_category)
  );
  const quickLinkPages = pages.filter(
    (p) => p.show_in_footer && p.footer_category === "quick_links"
  );

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#131C33] via-[#10182B] to-[#0B1120] text-white border-t border-[#223052]">
      {/* Subtle Blueprint Grid Pattern on Dark Navy */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148,163,184,.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,.08) 1px, transparent 1px)
          `,
          backgroundSize: "118px 118px",
        }}
      />

      {/* Soft Glowing Accents */}
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#035BE3]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#7555E8]/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 pt-11 pb-7 sm:pt-14 sm:pb-9">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 gap-9 lg:grid-cols-12 lg:gap-10">
          {/* 1. BRAND & TAGLINE (4 COLS) */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center rounded-2xl bg-white px-4 py-2.5 shadow-sm transition-transform duration-200 hover:scale-[1.02]"
            >
              <img
                src={settings.site_logo || "/images/logo/logo.png"}
                alt={settings.site_name || "Logo"}
                className="h-9 sm:h-10 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/images/logo/logo.png";
                }}
              />
            </Link>

            <p className="text-[13.5px] leading-relaxed text-[#A3B1C6] max-w-sm">
              {settings.site_tagline}
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <Link
                to="/packages"
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-[#035BE3] px-4.5 text-[12.5px] font-semibold text-white shadow-sm shadow-[#035BE3]/30 transition hover:bg-[#FA8C03]"
              >
                <span>Explore Packages</span>
                <ArrowUpRight size={14} />
              </Link>

              <Link
                to="/services"
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4.5 text-[12.5px] font-semibold text-white transition hover:border-[#FA8C03] hover:bg-white/10"
              >
                <span>Our Services</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* 2. EXPLORE & LEGAL LINKS (SIDE-BY-SIDE 2 COLS ON MOBILE & DESKTOP - 5 COLS) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-6 sm:gap-8 pt-6 lg:pt-0 border-t border-white/10 lg:border-t-0">
            {/* Explore Column */}
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#6CA3FF]">
                Explore
              </p>

              <div className="mt-4 space-y-2.5">
                <Link
                  to="/"
                  className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                >
                  Home
                </Link>
                <Link
                  to="/packages"
                  className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                >
                  Packages & Bundles
                </Link>
                <Link
                  to="/courses"
                  className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                >
                  Masterclass Library
                </Link>
                <Link
                  to="/services"
                  className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                >
                  Digital Services
                </Link>
                <Link
                  to="/affiliate"
                  onClick={(e) => {
                    if (
                      isUserAuthenticated() &&
                      !isUserHasPurchasedPackage()
                    ) {
                      e.preventDefault();
                      openPackageRequiredModal();
                    }
                  }}
                  className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                >
                  Affiliate Partner
                </Link>
                <Link
                  to="/contact"
                  className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                >
                  Contact Support
                </Link>
                {quickLinkPages.map((page) => (
                  <Link
                    key={page.id}
                    to={`/page/${page.slug}`}
                    className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Policies & Legal Column */}
            <div>
              <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#B89CFF]">
                Policies & Legal
              </p>

              <div className="mt-4 space-y-2.5">
                {legalPages.length > 0 ? (
                  legalPages.map((page) => (
                    <Link
                      key={page.id}
                      to={`/page/${page.slug}`}
                      className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                    >
                      {page.title}
                    </Link>
                  ))
                ) : (
                  <>
                    <Link
                      to="/page/privacy-policy"
                      className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      to="/page/terms-and-conditions"
                      className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                    >
                      Terms of Service
                    </Link>
                    <Link
                      to="/page/refund-policy"
                      className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                    >
                      Refund Policy
                    </Link>
                    <Link
                      to="/page/disclaimer"
                      className="block text-[13.5px] text-[#B0BDD0] transition hover:text-white"
                    >
                      Disclaimer
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 3. CONTACT & SUPPORT (3 COLS) */}
          <div className="lg:col-span-3 space-y-3 pt-6 lg:pt-0 border-t border-white/10 lg:border-t-0">
            <p className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-[#FFAA70]">
              Contact & Support
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 pt-1">
              {settings.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#18233E]/90 px-3.5 py-2.5 text-[12.5px] font-medium text-[#E2E8F0] transition hover:border-[#035BE3] hover:bg-[#1D2B4D]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#035BE3]/25 text-[#6CA3FF]">
                    <Mail className="h-4 w-4" />
                  </span>
                  <span className="truncate">{settings.contact_email}</span>
                </a>
              )}

              {settings.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#18233E]/90 px-3.5 py-2.5 text-[12.5px] font-medium text-[#E2E8F0] transition hover:border-emerald-500/60 hover:bg-[#1D2B4D]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="truncate">{settings.contact_phone}</span>
                </a>
              )}

              {settings.contact_address && (
                <div className="sm:col-span-2 lg:col-span-1 flex items-start gap-3 rounded-2xl border border-white/10 bg-[#18233E]/90 px-3.5 py-2.5 text-[12px] leading-relaxed text-[#A3B1C6]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span>{settings.contact_address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-9 pt-6 border-t border-white/10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center sm:text-left text-[12px] text-[#8E9DB5]">
            © {CURRENT_YEAR}{" "}
            {settings.copyright_text || "The Skillpreneur. All rights reserved."}
          </p>

          {/* Social Brand Icons */}
          <div className="flex items-center justify-center sm:justify-end gap-2.5">
            {settings.social_instagram && (
              <a
                href={settings.social_instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-[#18233E] text-[#CBD5E1] transition hover:border-[#E1306C] hover:bg-[#E1306C] hover:text-white"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}

            {settings.social_linkedin && (
              <a
                href={settings.social_linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-[#18233E] text-[#CBD5E1] transition hover:border-[#0077B5] hover:bg-[#0077B5] hover:text-white"
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
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-[#18233E] text-[#CBD5E1] transition hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}

            {settings.social_telegram && (
              <a
                href={settings.social_telegram}
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-[#18233E] text-[#CBD5E1] transition hover:border-[#229ED9] hover:bg-[#229ED9] hover:text-white"
              >
                <Send className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}