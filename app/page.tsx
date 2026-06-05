"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem("moodrai-started")) {
      router.replace("/journal")
    } else {
      router.replace("/start")
    }
  }, [router])

  return null
}
