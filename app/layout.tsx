import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import "./globals.css"
import { BottomNav } from "@/components/navigation/BottomNav"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500"],
})

export const metadata: Metadata = {
  title: "MooDrai",
  description: "Understand your mood. Grow with every day.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="h-full bg-[#EDEAE5] text-[#1C1A18]">
        <div className="mx-auto flex min-h-full max-w-md flex-col">
          <main className="flex-1 overflow-y-auto pb-24">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
