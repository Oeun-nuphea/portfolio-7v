import { ImageResponse } from "next/og"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"
export const size = { width: 32, height: 32 }
export const contentType = "image/png"

export default async function Icon() {
  const filePath = path.join(process.cwd(), "public", "OUENNUPHEA.jpg")
  const fileBuffer = fs.readFileSync(filePath)
  const base64Image = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "32px",
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          overflow: "hidden",
          backgroundColor: "#000000",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={base64Image}
          alt="Oeun Nuphea"
          style={{
            width: "32px",
            height: "32px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
        />
      </div>
    ),
    { ...size }
  )
}
