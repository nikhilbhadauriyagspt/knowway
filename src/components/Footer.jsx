import React from "react";
import {
  BookOpen,
  ArrowUpRight,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#E7ECF3] bg-[#FBFCFF]">
      <div className="mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12">
        {/* TOP */}
        <div className="grid gap-10 py-12 lg:grid-cols-[1.2fr_.8fr_.8fr] lg:py-14">

          {/* BRAND */}
          <div className="max-w-[520px]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#315FD8] text-white">
                <BookOpen size={21} />
              </div>

              <div>
                <p className="text-[18px] font-bold text-[#171D2B]">
                  LearnSpace
                </p>
                <p className="text-[10px] tracking-[0.16em] text-[#8B95A7]">
                  LEARN • GROW • BUILD
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-[470px] text-[13px] leading-6 text-[#6C778A]">
              Simple learning paths, practical digital skills and useful
              knowledge designed to help you keep progressing.
            </p>

            <a
              href="/courses"
              className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold text-[#315FD8]"
            >
              Explore Courses
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* QUICK LINKS */}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#8A94A6]">
              Quick Links
            </p>

            <div className="mt-5 space-y-3">
              {["Home", "Explore", "Categories", "Packages", "About"].map(
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
              {["FAQ", "Contact", "Privacy Policy", "Terms & Conditions"].map(
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
            © 2026 LearnSpace. All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <SocialIcon icon={<Instagram size={15} />} />
            <SocialIcon icon={<Linkedin size={15} />} />
            <SocialIcon icon={<Youtube size={15} />} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }) {
  return (
    <a
      href="#"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E6EF] bg-white text-[#59657A] transition hover:border-[#315FD8] hover:text-[#315FD8]"
    >
      {icon}
    </a>
  );
}