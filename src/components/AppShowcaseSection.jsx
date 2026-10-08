import React from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  MessageCircleMore,
  BriefcaseBusiness,
} from "lucide-react";

export default function CreatorProgramSection() {
  const points = [
    "Get feedback on your work from mentors and peers.",
    "Understand why projects get shortlisted or improved.",
    "Take part in guided project-based activities.",
    "Build confidence through practical hands-on work.",
    "Access opportunities designed for active learners.",
  ];

  return (
    <section className="relative overflow-hidden bg-[#FBFCFF] py-10 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12">
        <div
          className="
            relative overflow-hidden rounded-[34px]
            border border-white/20
            bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,.24),_transparent_40%),linear-gradient(135deg,#035BE3_0%,#155DFC_48%,#023ea6_100%)]
            px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14
            shadow-[0_25px_80px_rgba(3,91,227,.30)]
          "
        >
          {/* subtle overlays */}
          <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-300/15 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-10 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            {/* LEFT CONTENT */}
            <div className="relative z-10 max-w-[680px]">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 backdrop-blur-md">
                <Sparkles size={13} className="text-white" />
                <span className="text-[12px] font-semibold tracking-[0.02em] text-white">
                  Creator Program
                </span>
              </div>

              <div className="max-w-[560px] rounded-[28px] border border-white/20 bg-white/10 p-6 sm:p-7 backdrop-blur-sm">
                <p className="text-[18px] leading-[1.5] text-blue-100 sm:text-[22px] font-medium">
                  Turn learning into
                </p>

                <h2 className="mt-2 text-[40px] font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-[52px] lg:text-[64px]">
                  Real Progress.
                </h2>

                <p className="mt-5 max-w-[500px] text-[14px] leading-7 text-blue-50 sm:text-[15px] font-medium">
                  Join a guided learning environment where you can build better
                  skills, stay consistent, practice with direction and move
                  closer to real digital opportunities.
                </p>
              </div>

              <ul className="mt-7 space-y-4">
                {points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-[14px] leading-7 text-white font-medium sm:text-[15px]"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-1 shrink-0 text-amber-300"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="/signup"
                  className="inline-flex h-[54px] items-center gap-3 rounded-full bg-[#FA8C03] px-6 pr-2 text-[13px] font-bold text-white transition-all duration-200 hover:bg-[#e07b02] shadow-xl shadow-black/20 cursor-pointer transform hover:-translate-y-0.5"
                >
                  Join Now
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#FA8C03]">
                    <ArrowUpRight size={16} />
                  </span>
                </a>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-3 text-[12px] font-semibold text-white backdrop-blur-md">
                  <BriefcaseBusiness size={14} className="text-amber-300" />
                  Practical Growth Experience
                </div>
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="relative z-10 flex min-h-[560px] items-center justify-center lg:justify-end">
              {/* back card glow */}
              <div className="absolute h-[420px] w-[420px] rounded-full bg-white/15 blur-3xl" />

              {/* back phone */}
              <PhoneMockup
                className="absolute right-2 top-0 hidden scale-[0.98] lg:block"
                title="Learning Circle"
                subtitle="Updates • Community • Wins"
                lines={[
                  "Great session today — very clear explanation.",
                  "Finished my first guided task this week. 🙌",
                  "This helped me stay more consistent.",
                  "The learning flow feels much easier now.",
                  "Really useful and practical experience.",
                ]}
                small
              />

              {/* front phone */}
              <PhoneMockup
                className="relative z-10 mt-16 lg:-left-10"
                title="Creator Program"
                subtitle="Active Learners Group"
                lines={[
                  "Loved the way the skill path was explained.",
                  "Finally started practicing with proper direction.",
                  "The activities made learning feel more real.",
                  "This is helping me build confidence step by step.",
                  "Clear structure, practical tasks, better focus.",
                  "A very motivating group experience overall.",
                ]}
              />

              {/* little info chips */}
              <div className="absolute bottom-6 left-0 hidden rounded-2xl border border-white/20 bg-white/20 px-4 py-3 backdrop-blur-md lg:flex lg:items-center lg:gap-3 shadow-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#035BE3]">
                  <MessageCircleMore size={18} />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-white">
                    Guided community vibe
                  </p>
                  <p className="text-[10px] text-blue-100 font-medium">
                    Interactive learning support
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* tiny bottom strip */}
          <div className="relative z-10 mt-10 border-t border-white/15 pt-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12px] font-semibold text-white/95">
                Learn better • Practice consistently • Progress with confidence
              </p>
              <p className="text-[11px] text-blue-100">
                KnowWay Guided Learning Platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneMockup({
  className = "",
  title,
  subtitle,
  lines = [],
  small = false,
}) {
  return (
    <div
      className={`
        relative rounded-[42px] border border-white/15 bg-[#0a0d10]
        p-[10px] shadow-[0_30px_80px_rgba(0,0,0,.5)]
        ${small ? "w-[250px]" : "w-[300px] sm:w-[320px]"}
        ${className}
      `}
    >
      {/* notch */}
      <div className="absolute left-1/2 top-[10px] h-[26px] w-[126px] -translate-x-1/2 rounded-full bg-black" />

      <div className="overflow-hidden rounded-[34px] bg-[#0b0f13]">
        {/* status */}
        <div className="flex items-center justify-between px-5 pt-5 text-[11px] text-white/90">
          <span>2:12</span>
          <span className="rounded-full bg-[#1b1f24] px-2 py-0.5 text-[10px]">
            19
          </span>
        </div>

        {/* header */}
        <div className="flex items-center gap-3 px-5 pb-4 pt-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#035BE3] text-white">
            <MessageCircleMore size={18} />
          </div>

          <div>
            <p className="text-[15px] font-semibold text-white">{title}</p>
            <p className="text-[11px] text-white/55">{subtitle}</p>
          </div>
        </div>

        {/* chat body */}
        <div className="space-y-3 bg-[#0b0f13] px-4 pb-6 pt-1">
          {lines.map((line, idx) => (
            <div
              key={idx}
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-[12px] leading-5 ${
                idx % 2 === 0
                  ? "bg-[#1a1f25] text-white/90"
                  : "ml-auto bg-[#155DFC]/30 border border-[#155DFC]/40 text-blue-100"
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}