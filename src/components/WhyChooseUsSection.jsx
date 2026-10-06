import React from "react";
import {
  Sparkles,
  BookOpen,
  Users,
  Layers3,
  Play,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

export default function WhyUsSection() {
  return (
    <section className="relative overflow-hidden bg-[#FBFCFF] py-20 lg:py-28">
      {/* HERO STYLE GRID */}
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
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-2">
              <Sparkles size={13} className="text-[#315FD8]" />

              <span className="text-[12px] font-semibold text-[#59667E]">
                Why LearnSpace
              </span>
            </div>

            <h2 className="text-[40px] font-bold leading-[1.05] tracking-[-0.045em] text-[#151B29] sm:text-[48px] lg:text-[56px]">
              Built for people who
              <span className="ml-3 inline-block rounded-[10px] bg-[#DDD1FF] px-3">
                want to grow.
              </span>
            </h2>

            <p className="mt-4 max-w-[650px] text-[15px] leading-7 text-[#677289]">
              Clear learning paths, practical topics and a flexible experience
              designed to make building new skills feel simpler.
            </p>
          </div>

          {/* small top stat */}
          <div className="flex items-center gap-3 rounded-full border border-[#E1E7F0] bg-white px-5 py-3">
            <div className="flex -space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#315FD8] text-white">
                <BookOpen size={13} />
              </span>

              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#7555E8] text-white">
                <Users size={13} />
              </span>

              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#EE7D42] text-white">
                <Layers3 size={13} />
              </span>
            </div>

            <div>
              <p className="text-[17px] font-bold text-[#171D2B]">
                Learn. Practice. Grow.
              </p>
            </div>
          </div>
        </div>

        {/* ================= MAIN CARDS ================= */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_.95fr]">
          {/* =====================================================
              CARD 1
          ====================================================== */}
          <div className="relative min-h-[390px] overflow-hidden rounded-[32px] border border-[#DCE5F4] bg-[#EEF3FF] p-7 sm:p-9 lg:p-10">
            <div className="relative z-10 grid h-full grid-cols-1 gap-10 md:grid-cols-[.8fr_1.2fr] md:items-center">
              {/* LEFT STATS */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#315FD8]">
                  Learning Library
                </span>

                <div className="mt-8">
                  <p className="text-[52px] font-bold leading-none tracking-[-0.05em] text-[#161B29]">
                    80+
                  </p>

                  <p className="mt-2 text-[13px] font-medium text-[#68748A]">
                    Guided learning topics
                  </p>
                </div>

                <div className="my-7 h-px w-full max-w-[180px] bg-[#D6E0F3]" />

                <div>
                  <p className="text-[52px] font-bold leading-none tracking-[-0.05em] text-[#161B29]">
                    4
                  </p>

                  <p className="mt-2 text-[13px] font-medium text-[#68748A]">
                    Focused learning paths
                  </p>
                </div>
              </div>

              {/* RIGHT VISUAL */}
              <div className="relative flex min-h-[270px] items-center justify-center">
                {/* central node */}
                <div className="relative z-10 flex h-[110px] w-[110px] items-center justify-center rounded-[30px] border border-[#CAD8F3] bg-white shadow-[0_18px_45px_rgba(49,95,216,.10)]">
                  <div className="flex h-[62px] w-[62px] items-center justify-center rounded-[20px] bg-[#315FD8] text-white">
                    <Users size={27} />
                  </div>
                </div>

                {/* connector lines */}
                <span className="absolute left-[22%] top-[28%] h-px w-[24%] rotate-[18deg] bg-[#B6C9EE]" />
                <span className="absolute right-[20%] top-[30%] h-px w-[25%] -rotate-[17deg] bg-[#B6C9EE]" />
                <span className="absolute bottom-[24%] left-[24%] h-px w-[23%] -rotate-[20deg] bg-[#B6C9EE]" />
                <span className="absolute bottom-[24%] right-[23%] h-px w-[23%] rotate-[20deg] bg-[#B6C9EE]" />

                <Node
                  className="left-[10%] top-[8%]"
                  icon={<BookOpen size={18} />}
                  bg="#FFFFFF"
                  color="#315FD8"
                />

                <Node
                  className="right-[8%] top-[10%]"
                  icon={<Sparkles size={18} />}
                  bg="#FFFFFF"
                  color="#7555E8"
                />

                <Node
                  className="bottom-[4%] left-[14%]"
                  icon={<Play size={18} />}
                  bg="#FFFFFF"
                  color="#EE7D42"
                />

                <Node
                  className="bottom-[3%] right-[12%]"
                  icon={<CheckCircle2 size={18} />}
                  bg="#FFFFFF"
                  color="#D99B1D"
                />

                <div className="absolute right-[4%] top-[45%] rounded-full bg-[#315FD8] px-3 py-1.5 text-[10px] font-bold text-white">
                  Structured
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              CARD 2
          ====================================================== */}
          <div className="relative min-h-[390px] overflow-hidden rounded-[32px] border border-[#E4DDF8] bg-[#F4F0FF] p-7 sm:p-9 lg:p-10">
            <div className="relative z-10 max-w-[430px]">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#7555E8]">
                Learn Without Limits
              </span>

              <h3 className="mt-4 text-[34px] font-bold leading-[1.05] tracking-[-0.04em] text-[#171D2B] sm:text-[40px]">
                Your learning,
                <br />
                your pace,
                <br />
                your progress.
              </h3>

              <p className="mt-5 max-w-[390px] text-[13px] leading-6 text-[#677289]">
                Explore lessons when it works for you, revisit useful topics and
                continue learning across a growing library of digital skills.
              </p>
            </div>

            {/* visual device */}
            <div className="absolute -bottom-[76px] right-[-15px] hidden h-[340px] w-[235px] rotate-[3deg] rounded-[42px] border-[8px] border-[#171A22] bg-white shadow-[0_25px_60px_rgba(48,45,80,.17)] sm:block">
              {/* phone notch */}
              <div className="absolute left-1/2 top-[9px] h-[22px] w-[90px] -translate-x-1/2 rounded-full bg-[#171A22]" />

              <div className="px-4 pt-14">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[8px] text-[#8A94A6]">
                      Welcome back
                    </p>

                    <p className="text-[12px] font-bold text-[#171D2B]">
                      Keep learning
                    </p>
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF3FF] text-[#315FD8]">
                    <BookOpen size={13} />
                  </div>
                </div>

                <div className="mt-5 rounded-[16px] bg-[#EEF3FF] p-3">
                  <div className="flex h-[78px] items-center justify-center rounded-[12px] bg-[#315FD8] text-white">
                    <Play size={24} fill="currentColor" />
                  </div>

                  <p className="mt-3 text-[10px] font-bold text-[#171D2B]">
                    Continue your lesson
                  </p>

                  <div className="mt-2 h-[4px] rounded-full bg-white">
                    <div className="h-full w-[65%] rounded-full bg-[#315FD8]" />
                  </div>
                </div>

                <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8A94A6]">
                  Explore
                </p>

                <div className="mt-2 grid grid-cols-2 gap-2">
                  <MiniBox color="#315FD8" />
                  <MiniBox color="#7555E8" />
                  <MiniBox color="#EE7D42" />
                  <MiniBox color="#D99B1D" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM BIG STATEMENT
        ====================================================== */}
        <div className="mx-auto mt-20 max-w-[1050px] text-center">
          <p className="text-[34px] font-medium leading-[1.18] tracking-[-0.035em] text-[#303746] sm:text-[46px] lg:text-[56px]">
            Made for curious learners
            <span className="mx-2 inline-flex align-middle text-[#315FD8]">
              ✦
            </span>
            who want to turn
            <span className="mx-2 inline-flex rounded-[10px] bg-[#DDD1FF] px-2">
              knowledge
            </span>
            into useful skills and
            <span className="mx-2 text-[#315FD8]">real progress.</span>
          </p>
        </div>

        {/* SMALL CTA */}
        <div className="mt-10 flex justify-center">
          <a
            href="/courses"
            className="inline-flex h-[50px] items-center gap-3 rounded-full bg-[#171D2B] pl-6 pr-2 text-[13px] font-semibold text-white transition hover:bg-[#315FD8]"
          >
            Start Exploring

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#171D2B]">
              <ArrowUpRight size={15} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Node({ className, icon, bg, color }) {
  return (
    <div
      className={`absolute flex h-[58px] w-[58px] items-center justify-center rounded-[18px] border border-[#DDE5F3] shadow-[0_10px_25px_rgba(30,52,90,.07)] ${className}`}
      style={{
        backgroundColor: bg,
        color,
      }}
    >
      {icon}
    </div>
  );
}

function MiniBox({ color }) {
  return (
    <div className="rounded-[9px] border border-[#EBEEF4] bg-[#FAFBFD] p-2">
      <div
        className="h-[4px] w-7 rounded-full"
        style={{ backgroundColor: color }}
      />

      <div className="mt-2 h-[3px] w-full rounded-full bg-[#E8ECF2]" />
      <div className="mt-1 h-[3px] w-[70%] rounded-full bg-[#E8ECF2]" />
    </div>
  );
}