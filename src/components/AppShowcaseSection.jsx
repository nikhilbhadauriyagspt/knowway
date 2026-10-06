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
    <section className="relative overflow-hidden bg-[#FBFCFF] py-20 lg:py-24">
      <div className="mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12">
        <div
          className="
            relative overflow-hidden rounded-[34px]
            border border-[#0f5c53]/30
            bg-[radial-gradient(circle_at_top_left,_rgba(20,122,104,.28),_transparent_34%),linear-gradient(135deg,#042f2b_0%,#053a33_45%,#06483f_100%)]
            px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14
            shadow-[0_25px_80px_rgba(4,48,43,.18)]
          "
        >
          {/* subtle overlays */}
          <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#0d8a76]/10 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#11b89b]/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-10 h-52 w-52 rounded-full bg-[#ffffff08] blur-3xl" />

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            {/* LEFT CONTENT */}
            <div className="relative z-10 max-w-[680px]">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
                <Sparkles size={13} className="text-[#7FE8D4]" />
                <span className="text-[12px] font-semibold tracking-[0.02em] text-[#D9F5EE]">
                  Creator Program
                </span>
              </div>

              <div className="max-w-[560px] rounded-[28px] border border-white/8 bg-white/[0.03] p-6 sm:p-7">
                <p className="text-[18px] leading-[1.5] text-white sm:text-[22px]">
                  Turn learning into
                </p>

                <h2 className="mt-2 text-[40px] font-bold leading-[1.05] tracking-[-0.04em] text-white sm:text-[52px] lg:text-[64px]">
                  Real Progress.
                </h2>

                <p className="mt-5 max-w-[500px] text-[14px] leading-7 text-[#D0E8E2] sm:text-[15px]">
                  Join a guided learning environment where you can build better
                  skills, stay consistent, practice with direction and move
                  closer to real digital opportunities.
                </p>
              </div>

              <ul className="mt-7 space-y-4">
                {points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-[14px] leading-7 text-white/95 sm:text-[15px]"
                  >
                    <CheckCircle2
                      size={18}
                      className="mt-1 shrink-0 text-[#7FE8D4]"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="/creator-program"
                  className="inline-flex h-[54px] items-center gap-3 rounded-full bg-white px-5 pr-2 text-[13px] font-semibold text-[#083B34] transition hover:bg-[#ecfffa]"
                >
                  Join Now
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A6A5A] text-white">
                    <ArrowUpRight size={16} />
                  </span>
                </a>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-[12px] font-medium text-[#D7EEE8]">
                  <BriefcaseBusiness size={14} className="text-[#7FE8D4]" />
                  Practical Growth Experience
                </div>
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="relative z-10 flex min-h-[560px] items-center justify-center lg:justify-end">
              {/* back card glow */}
              <div className="absolute h-[420px] w-[420px] rounded-full bg-[#0ea58f]/10 blur-3xl" />

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
              <div className="absolute bottom-6 left-0 hidden rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-md lg:flex lg:items-center lg:gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0e7b68] text-white">
                  <MessageCircleMore size={18} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white">
                    Guided community vibe
                  </p>
                  <p className="text-[10px] text-[#D0E8E2]">
                    Interactive learning support
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* tiny bottom strip */}
          <div className="relative z-10 mt-10 border-t border-white/8 pt-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[12px] font-medium text-[#D4ECE5]">
                Learn better • Practice consistently • Progress with confidence
              </p>
              <p className="text-[11px] text-[#A9CFC6]">
                Use this section before “How It Works”
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
        relative rounded-[42px] border border-white/10 bg-[#0a0d10]
        p-[10px] shadow-[0_30px_80px_rgba(0,0,0,.45)]
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f6d5f] text-white">
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
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-[12px] leading-5 ${idx % 2 === 0
                ? "bg-[#1a1f25] text-white/90"
                : "ml-auto bg-[#202830] text-white/90"
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