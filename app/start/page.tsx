"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

function clearLocalStorage() {
  localStorage.removeItem("moodrai-store")
  localStorage.removeItem("moodrai-started")
  localStorage.removeItem("moodrai-onboarded")
}

export default function StartPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    clearLocalStorage()
    router.push("/journal")
  }

  return (
    <div
      className="absolute inset-0 z-[60] flex flex-col items-center overflow-hidden"
      style={{ backgroundColor: "#FAFAF8" }}
    >
      <style>{`
        @keyframes start-blob {
          0%,100% { border-radius:62% 38% 54% 46%/50% 60% 40% 55%; transform:scale(1) rotate(0deg) translate(0px,0px); }
          18%      { border-radius:50% 50% 44% 56%/62% 38% 54% 46%; transform:scale(1.05) rotate(2deg) translate(6px,-10px); }
          36%      { border-radius:44% 56% 62% 38%/44% 56% 46% 54%; transform:scale(0.96) rotate(-3deg) translate(-8px,7px); }
          54%      { border-radius:56% 44% 48% 52%/52% 48% 62% 38%; transform:scale(1.04) rotate(1deg) translate(5px,9px); }
          72%      { border-radius:38% 62% 56% 44%/58% 42% 40% 60%; transform:scale(0.97) rotate(-2deg) translate(-6px,-8px); }
          88%      { border-radius:54% 46% 42% 58%/46% 54% 58% 42%; transform:scale(1.03) rotate(2deg) translate(7px,4px); }
        }
      `}</style>

      {/* Blob */}
      <div className="absolute inset-0 flex items-start justify-center" style={{ paddingTop: "2%" }}>
        <div
          style={{
            width: 340,
            height: 340,
            background: [
              "radial-gradient(circle at 42% 44%, rgba(88,85,175,0.82) 0%, rgba(110,120,195,0.65) 28%, rgba(140,160,220,0.38) 58%, transparent 100%)",
              "radial-gradient(circle at 64% 54%, rgba(100,130,220,0.72) 0%, rgba(148,178,235,0.50) 45%, transparent 100%)",
              "radial-gradient(circle at 36% 62%, rgba(105,90,180,0.58) 0%, rgba(130,110,200,0.30) 55%, transparent 100%)",
              "radial-gradient(circle at 58% 36%, rgba(130,155,230,0.52) 0%, rgba(170,190,245,0.28) 50%, transparent 100%)",
            ].join(", "),
            filter: "blur(42px)",
            opacity: 0.90,
            animation: "start-blob 11s ease-in-out infinite",
            willChange: "border-radius, transform",
          }}
        />
      </div>

      {/* Title */}
      <div
        className="relative z-10 flex flex-col items-center justify-center text-center px-10"
        style={{ flex: 1 }}
      >
        <h1
          className="font-serif font-light leading-none tracking-wide text-[#1C1A18]"
          style={{ fontSize: "3.4rem" }}
        >
          Moodrai
        </h1>
        <p
          className="mt-5 leading-loose text-[#3A3630]"
          style={{ fontSize: "0.72rem", letterSpacing: "0.1em" }}
        >
          Understand your mood.
          <br />
          Grow with everyday.
          <br />
          See your Aura.
        </p>
      </div>

      {/* Form */}
      <div className="relative z-10 w-full px-7 pb-14 flex flex-col gap-4 max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
            className="w-full outline-none text-[13px] rounded-lg px-4 py-[14px] placeholder:text-[rgba(80,90,140,0.45)] transition-all duration-200 focus:bg-[rgba(200,210,240,0.25)]"
            style={{
              fontFamily: "var(--font-sans)",
              color: "#1C1A18",
              background: "rgba(210,218,245,0.18)",
              border: "1px solid rgba(160,175,230,0.30)",
              letterSpacing: "0.02em",
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete="current-password"
            className="w-full outline-none text-[13px] rounded-lg px-4 py-[14px] placeholder:text-[rgba(80,90,140,0.45)] transition-all duration-200 focus:bg-[rgba(200,210,240,0.25)]"
            style={{
              fontFamily: "var(--font-sans)",
              color: "#1C1A18",
              background: "rgba(210,218,245,0.18)",
              border: "1px solid rgba(160,175,230,0.30)",
              letterSpacing: "0.02em",
            }}
          />

          {error && (
            <p
              className="text-center text-[11px] pt-1"
              style={{ fontFamily: "var(--font-sans)", color: "rgba(180,60,60,0.85)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full py-4 text-[10px] tracking-[0.22em] uppercase transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_32px_8px_rgba(100,110,200,0.22)] active:scale-[0.97]"
            style={{
              fontFamily: "var(--font-sans)",
              backgroundColor: "#1C1A18",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p
          className="text-center text-[11px] mt-2"
          style={{ fontFamily: "var(--font-sans)", color: "#6B6660", letterSpacing: "0.06em" }}
        >
          No account?{" "}
          <Link
            href="/register"
            style={{ color: "#3A3630" }}
            className="underline underline-offset-2"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
