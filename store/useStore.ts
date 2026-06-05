"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Entry, UserSettings } from "@/lib/types"
import { DEFAULT_MOODS, DEFAULT_TAGS } from "@/constants/defaults"

interface Store {
  entries: Entry[]
  settings: UserSettings
  addEntry: (entry: Entry) => void
  updateEntry: (id: string, updates: Partial<Entry>) => void
  deleteEntry: (id: string) => void
  updateSettings: (updates: Partial<UserSettings>) => void
  clearAll: () => void
}

const defaultSettings: UserSettings = {
  name: "Kate",
  moods: DEFAULT_MOODS,
  tags: DEFAULT_TAGS,
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      entries: [],
      settings: defaultSettings,
      addEntry: (entry) =>
        set((state) => ({ entries: [entry, ...state.entries] })),
      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      deleteEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
      updateSettings: (updates) =>
        set((state) => ({ settings: { ...state.settings, ...updates } })),
      clearAll: () => set({ entries: [], settings: defaultSettings }),
    }),
    {
      name: "moodrai-store",
      version: 2,
      migrate: (state: any, version) => {
        if (version < 2) {
          // Merge new default moods — add moods not yet present, keep existing
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
