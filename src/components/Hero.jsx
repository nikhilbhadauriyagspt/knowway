import React from "react";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  ChartNoAxesCombined,
  Code2,
  Layers3,
  Palette,
  PenTool,
  Play,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

const SkillIcon = ({
  icon: Icon,
  className = "",
  iconClass = "",
  boxClass = "",
}) => {
  return (
    <div
      className={`
        absolute z-20 hidden
        h-[52px] w-[52px]
        xl:h-[64px] xl:w-[64px]
        items-center justify-center
        rounded-[14px] xl:rounded-[18px] border
        lg:flex
        shadow-xs transition-transform duration-300 hover:scale-110
        ${boxClass}
        ${className}
      `}
    >
      <Icon className={`${iconClass} w-5 h-5 xl:w-7 xl:h-7`} strokeWidth={1.7} />
    </div>
  );
};

export default function Hero() {
  return (
    <section className="relative isolate min-h-[560px] lg:min-h-[620px] xl:min-h-[660px] overflow-hidden bg-[#FBFCFF]">

      {/* =====================================================
          OPTIONAL FULL BACKGROUND PNG
      ====================================================== */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: "url('/hero-bg-art.png')",
        }}
      />

      {/* =====================================================
          GRID BACKGROUND
      ====================================================== */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(91,111,150,.075) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(91,111,150,.075) 1px, transparent 1px)
          `,
          backgroundSize: "118px 108px",
        }}
      />

      {/* White center fade */}
      <div
        className="
          pointer-events-none absolute inset-0 -z-[5]
          bg-[radial-gradient(circle_at_center,rgba(251,252,255,0.30)_0%,rgba(251,252,255,0.55)_47%,rgba(251,252,255,0.94)_100%)]
        "
      />

      {/* =====================================================
          BIG SOFT COLOR SHAPES (Visible on Laptops & Desktops)
      ====================================================== */}

      <div
        className="
          pointer-events-none absolute
          -left-[120px] top-[90px] xl:top-[110px]
          hidden h-[260px] w-[260px] xl:h-[330px] xl:w-[330px]
          rounded-full border-[50px] xl:border-[70px] border-[#EDF3FF]
          lg:block
        "
      />

      <div
        className="
          pointer-events-none absolute
          -right-[90px] bottom-[110px] xl:bottom-[130px]
          hidden h-[240px] w-[240px] xl:h-[300px] xl:w-[300px]
          rounded-full border-[45px] xl:border-[65px] border-[#F3EEFF]
          lg:block
        "
      />

      <div className="absolute left-[8%] xl:left-[9%] top-[16%] xl:top-[18%] hidden h-[10px] w-[10px] xl:h-[11px] xl:w-[11px] rounded-full bg-[#FF985D] lg:block" />
      <div className="absolute right-[10%] xl:right-[12%] top-[32%] xl:top-[34%] hidden h-[10px] w-[10px] xl:h-[12px] xl:w-[12px] rounded-full bg-[#6D5CE7] lg:block" />
      <div className="absolute bottom-[21%] xl:bottom-[23%] left-[17%] xl:left-[19%] hidden h-[9px] w-[9px] xl:h-[10px] xl:w-[10px] rounded-full bg-[#FFCE57] lg:block" />

      {/* =====================================================
          LEFT FLOATING ICONS
      ====================================================== */}

      <SkillIcon
        icon={BrainCircuit}
        className="left-[5%] xl:left-[7%] top-[12%] xl:top-[14%] -rotate-6"
        boxClass="border-[#D9E5FF] bg-[#EFF4FF]"
        iconClass="text-[#356AE6]"
      />

      <SkillIcon
        icon={PenTool}
        className="left-[14%] xl:left-[18%] top-[32%] xl:top-[34%] rotate-6"
        boxClass="border-[#FFE2CF] bg-[#FFF4EC]"
        iconClass="text-[#EE7D42]"
      />

      <SkillIcon
        icon={Palette}
        className="bottom-[18%] xl:bottom-[19%] left-[6%] xl:left-[9%] -rotate-6"
        boxClass="border-[#E8DEFF] bg-[#F5F0FF]"
        iconClass="text-[#7555E8]"
      />

      {/* =====================================================
          RIGHT FLOATING ICONS
      ====================================================== */}

      <SkillIcon
        icon={Code2}
        className="right-[15%] xl:right-[19%] top-[31%] xl:top-[33%] rotate-6"
        boxClass="border-[#D9E5FF] bg-[#EFF5FF]"
        iconClass="text-[#3970E8]"
      />

      <SkillIcon
        icon={Video}
        className="bottom-[17%] xl:bottom-[18%] right-[5%] xl:right-[8%] -rotate-6"
        boxClass="border-[#FFDCE6] bg-[#FFF1F5]"
        iconClass="text-[#E65C81]"
      />

      {/* =====================================================
          LEFT STAT WINDOW (Laptop & Desktop Friendly)
      ====================================================== */}

      <div
        className="
          absolute left-[1.5%] xl:left-[2.2%] top-[50%] z-10
          hidden w-[160px] xl:w-[185px]
          -translate-y-1/2 rotate-[2deg]
          overflow-hidden rounded-[18px] xl:rounded-[20px]
          border border-[#D7DEEE]
          bg-[#17233E]
          shadow-lg shadow-slate-900/10
          lg:block
        "
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 xl:px-5 py-3 xl:py-3.5">
          <span className="h-[6px] w-[6px] xl:h-[7px] xl:w-[7px] rounded-full bg-[#FF6F67]" />
          <span className="h-[6px] w-[6px] xl:h-[7px] xl:w-[7px] rounded-full bg-[#FFC658]" />
          <span className="h-[6px] w-[6px] xl:h-[7px] xl:w-[7px] rounded-full bg-[#70C7FF]" />
        </div>

        <div className="p-4 xl:p-5">
          <p className="text-[28px] xl:text-[34px] font-bold leading-none tracking-[-0.05em] text-white">
            80+
          </p>

          <p className="mt-2 text-[12px] xl:text-[13px] leading-[1.4] text-white/60">
            Guided topics
            <br />
            ready to explore
          </p>

          <div className="mt-5 xl:mt-7 flex items-end gap-[6px] xl:gap-[7px]">
            <span className="h-[20px] xl:h-[25px] w-[7px] xl:w-[8px] rounded-full bg-[#5267A0]" />
            <span className="h-[30px] xl:h-[36px] w-[7px] xl:w-[8px] rounded-full bg-[#6E83C0]" />
            <span className="h-[42px] xl:h-[50px] w-[7px] xl:w-[8px] rounded-full bg-[#7E65E5]" />
            <span className="h-[34px] xl:h-[40px] w-[7px] xl:w-[8px] rounded-full bg-[#F28A61]" />
            <span className="h-[52px] xl:h-[62px] w-[7px] xl:w-[8px] rounded-full bg-[#5480FF]" />
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT STAT WINDOW (Laptop & Desktop Friendly)
      ====================================================== */}

      <div
        className="
          absolute right-[1.5%] xl:right-[3.5%] top-[14%] xl:top-[16%] z-10
          hidden w-[160px] xl:w-[188px]
          -rotate-[2deg]
          overflow-hidden rounded-[18px] xl:rounded-[20px]
          border border-[#F0DEB4]
          bg-[#FFF4CF]
          shadow-lg shadow-amber-900/5
          lg:block
        "
      >
        <div className="flex items-center justify-between border-b border-[#EBD99F] px-4 xl:px-5 py-3 xl:py-3.5">
          <div className="flex gap-1.5">
            <span className="h-[6px] w-[6px] xl:h-[7px] xl:w-[7px] rounded-full bg-[#FC756D]" />
            <span className="h-[6px] w-[6px] xl:h-[7px] xl:w-[7px] rounded-full bg-[#F2B94B]" />
            <span className="h-[6px] w-[6px] xl:h-[7px] xl:w-[7px] rounded-full bg-[#7667DE]" />
          </div>

          <Sparkles size={14} className="text-[#8B6C19]" />
        </div>

        <div className="p-4 xl:p-5">
          <p className="text-[28px] xl:text-[32px] font-bold leading-none tracking-[-0.05em] text-[#25202D]">
            25k+
          </p>

          <p className="mt-2 text-[12px] xl:text-[13px] leading-[1.4] text-[#6B6049]">
            Curious learners
            <br />
            building new skills
          </p>

          <div className="mt-5 xl:mt-7 h-[2px] w-full bg-[#EAD999]">
            <div className="h-[2px] w-[68%] bg-[#7667DE]" />
          </div>

          <p className="mt-2 text-[9px] xl:text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8B7B56]">
            Growing weekly
          </p>
        </div>
      </div>

      {/* =====================================================
          SMALL FLOATING CONTENT CARD (Laptop + Desktop)
      ====================================================== */}

      <div
        className="
          absolute bottom-[18%] xl:bottom-[19%] right-[16%] xl:right-[20%] z-20
          hidden w-[165px] xl:w-[184px]
          rotate-[3deg]
          rounded-[16px] xl:rounded-[18px]
          border border-[#DDD9F9]
          bg-[#F6F3FF]
          p-3.5 xl:p-4
          shadow-md
          xl:block
        "
      >
        <div className="flex items-center gap-2.5 xl:gap-3">
          <div className="flex h-9 w-9 xl:h-10 xl:w-10 items-center justify-center rounded-[10px] xl:rounded-[12px] bg-[#7761DF] text-white shrink-0">
            <Layers3 size={17} />
          </div>

          <div>
            <p className="text-[11px] xl:text-[12px] font-bold text-[#252038]">
              New lessons
            </p>

            <p className="mt-0.5 text-[9px] xl:text-[10px] text-[#7D748E]">
              Added regularly
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT (Balanced for Laptop & Desktop Screens)
      ====================================================== */}

      <div
        className="
          relative z-30 mx-auto
          flex min-h-[560px] lg:min-h-[620px] xl:min-h-[660px]
          max-w-[1500px]
          flex-col items-center justify-center
          px-5 pb-10 pt-[90px]
          sm:pb-12 sm:pt-[95px]
          lg:pb-14 lg:pt-[105px]
          text-center
          sm:px-8
        "
      >
        {/* Badge */}
        <div
          className="
            mb-6 xl:mb-7 inline-flex items-center gap-2
            rounded-full border border-[#DCE5F5]
            bg-white px-4 py-[8px] xl:py-[9px]
            shadow-xs
          "
        >
          <span className="flex h-5 w-5 xl:h-6 xl:w-6 items-center justify-center rounded-full bg-[#EEF3FF]">
            <Sparkles size={12} className="text-[#416FE8]" />
          </span>

          <span className="text-[11px] xl:text-[12px] font-semibold tracking-[0.01em] text-[#526079]">
            Learn clearly. Build confidently.
          </span>
        </div>

        {/* =====================================================
            HEADING (Fluid Responsive Typography)
        ====================================================== */}

        <h1
          className="
            max-w-[760px] xl:max-w-[920px] 2xl:max-w-[990px]
            text-[38px] font-bold
            leading-[1.08] xl:leading-[1.045]
            tracking-[-0.045em] xl:tracking-[-0.052em]
            text-[#161B29]
            sm:text-[50px]
            lg:text-[56px]
            xl:text-[68px]
            2xl:text-[76px]
          "
        >
          Learn new skills.
          <br />

          <span className="mt-1.5 xl:mt-2 inline-flex flex-wrap items-center justify-center">
            Turn knowledge into

            <span className="relative ml-2.5 xl:ml-3 inline-flex px-2">
              <span className="relative z-10 text-[#25213B]">
                progress.
              </span>

              <span
                className="
                  absolute bottom-[2px] left-0 -z-0
                  h-[72%] w-full
                  rounded-[9px] xl:rounded-[11px]
                  bg-[#DCCFFF]
                "
              />
            </span>
          </span>
        </h1>

        {/* Description */}
        <p
          className="
            mt-5 xl:mt-7 max-w-[580px] xl:max-w-[680px]
            text-[15px] leading-[1.75] xl:text-[17px] xl:leading-[1.85]
            text-[#626B7C]
          "
        >
          Explore practical guides, useful lessons and simple learning paths
          made to help you understand ideas faster and use them with confidence.
        </p>

        {/* CTA Buttons */}
        <div className="mt-7 xl:mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            className="
              group flex h-[48px] xl:h-[52px] items-center justify-center gap-2
              rounded-full
              bg-[#035BE3]
              px-6 xl:px-7
              text-[13px] xl:text-[14px] font-semibold text-white
              transition-colors duration-200
              hover:bg-[#FA8C03]
              shadow-md shadow-[#035BE3]/20 cursor-pointer
            "
          >
            Explore Learning

            <ArrowUpRight
              size={16}
              className="
                transition-transform duration-200
                group-hover:-translate-y-[1px]
                group-hover:translate-x-[2px]
              "
            />
          </button>

          <button
            className="
              group flex h-[48px] xl:h-[52px] items-center justify-center gap-2
              rounded-full border border-[#DCE2ED]
              bg-white px-5 xl:px-6
              text-[13px] xl:text-[14px] font-semibold text-[#293246]
              transition-all duration-200
              hover:border-[#FA8C03] hover:text-[#FA8C03]
              shadow-xs cursor-pointer
            "
          >
            <span className="flex h-6 w-6 xl:h-7 xl:w-7 items-center justify-center rounded-full bg-[#FFF4E6] text-[#FA8C03] transition-colors group-hover:bg-[#FA8C03] group-hover:text-white">
              <Play size={10} fill="currentColor" />
            </span>

            Discover how it works
          </button>
        </div>

        {/* =====================================================
            CATEGORY PILLS
        ====================================================== */}

        <div className="mt-10 xl:mt-12 flex max-w-[760px] flex-wrap items-center justify-center gap-2 xl:gap-2.5">
          <div className="flex items-center gap-2 rounded-full border border-[#DCE6FB] bg-[#F4F7FF] px-3.5 xl:px-4 py-2 xl:py-2.5">
            <BrainCircuit size={14} className="text-[#3769DE]" />
            <span className="text-[11px] xl:text-[12px] font-semibold text-[#536078]">
              AI & Tools
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#E6DEFC] bg-[#F8F5FF] px-3.5 xl:px-4 py-2 xl:py-2.5">
            <Palette size={14} className="text-[#7559DC]" />
            <span className="text-[11px] xl:text-[12px] font-semibold text-[#536078]">
              Creative Skills
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#FFE2D1] bg-[#FFF7F2] px-3.5 xl:px-4 py-2 xl:py-2.5">
            <Code2 size={14} className="text-[#E2763F]" />
            <span className="text-[11px] xl:text-[12px] font-semibold text-[#536078]">
              Development
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#F2E1AD] bg-[#FFF9E8] px-3.5 xl:px-4 py-2 xl:py-2.5">
            <ChartNoAxesCombined size={14} className="text-[#B88415]" />
            <span className="text-[11px] xl:text-[12px] font-semibold text-[#536078]">
              Business
            </span>
          </div>
        </div>

        {/* =====================================================
            MOBILE / TABLET STATS (Hidden on Laptop & Desktop)
        ====================================================== */}

        <div className="mt-10 grid w-full max-w-[610px] grid-cols-2 gap-3 lg:hidden">
          <div className="rounded-[18px] border border-[#DCE3F0] bg-white p-5 text-left shadow-xs">
            <div className="flex items-center gap-2 text-[#3A68DA]">
              <BookOpen size={17} />
              <span className="text-[11px] font-semibold">
                Learning library
              </span>
            </div>

            <p className="mt-4 text-[27px] font-bold tracking-[-0.04em] text-[#171D2B]">
              80+
            </p>

            <p className="text-[11px] text-[#7A8393]">
              Guided topics
            </p>
          </div>

          <div className="rounded-[18px] border border-[#E2DCF5] bg-[#FAF8FF] p-5 text-left shadow-xs">
            <div className="flex items-center gap-2 text-[#735AD5]">
              <Users size={17} />
              <span className="text-[11px] font-semibold">
                Learning community
              </span>
            </div>

            <p className="mt-4 text-[27px] font-bold tracking-[-0.04em] text-[#171D2B]">
              25k+
            </p>

            <p className="text-[11px] text-[#7A8393]">
              Active learners
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}