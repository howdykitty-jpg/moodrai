"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "moodrai-onboarded"

export function SplashScreen() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY)
    if (!done) setVisible(true)
  }, [])

  function handleStart() {
    setLeaving(true)
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, "1")
      setVisible(false)
    }, 500)
  }

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes aura-breathe {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(1.06); }
        }
        @keyframes aura-breathe-b {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          50%      { transform: translate(-50%,-50%) scale(0.94); }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-between py-16 px-6"
        style={{
          background: "#FAFAF8",
          transition: "opacity 0.5s ease",
          opacity: leaving ? 0 : 1,
        }}
      >
        {/* Blob zielony — dolny lewy, większy i bardziej nasycony */}
        <div aria-hidden style={{
          position: "absolute",
          top: "44%", left: "38%",
          width: 400, height: 380,
          borderRadius: "50%",
          background: "rgba(130, 178, 152, 0.68)",
          filter: "blur(58px)",
          transform: "translate(-50%,-50%)",
          animation: "aura-breathe 9s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Blob lawendowy — górny prawy, bardziej nasycony */}
        <div aria-hidden style={{
          position: "absolute",
          top: "30%", left: "62%",
          width: 300, height: 300,
          borderRadius: "50%",
          background: "rgba(168, 155, 212, 0.72)",
          filter: "blur(52px)",
          transform: "translate(-50%,-50%)",
          animation: "aura-breathe-b 11s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Logo + subtitle — w centrum blobów */}
        <div className="absolute flex flex-col items-center gap-3" style={{ top: "42%", left: 0, right: 0, transform: "translateY(-50%)" }}>
          <h1 className="leading-none" style={{ fontSize: "2.8rem", letterSpacing: "-0.01em" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: "#1C1917" }}>Moo</span>
            <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, color: "#1C1917" }}>D</span>
            <span style={{ fontFamily: "var(--font-serif)", fontWeight: 300, color: "#4A4540" }}>r</span>
            <span style={{ fontFamily: "var(--font-serif)", fontWeight: 500, color: "#1C1917" }}>ai</span>
          </h1>
          <p className="text-center text-[13px] leading-relaxed" style={{ fontFamily: "var(--font-sans)", color: "#3A3632", fontWeight: 400 }}>
            Understand your mood.<br />Grow with every day.
          </p>
        </div>

        {/* Spacer */}
        <div />

        {/* Get started button */}
        <button
          onClick={handleStart}
          className="w-2/3 rounded-full py-4 active:scale-[0.98] transition-transform"
          style={{ fontFamily: "var(--font-sans)", fontSize: "15px", fontWeight: 400, backgroundColor: "#1C1917", color: "#FAFAF8" }}
        >
          Get started
        </button>
      </div>
    </>
  )
}
