"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Entry, UserSettings } from "@/lib/types"
import { DEFAULT_MOODS, DEFAULT_TAGS } from "@/constants/defaults"
import { supabase } from "@/lib/supabase"

interface Store {
  entries: Entry[]
  settings: UserSettings
  hydrated: boolean
  addEntry: (entry: Entry) => Promise<void>
  updateEntry: (id: string, updates: Partial<Entry>) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  updateSettings: (updates: Partial<UserSettings>) => void
  clearAll: () => void
  loadFromSupabase: () => Promise<void>
}

const defaultSettings: UserSettings = {
  name: "Kate",
  moods: DEFAULT_MOODS,
  tags: DEFAULT_TAGS,
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      entries: [],
      settings: defaultSettings,
      hydrated: false,

      addEntry: async (entry) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        set((state) => ({ entries: [entry, ...state.entries] }))
        const { error } = await supabase.from("entries").insert({
          id: entry.id,
          date: entry.date,
          timestamp: entry.timestamp,
          content: entry.content,
          mood: entry.mood,
          tags: entry.tags,
          user_id: user.id,
        })
        if (error) {
          set((state) => ({ entries: state.entries.filter((e) => e.id !== entry.id) }))
          console.error("addEntry failed:", error.message)
        }
      },

      updateEntry: async (id, updates) => {
        const previous = get().entries.find((e) => e.id === id)
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }))
        const { error } = await supabase.from("entries").update(updates).eq("id", id)
        if (error && previous) {
          set((state) => ({
            entries: state.entries.map((e) => (e.id === id ? previous : e)),
          }))
          console.error("updateEntry failed:", error.message)
        }
      },

      deleteEntry: async (id) => {
        const previous = get().entries.find((e) => e.id === id)
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) }))
        const { error } = await supabase.from("entries").delete().eq("id", id)
        if (error && previous) {
          set((state) => ({ entries: [previous, ...state.entries] }))
          console.error("deleteEntry failed:", error.message)
        }
      },

      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),

      clearAll: () => set({ entries: [], settings: defaultSettings }),

      loadFromSupabase: async () => {
        const { data, error } = await supabase
          .from("entries")
          .select("id, date, timestamp, content, mood, tags")
          .order("timestamp", { ascending: false })
        if (!error && data) {
          set({ entries: data as Entry[], hydrated: true })
        } else {
          if (error) console.error("loadFromSupabase failed:", error.message)
          set({ hydrated: true })
        }
      },
    }),
    {
      name: "moodrai-store",
      version: 2,
      partialize: (state) => ({ settings: state.settings }),
      migrate: (state: any, version) => {
        if (version < 2) {
          const existingIds = new Set<string>(state.settings?.moods?.map((m: any) => m.id) ?? [])
          const newMoods = DEFAULT_MOODS.filter((m) => !existingIds.has(m.id))
          state.settings = {
            ...state.settings,
            moods: [...(state.settings?.moods ?? []), ...newMoods],
          }
        }
        return state
      },
    }
  )
)
