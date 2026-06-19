"use client"

import { useEffect } from "react"
import { useStore } from "@/store/useStore"
import { supabase } from "@/lib/supabase"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const loadFromSupabase = useStore((s) => s.loadFromSupabase)

  useEffect(() => {
    loadFromSupabase()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        loadFromSupabase()
      }
    })

    return () => subscription.unsubscribe()
  }, [loadFromSupabase])

  return <>{children}</>
}
