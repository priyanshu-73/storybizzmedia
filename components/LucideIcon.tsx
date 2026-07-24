import { icons } from "lucide-react";
import type { CSSProperties } from "react";

const toPascal = (name: string) =>
  name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");

/* Renders a lucide icon from the kebab-case names used in the page data
   (the prototype's `data-lucide` attribute values). */
export default function LucideIcon({
  name,
  size,
  style,
  className,
}: {
  name: string;
  size?: number;
  style?: CSSProperties;
  className?: string;
}) {
  const Icon = icons[toPascal(name) as keyof typeof icons];
  if (!Icon) return null;
  return <Icon className={className} size={size} style={style} aria-hidden />;
}
