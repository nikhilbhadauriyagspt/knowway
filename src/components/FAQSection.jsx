import React, { useState } from "react";
import {
  Sparkles,
  Plus,
  Minus,
  BookOpen,
  Palette,
  Code2,
  BarChart3,
  Video,
  BriefcaseBusiness,
  BrainCircuit,
} from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How do I start learning after choosing a package?",
      answer:
        "Once you choose a learning package, you can begin exploring the included courses and follow the lessons in a structured sequence at your own pace.",
    },
    {
      question: "Do I need previous experience to start?",
      answer:
        "No. Many learning paths are designed to begin with foundational concepts before moving into more detailed and practical topics.",
    },
    {
      question: "Can I learn while working or studying?",
      answer:
        "Yes. The learning experience is designed to be flexible, so you can continue lessons whenever your schedule allows.",
    },
    {
      question: "What kind of skills can I explore?",
      answer:
        "You can explore areas such as digital tools, creative skills, development, business, content creation and other practical learning topics.",
    },
    {
      question: "Can I move to another learning package later?",
      answer:
        "You can explore additional learning paths whenever you want to expand into more topics and continue building your knowledge.",
    },
  ];

  const nodes = [
    {
      icon: BookOpen,
      className: "left-[5%] top-[18%]",
      bg: "#EEF3FF",
      color: "#315FD8",
    },
    {
      icon: Palette,
      className: "left-[30%] top-[6%]",
      bg: "#F4EFFF",
      color: "#7555E8",
    },
    {
      icon: Code2,
      className: "left-[55%] top-[26%]",
      bg: "#FFF1EA",
      color: "#EE7D42",
    },
    {
      icon: BarChart3,
      className: "left-[18%] top-[55%]",
      bg: "#FFF8E8",
      color: "#D99B1D",
    },
    {
      icon: Video,
      className: "left-[50%] top-[62%]",
      bg: "#F4EFFF",
      color: "#7555E8",
    },
    {
      icon: BriefcaseBusiness,
      className: "left-[72%] top-[46%]",
      bg: "#EEF3FF",
      color: "#315FD8",
    },
    {
      icon: BrainCircuit,
      className: "left-[72%] top-[8%]",
      bg: "#EEF7FF",
      color: "#315FD8",
    },
  ];

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#FBFCFF] py-10 sm:py-12 lg:py-16"
    >
      {/* subtle hero grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(91,111,150,.055) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(91,111,150,.055) 1px, transparent 1px)
          `,
          backgroundSize: "118px 118px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">

          {/* =====================================================
              LEFT SIDE
          ====================================================== */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCE5F5] bg-white px-4 py-2">
              <Sparkles size={13} className="text-[#315FD8]" />
              <span className="text-[12px] font-semibold text-[#59667E]">
                Frequently Asked Questions
              </span>
            </div>

            <h2 className="mt-5 max-w-[620px] text-[40px] font-bold leading-[1.06] tracking-[-0.045em] text-[#151B29] sm:text-[48px] lg:text-[56px]">
              Questions before
              <br />
              <span className="mt-2 inline-block rounded-[10px] bg-[#DDD1FF] px-3">
                you start?
              </span>
            </h2>

            <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[#68748A]">
              Find quick answers about learning paths, packages and how the
              learning experience works.
            </p>

            {/* VISUAL NETWORK */}
            <div className="relative mt-12 hidden h-[370px] max-w-[620px] sm:block">

              {/* connecting lines */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 620 370"
                fill="none"
              >
                <path
                  d="M70 105 L205 55 L350 130 L465 55"
                  stroke="#D9E1EF"
                  strokeWidth="1.5"
                />

                <path
                  d="M70 105 L145 230 L330 250 L470 190"
                  stroke="#D9E1EF"
                  strokeWidth="1.5"
                />

                <path
                  d="M350 130 L330 250"
                  stroke="#D9E1EF"
                  strokeWidth="1.5"
                />

                <path
                  d="M465 55 L470 190"
                  stroke="#D9E1EF"
                  strokeWidth="1.5"
                />

                <path
                  d="M330 250 L505 300"
                  stroke="#D9E1EF"
                  strokeWidth="1.5"
                />

                <circle cx="70" cy="105" r="3" fill="#315FD8" />
                <circle cx="205" cy="55" r="3" fill="#7555E8" />
                <circle cx="350" cy="130" r="3" fill="#EE7D42" />
                <circle cx="145" cy="230" r="3" fill="#D99B1D" />
                <circle cx="330" cy="250" r="3" fill="#7555E8" />
                <circle cx="470" cy="190" r="3" fill="#315FD8" />
              </svg>

              {nodes.map((node, index) => {
                const Icon = node.icon;

                return (
                  <div
                    key={index}
                    className={`absolute flex h-[76px] w-[76px] items-center justify-center rounded-[24px] border border-white bg-white shadow-[0_15px_40px_rgba(28,45,78,.08)] ${node.className}`}
                  >
                    <div
                      className="flex h-[46px] w-[46px] items-center justify-center rounded-[15px]"
                      style={{
                        backgroundColor: node.bg,
                        color: node.color,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* bottom small info */}
            <div className="mt-8 inline-flex items-center gap-3 border-t border-[#E4E9F1] pt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF3FF] text-[#315FD8]">
                <BookOpen size={16} />
              </div>

              <div>
                <p className="text-[12px] font-semibold text-[#171D2B]">
                  Still exploring?
                </p>

                <p className="text-[11px] text-[#8A94A6]">
                  Browse the learning paths and choose what fits you.
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT FAQ ACCORDION
          ====================================================== */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className={`
                    overflow-hidden rounded-[24px] border transition-all duration-300
                    ${isOpen
                      ? "border-[#D6E1F5] bg-white"
                      : "border-transparent bg-[#F1F5FB]"
                    }
                  `}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="
                      flex w-full items-center justify-between
                      gap-5 px-6 py-6 text-left
                      sm:px-7 sm:py-7
                    "
                  >
                    <span
                      className={`
                        text-[15px] font-bold leading-6
                        sm:text-[16px]
                        ${isOpen ? "text-[#171D2B]" : "text-[#283247]"}
                      `}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={`
                        flex h-9 w-9 shrink-0 items-center justify-center
                        rounded-full transition-colors
                        ${isOpen
                          ? "bg-[#035BE3] text-white shadow-sm shadow-[#035BE3]/25"
                          : "bg-white text-[#536078] group-hover:text-[#FA8C03]"
                        }
                      `}
                    >
                      {isOpen ? (
                        <Minus size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </span>
                  </button>

                  <div
                    className={`
                      grid transition-all duration-300
                      ${isOpen
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                      }
                    `}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[#EEF1F6] px-6 pb-7 pt-5 sm:px-7">
                        <p className="max-w-[680px] text-[13.5px] leading-7 text-[#6B768A]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}