"use client"

import { useState } from "react"
import { useStore } from "@/store/useStore"
import { calculateAura, getTopTags } from "@/lib/aura"
import { AuraBlob } from "@/components/aura/AuraBlob"
import { MoodBlob, MOOD_BAR_GRADIENT, fallbackAura } from "@/components/mood/MoodBlob"

export default function AuraPage() {
  const { entries, settings } = useStore()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`
  const aura = calculateAura(entries, settings.moods, monthKey)
  const topTags = getTopTags(entries, monthKey)

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  function prev() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function next() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { month: "long" })

  return (
    <div className="px-5 pt-12 pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[2.6rem] font-light leading-tight tracking-tight text-[#1C1917]" style={{ fontFamily: "var(--font-serif)" }}>
          Your Aura
        </h1>
        <p className="mt-1 text-[13px] text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
          Your emotional energy this month.
        </p>
        <div className="flex items-center justify-between mt-5">
          <span className="text-[18px] font-light text-[#1C1917]" style={{ fontFamily: "var(--font-serif)" }}>
            {monthName} {year}
          </span>
          <div className="flex items-center gap-2">
            <button onClick={prev} className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#DDD9D0] text-[#3A3630]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button onClick={next} className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#DDD9D0] text-[#3A3630]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AuraBlob proportions={aura.proportions} />

      <p
        className="mt-1 mb-6 text-center text-[15px] leading-relaxed text-[#1C1917] px-6"
        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
      >
        {aura.description}
      </p>

      {aura.proportions.length > 0 && (
        <div className="mb-4 rounded-2xl border border-[#DDD9D0] bg-[#F5F2EC] p-5">
          <p
            className="mb-4 text-[10px] tracking-[0.18em] uppercase text-[#3A3630]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Mood breakdown
          </p>
          <div className="flex flex-col gap-3.5">
            {aura.proportions.map(({ mood, percentage }) => (
              <div key={mood.id} className="flex items-center gap-3">
                <MoodBlob moodId={mood.id} color={mood.color} size={22} />
                <span className="text-[12px] text-[#1C1917] w-16" style={{ fontFamily: "var(--font-sans)" }}>
                  {mood.label}
                </span>
                <div className="flex-1 h-[3px] rounded-full bg-[#DDD9D0] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${(MOOD_BAR_GRADIENT[mood.id] ?? [mood.color, mood.color])[0]}, ${(MOOD_BAR_GRADIENT[mood.id] ?? [mood.color, mood.color])[1]})`,
                      }}
                  />
                </div>
                <span className="text-[11px] text-[#3A3630] w-8 text-right" style={{ fontFamily: "var(--font-sans)" }}>
                  {percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topTags.length > 0 && (
        <div className="rounded-2xl border border-[#DDD9D0] bg-[#F5F2EC] p-5">
          <p
            className="mb-3 text-[10px] tracking-[0.18em] uppercase text-[#3A3630]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Recurring themes
          </p>
          <div className="flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#DDD9D0] px-3.5 py-1.5 text-[12px] text-[#3A3630] capitalize"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
