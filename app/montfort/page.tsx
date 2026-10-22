import type { Metadata } from "next"
import { Jost } from "next/font/google"
import Montfort from "@/components/montfort/montfort"

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
})

export const metadata: Metadata = {
  title: "Montfort Trading — Global Commodity Trading & Energy",
  description:
    "Montfort Trading is a global commodity trading and asset investment company providing energy solutions with integrity and efficiency.",
}

export default function MontfortPage() {
  return <Montfort fontClassName={jost.className} />
}
