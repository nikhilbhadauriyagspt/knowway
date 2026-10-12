import React from "react";
import {
  Sparkles,
  Layers3,
  BookOpen,
  PenTool,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Pick a Learning Path",
      description:
        "Choose a skill path that matches what you want to explore and start with a clear learning direction.",
      icon: Layers3,
      bg: "#EEF3FF",
      border: "#DCE6FA",
      accent: "#315FD8",
      badgeBg: "#315FD8",
    },
    {
      number: "02",
      title: "Understand the Skills",
      description:
        "Follow clear lessons and structured topics designed to make each concept easier to understand.",
      icon: BookOpen,
      bg: "#F6F1FF",
      border: "#E7DEFC",
      accent: "#7555E8",
      badgeBg: "#7555E8",
    },
    {
      number: "03",
      title: "Practice What You Learn",
      description:
        "Use guided activities and practical examples to turn new knowledge into skills you can apply.",
      icon: PenTool,
      bg: "#FFF5EE",
      border: "#F6DFD2",
      accent: "#EE7D42",
      badgeBg: "#EE7D42",
    },
    {
      number: "04",
      title: "Keep Moving Forward",
      description:
        "Build confidence, explore deeper topics and continue growing through the next stage of your learning journey.",
      icon: TrendingUp,
      bg: "#FFF9E9",
      border: "#F3E5BB",
      accent: "#D99B1D",
      badgeBg: "#D99B1D",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#FBFCFF] py-10 sm:py-12 lg:py-16"
    >
      {/* HERO STYLE GRID */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.52]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(91,111,150,.055) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(91,111,150,.055) 1px, transparent 1px)
          `,
          backgroundSize: "118px 118px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        {/* ================= HEADER ================= */}
        <div className="mb-8 sm:mb-12 max-w-[850px]">
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-3.5 sm:px-4 py-1.5 sm:py-2">
            <Sparkles size={13} className="text-[#315FD8]" />

            <span className="text-[11.5px] sm:text-[12px] font-semibold text-[#59667E]">
              How It Works
            </span>
          </div>

          <h2 className="text-[28px] xs:text-[32px] sm:text-[46px] lg:text-[55px] font-bold leading-[1.12] sm:leading-[1.08] tracking-[-0.04em] text-[#151B29]">
            Learn step by step.
            <br />

            <span className="mt-1.5 sm:mt-2 inline-block rounded-[10px] bg-[#DDD1FF] px-2.5 sm:px-3">
              Build as you progress.
            </span>
          </h2>

          <p className="mt-4 sm:mt-5 max-w-[760px] text-[14px] leading-6 sm:text-[16px] sm:leading-7 text-[#657188]">
            A simple learning journey designed to help you choose the right
            path, understand useful skills, practice them and keep progressing
            with confidence.
          </p>
        </div>

        {/* =====================================================
            DESKTOP ZIG ZAG JOURNEY
        ====================================================== */}
        <div className="relative hidden lg:block">
          {/* STEP 1 */}
          <div className="relative mb-[105px] flex justify-start">
            <StepCard step={steps[0]} />
          </div>

          {/* connector 1 */}
          <ConnectorOne />

          {/* STEP 2 */}
          <div className="relative mb-[105px] flex justify-end">
            <StepCard step={steps[1]} />
          </div>

          {/* connector 2 */}
          <ConnectorTwo />

          {/* STEP 3 */}
          <div className="relative mb-[105px] flex justify-start">
            <StepCard step={steps[2]} />
          </div>

          {/* connector 3 */}
          <ConnectorThree />

          {/* STEP 4 */}
          <div className="relative flex justify-end">
            <StepCard step={steps[3]} />
          </div>
        </div>

        {/* =====================================================
            TABLET / MOBILE
        ====================================================== */}
        <div className="grid grid-cols-1 gap-5 lg:hidden">
          {steps.map((step) => (
            <StepCard key={step.number} step={step} mobile />
          ))}
        </div>

        {/* ================= BOTTOM CTA ================= */}
        <div className="mt-14 flex flex-col gap-5 border-t border-[#E2E8F1] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[13px] font-bold text-[#171D2B]">
              Ready to start learning?
            </p>

            <p className="mt-1 text-[12px] text-[#7A8497]">
              Explore the learning paths and choose the one that fits your goals.
            </p>
          </div>

          <a
            href="/courses"
            className="inline-flex h-[48px] w-fit items-center gap-3 rounded-full bg-[#171D2B] pl-5 pr-2 text-[12.5px] font-semibold text-white transition hover:bg-[#315FD8]"
          >
            Explore Learning

            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#171D2B]">
              <ArrowUpRight size={14} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   STEP CARD
============================================================ */

function StepCard({ step, mobile = false }) {
  const Icon = step.icon;

  return (
    <article
      className={`
        group relative overflow-hidden
        border
        ${mobile ? "w-full" : "w-[620px] xl:w-[660px]"}
        rounded-[24px] sm:rounded-[30px]
        px-5 py-6 sm:px-9 sm:py-9
        transition-transform duration-300
        hover:-translate-y-1
      `}
      style={{
        backgroundColor: step.bg,
        borderColor: step.border,
      }}
    >
      {/* STEP BADGE */}
      <div
        className="
          absolute left-0 top-0
          flex h-full w-[60px] sm:w-[82px]
          items-center justify-center
        "
      >
        <div
          className="
            flex h-[150px] sm:h-[185px] w-[40px] sm:w-[52px]
            items-center justify-center
            rounded-full
            text-white
          "
          style={{ backgroundColor: step.badgeBg }}
        >
          <span className="-rotate-90 whitespace-nowrap text-[11px] sm:text-[12px] font-bold tracking-[0.08em]">
            STEP {step.number}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="pl-[52px] sm:pl-[82px]">
        <div className="flex items-start gap-3 sm:gap-4">
          <div
            className="
              flex h-[42px] sm:h-[48px] w-[42px] sm:w-[48px] shrink-0
              items-center justify-center
              rounded-[12px] sm:rounded-[15px]
              bg-white
            "
            style={{ color: step.accent }}
          >
            <Icon size={19} strokeWidth={1.9} />
          </div>

          <div>
            <span
              className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.15em]"
              style={{ color: step.accent }}
            >
              Learning Stage
            </span>

            <h3 className="mt-0.5 sm:mt-1 text-[20px] sm:text-[26px] font-bold tracking-[-0.025em] text-[#171D2B]">
              {step.title}
            </h3>
          </div>
        </div>

        <p className="mt-4 sm:mt-7 max-w-[470px] text-[13px] sm:text-[14px] leading-[1.65] sm:leading-[1.8] text-[#5F6B80]">
          {step.description}
        </p>

        {/* bottom accent */}
        <div className="mt-7 flex items-center gap-2">
          <span
            className="h-[4px] w-[35px] rounded-full"
            style={{ backgroundColor: step.accent }}
          />
          <span className="h-[4px] w-[12px] rounded-full bg-white" />
          <span className="h-[4px] w-[7px] rounded-full bg-white" />
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   CONNECTOR 1 — LEFT TO RIGHT
============================================================ */

function ConnectorOne() {
  return (
    <svg
      className="
        pointer-events-none
        absolute
        left-[37%]
        top-[245px]
        h-[160px]
        w-[39%]
        overflow-visible
      "
      viewBox="0 0 500 170"
      fill="none"
    >
      <path
        d="M5 8 H340
           C405 8 430 32 430 87
           V145"
        stroke="#C9D1DE"
        strokeWidth="2"
        strokeDasharray="7 8"
        strokeLinecap="round"
      />

      <path
        d="M422 137 L430 148 L438 137"
        stroke="#C9D1DE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   CONNECTOR 2 — RIGHT TO LEFT
============================================================ */

function ConnectorTwo() {
  return (
    <svg
      className="
        pointer-events-none
        absolute
        right-[37%]
        top-[610px]
        h-[160px]
        w-[39%]
        overflow-visible
      "
      viewBox="0 0 500 170"
      fill="none"
    >
      <path
        d="M495 8 H160
           C95 8 70 32 70 87
           V145"
        stroke="#C9D1DE"
        strokeWidth="2"
        strokeDasharray="7 8"
        strokeLinecap="round"
      />

      <path
        d="M62 137 L70 148 L78 137"
        stroke="#C9D1DE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   CONNECTOR 3 — LEFT TO RIGHT
============================================================ */

function ConnectorThree() {
  return (
    <svg
      className="
        pointer-events-none
        absolute
        left-[37%]
        top-[975px]
        h-[160px]
        w-[39%]
        overflow-visible
      "
      viewBox="0 0 500 170"
      fill="none"
    >
      <path
        d="M5 8 H340
           C405 8 430 32 430 87
           V145"
        stroke="#C9D1DE"
        strokeWidth="2"
        strokeDasharray="7 8"
        strokeLinecap="round"
      />

      <path
        d="M422 137 L430 148 L438 137"
        stroke="#C9D1DE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}