import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Layers3,
} from "lucide-react";

export default function PackagesSection() {
  const packages = [
    {
      id: "pro",
      name: "Pro",
      description:
        "Build practical digital skills and create a strong foundation for your online career.",
      image: "/images/packages/pro.png",
      link: "/package/pro",
      type: "horizontal",
      cardClass:
        "bg-[#EEF3FF] border-[#DDE7FF]",
      accent: "#315FD8",
    },
    {
      id: "supreme",
      name: "Supreme",
      description:
        "Go deeper with advanced learning paths designed for digital growth and business skills.",
      image: "/images/packages/supreme.png",
      link: "/package/supreme",
      type: "horizontal",
      cardClass:
        "bg-[#FFF8E9] border-[#F6E7BD]",
      accent: "#D99B1D",
    },
    {
      id: "premium",
      name: "Premium",
      description:
        "Learn how digital commerce works and explore the skills behind building an online business.",
      image: "/images/packages/premium.png",
      link: "/package/premium",
      type: "vertical",
      cardClass:
        "bg-[#EFF7FF] border-[#D7E9FF]",
      accent: "#356AE6",
    },
    {
      id: "premium-plus",
      name: "Premium Plus",
      description:
        "Explore content creation, personal branding and modern digital communication skills.",
      image: "/images/packages/premium-plus.png",
      link: "/package/premium-plus",
      type: "vertical",
      cardClass:
        "bg-[#F6F0FF] border-[#E5D9FF]",
      accent: "#7555E8",
      featured: true,
    },
  ];

  return (
    <section
      id="packages"
      className="relative overflow-hidden bg-[#FBFCFF] py-20 lg:py-28"
    >
      {/* HERO-MATCHING GRID */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.58]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(90,109,145,.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(90,109,145,.07) 1px, transparent 1px)
          `,
          backgroundSize: "118px 118px",
        }}
      />

      {/* SOFT HERO SHAPES */}
      <div className="pointer-events-none absolute -left-[95px] top-[120px] h-[255px] w-[255px] rounded-full border-[42px] border-[#E8EFFF]" />
      <div className="pointer-events-none absolute -right-[120px] bottom-[30px] h-[310px] w-[310px] rounded-full border-[52px] border-[#F0E9FF]" />

      <div className="relative z-10 mx-auto w-full max-w-[1540px] px-5 sm:px-8 lg:px-12">

        {/* ================= HEADER ================= */}
        <div className="mb-11 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white/90 px-4 py-2 shadow-[0_2px_5px_rgba(20,35,70,.04)]">
              <Sparkles size={13} className="text-[#315FD8]" />

              <span className="text-[12px] font-semibold text-[#58657D]">
                Explore Learning Packages
              </span>
            </div>

            <h2 className="text-[38px] font-bold leading-[1.07] tracking-[-0.045em] text-[#141A29] sm:text-[46px] lg:text-[54px]">
              Knowledge built for
              <span className="ml-3 inline-block rounded-[10px] bg-[#DED1FF] px-2.5 text-[#171B29]">
                progress.
              </span>
            </h2>

            <p className="mt-5 max-w-[650px] text-[15px] leading-7 text-[#647089] sm:text-[16px]">
              Choose a learning path that matches your goals and explore
              practical skills through clear, structured courses.
            </p>
          </div>

          {/* COUNTER */}
          <div className="flex items-center gap-3">
            <div className="flex h-[58px] items-center gap-5 rounded-full border border-[#DFE6F1] bg-white px-5">
              <BookOpen size={17} className="text-[#315FD8]" />

              <span className="text-[13px] font-semibold text-[#424E65]">
                Digital Packages
              </span>

              <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#315FD8] px-2 text-[12px] font-bold text-white">
                4
              </span>
            </div>
          </div>
        </div>

        {/* ================= MAIN LAYOUT ================= */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">

          {/* LEFT SIDE */}
          <div className="grid gap-5 xl:col-span-6">
            {packages
              .filter((item) => item.type === "horizontal")
              .map((pkg) => (
                <PackageHorizontal key={pkg.id} pkg={pkg} />
              ))}
          </div>

          {/* RIGHT TALL CARDS */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:col-span-6">
            {packages
              .filter((item) => item.type === "vertical")
              .map((pkg) => (
                <PackageVertical key={pkg.id} pkg={pkg} />
              ))}
          </div>
        </div>

        {/* ================= BOTTOM STRIP ================= */}
        <div className="mt-8 flex flex-col gap-5 border-t border-[#E3E8F1] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EEE9FF] text-[#7555E8]">
              <Layers3 size={18} />
            </div>

            <div>
              <p className="text-[13px] font-bold text-[#171D2B]">
                Choose a path. Learn at your pace.
              </p>

              <p className="mt-0.5 text-[12px] text-[#7A8497]">
                Each package gives you a structured way to explore new skills.
              </p>
            </div>
          </div>

          <Link
            to="/courses"
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-full bg-[#171D2B] px-5 text-[12px] font-semibold text-white transition hover:bg-[#315FD8]"
          >
            Explore all courses
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   HORIZONTAL PACKAGE
========================================================= */

function PackageHorizontal({ pkg }) {
  return (
    <article
      className={`
        group relative min-h-[270px] overflow-hidden
        rounded-[30px] border p-7 sm:p-8 lg:p-9
        ${pkg.cardClass}
      `}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full border-[28px] border-white/45" />
      <div className="pointer-events-none absolute -bottom-20 left-[30%] h-44 w-44 rounded-full border-[26px] border-white/35" />

      <div className="relative z-10 grid h-full grid-cols-1 items-center gap-5 sm:grid-cols-[1.15fr_.85fr]">
        <div>
          <div
            className="mb-5 h-[4px] w-[38px] rounded-full"
            style={{ backgroundColor: pkg.accent }}
          />

          <h3 className="text-[31px] font-bold tracking-[-0.035em] text-[#161B29]">
            {pkg.name}
          </h3>

          <p className="mt-3 max-w-[380px] text-[13.5px] leading-[1.75] text-[#5E697D]">
            {pkg.description}
          </p>

          <Link
            to={pkg.link}
            className="mt-7 inline-flex h-[47px] items-center gap-3 rounded-full bg-[#171D2B] pl-5 pr-2 text-[12.5px] font-semibold text-white transition duration-300 hover:bg-[#315FD8]"
          >
            Explore Package

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#171D2B]">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>

        {/* PRODUCT IMAGE */}
        <div className="relative flex min-h-[195px] items-center justify-center">
          <div
            className="absolute h-[150px] w-[150px] rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: pkg.accent }}
          />

          <img
            src={pkg.image}
            alt={`${pkg.name} learning package`}
            className="
              relative z-10 max-h-[225px] w-auto object-contain
              drop-shadow-[0_22px_24px_rgba(28,43,75,.15)]
              transition-transform duration-500
              group-hover:-translate-y-2 group-hover:rotate-[1deg]
            "
          />
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   VERTICAL PACKAGE
========================================================= */

function PackageVertical({ pkg }) {
  return (
    <article
      className={`
        group relative min-h-[565px] overflow-hidden
        rounded-[30px] border p-7 lg:p-8
        ${pkg.cardClass}
        ${pkg.featured
          ? "shadow-[0_18px_60px_rgba(117,85,232,.13)]"
          : ""
        }
      `}
    >
      {/* Accent decorations */}
      <div className="pointer-events-none absolute -right-[75px] -top-[70px] h-[210px] w-[210px] rounded-full border-[34px] border-white/50" />

      <div
        className="pointer-events-none absolute bottom-[-80px] left-[-60px] h-[210px] w-[210px] rounded-full opacity-[0.08]"
        style={{ backgroundColor: pkg.accent }}
      />

      <div className="relative z-10 flex h-full flex-col">
        <div>
          {pkg.featured && (
            <span className="mb-4 inline-flex rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7555E8]">
              Complete Track
            </span>
          )}

          <h3 className="text-[30px] font-bold tracking-[-0.035em] text-[#161B29]">
            {pkg.name}
          </h3>
        </div>

        {/* IMAGE AREA */}
        <div className="relative my-4 flex min-h-[280px] flex-1 items-center justify-center">
          <div
            className="absolute h-[180px] w-[180px] rounded-full opacity-[0.18] blur-3xl"
            style={{ backgroundColor: pkg.accent }}
          />

          <img
            src={pkg.image}
            alt={`${pkg.name} learning package`}
            className="
              relative z-10 max-h-[300px] w-auto object-contain
              drop-shadow-[0_25px_28px_rgba(23,29,43,.14)]
              transition-transform duration-500
              group-hover:-translate-y-2
            "
          />
        </div>

        <div>
          <p className="min-h-[67px] text-[13px] leading-[1.7] text-[#566176]">
            {pkg.description}
          </p>

          <Link
            to={pkg.link}
            className="mt-5 inline-flex h-[47px] items-center gap-3 rounded-full bg-[#171D2B] pl-5 pr-2 text-[12.5px] font-semibold text-white transition hover:bg-[#315FD8]"
          >
            Explore Package

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#171D2B]">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}