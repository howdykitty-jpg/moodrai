"use client"

import { useState } from "react"
import { useStore } from "@/store/useStore"
import { calculateAura, getTopTags } from "@/lib/aura"
import { AuraBlob } from "@/components/aura/AuraBlob"
import { MoodBlob, MOOD_BAR_GRADIENT } from "@/components/mood/MoodBlob"

export default function AuraPage() {
  const { entries, settings, hydrated } = useStore()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`
  const aura = calculateAura(entries, settings.moods, monthKey)
  const topTags = getTopTags(entries, monthKey)

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
    <div className="px-5 pt-8 pb-6">
      {/* Compact month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prev}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ color: "var(--fg-2)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--border-2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-[18px] font-light" style={{ fontFamily: "var(--font-serif)", color: "var(--fg)" }}>
          {monthName}{" "}
          <span className="text-[14px]" style={{ color: "var(--fg-2)" }}>{year}</span>
        </span>
        <button
          onClick={next}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
          style={{ color: "var(--fg-2)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--border-2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {!hydrated ? (
        <div className="flex flex-col items-center gap-6 py-6">
          <div className="w-[260px] h-[260px] rounded-full animate-pulse" style={{ background: "var(--border-2)" }} />
          <div className="h-4 w-48 rounded-full animate-pulse" style={{ background: "var(--border-2)" }} />
          <div className="w-full rounded-2xl p-5 flex flex-col gap-3" style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 rounded-full animate-pulse" style={{ background: "var(--border-2)" }} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <AuraBlob proportions={aura.proportions} />

          <p
            className="mt-1 mb-6 text-center text-[15px] leading-relaxed px-6"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--fg)" }}
          >
            {aura.description}
          </p>

          {aura.proportions.length > 0 && (
            <div
              className="mb-4 rounded-2xl p-5"
              style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}
            >
              <p
                className="mb-4 text-[10px] tracking-[0.18em] uppercase"
                style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}
              >
                Mood breakdown
              </p>
              <div className="flex flex-col gap-3.5">
                {aura.proportions.map(({ mood, percentage }) => (
                  <div key={mood.id} className="flex items-center gap-3">
                    <MoodBlob moodId={mood.id} color={mood.color} size={22} />
                    <span
                      className="text-[12px] w-16"
                      style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}
                    >
                      {mood.label}
                    </span>
                    <div
                      className="flex-1 h-[3px] rounded-full overflow-hidden"
                      style={{ background: "var(--border-2)" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, ${(MOOD_BAR_GRADIENT[mood.id] ?? [mood.color, mood.color])[0]}, ${(MOOD_BAR_GRADIENT[mood.id] ?? [mood.color, mood.color])[1]})`,
                        }}
                      />
                    </div>
                    <span
                      className="text-[11px] w-8 text-right"
                      style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}
                    >
                      {percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {topTags.length > 0 && (
            <div
              className="rounded-2xl p-5"
              style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}
            >
              <p
                className="mb-3 text-[10px] tracking-[0.18em] uppercase"
                style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}
              >
                Recurring themes
              </p>
              <div className="flex flex-wrap gap-2">
                {topTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-3.5 py-1.5 text-[12px] capitalize"
                    style={{
                      fontFamily: "var(--font-sans)",
                      border: "1px solid var(--border-2)",
                      color: "var(--fg-2)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {aura.proportions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}>
                Nothing here yet
              </p>
              <p className="text-[13px]" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}>
                Start journaling to see your aura.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
