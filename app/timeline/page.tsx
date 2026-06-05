"use client"

import { useStore } from "@/store/useStore"
import { EmotionalTimeline } from "@/components/timeline/EmotionalTimeline"

export default function TimelinePage() {
  const { entries, settings } = useStore()

  return (
    <div className="px-5 pt-12 pb-6">
      <div className="mb-8">
        <h1 className="text-[2.6rem] font-light leading-tight tracking-tight text-[#1C1917]" style={{ fontFamily: "var(--font-serif)" }}>
          Timeline
        </h1>
        <p className="mt-1 text-[13px] text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
          Your emotional journey, day by day.
        </p>
      </div>
      <EmotionalTimeline entries={entries} moods={settings.moods} />
    </div>
  )
}
