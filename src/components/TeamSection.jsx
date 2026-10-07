import React, { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

export default function ExpertsSection() {
  const scrollRef = useRef(null);

  const experts = [
    {
      name: "Aarav Mehta",
      role: "Digital Skills Mentor",
      image: "/images/experts/expert-1.png",
      description:
        "Helping learners understand practical digital skills through clear and structured learning.",
      accent: "#315FD8",
      bg: "#EEF3FF",
    },
    {
      name: "Riya Kapoor",
      role: "Creative Skills Mentor",
      image: "/images/experts/expert-2.png",
      description:
        "Focused on creative thinking, design fundamentals and building confidence through practice.",
      accent: "#7555E8",
      bg: "#F5F0FF",
    },
    {
      name: "Kabir Arora",
      role: "Development Mentor",
      image: "/images/experts/expert-3.png",
      description:
        "Making development concepts simpler with practical examples and step-by-step learning.",
      accent: "#EE7D42",
      bg: "#FFF4ED",
    },
    {
      name: "Meera Shah",
      role: "Business Learning Mentor",
      image: "/images/experts/expert-4.png",
      description:
        "Helping learners understand modern business ideas, growth thinking and digital opportunities.",
      accent: "#D99B1D",
      bg: "#FFF8E8",
    },
    {
      name: "Arjun Malhotra",
      role: "Career Skills Mentor",
      image: "/images/experts/expert-5.png",
      description:
        "Focused on practical career skills, structured learning and long-term confidence building.",
      accent: "#315FD8",
      bg: "#EEF7FF",
    },
  ];

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#FBFCFF] py-10 sm:py-12 lg:py-16">
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.48]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(91,111,150,.055) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(91,111,150,.055) 1px, transparent 1px)
          `,
          backgroundSize: "118px 118px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12">
        {/* ================= HEADER ================= */}
        <div className="mb-8 sm:mb-9 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-2">
              <Sparkles size={13} className="text-[#315FD8]" />

              <span className="text-[12px] font-semibold text-[#59667E]">
                Learn From Experienced Mentors
              </span>
            </div>

            <h2 className="text-[38px] font-bold leading-[1.08] tracking-[-0.045em] text-[#151B29] sm:text-[46px] lg:text-[54px]">
              Meet the people behind
              <span className="ml-3 inline-block rounded-[10px] bg-[#DDD1FF] px-3">
                better learning.
              </span>
            </h2>

            <p className="mt-4 max-w-[650px] text-[15px] leading-7 text-[#69758A]">
              Learn through guidance, practical experience and ideas shared by
              mentors across different digital skill areas.
            </p>
          </div>

          {/* scroll buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#DCE4F0] bg-white text-[#171D2B] transition-colors hover:border-[#035BE3] hover:text-[#035BE3] cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>

            <button
              onClick={() => scroll("right")}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[#035BE3] text-white transition-colors hover:bg-[#FA8C03] shadow-md shadow-[#035BE3]/20 cursor-pointer"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* ================= SCROLLER ================= */}
        <div
          ref={scrollRef}
          className="
            flex snap-x snap-mandatory gap-5
            overflow-x-auto pb-4
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {experts.map((expert, index) => (
            <article
              key={expert.name}
              className="
                group relative min-w-[300px] snap-start
                overflow-hidden rounded-[28px]
                border border-[#E1E7F0]
                bg-white
                sm:min-w-[340px]
                lg:min-w-[365px]
              "
            >
              {/* top image area */}
              <div
                className="relative h-[310px] overflow-hidden"
                style={{ backgroundColor: expert.bg }}
              >
                {/* number */}
                <span
                  className="absolute left-5 top-5 z-20 text-[11px] font-bold tracking-[0.12em]"
                  style={{ color: expert.accent }}
                >
                  0{index + 1}
                </span>

                {/* role pill */}
                <div className="absolute right-5 top-5 z-20 rounded-full border border-white/70 bg-white/80 px-3 py-1.5 backdrop-blur-md">
                  <span className="text-[10px] font-semibold text-[#59657A]">
                    Mentor
                  </span>
                </div>

                <img
                  src={expert.image}
                  alt={expert.name}
                  className="
                    absolute bottom-0 left-1/2
                    h-[92%] w-auto max-w-[95%]
                    -translate-x-1/2
                    object-contain
                    transition-transform duration-500
                    group-hover:scale-[1.035]
                  "
                />

                {/* bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent" />
              </div>

              {/* content */}
              <div className="p-6">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: expert.accent }}
                >
                  {expert.role}
                </span>

                <h3 className="mt-2 text-[23px] font-bold tracking-[-0.025em] text-[#171D2B]">
                  {expert.name}
                </h3>

                <p className="mt-3 min-h-[72px] text-[13px] leading-6 text-[#6B768A]">
                  {expert.description}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-[#EDF0F5] pt-5">
                  <button
                    className="inline-flex items-center gap-2 text-[12px] font-semibold"
                    style={{ color: expert.accent }}
                  >
                    View Profile
                    <ArrowUpRight size={14} />
                  </button>

                  <button
                    aria-label="LinkedIn Profile"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1E6EF] bg-[#FAFBFD] text-[#536078] transition hover:bg-[#171D2B] hover:text-white"
                  >
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 0 0-1.66 1.63 1.65 1.65 0 0 0 1.66 1.64c.9 0 1.64-.74 1.64-1.64a1.64 1.64 0 0 0-1.64-1.63" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* bottom accent */}
              <div
                className="absolute bottom-0 left-0 h-[3px] w-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                style={{
                  backgroundColor: expert.accent,
                  transformOrigin: "left",
                }}
              />
            </article>
          ))}
        </div>

        {/* ================= BOTTOM LINE ================= */}
        <div className="mt-7 flex items-center justify-between border-t border-[#E3E8F1] pt-5">
          <p className="text-[11px] text-[#8A94A6]">
            Drag or use arrows to explore mentors
          </p>

          <div className="hidden items-center gap-2 sm:flex">
            {experts.map((expert, index) => (
              <span
                key={index}
                className={`h-[4px] rounded-full ${index === 0 ? "w-8 bg-[#315FD8]" : "w-3 bg-[#DCE3EE]"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}