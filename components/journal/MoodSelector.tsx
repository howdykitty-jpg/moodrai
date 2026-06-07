"use client"

import { useRef, useState } from "react"
import { Mood } from "@/lib/types"
import { BLOB_RADIUS, MOOD_AURA, fallbackAura } from "@/components/mood/MoodBlob"

interface MoodSelectorProps {
  moods: Mood[]
  selected: string | null
  onSelect: (id: string) => void
}

function FaceSVG({ moodId, ink }: { moodId: string; ink: string }) {
  const sw = 1.7
  return (
    <svg width="44" height="44" viewBox="0 0 54 54" fill="none" style={{ position: "relative", zIndex: 1 }}>
      {moodId === "calm" && (
        <>
          <path d="M18 23 Q20.5 20.5 23 23" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M31 23 Q33.5 20.5 36 23" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M20 32 Q27 37 34 32" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
        </>
      )}
      {moodId === "happy" && (
        <>
          <circle cx="20" cy="23" r="1.6" fill={ink} />
          <circle cx="33" cy="23" r="1.6" fill={ink} />
          <path d="M18 31 Q26.5 38 35 31" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
        </>
      )}
      {moodId === "neutral" && (
        <>
          <circle cx="20.5" cy="23" r="1.5" fill={ink} />
          <circle cx="32.5" cy="23" r="1.5" fill={ink} />
          <line x1="21" y1="32" x2="32" y2="32" stroke={ink} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {moodId === "tired" && (
        <>
          <path d="M18 22 Q20.5 25 23 22" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M30 22 Q32.5 25 35 22" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <line x1="21" y1="33" x2="31" y2="33" stroke={ink} strokeWidth={sw} strokeLinecap="round" />
          <text x="35" y="17" fill={ink} fontSize="5.5" fontFamily="Georgia,serif" opacity="0.8">z</text>
          <text x="38" y="12" fill={ink} fontSize="4" fontFamily="Georgia,serif" opacity="0.55">z</text>
        </>
      )}
      {moodId === "anxious" && (
        <>
          <path d="M18 19.5 Q20.5 17 23 19.5" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M30 19.5 Q32.5 17 35 19.5" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <circle cx="20.5" cy="24" r="1.4" fill={ink} />
          <circle cx="32.5" cy="24" r="1.4" fill={ink} />
          <path d="M19 35 Q23 31.5 27 35 Q31 38.5 34 35" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
        </>
      )}
      {moodId === "sad" && (
        <>
          <path d="M18 22 Q20.5 24.5 23 22" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M30 22 Q32.5 24.5 35 22" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M20 35 Q27 30 34 35" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <circle cx="23.5" cy="28" r="1.2" fill={ink} opacity="0.5" />
        </>
      )}
      {moodId === "angry" && (
        <>
          <path d="M17 21 Q20 18.5 23 21" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M30 21 Q33 18.5 36 21" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <circle cx="20.5" cy="25" r="1.5" fill={ink} />
          <circle cx="32.5" cy="25" r="1.5" fill={ink} />
          <path d="M19 35 Q27 30.5 34 35" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
        </>
      )}
      {moodId === "love" && (
        <>
          <path d="M18 23 Q20.5 20.5 23 23" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M31 23 Q33.5 20.5 36 23" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M18 31 Q26.5 38 35 31" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M25.5 26 Q27 24 28.5 26 Q27 28 25.5 26Z" fill={ink} opacity="0.75" />
        </>
      )}
    </svg>
  )
}

export function MoodSelector({ moods, selected, onSelect }: MoodSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [atEnd, setAtEnd] = useState(false)

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8)
  }

  return (
    <div className="relative overflow-hidden" style={{ marginLeft: "-4px", marginRight: "-4px", paddingLeft: "4px" }}>
      {/* fade + arrow — klikalny, znika gdy doscrollowane do końca */}
      {!atEnd && (
        <button
          type="button"
          onClick={() => scrollRef.current?.scrollBy({ left: 120, behavior: "smooth" })}
          className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-end"
          style={{
            width: 68,
            paddingRight: "10px",
            background: "linear-gradient(to right, transparent, #EDEAE5 52%)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ opacity: 0.5, flexShrink: 0 }}>
            <path d="M4.5 2.5l4 4-4 4" stroke="#1C1A18" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide px-1"
        style={{ paddingRight: "4px" }}
      >
        {moods.map((mood) => {
          const active = selected === mood.id
          const gradient = MOOD_AURA[mood.id] ?? fallbackAura(mood.color)
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => onSelect(mood.id)}
              className="flex flex-col items-center gap-2 flex-shrink-0 py-1 transition-all duration-200"
            >
              <div style={{ position: "relative", width: 62, height: 62, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div
                  style={{
                    position: "absolute",
                    width: 54,
                    height: 54,
                    borderRadius: BLOB_RADIUS[mood.id] ?? "50%",
                    background: gradient,
                    filter: `blur(${mood.id === "angry" ? (active ? 5 : 3) : active ? 8 : 6}px)`,
                    opacity: mood.id === "angry" ? (active ? 1 : 0.92) : active ? 1 : 0.78,
                    transform: active ? "scale(1.08)" : "scale(1)",
                    transition: "all 0.25s ease",
                  }}
                />
              </div>
              <span
                className="text-[9px] tracking-[0.08em] uppercase"
                style={{
                  fontFamily: "var(--font-sans)",
                  color: active ? "#1C1A18" : "#3A3630",
                  fontWeight: active ? 600 : 400,
                }}
              >
                {mood.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
