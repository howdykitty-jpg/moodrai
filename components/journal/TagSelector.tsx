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
    <div className="rounded-2xl p-5" style={{ border: "1px solid var(--border-2)", background: "var(--surface-2)" }}>
      <p
        className="mb-1 text-[15px] font-light"
        style={{ fontFamily: "var(--font-serif)", color: "var(--fg)" }}
      >
        What was this about?
      </p>
      <p className="mb-4 text-[13px]" style={{ fontFamily: "var(--font-sans)", color: "var(--fg-2)" }}>
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
                backgroundColor: active ? "var(--fg)" : "transparent",
                color: active ? "var(--btn-fg)" : "var(--fg-2)",
                borderColor: active ? "var(--fg)" : "var(--border-2)",
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
          backgroundColor: "var(--fg)",
          color: "var(--btn-fg)",
        }}
      >
        Save entry
      </button>
    </div>
  )
}
