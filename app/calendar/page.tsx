"use client"

import { useStore } from "@/store/useStore"
import { MoodCalendar } from "@/components/calendar/MoodCalendar"
import { EmotionalTimeline } from "@/components/timeline/EmotionalTimeline"

export default function CalendarPage() {
  const { entries, settings } = useStore()

  return (
    <div className="px-5 pt-12 pb-6">
      <div className="mb-8">
        <h1 className="text-[2.6rem] font-light leading-tight tracking-tight text-[#1C1917]" style={{ fontFamily: "var(--font-serif)" }}>
          History
        </h1>
        <p className="mt-1 text-[13px] text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
          Your emotional journey at a glance.
        </p>
      </div>

      <MoodCalendar entries={entries} moods={settings.moods} />

      <div className="mt-8 mb-4 flex items-center gap-3">
        <div className="flex-1 h-px bg-[#DDD9D0]" />
        <span className="text-[10px] tracking-[0.18em] uppercase text-[#8A8680]" style={{ fontFamily: "var(--font-sans)" }}>
          Timeline
        </span>
        <div className="flex-1 h-px bg-[#DDD9D0]" />
      </div>

      <EmotionalTimeline entries={entries} moods={settings.moods} />
    </div>
  )
}
