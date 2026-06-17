"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/store/useStore"
import { Tag } from "@/lib/types"
import { MoodBlob } from "@/components/mood/MoodBlob"
import { supabase } from "@/lib/supabase"
import { useTheme } from "@/components/ThemeProvider"

export default function ProfilePage() {
  const router = useRouter()
  const { settings, updateSettings, clearAll, entries } = useStore()
  const { theme, toggle: toggleTheme } = useTheme()
  const [name, setName] = useState(settings.name)
  const [newTagLabel, setNewTagLabel] = useState("")
  const [confirmClear, setConfirmClear] = useState(false)
  const [editingMoodId, setEditingMoodId] = useState<string | null>(null)
  const [editingMoodLabel, setEditingMoodLabel] = useState("")
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setUserEmail(user.email)
    })
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

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
    <div className="px-5 pt-8 pb-6">

      {/* Name card */}
      <section className="mb-4 rounded-2xl p-5" style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}>
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--border-2)" }}
          >
            <span className="text-xl" style={{ fontFamily: "var(--font-serif)", color: "var(--fg-2)" }}>
              {settings.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[18px] font-light" style={{ fontFamily: "var(--font-serif)", color: "var(--fg)" }}>
              {settings.name}
            </p>
            <p className="text-[11px] truncate" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}>
              {userEmail || "—"}
            </p>
            <p className="text-[11px]" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}>
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
            className="flex-1 rounded-full px-4 py-2.5 text-[13px] outline-none transition-colors"
            style={{
              fontFamily: "var(--font-sans)",
              border: "1px solid var(--border-2)",
              background: "var(--surface)",
              color: "var(--fg)",
            }}
          />
          <button
            onClick={saveName}
            className="rounded-full px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-colors"
            style={{
              fontFamily: "var(--font-sans)",
              backgroundColor: "var(--fg)",
              color: "var(--btn-fg)",
            }}
          >
            Save
          </button>
        </div>
      </section>

      {/* Moods */}
      <section className="mb-4 rounded-2xl p-5" style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}>
        <p className="mb-4 text-[10px] tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}>
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
                  className="flex-1 rounded-full px-3 py-1 text-[13px] outline-none"
                  style={{
                    fontFamily: "var(--font-sans)",
                    border: "1px solid var(--fg)",
                    background: "var(--surface)",
                    color: "var(--fg)",
                  }}
                />
              ) : (
                <span
                  className="flex-1 text-[13px]"
                  style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}
                >
                  {mood.label}
                </span>
              )}

              <button
                onClick={() => startEditMood(mood)}
                className="text-[11px] transition-colors"
                style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Tags */}
      <section className="mb-4 rounded-2xl p-5" style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}>
        <p className="mb-4 text-[10px] tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}>
          Tags
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {settings.tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-1.5 rounded-full pl-3.5 pr-2.5 py-1.5"
              style={{ border: "1px solid var(--border-2)" }}
            >
              <span className="text-[12px]" style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>
                {tag.label}
              </span>
              {!tag.isDefault && (
                <button
                  onClick={() => removeTag(tag.id)}
                  className="transition-colors leading-none"
                  style={{ color: "var(--fg-3)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid var(--border-2)" }}>
          <input
            value={newTagLabel}
            onChange={(e) => setNewTagLabel(e.target.value)}
            placeholder="New tag..."
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            className="flex-1 rounded-full px-4 py-2.5 text-[13px] outline-none transition-colors"
            style={{
              fontFamily: "var(--font-sans)",
              border: "1px solid var(--border-2)",
              background: "var(--surface)",
              color: "var(--fg)",
            }}
          />
          <button
            onClick={addTag}
            disabled={!newTagLabel.trim()}
            className="rounded-full px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-all disabled:opacity-40"
            style={{
              fontFamily: "var(--font-sans)",
              backgroundColor: "var(--fg)",
              color: "var(--btn-fg)",
            }}
          >
            Add
          </button>
        </div>
      </section>

      {/* Appearance */}
      <section className="mb-4 rounded-2xl p-5" style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}>
        <p className="mb-3 text-[10px] tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}>
          Appearance
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[13px]" style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}>
            {theme === "light" ? "Light mode" : "Dark mode"}
          </span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[11px] tracking-[0.12em] uppercase transition-all duration-200"
            style={{
              fontFamily: "var(--font-sans)",
              background: "var(--btn-bg)",
              color: "var(--btn-fg)",
            }}
          >
            {theme === "light" ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            )}
            Switch
          </button>
        </div>
      </section>

      {/* Account */}
      <section className="mb-4 rounded-2xl p-5" style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}>
        <p className="mb-3 text-[10px] tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}>
          Account
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleSignOut}
            className="rounded-full px-12 py-3 text-[13px] transition-colors"
            style={{
              fontFamily: "var(--font-sans)",
              border: "1px solid var(--border-2)",
              color: "var(--fg-2)",
            }}
          >
            Sign out
          </button>
        </div>
      </section>

      {/* Clear data */}
      <section className="rounded-2xl p-5" style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}>
        <p className="mb-3 text-[10px] tracking-[0.18em] uppercase" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}>
          Data
        </p>
        {confirmClear ? (
          <div className="flex flex-col gap-3">
            <p className="text-[13px]" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}>
              This will delete all entries and reset settings.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => { clearAll(); setConfirmClear(false) }}
                className="flex-1 rounded-full px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-colors"
                style={{
                  fontFamily: "var(--font-sans)",
                  backgroundColor: "var(--fg)",
                  color: "var(--btn-fg)",
                }}
              >
                Delete all
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 rounded-full px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-colors"
                style={{
                  fontFamily: "var(--font-sans)",
                  border: "1px solid var(--border-2)",
                  color: "var(--fg-2)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setConfirmClear(true)}
              className="rounded-full px-12 py-3 text-[13px] transition-colors"
              style={{
                fontFamily: "var(--font-sans)",
                border: "1px solid var(--border-2)",
                color: "var(--fg-2)",
              }}
            >
              Clear all data
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
