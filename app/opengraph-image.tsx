import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0C",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", fontSize: 88, fontWeight: 700, color: "#fff" }}>
          Story
          <span style={{ color: "#E9480F" }}>B</span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: 40,
            color: "rgba(255,255,255,0.82)",
          }}
        >
          Become impossible to ignore.
        </div>
      </div>
    ),
    { ...size }
  );
}
