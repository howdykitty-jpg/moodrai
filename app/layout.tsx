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
    <html lang="en" className={`${cormorant.variable} ${inter.variable} antialiased`}>
      <body className="bg-[#DDD9D0] text-[#1C1A18]">

        {/* ── Mobile: pełny ekran ── */}
        <div className="flex min-h-dvh flex-col md:hidden bg-[#EDEAE5]">
          <main className="flex-1 overflow-y-auto pb-24">{children}</main>
          <BottomNav />
        </div>

        {/* ── Desktop: ramka telefonu ── */}
        <div className="hidden md:flex min-h-screen items-start justify-center py-10">
          <div
            style={{
              position: "relative",
              width: 375,
              height: 812,
              borderRadius: 52,
              background: "#1C1A18",
              boxShadow: "0 40px 120px rgba(0,0,0,0.35), 0 0 0 1.5px #3A3630, inset 0 0 0 2px #2C2A28",
              padding: "14px 10px",
              flexShrink: 0,
            }}
          >
            {/* Przyciski boczne */}
            <div style={{ position: "absolute", left: -3, top: 120, width: 3, height: 36, background: "#2C2A28", borderRadius: "2px 0 0 2px" }} />
            <div style={{ position: "absolute", left: -3, top: 170, width: 3, height: 64, background: "#2C2A28", borderRadius: "2px 0 0 2px" }} />
            <div style={{ position: "absolute", left: -3, top: 246, width: 3, height: 64, background: "#2C2A28", borderRadius: "2px 0 0 2px" }} />
            <div style={{ position: "absolute", right: -3, top: 160, width: 3, height: 80, background: "#2C2A28", borderRadius: "0 2px 2px 0" }} />

            {/* Ekran */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 42,
                overflow: "hidden",
                background: "#EDEAE5",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Status bar */}
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: 44,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 24px",
                  zIndex: 50,
                  pointerEvents: "none",
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: "#1C1917", letterSpacing: "-0.3px", fontFamily: "sans-serif" }}>9:41</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="17" height="12" viewBox="0 0 17 12" fill="#1C1917">
                    <rect x="0" y="7" width="3" height="5" rx="0.8" opacity="0.4"/>
                    <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.8" opacity="0.6"/>
                    <rect x="9" y="2" width="3" height="10" rx="0.8" opacity="0.8"/>
                    <rect x="13.5" y="0" width="3" height="12" rx="0.8"/>
                  </svg>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="#1C1917" strokeLinecap="round">
                    <path d="M1 4.5C3.8 1.8 12.2 1.8 15 4.5" strokeWidth="1.4" opacity="0.4"/>
                    <path d="M3.2 6.8C5 5 11 5 12.8 6.8" strokeWidth="1.4" opacity="0.7"/>
                    <path d="M5.5 9C6.5 8 9.5 8 10.5 9" strokeWidth="1.4"/>
                    <circle cx="8" cy="11" r="1" fill="#1C1917" stroke="none"/>
                  </svg>
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <div style={{ width: 25, height: 12, border: "1.5px solid #1C1917", borderRadius: 3, padding: 2 }}>
                      <div style={{ width: "100%", height: "100%", background: "#1C1917", borderRadius: 1 }} />
                    </div>
                    <div style={{ width: 2, height: 5, background: "#1C1917", borderRadius: 1, opacity: 0.5 }} />
                  </div>
                </div>
              </div>

              {/* Dynamic island */}
              <div
                style={{
                  position: "absolute",
                  top: 12, left: "50%",
                  transform: "translateX(-50%)",
                  width: 120, height: 34,
                  background: "#1C1A18",
                  borderRadius: 20,
                  zIndex: 51,
                  pointerEvents: "none",
                }}
              />

              {/* Treść aplikacji */}
              <div style={{ flex: 1, overflowY: "auto", paddingTop: 44, position: "relative" }}>
                <main style={{ minHeight: "100%" }}>{children}</main>
                <BottomNav />
              </div>
            </div>
          </div>
        </div>

      </body>
    </html>
  )
}
