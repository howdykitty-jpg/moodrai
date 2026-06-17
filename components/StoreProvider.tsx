"use client"

import { useEffect } from "react"
import { useStore } from "@/store/useStore"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const loadFromSupabase = useStore((s) => s.loadFromSupabase)

  useEffect(() => {
    loadFromSupabase()
  }, [loadFromSupabase])

  return <>{children}</>
}
