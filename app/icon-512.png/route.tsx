import { ImageResponse } from "next/og"
import fs from "fs"
import path from "path"

export const runtime = "nodejs"
export const dynamic = "force-static"

export async function GET(): Promise<Response> {
  const filePath = path.join(process.cwd(), "public", "OUENNUPHEA.jpg")
  const fileBuffer = fs.readFileSync(filePath)
  const base64Image = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "512px",
          height: "512px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          borderRadius: "96px",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={base64Image}
          alt="Oeun Nuphea"
          style={{
            width: "512px",
            height: "512px",
            objectFit: "cover",
          }}
        />
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  )
}
