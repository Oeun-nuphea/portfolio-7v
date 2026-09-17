import { ImageResponse } from "next/og"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default async function AppleIcon(): Promise<ImageResponse> {
  const filePath = path.join(process.cwd(), "public", "OUENNUPHEA.jpg")
  const fileBuffer = fs.readFileSync(filePath)
  const base64Image = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "180px",
          height: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={base64Image}
          alt="Oeun Nuphea"
          style={{
            width: "180px",
            height: "180px",
            objectFit: "cover",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
