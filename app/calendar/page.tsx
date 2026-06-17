"use client"

import { useState } from "react"
import { useStore } from "@/store/useStore"
import { DateStrip } from "@/components/ui/DateStrip"
import { MoodBlob } from "@/components/mood/MoodBlob"

function parseContent(html: string): { text: string; imgSrc: string | null } {
  const imgMatch = html.match(/<img[^>]+src="([^"]+)"/)
  const imgSrc = imgMatch ? imgMatch[1] : null
  const text = html.replace(/<img[^>]+>/g, "").replace(/<[^>]+>/g, "").trim()
  return { text, imgSrc }
}

function buildContent(text: string, imgSrc: string | null): string {
  const imgHtml = imgSrc
    ? `<img src="${imgSrc}" alt="" style="max-width:100%;border-radius:16px;margin-top:12px;" />`
    : ""
  return `<p>${text}</p>${imgHtml}`
}

export default function CalendarPage() {
  const { entries, settings, hydrated, updateEntry, deleteEntry } = useStore()
  const today = new Date().toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [activeCardId, setActiveCardId] = useState<string | null>(null)

  const dotDates = new Set(entries.map((e) => e.date))
  const dateEntries = entries
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => b.timestamp - a.timestamp)
  const getMood = (id: string) => settings.moods.find((m) => m.id === id)

  const selectedLabel = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  function startEdit(id: string, currentText: string) {
    setEditingId(id)
    setEditText(currentText)
    setConfirmDeleteId(null)
  }

  function saveEdit(entry: { id: string; content: string }) {
    const { imgSrc } = parseContent(entry.content)
    updateEntry(entry.id, { content: buildContent(editText.trim(), imgSrc) })
    setEditingId(null)
  }

  function handleDelete(id: string) {
    deleteEntry(id)
    setConfirmDeleteId(null)
  }

  return (
    <div className="px-5 pt-8 pb-6">
      {/* Date strip */}
      <div className="mb-6">
        <DateStrip
          selected={selectedDate}
          onSelect={(d) => { setSelectedDate(d); setEditingId(null); setConfirmDeleteId(null) }}
          dotDates={dotDates}
          daysBack={30}
        />
      </div>

      {/* Selected date label */}
      <p className="mb-5 text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}>
        {selectedLabel}
      </p>

      {/* Entries */}
      {!hydrated ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: "var(--border-2)" }} />
          ))}
        </div>
      ) : dateEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}>
            Nothing here yet
          </p>
          <p className="text-[13px]" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}>
            No entries for this day.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {dateEntries.map((entry) => {
            const mood = getMood(entry.mood)
            const { text, imgSrc } = parseContent(entry.content)
            const isEditing = editingId === entry.id
            const isConfirmDelete = confirmDeleteId === entry.id

            return (
              <div
                key={entry.id}
                className="group rounded-2xl p-5"
                style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}
                onClick={() => {
                  if (editingId === entry.id || confirmDeleteId === entry.id) return
                  setActiveCardId((prev) => (prev === entry.id ? null : entry.id))
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-3">
                  {mood && <MoodBlob moodId={mood.id} color={mood.color} size={20} />}
                  <span
                    className="text-[11px] uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}
                  >
                    {mood?.label}
                  </span>
                  <span
                    className="text-[11px]"
                    style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}
                  >
                    {new Date(entry.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <div className={`ml-auto flex items-center gap-3 transition-opacity duration-150 ${isEditing || isConfirmDelete || activeCardId === entry.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    <button
                      onClick={(e) => { e.stopPropagation(); isEditing ? setEditingId(null) : startEdit(entry.id, text) }}
                      style={{ color: isEditing ? "var(--fg)" : "var(--fg-3)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(isConfirmDelete ? null : entry.id) }}
                      style={{ color: isConfirmDelete ? "#B43C3C" : "var(--fg-3)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm delete */}
                {isConfirmDelete && (
                  <div className="mb-3 flex items-center gap-3">
                    <p className="flex-1 text-[12px]" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}>
                      Delete this entry?
                    </p>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="rounded-full px-3 py-1 text-[11px] tracking-[0.08em] uppercase"
                      style={{ background: "#B43C3C", color: "#fff", fontFamily: "var(--font-sans)" }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-full px-3 py-1 text-[11px] tracking-[0.08em] uppercase"
                      style={{ border: "1px solid var(--border-2)", color: "var(--fg-2)", fontFamily: "var(--font-sans)" }}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Content */}
                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <textarea
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-xl px-4 py-3 text-[15px] leading-relaxed outline-none"
                      style={{
                        fontFamily: "var(--font-serif)",
                        border: "1px solid var(--border-2)",
                        background: "var(--surface)",
                        color: "var(--fg)",
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(entry)}
                        className="rounded-full px-4 py-2 text-[11px] tracking-[0.1em] uppercase"
                        style={{ background: "var(--fg)", color: "var(--btn-fg)", fontFamily: "var(--font-sans)" }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-full px-4 py-2 text-[11px] tracking-[0.1em] uppercase"
                        style={{ border: "1px solid var(--border-2)", color: "var(--fg-2)", fontFamily: "var(--font-sans)" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <p
                      className="flex-1 text-[15px] leading-relaxed"
                      style={{ fontFamily: "var(--font-serif)", color: "var(--fg)" }}
                    >
                      {text}
                    </p>
                    {imgSrc && (
                      <div style={{ position: "relative", flexShrink: 0, marginTop: 4 }}>
                        {/* Pin */}
                        <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
                          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                            <circle cx="8" cy="6" r="5" fill="#7C3AED" />
                            <circle cx="8" cy="6" r="2.5" fill="rgba(255,255,255,0.35)" />
                            <line x1="8" y1="11" x2="8" y2="20" stroke="#5b21b6" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgSrc}
                          alt=""
                          style={{
                            width: 68,
                            height: 68,
                            objectFit: "cover",
                            borderRadius: 10,
                            transform: "rotate(-2deg)",
                            boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {entry.tags.length > 0 && !isEditing && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {entry.tags.map((t) => (
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
