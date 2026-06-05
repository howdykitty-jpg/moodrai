"use client"

import { useState } from "react"
import { useStore } from "@/store/useStore"
import { Tag } from "@/lib/types"
import { MoodBlob } from "@/components/mood/MoodBlob"

export default function ProfilePage() {
  const { settings, updateSettings, clearAll, entries } = useStore()
  const [name, setName] = useState(settings.name)
  const [newTagLabel, setNewTagLabel] = useState("")
  const [confirmClear, setConfirmClear] = useState(false)
  const [editingMoodId, setEditingMoodId] = useState<string | null>(null)
  const [editingMoodLabel, setEditingMoodLabel] = useState("")

  function saveName() {
    updateSettings({ name: name.trim() || "You" })
  }

  function startEditMood(mood: { id: string; label: string }) {
    setEditingMoodId(mood.id)
    setEditingMoodLabel(mood.label)
  }

  function saveMoodLabel(id: string) {
    if (!editingMoodLabel.trim()) return
    updateSettings({
      moods: settings.moods.map((m) => (m.id === id ? { ...m, label: editingMoodLabel.trim() } : m)),
    })
    setEditingMoodId(null)
  }

  function removeMood(id: string) {
    updateSettings({ moods: settings.moods.filter((m) => m.id !== id) })
  }

  function addTag() {
    if (!newTagLabel.trim()) return
    const tag: Tag = {
      id: `custom-${Date.now()}`,
      label: newTagLabel.trim(),
      isDefault: false,
    }
    updateSettings({ tags: [...settings.tags, tag] })
    setNewTagLabel("")
  }

  function removeTag(id: string) {
    updateSettings({ tags: settings.tags.filter((t) => t.id !== id) })
  }

  const uniqueDays = new Set(entries.map((e) => e.date)).size

  return (
    <div className="px-5 pt-12 pb-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[2.6rem] font-light leading-tight tracking-tight text-[#1C1917]" style={{ fontFamily: "var(--font-serif)" }}>
          Profile
        </h1>
        <p className="mt-1 text-[13px] text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
          Personalize your MooDrai.
        </p>
      </div>

      {/* Name card */}
      <section className="mb-4 rounded-2xl border border-[#DDD9D0] bg-[#F5F2EC] p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#DDD9D0] flex items-center justify-center flex-shrink-0">
            <span className="text-xl text-[#3A3630]" style={{ fontFamily: "var(--font-serif)" }}>
              {settings.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-[18px] font-light text-[#1C1917]" style={{ fontFamily: "var(--font-serif)" }}>
              {settings.name}
            </p>
            <p className="text-[11px] text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
              {entries.length} entries · {uniqueDays} days tracked
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={saveName}
            onKeyDown={(e) => e.key === "Enter" && saveName()}
            placeholder="Your name"
            className="flex-1 rounded-full border border-[#DDD9D0] bg-[#EDEAE5] px-4 py-2.5 text-[13px] text-[#1C1917] outline-none focus:border-[#1C1917] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          />
          <button
            onClick={saveName}
            className="rounded-full px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-colors"
            style={{
              fontFamily: "var(--font-sans)",
              backgroundColor: "#1C1917",
              color: "#EDEAE5",
            }}
          >
            Save
          </button>
        </div>
      </section>

      {/* Moods */}
      <section className="mb-4 rounded-2xl border border-[#DDD9D0] bg-[#F5F2EC] p-5">
        <p className="mb-4 text-[10px] tracking-[0.18em] uppercase text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
          Moods
        </p>
        <div className="flex flex-col gap-1">
          {settings.moods.map((mood) => (
            <div key={mood.id} className="flex items-center gap-3 py-1">
              <MoodBlob moodId={mood.id} color={mood.color} size={32} />

              {editingMoodId === mood.id ? (
                <input
                  autoFocus
                  value={editingMoodLabel}
                  onChange={(e) => setEditingMoodLabel(e.target.value)}
                  onBlur={() => saveMoodLabel(mood.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveMoodLabel(mood.id)
                    if (e.key === "Escape") setEditingMoodId(null)
                  }}
                  className="flex-1 rounded-full border border-[#1C1917] bg-[#EDEAE5] px-3 py-1 text-[13px] text-[#1C1917] outline-none"
                  style={{ fontFamily: "var(--font-sans)" }}
                />
              ) : (
                <span
                  className="flex-1 text-[13px] text-[#1C1917]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {mood.label}
                </span>
              )}

              <button
                onClick={() => startEditMood(mood)}
                className="text-[11px] text-[#8A8680] hover:text-[#1C1917] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Tags */}
      <section className="mb-4 rounded-2xl border border-[#DDD9D0] bg-[#F5F2EC] p-5">
        <p className="mb-4 text-[10px] tracking-[0.18em] uppercase text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
          Tags
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {settings.tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1.5 rounded-full border border-[#DDD9D0] pl-3.5 pr-2.5 py-1.5"
            >
              <span className="text-[12px] text-[#1C1917]" style={{ fontFamily: "var(--font-sans)" }}>
                {tag.label}
              </span>
              {!tag.isDefault && (
                <button
                  onClick={() => removeTag(tag.id)}
                  className="text-[#3A3630] hover:text-[#1C1917] transition-colors leading-none"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-3 border-t border-[#DDD9D0]">
          <input
            value={newTagLabel}
            onChange={(e) => setNewTagLabel(e.target.value)}
            placeholder="New tag..."
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            className="flex-1 rounded-full border border-[#DDD9D0] bg-[#EDEAE5] px-4 py-2.5 text-[13px] outline-none focus:border-[#1C1917] transition-colors"
            style={{ fontFamily: "var(--font-sans)" }}
          />
          <button
            onClick={addTag}
            disabled={!newTagLabel.trim()}
            className="rounded-full px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-all disabled:opacity-40"
            style={{
              fontFamily: "var(--font-sans)",
              backgroundColor: "#1C1917",
              color: "#EDEAE5",
            }}
          >
            Add
          </button>
        </div>
      </section>

      {/* Clear data */}
      <section className="rounded-2xl border border-[#DDD9D0] bg-[#F5F2EC] p-5">
        <p className="mb-3 text-[10px] tracking-[0.18em] uppercase text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
          Data
        </p>
        {confirmClear ? (
          <div className="flex flex-col gap-3">
            <p className="text-[13px] text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
              This will delete all entries and reset settings.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { clearAll(); setConfirmClear(false) }}
                className="flex-1 rounded-full px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase bg-[#1C1917] text-[#EDEAE5] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Delete all
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 rounded-full px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase border border-[#DDD9D0] text-[#3A3630] hover:border-[#1C1917] hover:text-[#1C1917] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setConfirmClear(true)}
              className="rounded-full border border-[#DDD9D0] px-12 py-3 text-[15px] text-[#3A3630] hover:border-[#1C1917] hover:text-[#1C1917] transition-colors"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Clear all data
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
