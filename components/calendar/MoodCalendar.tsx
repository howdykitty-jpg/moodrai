"use client"

import { useState } from "react"
import { Entry, Mood } from "@/lib/types"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { MoodBlob } from "@/components/mood/MoodBlob"

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

// --- Mini aura blob for calendar ---
const MOOD_AURA: Record<string, string> = {
  calm:    "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.90) 0%, rgba(140,210,248,0.95) 18%, rgba(70,160,230,0.90) 42%, rgba(30,100,180,0.75) 68%, transparent 100%)",
  happy:   "radial-gradient(circle at 38% 32%, rgba(255,255,220,0.92) 0%, rgba(255,210,80,0.95) 18%, rgba(240,155,40,0.90) 42%, rgba(190,90,10,0.70) 68%, transparent 100%)",
  neutral: "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.95) 0%, rgba(235,230,218,0.90) 20%, rgba(200,195,182,0.80) 48%, rgba(160,155,145,0.55) 72%, transparent 100%)",
  tired:   "radial-gradient(circle at 38% 32%, rgba(220,220,228,0.92) 0%, rgba(165,165,180,0.90) 20%, rgba(120,120,140,0.82) 45%, rgba(75,75,95,0.65) 70%, transparent 100%)",
  anxious: "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.80) 0%, rgba(185,140,245,0.92) 18%, rgba(130,70,210,0.85) 38%, rgba(60,160,90,0.65) 62%, transparent 100%)",
}
const BLOB_RADIUS: Record<string, string> = {
  calm:    "62% 38% 54% 46% / 48% 62% 38% 52%",
  happy:   "44% 56% 62% 38% / 58% 42% 58% 42%",
  neutral: "50% 50% 44% 56% / 56% 44% 52% 48%",
  tired:   "38% 62% 50% 50% / 44% 56% 62% 38%",
  anxious: "56% 44% 38% 62% / 42% 58% 44% 56%",
}

function fallbackAura(color: string): string {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  const dr = Math.max(0, r - 60); const dg = Math.max(0, g - 60); const db = Math.max(0, b - 60)
  return `radial-gradient(circle at 38% 32%, rgba(255,255,255,0.88) 0%, rgba(${r},${g},${b},0.92) 22%, rgba(${dr},${dg},${db},0.60) 68%, transparent 100%)`
}

