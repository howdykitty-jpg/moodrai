"use client"

import { useState } from "react"
import { Entry, Mood } from "@/lib/types"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { MoodBlob } from "@/components/mood/MoodBlob"

type Range = "week" | "month" | "all"

interface EmotionalTimelineProps {
  entries: Entry[]
  moods: Mood[]
}

function filterByRange(entries: Entry[], range: Range): Entry[] {
  const now = new Date()
  if (range === "all") return entries
  const days = range === "week" ? 7 : 30
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffStr = cutoff.toISOString().split("T")[0]
  return entries.filter((e) => e.date >= cutoffStr)
}

const RANGES: { value: Range; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "all", label: "All time" },
]

export function EmotionalTimeline({ entries, moods }: EmotionalTimelineProps) {
  const [range, setRange] = useState<Range>("month")
  const [selected, setSelected] = useState<Entry | null>(null)

  const filtered = filterByRange(entries, range).slice().reverse()
  const getMood = (id: string) => moods.find((m) => m.id === id)

  return (
    <div>
      {/* Range selector */}
      <div
        className="mb-6 flex gap-1 rounded-full p-1"
        style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}
      >
        {RANGES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setRange(value)}
            className="flex-1 rounded-full py-2 text-[11px] tracking-[0.08em] uppercase transition-all duration-200"
            style={{
              fontFamily: "var(--font-sans)",
              backgroundColor: range === value ? "var(--fg)" : "transparent",
              color: range === value ? "var(--btn-fg)" : "var(--fg-2)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 rounded-full mb-5" style={{ background: "var(--border-2)" }} />
          <p className="text-[17px]" style={{ fontFamily: "var(--font-serif)", color: "var(--fg)" }}>
            No entries yet.
          </p>
          <p className="mt-1 text-[12px]" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}>
            Start writing to see your journey.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max px-1 py-2">
            {filtered.map((entry) => {
              const mood = getMood(entry.mood)
              return (
                <button
                  key={entry.id}
                  onClick={() => setSelected(entry)}
                  className="flex flex-col items-center gap-2.5 group"
                >
                  {mood
                    ? <MoodBlob moodId={mood.id} color={mood.color} size={48} />
                    : <div className="w-12 h-12 rounded-full" style={{ background: "var(--border-2)" }} />
                  }
                  <span
                    className="text-[10px]"
                    style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}
                  >
                    {formatDate(entry.date)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl max-h-[80vh] overflow-y-auto"
          style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border-2)" }}
        >
          {selected && (() => {
            const mood = getMood(selected.mood)
            return (
              <>
                <SheetHeader className="mb-5">
                  <div className="flex items-center gap-3">
                    {mood && <MoodBlob moodId={mood.id} color={mood.color} size={22} />}
                    <div>
                      <SheetTitle
                        className="text-left text-[22px] font-light"
                        style={{ fontFamily: "var(--font-serif)", fontWeight: 300, color: "var(--fg)" }}
                      >
                        {mood?.label}
                      </SheetTitle>
                      <p className="text-[11px]" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}>
                        {formatFullDate(selected.date)}
                      </p>
                    </div>
                  </div>
                </SheetHeader>
                <div
                  className="text-[15px] leading-relaxed mb-4"
                  style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}
                  dangerouslySetInnerHTML={{ __html: selected.content }}
                />
                {selected.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pb-4">
                    {selected.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-3 py-1 text-[11px]"
                        style={{
                          fontFamily: "var(--font-sans)",
                          border: "1px solid var(--border-2)",
                          color: "var(--fg-2)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )
          })()}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatFullDate(iso: string) {
  const d = new Date(iso + "T00:00:00")
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
}
