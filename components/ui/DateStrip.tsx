"use client"

import { useRef, useEffect } from "react"

interface DateStripProps {
  selected: string
  onSelect: (date: string) => void
  daysBack?: number
  dotDates?: Set<string>
}

export function DateStrip({ selected, onSelect, daysBack = 14, dotDates }: DateStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const todayISO = new Date().toISOString().split("T")[0]

  const days = Array.from({ length: daysBack }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (daysBack - 1 - i))
    return d
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1"
      style={{ scrollbarWidth: "none" }}
    >
      {days.map((d) => {
        const iso = d.toISOString().split("T")[0]
        const isToday = iso === todayISO
        const isSelected = iso === selected
        const dayLabel = isToday
          ? "TODAY"
          : d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
        const dayNum = d.getDate()
        const hasDot = dotDates?.has(iso)

        return (
          <button
            key={iso}
            onClick={() => onSelect(iso)}
            className="flex flex-col items-center rounded-xl flex-shrink-0 transition-all duration-150"
            style={{
              minWidth: 56,
              padding: "10px 12px",
              backgroundColor: isSelected ? "var(--fg)" : "var(--surface-2)",
              border: `1px solid ${isSelected ? "transparent" : "var(--border-2)"}`,
            }}
          >
            <span
              className="text-[9px] tracking-[0.12em] mb-1.5 leading-none"
              style={{
                fontFamily: "var(--font-sans)",
                color: isSelected ? "var(--btn-fg)" : "var(--fg-3)",
              }}
            >
              {dayLabel}
            </span>
            <span
              className="text-[20px] font-light leading-none"
              style={{
                fontFamily: "var(--font-serif)",
                color: isSelected ? "var(--btn-fg)" : "var(--fg)",
              }}
            >
              {dayNum}
            </span>
            <div className="mt-1.5 w-1 h-1 rounded-full transition-all duration-150" style={{
              backgroundColor: hasDot
                ? (isSelected ? "var(--btn-fg)" : "var(--fg-3)")
                : "transparent",
            }} />
          </button>
        )
      })}
    </div>
  )
}
