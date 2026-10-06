import React from "react";
import {
  Sparkles,
  TrendingUp,
  Video,
  Code2,
  Palette,
  BrainCircuit,
  MessageSquare,
  DollarSign,
  Briefcase,
  GraduationCap,
} from "lucide-react";

export default function MarqueeSection() {
  const learningTopics = [
    { title: "Digital Marketing Mastery", icon: TrendingUp, color: "text-[#356AE6]" },
    { title: "Professional Video Editing", icon: Video, color: "text-[#E65C81]" },
    { title: "Web & Software Development", icon: Code2, color: "text-[#3970E8]" },
    { title: "Graphic Design & Canva", icon: Palette, color: "text-[#7555E8]" },
    { title: "Artificial Intelligence Tools", icon: BrainCircuit, color: "text-[#315FD8]" },
    { title: "Spoken English & Communication", icon: MessageSquare, color: "text-[#059669]" },
    { title: "Stock Market & Trading Basics", icon: DollarSign, color: "text-[#B88415]" },
    { title: "Freelancing & Client Closing", icon: Briefcase, color: "text-[#EE7D42]" },
  ];

  // Repeat for a continuous seamless stream
  const marqueeList = [...learningTopics, ...learningTopics];

  return (
    <div className="relative w-full border-y border-[#E5EBF4] bg-[#F6F8FC] py-4 overflow-hidden">
      
      {/* Side Fade Masks */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="animate-marquee flex items-center gap-8 sm:gap-12 whitespace-nowrap">
          {marqueeList.map((topic, idx) => {
            const Icon = topic.icon;
            return (
              <div
                key={`${topic.title}-${idx}`}
                className="flex items-center gap-2.5 select-none shrink-0"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-[#E0E6F0] shadow-2xs">
                  <Icon size={15} className={topic.color} strokeWidth={2} />
                </div>

                <span className="text-[13px] font-bold text-[#2A3447]">
                  {topic.title}
                </span>

                {/* Subtle separator dot */}
                <span className="h-1.5 w-1.5 rounded-full bg-[#CBD5E1] ml-6 sm:ml-9" />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
