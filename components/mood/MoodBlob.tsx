"use client"

// Shared blob shapes and gradients — used by MoodSelector and ProfilePage

export const BLOB_RADIUS: Record<string, string> = {
  calm:    "62% 38% 54% 46% / 48% 62% 38% 52%",
  happy:   "44% 56% 62% 38% / 58% 42% 58% 42%",
  neutral: "50% 50% 44% 56% / 56% 44% 52% 48%",
  tired:   "38% 62% 50% 50% / 44% 56% 62% 38%",
  anxious: "56% 44% 38% 62% / 42% 58% 44% 56%",
  sad:     "42% 58% 46% 54% / 54% 46% 60% 40%",
  angry:   "52% 48% 60% 40% / 40% 60% 46% 54%",
  love:    "58% 42% 52% 48% / 46% 54% 42% 58%",
}

export const MOOD_AURA: Record<string, string> = {
  calm: `radial-gradient(circle at 38% 32%,
    rgba(255,255,255,0.90) 0%,
    rgba(140,210,248,0.95) 18%,
    rgba(70,160,230,0.90) 42%,
    rgba(30,100,180,0.75) 68%,
    transparent 100%)`,

  happy: `radial-gradient(circle at 38% 32%,
    rgba(255,255,220,0.92) 0%,
    rgba(255,210,80,0.95) 18%,
    rgba(240,155,40,0.90) 42%,
    rgba(190,90,10,0.70) 68%,
    transparent 100%)`,

  neutral: `radial-gradient(circle at 38% 32%,
    rgba(255,255,255,0.95) 0%,
    rgba(235,230,218,0.90) 20%,
    rgba(200,195,182,0.80) 48%,
    rgba(160,155,145,0.55) 72%,
    transparent 100%)`,

  tired: `radial-gradient(circle at 38% 32%,
    rgba(220,220,228,0.92) 0%,
    rgba(165,165,180,0.90) 20%,
    rgba(120,120,140,0.82) 45%,
    rgba(75,75,95,0.65) 70%,
    transparent 100%)`,

  anxious: `radial-gradient(circle at 38% 32%,
    rgba(255,255,255,0.80) 0%,
    rgba(185,140,245,0.92) 18%,
    rgba(130,70,210,0.85) 38%,
    rgba(60,160,90,0.65) 62%,
    rgba(20,100,50,0.40) 78%,
    transparent 100%)`,

  sad: `radial-gradient(circle at 38% 32%,
    rgba(200,220,255,0.88) 0%,
    rgba(90,130,210,0.92) 20%,
    rgba(40,80,170,0.85) 45%,
    rgba(15,40,110,0.65) 70%,
    transparent 100%)`,

  angry: `radial-gradient(circle at 40% 36%,
    rgba(255,100,80,1.00) 0%,
    rgba(230,30,20,1.00) 18%,
    rgba(185,10,10,0.98) 40%,
    rgba(130,5,5,0.88) 62%,
    rgba(70,0,0,0.55) 80%,
    transparent 100%)`,

  love: `radial-gradient(circle at 38% 32%,
    rgba(255,240,245,0.92) 0%,
    rgba(255,180,200,0.95) 18%,
    rgba(240,120,155,0.88) 42%,
    rgba(190,60,100,0.60) 68%,
    transparent 100%)`,
}

// Key colors for progress bars — [from, to] matching each mood's gradient palette
export const MOOD_BAR_GRADIENT: Record<string, [string, string]> = {
  calm:    ["#8CD2F8", "#1E64B4"],
  happy:   ["#FFD250", "#C86010"],
  neutral: ["#D8D4C4", "#8A8478"],
  tired:   ["#C0C0D0", "#505068"],
  anxious: ["#C090F8", "#3C8040"],
  sad:     ["#90B8F0", "#0F2870"],
  angry:   ["#FF6050", "#861010"],
  love:    ["#FFB8CC", "#C03060"],
}

export function fallbackAura(color: string): string {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  const dr = Math.max(0, r - 60)
  const dg = Math.max(0, g - 60)
  const db = Math.max(0, b - 60)
  return `radial-gradient(circle at 38% 32%,
    rgba(255,255,255,0.88) 0%,
    rgba(${r},${g},${b},0.92) 22%,
    rgba(${r},${g},${b},0.85) 45%,
    rgba(${dr},${dg},${db},0.60) 68%,
    transparent 100%)`
}

interface MoodBlobProps {
  moodId: string
  color: string
  size?: number      // outer container size in px (default 36)
  active?: boolean
  className?: string
  style?: React.CSSProperties
}

export function MoodBlob({ moodId, color, size = 36, active = false, className, style }: MoodBlobProps) {
  const gradient = MOOD_AURA[moodId] ?? fallbackAura(color)
  const blobSize = size * 0.85
  const blurPx = moodId === "angry"
    ? (active ? 5 : 3)
    : active ? Math.round(size * 0.14) : Math.round(size * 0.10)

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: blobSize,
          height: blobSize,
          borderRadius: BLOB_RADIUS[moodId] ?? "50%",
          background: gradient,
          filter: `blur(${blurPx}px)`,
          opacity: moodId === "angry" ? (active ? 1 : 0.92) : active ? 1 : 0.82,
          transform: active ? "scale(1.08)" : "scale(1)",
          transition: "all 0.25s ease",
        }}
      />
    </div>
  )
}
