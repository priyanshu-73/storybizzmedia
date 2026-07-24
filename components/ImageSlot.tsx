import type { CSSProperties } from "react";

interface ImageSlotProps {
  src?: string;
  placeholder?: string;
  shape?: "rect" | "rounded" | "circle";
  radius?: number | string;
  fit?: "cover" | "contain" | "fill";
  position?: string;
  alt?: string;
  style?: CSSProperties;
  className?: string;
}

/* React port of the prototype's <image-slot> web component: renders the image
   when a source exists, otherwise a labelled empty state. */
export default function ImageSlot({
  src,
  placeholder = "Image",
  shape = "rect",
  radius,
  fit = "cover",
  position,
  alt,
  style,
  className,
}: ImageSlotProps) {
  const slotStyle: CSSProperties = { ...style };
  if (radius !== undefined) {
    (slotStyle as Record<string, string>)["--slot-radius"] =
      typeof radius === "number" ? `${radius}px` : radius;
  }
  return (
    <span
      className={`image-slot${className ? ` ${className}` : ""}`}
      data-shape={shape}
      data-fit={fit}
      style={slotStyle}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? placeholder}
          loading="lazy"
          style={position ? { objectPosition: position } : undefined}
        />
      ) : (
        <span className="slot-empty">{placeholder}</span>
      )}
    </span>
  );
}
