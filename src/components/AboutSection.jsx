import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Lightbulb,
  Target,
} from "lucide-react";

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-[#FBFCFF] py-20 lg:py-28 border-b border-[#E5EBF4]">

      {/* =========================================
          SAME SOFT GRID AS HERO
      ========================================== */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(91,111,150,.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(91,111,150,.06) 1px, transparent 1px)
          `,
          backgroundSize: "118px 118px",
        }}
      />

      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-[160px] top-[90px] h-[330px] w-[330px] rounded-full border-[52px] border-[#EAF0FF]" />

      <div className="pointer-events-none absolute -right-[150px] bottom-[30px] h-[330px] w-[330px] rounded-full border-[52px] border-[#F0E9FF]" />

      <div className="relative z-10 mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12">

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">

          {/* =====================================================
              LEFT IMAGE (FULL TO THE LEFT)
          ====================================================== */}
          <div className="relative flex min-h-[440px] items-center justify-start lg:min-h-[580px] lg:col-span-6 lg:-ml-4 xl:-ml-8">

            {/* Big blue soft circle */}
            <div
              className="
                pointer-events-none
                absolute left-0 top-[4%]
                h-[380px] w-[380px]
                rounded-full
                bg-[#EDF3FF]
                sm:h-[480px] sm:w-[480px]
                lg:h-[540px] lg:w-[540px]
              "
            />

            {/* Purple shape */}
            <div
              className="
                pointer-events-none
                absolute bottom-[4%] left-[40%]
                h-[220px] w-[220px]
                rounded-full
                border-[38px] border-[#E9DFFF]
                sm:h-[280px] sm:w-[280px]
              "
            />

            {/* smaller yellow circle */}
            <div className="pointer-events-none absolute left-[10%] top-[16%] h-4 w-4 rounded-full bg-[#F5C84C]" />

            {/* blue dot */}
            <div className="pointer-events-none absolute bottom-[18%] left-[70%] h-3 w-3 rounded-full bg-[#315FD8]" />

            {/* Main transparent image full left */}
            <img
              src="/images/about/about-learning.png"
              alt="People learning together"
              className="
                relative z-10
                w-full
                max-w-[650px]
                object-contain
                drop-shadow-[0_28px_40px_rgba(32,52,96,.12)]
              "
            />
          </div>


          {/* =====================================================
              RIGHT CONTENT
          ====================================================== */}
          <div className="lg:col-span-6 max-w-[680px]">

            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-2">
              <Sparkles size={13} className="text-[#315FD8]" />

              <span className="text-[12px] font-semibold text-[#59667E]">
                About LearnSpace
              </span>
            </div>


            {/* Heading */}
            <h2
              className="
                text-[38px]
                font-bold
                leading-[1.08]
                tracking-[-0.045em]
                text-[#151B29]
                sm:text-[46px]
                lg:text-[54px]
              "
            >
              Learning made simple.
              <br />

              <span className="mt-2 inline-block rounded-[10px] bg-[#DDD1FF] px-3 text-[#151B29]">
                Skills made useful.
              </span>
            </h2>


            {/* Description */}
            <p className="mt-6 max-w-[620px] text-[15px] leading-7 text-[#606C82] sm:text-[16px]">
              We make digital learning easier to understand through clear
              lessons, practical ideas and structured learning paths designed
              for modern learners.
            </p>

            <p className="mt-4 max-w-[610px] text-[14px] leading-7 text-[#7A8497]">
              From exploring new topics to developing practical skills,
              LearnSpace gives you a simple place to learn, practice and
              continue progressing with confidence.
            </p>


            {/* =====================================
                3 SMALL INFO CARDS
            ====================================== */}
            <div className="mt-8 grid grid-cols-3 gap-3.5">

              {/* Card 1 */}
              <div className="rounded-[20px] border border-[#DDE6FA] bg-[#EEF3FF] p-4 sm:p-5 transition-transform duration-200 hover:-translate-y-1">

                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[11px] bg-white text-[#315FD8] shadow-2xs">
                  <BookOpen size={17} />
                </div>

                <p className="text-[17px] font-bold text-[#171D2B] sm:text-[20px]">
                  Learn
                </p>

                <p className="mt-1 text-[10.5px] leading-4 text-[#788397] sm:text-[11.5px]">
                  Clear lessons
                </p>

              </div>


              {/* Card 2 */}
              <div className="rounded-[20px] border border-[#E6DDFB] bg-[#F6F1FF] p-4 sm:p-5 transition-transform duration-200 hover:-translate-y-1">

                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[11px] bg-white text-[#7555E8] shadow-2xs">
                  <Lightbulb size={17} />
                </div>

                <p className="text-[17px] font-bold text-[#171D2B] sm:text-[20px]">
                  Practice
                </p>

                <p className="mt-1 text-[10.5px] leading-4 text-[#788397] sm:text-[11.5px]">
                  Useful ideas
                </p>

              </div>


              {/* Card 3 */}
              <div className="rounded-[20px] border border-[#F3E3BD] bg-[#FFF8E9] p-4 sm:p-5 transition-transform duration-200 hover:-translate-y-1">

                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-[11px] bg-white text-[#D99B1D] shadow-2xs">
                  <Target size={17} />
                </div>

                <p className="text-[17px] font-bold text-[#171D2B] sm:text-[20px]">
                  Grow
                </p>

                <p className="mt-1 text-[10.5px] leading-4 text-[#788397] sm:text-[11.5px]">
                  Build confidence
                </p>

              </div>

            </div>


            {/* =====================================
                BUTTON
            ====================================== */}
            <a
              href="/signup"
              className="
                mt-8 inline-flex h-[50px]
                items-center gap-3
                rounded-full
                bg-[#315FD8]
                pl-6 pr-2
                text-[13px] font-semibold text-white
                transition duration-200
                hover:bg-[#264FBC] cursor-pointer
              "
            >
              Learn More About Us

              <span
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-full
                  bg-white
                  text-[#171D2B]
                "
              >
                <ArrowUpRight size={15} />
              </span>
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}