function MiniAuraFace({ moodId, ink }: { moodId: string; ink: string }) {
  const sw = 2.2
  return (
    <svg width="26" height="26" viewBox="0 0 54 54" fill="none" style={{ position: "relative", zIndex: 1 }}>
      {moodId === "calm" && (
        <>
          <path d="M18 23 Q20.5 20.5 23 23" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M31 23 Q33.5 20.5 36 23" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M20 32 Q27 37 34 32" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
        </>
      )}
      {moodId === "happy" && (
        <>
          <circle cx="20" cy="23" r="2" fill={ink} />
          <circle cx="33" cy="23" r="2" fill={ink} />
          <path d="M18 31 Q26.5 38 35 31" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
        </>
      )}
      {moodId === "neutral" && (
        <>
          <circle cx="20.5" cy="23" r="2" fill={ink} />
          <circle cx="32.5" cy="23" r="2" fill={ink} />
          <line x1="20" y1="32" x2="33" y2="32" stroke={ink} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {moodId === "tired" && (
        <>
          <path d="M18 22 Q20.5 25 23 22" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M30 22 Q32.5 25 35 22" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <line x1="21" y1="33" x2="31" y2="33" stroke={ink} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {moodId === "anxious" && (
        <>
          <path d="M18 19.5 Q20.5 17 23 19.5" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M30 19.5 Q32.5 17 35 19.5" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <circle cx="20.5" cy="24" r="1.8" fill={ink} />
          <circle cx="32.5" cy="24" r="1.8" fill={ink} />
          <path d="M19 35 Q23 31.5 27 35 Q31 38.5 34 35" stroke={ink} strokeWidth={sw} strokeLinecap="round" fill="none" />
        </>
      )}
    </svg>
  )
}

function MiniMoodBlob({ mood }: { mood: Mood }) {
  const gradient = MOOD_AURA[mood.id] ?? fallbackAura(mood.color)
  const radius = BLOB_RADIUS[mood.id] ?? "50%"
  return (
    <div style={{ position: "relative", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        position: "absolute",
        width: 28,
        height: 28,
        borderRadius: radius,
        background: gradient,
        filter: "blur(4px)",
        opacity: 0.85,
      }} />
      <MiniAuraFace moodId={mood.id} ink="#1C1A18" />
    </div>
  )
}

interface MoodCalendarProps {
  entries: Entry[]
  moods: Mood[]
}

export function MoodCalendar({ entries, moods }: MoodCalendarProps) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedEntries, setSelectedEntries] = useState<Entry[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const getMood = (id: string) => moods.find((m) => m.id === id)

  const entriesByDate: Record<string, Entry[]> = {}
  for (const e of entries) {
    if (!entriesByDate[e.date]) entriesByDate[e.date] = []
    entriesByDate[e.date].push(e)
  }

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: lastDay.getDate() }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function handleDayClick(day: number) {
    const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayEntries = entriesByDate[iso] ?? []
    if (dayEntries.length === 0) return
    setSelectedDate(iso)
    setSelectedEntries(dayEntries)
    setSheetOpen(true)
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const monthName = firstDay.toLocaleDateString("en-US", { month: "long" })
  const todayISO = today.toISOString().split("T")[0]

  return (
    <div>
      {/* Month nav */}
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#DDD9D0] text-[#3A3630]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-[22px] font-light" style={{ fontFamily: "var(--font-serif)" }}>
          {monthName} <span className="text-[16px] text-[#3A3630]">{year}</span>
        </span>
        <button
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#DDD9D0] text-[#3A3630]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1.5">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] tracking-[0.1em] text-[#3A3630] py-1.5 uppercase" style={{ fontFamily: "var(--font-sans)" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          const dayEntries = entriesByDate[iso] ?? []
          const isToday = iso === todayISO
          const topMood = dayEntries[0] ? getMood(dayEntries[0].mood) : null

          return (
            <button
              key={i}
              onClick={() => handleDayClick(day)}
              className="flex flex-col items-center py-2 rounded-xl transition-all duration-150"
              style={{
                cursor: dayEntries.length > 0 ? "pointer" : "default",
                opacity: dayEntries.length === 0 && !isToday ? 0.38 : 1,
              }}
            >
              <span
                className="text-[12px] w-7 h-7 flex items-center justify-center rounded-full mb-1"
                style={{
                  fontFamily: "var(--font-sans)",
                  backgroundColor: isToday ? "#1C1917" : "transparent",
                  color: isToday ? "#EDEAE5" : "#1C1917",
                  fontWeight: isToday ? 500 : 400,
                }}
              >
                {day}
              </span>
              {topMood && <MiniMoodBlob mood={topMood} />}
            </button>
          )
        })}
      </div>

      {/* Entry sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl max-h-[75vh] overflow-y-auto"
          style={{ backgroundColor: "#EDEAE5", borderTop: "1px solid #DDD9D0" }}
        >
          <SheetHeader className="mb-5">
            <SheetTitle
              className="text-left text-[22px] font-light"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 300 }}
            >
              {selectedDate ? formatFullDate(selectedDate) : ""}
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 pb-4">
            {selectedEntries.map((entry) => {
              const mood = getMood(entry.mood)
              return (
                <div key={entry.id} className="rounded-2xl border border-[#DDD9D0] bg-[#F5F2EC] p-5">
                  <div className="flex items-center gap-2.5 mb-3">
                    {mood && <MoodBlob moodId={mood.id} color={mood.color} size={22} />}
                    <span className="text-[11px] uppercase tracking-widest text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
                      {mood?.label}
                    </span>
                    <span className="ml-auto text-[11px] text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
                      {new Date(entry.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div
                    className="text-[15px] leading-relaxed text-[#1C1917]"
                    style={{ fontFamily: "var(--font-sans)" }}
                    dangerouslySetInnerHTML={{ __html: entry.content }}
                  />
                  {entry.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {entry.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full px-3 py-1 text-[11px] border border-[#DDD9D0] text-[#3A3630]"
                          style={{ fontFamily: "var(--font-sans)" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function formatFullDate(iso: string) {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
}
