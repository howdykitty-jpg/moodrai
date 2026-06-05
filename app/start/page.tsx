"use client"

import { useRouter } from "next/navigation"

export default function StartPage() {
  const router = useRouter()

  function handleStart() {
    localStorage.setItem("moodrai-started", "true")
    router.push("/journal")
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center overflow-hidden"
      style={{ backgroundColor: "#EDEAE5" }}
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

      {/* Blob + text */}
      <div className="relative flex-1 w-full flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            style={{
              width: 320,
              height: 320,
              background: [
                "radial-gradient(circle at 42% 44%, rgba(88,85,175,0.82) 0%, rgba(110,120,195,0.65) 28%, rgba(140,160,220,0.38) 58%, transparent 100%)",
                "radial-gradient(circle at 64% 54%, rgba(100,130,220,0.72) 0%, rgba(148,178,235,0.50) 45%, transparent 100%)",
                "radial-gradient(circle at 36% 62%, rgba(105,90,180,0.58) 0%, rgba(130,110,200,0.30) 55%, transparent 100%)",
                "radial-gradient(circle at 58% 36%, rgba(130,155,230,0.52) 0%, rgba(170,190,245,0.28) 50%, transparent 100%)",
              ].join(", "),
              filter: "blur(38px)",
              opacity: 0.92,
              animation: "start-blob 11s ease-in-out infinite",
              willChange: "border-radius, transform",
            }}
          />
        </div>

        {/* Text on top of blob */}
        <div className="relative z-10 text-center px-10">
          <h1
            className="font-serif font-light leading-none tracking-wide text-[#1C1A18] mb-5"
            style={{ fontSize: "3.4rem" }}
          >
            Moodrai
          </h1>
          <p
            className="leading-loose text-[#3A3630]"
            style={{ fontSize: "0.72rem", letterSpacing: "0.1em" }}
          >
            Understand your mood.
            <br />
            Grow with everyday.
            <br />
            See your Aura.
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="pb-14">
        <button
          onClick={handleStart}
          className="flex items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_32px_8px_rgba(100,110,200,0.35)] active:scale-[0.97]"
          style={{
            backgroundColor: "#1C1A18",
            paddingTop: "0.65rem",
            paddingBottom: "0.65rem",
            paddingLeft: "2.8rem",
            paddingRight: "2.8rem",
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Get started
        </button>
      </div>
    </div>
  )
}
