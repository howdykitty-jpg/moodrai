import { createBrowserClient } from "@supabase/ssr"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(url, key)

export type EntryRow = {
  id: string
  date: string
  timestamp: number
  content: string
  mood: string
  tags: string[]
  created_at: string
  updated_at: string
}
