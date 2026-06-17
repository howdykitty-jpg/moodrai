export interface Entry {
  id: string
  date: string
  timestamp: number
  content: string
  mood: string
  tags: string[]
}

export interface Mood {
  id: string
  label: string
  emoji: string
  color: string
  isDefault: boolean
}

export interface Tag {
  id: string
  label: string
  isDefault: boolean
}

export interface UserSettings {
  name: string
  moods: Mood[]
  tags: Tag[]
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}
