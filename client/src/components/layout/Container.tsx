import { cn } from "@/lib/utils";

function Container({
  children,
  padding = "xl",
  size = "xtralarge",
  className = "",
}: {
  children?: React.ReactNode;
  padding?: "xl" | "lg" | "md" | "sm";
  size?: "xtralarge" | "large" | "medium" | "small";
  className?: string;
}) {
  const getPadding = (padding: string) => {
    if (padding === "sm") return "px-4";
    else if (padding === "md") return "px-8";
    else if (padding === "lg") return "px-8 md:px-16";
    else return "px-8 sm:px-16 md:px-24";
  };
  const getSize = (size: string) => {
    if (size === "small") return "max-w-md";
    else if (size === "medium") return "max-w-lg";
    else if (size === "large") return "max-w-2xl";
    else if (size === "xtralarge") return "max-w-7xl";
    else return "max-w-full";
  };
  return (
    <div
      className={cn(
        getPadding(padding),
        getSize(size),
        "mx-auto w-full",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Container;
