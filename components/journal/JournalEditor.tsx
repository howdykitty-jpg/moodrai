"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import CharacterCount from "@tiptap/extension-character-count"
import Placeholder from "@tiptap/extension-placeholder"
import { useRef, useState } from "react"

const LIMIT = 1000
const PURPLE = "#C090F8"

interface JournalEditorProps {
  content: string
  onChange: (html: string) => void
}

export function JournalEditor({ content, onChange }: JournalEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      CharacterCount.configure({ limit: LIMIT }),
      Placeholder.configure({ placeholder: "Today I felt..." }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "min-h-[140px] outline-none text-[15px] leading-[1.75] text-[var(--fg)]",
        style: "font-family: var(--font-sans);",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const count = editor?.storage.characterCount.characters() ?? 0

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
        if (data.text && editor) {
          editor.chain().focus().insertContent(data.text).run()
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

  return (
    <div className="rounded-2xl px-5 py-4" style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 mb-3 pb-3" style={{ borderBottom: "1px solid var(--border-2)" }}>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive("bold") ?? false}
          title="Bold"
        >
          <span className="font-semibold text-[12px]" style={{ fontFamily: "var(--font-sans)" }}>B</span>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive("italic") ?? false}
          title="Italic"
        >
          <span className="italic text-[12px]" style={{ fontFamily: "var(--font-serif)" }}>I</span>
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList") ?? false}
          title="List"
        >
          <ListIcon />
        </ToolbarBtn>

        <div className="ml-auto flex items-center gap-2">
          {transcribing && (
            <span className="text-[11px]" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}>
              transcribing…
            </span>
          )}
          <button
            type="button"
            onClick={toggleRecording}
            disabled={transcribing}
            title={recording ? "Stop recording" : "Dictate"}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150 disabled:opacity-40"
            style={{
              backgroundColor: recording ? "var(--fg)" : "transparent",
              color: recording ? "var(--btn-fg)" : "var(--fg-2)",
            }}
          >
            <MicIcon recording={recording} />
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />

      <div className="mt-3 flex items-center justify-end gap-2">
        {/* subtle sparkle near counter */}
        <Sparkle size={8} color={PURPLE} style={{ opacity: 0.5 }} />
        <span
          className="text-[11px]"
          style={{
            fontFamily: "var(--font-sans)",
            color: count >= LIMIT ? "#E8A8A8" : "var(--fg-2)",
          }}
        >
          {count}/{LIMIT}
        </span>
      </div>
    </div>
  )
}

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-150"
      style={{
        backgroundColor: active ? "var(--fg)" : "transparent",
        color: active ? "var(--btn-fg)" : "var(--fg-2)",
      }}
    >
      {children}
    </button>
  )
}

function ListIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function MicIcon({ recording }: { recording: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

function Sparkle({
  size,
  color,
  style,
}: {
  size: number
  color: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      style={style}
    >
      {/* 4-pointed star / sparkle */}
      <path d="M12 2 C12 2 13 8 18 9 C13 10 12 16 12 16 C12 16 11 10 6 9 C11 8 12 2 12 2Z" />
      <path d="M19 5 C19 5 19.5 7.5 21.5 8 C19.5 8.5 19 11 19 11 C19 11 18.5 8.5 16.5 8 C18.5 7.5 19 5 19 5Z" />
    </svg>
  )
}
