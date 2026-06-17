"use client"

import { useStore } from "@/store/useStore"
import { EmotionalTimeline } from "@/components/timeline/EmotionalTimeline"

export default function TimelinePage() {
  const { entries, settings, hydrated } = useStore()

  return (
    <div className="px-5 pt-8 pb-6">
      {!hydrated ? (
        <div className="flex flex-col gap-3 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-2xl animate-pulse" style={{ background: "var(--border-2)" }} />
          ))}
        </div>
      ) : (
        <EmotionalTimeline entries={entries} moods={settings.moods} />
      )}
    </div>
  )
}
