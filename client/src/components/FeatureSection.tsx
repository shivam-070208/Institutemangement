import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

export default function FeatureSection() {
  return (
    <BentoGrid className="max-w-4xl mx-auto mb-10 py-8">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
const ImageCard = ({ url }: { url: string }) => (
  <div
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${url})` }}
  ></div>
);

const items = [

  {
    title: "Smart Enrollment & Registration",
    description: "Automates student semester enrollments, sections, and academic progression.",
    header: <ImageCard url="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b" />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Faculty & Course Allocation",
    description: "Assign courses to faculty and manage teaching load with transparency.",
    header: <ImageCard url="https://images.unsplash.com/photo-1588072432836-e10032774350" />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Student Profiles & Academic Records",
    description: "View and manage personal information, semesters, and enrollment history seamlessly.",
    header: <ImageCard url="https://plus.unsplash.com/premium_photo-1676618539992-21c7d3b6df0f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1332" />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Secure Online Fee Payment",
    description: "Students can pay fees securely via UPI, Cards, or Net Banking with real-time receipts.",
    header: <ImageCard url="https://images.unsplash.com/photo-1561414927-6d86591d0c4f" />,
    icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Role-Based Auth System",
    description: "Separate dashboards for Admin, Faculty, and Students ensure secure access handling.",
    header: <ImageCard url="https://images.unsplash.com/photo-1556155092-8707de31f9c4" />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Performance & Attendance Insights",
    description: "Track student performance and attendance with data-driven analytics.",
    header: <ImageCard url="https://images.unsplash.com/photo-1553877522-43269d4ea984" />,
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  },
];

