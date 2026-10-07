import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-[#E7ECF3] bg-[#FBFCFF]">
      <div className="mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12">
        {/* TOP */}
        <div className="grid gap-10 py-10 lg:grid-cols-[1.2fr_.8fr_.8fr] lg:py-12">
          {/* BRAND */}
          <div className="max-w-[520px]">
            <Link to="/" className="inline-block group">
              <img
                src="/images/logo/logo.png"
                alt="Logo"
                className="h-12 sm:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
            </Link>

            <p className="mt-5 max-w-[470px] text-[13px] leading-6 text-[#6C778A]">
              Simple learning paths, practical digital skills and useful
              knowledge designed to help you keep progressing.
            </p>

            <a
              href="/packages"
              className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-[#035BE3] hover:text-[#FA8C03] transition-colors"
            >
              Explore Packages
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* QUICK LINKS */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8A94A6]">
              Quick Links
            </p>

            <div className="mt-5 space-y-3">
              {["Home", "Packages", "About Us", "Creator Program", "How It Works", "Mentors"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-[13px] text-[#59657A] transition hover:text-[#315FD8]"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>

          {/* SUPPORT */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8A94A6]">
              Support
            </p>

            <div className="mt-5 space-y-3">
              {["FAQs", "Contact Us", "Privacy Policy", "Terms of Service"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-[13px] text-[#59657A] transition hover:text-[#315FD8]"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col gap-4 border-t border-[#E7ECF3] py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#8A94A6]">
            © {CURRENT_YEAR} Knowway. All rights reserved.
          </p>

          {/* Clean Social Brand Icons */}
          <div className="flex items-center gap-2">
            {/* Instagram */}
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E6EF] bg-white text-[#59657A] transition hover:border-[#315FD8] hover:text-[#315FD8]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E6EF] bg-white text-[#59657A] transition hover:border-[#315FD8] hover:text-[#315FD8]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 0 0-1.66 1.63 1.65 1.65 0 0 0 1.66 1.64c.9 0 1.64-.74 1.64-1.64a1.64 1.64 0 0 0-1.64-1.63" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="#"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E6EF] bg-white text-[#59657A] transition hover:border-[#315FD8] hover:text-[#315FD8]"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}