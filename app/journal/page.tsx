"use client"

import { useState } from "react"
import { useStore } from "@/store/useStore"
import { JournalEditor } from "@/components/journal/JournalEditor"
import { MoodSelector } from "@/components/journal/MoodSelector"
import { TagSelector } from "@/components/journal/TagSelector"
import { Entry } from "@/lib/types"

function Sparkle({ size, opacity = 1 }: { size: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#5B78D4" style={{ opacity }}>
      <path d="M12 2C12 2 12.8 8.2 18 9.5C12.8 10.8 12 17 12 17C12 17 11.2 10.8 6 9.5C11.2 8.2 12 2 12 2Z" />
      <path d="M20 4C20 4 20.4 6.6 22 7C20.4 7.4 20 10 20 10C20 10 19.6 7.4 18 7C19.6 6.6 20 4 20 4Z" />
    </svg>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

function todayISO() {
  return new Date().toISOString().split("T")[0]
}

type Step = "write" | "tags" | "done"

export default function JournalPage() {
  const { settings, entries, addEntry } = useStore()
  const [content, setContent] = useState("")
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [step, setStep] = useState<Step>("write")

  const today = todayISO()
  const todayEntries = entries.filter((e) => e.date === today)

  function handleSave() {
    if (!content || content === "<p></p>" || !selectedMood) return
    setStep("tags")
  }

  function toggleTag(id: string) {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  function handleConfirm() {
    const entry: Entry = {
      id: crypto.randomUUID(),
      date: today,
      timestamp: Date.now(),
      content,
      mood: selectedMood!,
      tags: selectedTags,
    }
    addEntry(entry)
    setContent("")
    setSelectedMood(null)
    setSelectedTags([])
    setStep("done")
    setTimeout(() => setStep("write"), 2000)
  }

  const todayLabel = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).toUpperCase()

  return (
    <div className="px-5 pt-12 pb-6">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[13px] text-[#3A3630] mb-1" style={{ fontFamily: "var(--font-sans)" }}>
          {getGreeting()}, {settings.name}
        </p>
        <h1 className="text-[2.6rem] font-light leading-tight tracking-tight text-[#1C1917]" style={{ fontFamily: "var(--font-serif)" }}>
          How was your day?
        </h1>
        <p className="mt-1.5 text-[13px] text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
          Write freely. Be honest. It&apos;s just for you.
        </p>
      </div>

      {todayEntries.length > 0 && step === "write" && (
        <div className="mb-5 rounded-2xl border border-[#DDD9D0] bg-[#F5F2EC] px-4 py-3">
          <p className="text-[12px] text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
            You already have {todayEntries.length} {todayEntries.length === 1 ? "entry" : "entries"} today. You can add another.
          </p>
        </div>
      )}

      {step === "done" ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#DDD9D0] bg-[#F5F2EC] py-14">
          <div className="w-12 h-12 rounded-full bg-[#DDD9D0] flex items-center justify-center mb-4">
            <div className="w-3 h-3 rounded-full bg-[#1C1917]" />
          </div>
          <p className="text-base text-[#1C1917]" style={{ fontFamily: "var(--font-serif)" }}>Entry saved.</p>
          <p className="mt-1 text-[12px] text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>See you tomorrow. Take care.</p>
        </div>
      ) : step === "tags" ? (
        <TagSelector
          tags={settings.tags}
          selected={selectedTags}
          onToggle={toggleTag}
          onConfirm={handleConfirm}
        />
      ) : (
        <div className="flex flex-col gap-5">
          <JournalEditor content={content} onChange={setContent} />

          <div>
            <p className="mb-4 text-[10px] tracking-[0.18em] uppercase text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
              How are you feeling right now?
            </p>
            <MoodSelector
              moods={settings.moods}
              selected={selectedMood}
              onSelect={setSelectedMood}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSave}
              disabled={!selectedMood || !content || content === "<p></p>"}
              className="rounded-full text-[11px] tracking-[0.18em] uppercase transition-all duration-200 disabled:cursor-not-allowed"
              style={{
                fontFamily: "var(--font-sans)",
                paddingTop: "0.65rem",
                paddingBottom: "0.65rem",
                paddingLeft: "2.8rem",
                paddingRight: "2.8rem",
                backgroundColor: (!selectedMood || !content || content === "<p></p>") ? "#DDD9D0" : "#1C1A18",
                color: (!selectedMood || !content || content === "<p></p>") ? "#3A3630" : "#EDEAE5",
              }}
            >
              Save entry
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
