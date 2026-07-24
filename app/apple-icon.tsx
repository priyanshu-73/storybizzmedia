import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0C",
          fontFamily: "Georgia, serif",
          fontSize: 120,
          fontWeight: 700,
          color: "#E9480F",
        }}
      >
        B
      </div>
    ),
    { ...size }
  );
}
