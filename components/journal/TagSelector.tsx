"use client"

import { Tag } from "@/lib/types"

interface TagSelectorProps {
  tags: Tag[]
  selected: string[]
  onToggle: (id: string) => void
  onConfirm: () => void
}

export function TagSelector({ tags, selected, onToggle, onConfirm }: TagSelectorProps) {
  return (
    <div className="rounded-2xl border border-[#DDD9D0] bg-[#F5F2EC] p-5">
      <p
        className="mb-1 text-[15px] font-light text-[#1C1917]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        What was this about?
      </p>
      <p className="mb-4 text-[13px] text-[#3A3630]" style={{ fontFamily: "var(--font-sans)" }}>
        Select all that apply. You can skip this.
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {tags.map((tag) => {
          const active = selected.includes(tag.id)
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggle(tag.id)}
              className="px-4 py-2 rounded-full text-[12px] border transition-all duration-150"
              style={{
                fontFamily: "var(--font-sans)",
                backgroundColor: active ? "#1C1917" : "transparent",
                color: active ? "#EDEAE5" : "#3A3630",
                borderColor: active ? "#1C1917" : "#DDD9D0",
                letterSpacing: "0.04em",
              }}
            >
              {tag.label}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onConfirm}
        className="w-full rounded-full py-4 text-[11px] tracking-[0.18em] uppercase transition-colors duration-150 mt-1"
        style={{
          fontFamily: "var(--font-sans)",
          backgroundColor: "#1C1917",
          color: "#EDEAE5",
        }}
      >
        Save entry
      </button>
    </div>
  )
}
