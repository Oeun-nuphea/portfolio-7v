import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Oeun Nuphea — Backend Engineer & Freelancer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: Name & Role */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Portfolio
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#0f0f0f",
              lineHeight: 1.1,
            }}
          >
            Oeun Nuphea
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 500,
              color: "#374151",
            }}
          >
            Backend Engineer & Freelancer
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#6b7280",
              maxWidth: "640px",
              lineHeight: 1.6,
              marginTop: "8px",
            }}
          >
            Building scalable, event-driven systems and high-performance APIs. Available for contract work.
          </div>
        </div>

        {/* Bottom: Tech stack + status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["Node.js", "TypeScript", "Go", "Docker", "AWS"].map((tag) => (
              <div
                key={tag}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "6px 14px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
                  backgroundColor: "#f9fafb",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              color: "#6b7280",
              fontWeight: 500,
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#10b981",
              }}
            />
            Open to Work
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
