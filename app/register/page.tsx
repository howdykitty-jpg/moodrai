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

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: "You" } },
    })

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
      <div className="absolute inset-0 flex items-start justify-center" style={{ paddingTop: "15%" }}>
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

      {/* Text */}
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
          Start your journey.
        </p>
      </div>

      {/* Form */}
      <div className="relative z-10 w-full px-7 pb-12 flex flex-col gap-3 max-w-sm">
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
            placeholder="Password (min. 6 characters)"
            required
            autoComplete="new-password"
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
              className="text-center text-[11px]"
              style={{ fontFamily: "var(--font-sans)", color: "rgba(180,60,60,0.85)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="mt-1 w-full rounded-full py-3.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_32px_8px_rgba(100,110,200,0.20)] active:scale-[0.97]"
            style={{
              fontFamily: "var(--font-sans)",
              backgroundColor: "#1C1A18",
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px" style={{ background: "rgba(60,55,48,0.15)" }} />
          <span className="text-[10px] tracking-[0.12em]" style={{ fontFamily: "var(--font-sans)", color: "rgba(60,55,48,0.40)" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "rgba(60,55,48,0.15)" }} />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="w-full rounded-full py-3.5 text-[10px] tracking-[0.18em] uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.97] flex items-center justify-center gap-2.5"
          style={{
            fontFamily: "var(--font-sans)",
            background: "transparent",
            border: "1px solid rgba(60,55,48,0.25)",
            color: "#1C1A18",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p
          className="text-center text-[11px] mt-1"
          style={{ fontFamily: "var(--font-sans)", color: "#6B6660", letterSpacing: "0.06em" }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{ color: "#3A3630" }}
            className="underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
