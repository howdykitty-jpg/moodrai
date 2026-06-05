"use client"

import { MOOD_AURA, fallbackAura } from "@/components/mood/MoodBlob"
import type { AuraProportion } from "@/lib/aura"

interface AuraBlobProps {
  proportions: AuraProportion[]
}

// Offsets — close enough to overlap well, spread enough to show each color
const POS = [
  { x:   0, y:   0 },
  { x: -44, y:  32 },
  { x:  40, y: -36 },
  { x: -30, y: -42 },
  { x:  36, y:  40 },
]

const ANIMS = [
  { dur: 10, delay:  0 },
  { dur: 13, delay: -4 },
  { dur: 11, delay: -7 },
  { dur: 14, delay: -2 },
  { dur: 12, delay: -9 },
]

const CSS = `
  @keyframes am0 {
    0%,100% { border-radius:62% 38% 54% 46%/50% 60% 40% 55%; transform:translate(0,0) scale(1); }
    25%      { border-radius:50% 50% 44% 56%/62% 38% 54% 46%; transform:translate(7px,-9px) scale(1.05); }
    55%      { border-radius:44% 56% 62% 38%/44% 56% 46% 54%; transform:translate(-8px,7px) scale(0.96); }
    78%      { border-radius:56% 44% 50% 50%/52% 48% 60% 40%; transform:translate(5px,10px) scale(1.03); }
  }
  @keyframes am1 {
    0%,100% { border-radius:44% 56% 62% 38%/58% 42% 58% 42%; transform:translate(0,0) scale(1); }
    30%      { border-radius:60% 40% 46% 54%/40% 60% 44% 56%; transform:translate(-10px,7px) scale(1.07); }
    62%      { border-radius:48% 52% 54% 46%/60% 40% 50% 50%; transform:translate(9px,-8px) scale(0.94); }
    82%      { border-radius:54% 46% 40% 60%/44% 56% 62% 38%; transform:translate(-6px,-9px) scale(1.04); }
  }
  @keyframes am2 {
    0%,100% { border-radius:56% 44% 38% 62%/42% 58% 44% 56%; transform:translate(0,0) scale(1); }
    35%      { border-radius:40% 60% 56% 44%/56% 44% 62% 38%; transform:translate(10px,9px) scale(1.06); }
    66%      { border-radius:58% 42% 48% 52%/48% 52% 38% 62%; transform:translate(-7px,-9px) scale(0.96); }
  }
  @keyframes am3 {
    0%,100% { border-radius:38% 62% 50% 50%/44% 56% 62% 38%; transform:translate(0,0) scale(1); }
    42%      { border-radius:54% 46% 44% 56%/60% 40% 50% 50%; transform:translate(-9px,9px) scale(1.08); }
    70%      { border-radius:46% 54% 58% 42%/38% 62% 46% 54%; transform:translate(9px,-6px) scale(0.94); }
  }
  @keyframes am4 {
    0%,100% { border-radius:52% 48% 60% 40%/60% 40% 46% 54%; transform:translate(0,0) scale(1); }
    45%      { border-radius:40% 60% 48% 52%/52% 48% 60% 40%; transform:translate(8px,-10px) scale(1.05); }
    74%      { border-radius:60% 40% 54% 46%/46% 54% 40% 60%; transform:translate(-9px,6px) scale(0.96); }
  }
`

export function AuraBlob({ proportions }: AuraBlobProps) {
  const isEmpty = proportions.length === 0

  // Opacity proportional to percentage — equal % = equal visual weight
  // regardless of how saturated the mood's colors are
  function layerOpacity(percentage: number) {
    return Math.min(0.92, (percentage / 100) * 1.75)
  }

  // Blob size: scale with percentage so dominant mood takes more space
  function blobSize(percentage: number, index: number) {
    const base = index === 0 ? 230 : 200
    return Math.round(base * (0.65 + (percentage / 100) * 0.55))
  }

  return (
    <div className="flex items-center justify-center py-6">
      <div style={{ position: "relative", width: 300, height: 300 }}>
        <style>{CSS}</style>

        {isEmpty ? (
          <div style={{
            position: "absolute",
            inset: 30,
            borderRadius: "60% 40% 55% 45%/50% 60% 40% 55%",
            background: "radial-gradient(circle at 42% 38%, rgba(210,207,202,0.85) 0%, rgba(175,170,164,0.50) 55%, transparent 100%)",
            filter: "blur(36px)",
            opacity: 0.60,
            animation: "am0 10s ease-in-out infinite",
          }} />
        ) : (
          // Render smallest percentage first (bottom), dominant last (top)
          [...proportions].slice(0, 5)
            .sort((a, b) => a.percentage - b.percentage)
            .map(({ mood, percentage }, renderIdx) => {
              // Get original index for position/animation
              const origIdx = proportions.findIndex(p => p.mood.id === mood.id)
              const pos = POS[origIdx] ?? POS[0]
              const anim = ANIMS[origIdx] ?? ANIMS[0]
              const size = blobSize(percentage, origIdx)
              const gradient = MOOD_AURA[mood.id] ?? fallbackAura(mood.color)
              const opacity = layerOpacity(percentage)

              return (
                <div
                  key={mood.id}
                  style={{
                    position: "absolute",
                    width: size,
                    height: size,
                    top: "50%",
                    left: "50%",
                    marginTop: -size / 2 + pos.y,
                    marginLeft: -size / 2 + pos.x,
                    background: gradient,
                    filter: "blur(40px)",
                    opacity,
                    zIndex: renderIdx,
                    animationName: `am${origIdx % 5}`,
                    animationDuration: `${anim.dur}s`,
                    animationDelay: `${anim.delay}s`,
                    animationTimingFunction: "ease-in-out",
                    animationIterationCount: "infinite",
                    willChange: "border-radius, transform",
                  }}
                />
              )
            })
        )}
      </div>
    </div>
  )
}
