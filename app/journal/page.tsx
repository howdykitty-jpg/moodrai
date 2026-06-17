"use client"

import { useRef, useState } from "react"
import { useStore } from "@/store/useStore"
import { MoodSelector } from "@/components/journal/MoodSelector"
import { DateStrip } from "@/components/ui/DateStrip"
import { MoodBlob } from "@/components/mood/MoodBlob"
import { Entry } from "@/lib/types"

function todayISO() {
  return new Date().toISOString().split("T")[0]
}

export default function JournalPage() {
  const { settings, entries, addEntry, hydrated } = useStore()
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const [draft, setDraft] = useState("")
  const [input, setInput] = useState("")
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [attachment, setAttachment] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const dateEntries = entries
    .filter((e) => e.date === selectedDate)
    .sort((a, b) => b.timestamp - a.timestamp)
  const dotDates = new Set(entries.map((e) => e.date))
  const getMood = (id: string) => settings.moods.find((m) => m.id === id)

  const dateLabel = new Date(selectedDate + "T00:00:00")
    .toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
    .toUpperCase()

  function submitInput() {
    const text = input.trim()
    if (!text) return
    setDraft((prev) => (prev ? prev + " " + text : text))
    setInput("")
  }

  function saveWithMood(moodId: string) {
    setSelectedMood(moodId)
    const imgHtml = attachment
      ? `<img src="${attachment}" alt="" style="max-width:100%;border-radius:16px;margin-top:12px;" />`
      : ""
    const entry: Entry = {
      id: crypto.randomUUID(),
      date: selectedDate,
      timestamp: Date.now(),
      content: `<p>${draft}</p>${imgHtml}`,
      mood: moodId,
      tags: [],
    }
    addEntry(entry)
    setDraft("")
    setAttachment(null)
    setSelectedMood(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxW = 900
        const scale = Math.min(1, maxW / img.width)
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height)
        setAttachment(canvas.toDataURL("image/jpeg", 0.8))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  async function startRecording() {
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      alert("Brak dostępu do mikrofonu. Sprawdź uprawnienia w przeglądarce.")
      return
    }
    const mr = new MediaRecorder(stream)
    chunksRef.current = []
    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    mr.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop())
      setTranscribing(true)
      try {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        const form = new FormData()
        form.append("audio", blob)
        const res = await fetch("/api/transcribe", { method: "POST", body: form })
        const data = await res.json()
        if (data.text) {
          setDraft((prev) => (prev ? prev + " " + data.text : data.text))
        }
      } finally {
        setTranscribing(false)
      }
    }
    mr.start()
    mediaRecorderRef.current = mr
    setRecording(true)
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    mediaRecorderRef.current = null
    setRecording(false)
  }

  function toggleRecording() {
    if (recording) stopRecording()
    else startRecording()
  }

  const isEmpty = hydrated && dateEntries.length === 0 && !draft && !attachment && !saved

  return (
    <div className="px-5 pt-6" style={{ paddingBottom: "5rem" }}>
      {/* Date strip */}
      <div className="mb-6">
        <DateStrip
          selected={selectedDate}
          onSelect={(d) => setSelectedDate(d)}
          dotDates={dotDates}
          daysBack={14}
        />
      </div>

      {/* Date label */}
      <p
        className="mb-6 text-[10px] tracking-[0.2em] uppercase"
        style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}
      >
        {dateLabel}
      </p>

      {/* Saved confirmation */}
      {saved && (
        <p
          className="mb-8 text-[13px]"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--fg-2)" }}
        >
          Entry saved. Take care.
        </p>
      )}

      {/* Draft — frameless, appears under the calendar */}
      {(draft || attachment) && (
        <div className="mb-10">
          {draft && (
            <div
              className="text-[17px] leading-[1.7] mb-5"
              style={{ fontFamily: "var(--font-serif)", color: "var(--fg)" }}
            >
              {draft}
            </div>
          )}
          {attachment && (
            <div className="relative mb-7 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={attachment}
                alt=""
                className="rounded-2xl"
                style={{ maxWidth: "100%", maxHeight: 260 }}
              />
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}
              >
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}
          <p
            className="mb-4 text-[10px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}
          >
            How did it feel?
          </p>
          <MoodSelector
            moods={settings.moods}
            selected={selectedMood}
            onSelect={saveWithMood}
          />
        </div>
      )}

      {/* Empty state */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center pt-20 text-center">
          <p
            className="mb-10 text-[11px] tracking-[0.24em] uppercase"
            style={{ fontFamily: "var(--font-serif)", color: "var(--fg-3)" }}
          >
            Nothing here yet
          </p>
          <div className="relative mb-6" style={{ width: 80, height: 80 }}>
            <button
              type="button"
              onClick={toggleRecording}
              className="flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-200 active:scale-95"
              style={{
                background: recording ? "rgba(239,68,68,0.08)" : "var(--btn-bg)",
                border: recording ? "2px solid #EF4444" : "none",
                color: recording ? "#EF4444" : "var(--btn-fg)",
              }}
            >
              <MicIcon recording={recording} size={26} />
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 active:scale-95"
              style={{
                top: -28,
                right: -68,
                background: "var(--btn-bg)",
                color: "var(--btn-fg)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
          </div>
          <p
            className="text-[14px]"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--fg-2)" }}
          >
            {transcribing ? "transcribing…" : recording ? "listening… tap to stop." : "tap to record what's on your mind."}
          </p>
        </div>
      )}

      {/* Entries — frameless */}
      {!hydrated ? (
        <div className="flex flex-col gap-4">
          <div className="h-5 w-3/4 rounded-full animate-pulse" style={{ background: "var(--border-2)" }} />
          <div className="h-5 w-1/2 rounded-full animate-pulse" style={{ background: "var(--border-2)" }} />
        </div>
      ) : (
        dateEntries.length > 0 && (
          <div className="flex flex-col gap-10">
            {dateEntries.map((entry) => {
              const mood = getMood(entry.mood)
              return (
                <div key={entry.id}>
                  <div className="flex items-center gap-2.5 mb-3">
                    {mood && <MoodBlob moodId={mood.id} color={mood.color} size={18} />}
                    <span
                      className="text-[10px] tracking-[0.16em] uppercase"
                      style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}
                    >
                      {mood?.label}
                    </span>
                    <span
                      className="ml-auto text-[10px]"
                      style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}
                    >
                      {new Date(entry.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div
                    className="text-[17px] leading-[1.7] journal-entry-content"
                    style={{ fontFamily: "var(--font-serif)", color: "var(--fg)" }}
                    dangerouslySetInnerHTML={{ __html: entry.content }}
                  />
                  {entry.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {entry.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full px-3 py-1 text-[11px]"
                          style={{ fontFamily: "var(--font-sans)", border: "1px solid var(--border-2)", color: "var(--fg-2)" }}
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
        )
      )}

{/* Bottom input bar — fixed above the nav */}
      <div
        className="fixed left-0 right-0 z-40 px-5 pb-3 pt-2"
        style={{ bottom: "max(env(safe-area-inset-bottom, 0px), 12px)", background: "transparent" }}
      >
        <div className="mx-auto flex max-w-md items-center gap-2.5">
          <div
            className="flex flex-1 items-center rounded-full px-5"
            style={{
              border: "1px solid var(--border-2)",
              background: "var(--surface-2)",
              height: 48,
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitInput()}
              placeholder={transcribing ? "transcribing…" : "what's on your mind?"}
              disabled={transcribing}
              className="w-full bg-transparent outline-none text-[14px]"
              style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--fg)" }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach image"
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ml-1 transition-opacity"
              style={{ color: attachment ? "var(--fg)" : "var(--fg-3)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
            {input.trim() && (
              <button
                type="button"
                onClick={submitInput}
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ml-2"
                style={{ background: "var(--btn-bg)", color: "var(--btn-fg)" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5" />
                  <path d="M5 12l7-7 7 7" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={toggleRecording}
            disabled={transcribing}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-transform duration-200 active:scale-95 disabled:opacity-40"
            style={{
              background: recording ? "rgba(239,68,68,0.08)" : "var(--btn-bg)",
              border: recording ? "2px solid #EF4444" : "none",
              color: recording ? "#EF4444" : "var(--btn-fg)",
              boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
            }}
          >
            <MicIcon recording={recording} size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

function MicIcon({ recording, size }: { recording: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {recording ? (
        <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
      ) : (
        <>
          <rect x="9" y="2" width="6" height="11" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="8" y1="22" x2="16" y2="22" />
        </>
      )}
    </svg>
  )
}
