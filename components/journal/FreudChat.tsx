"use client"

import { useEffect, useRef } from "react"
import { ChatMessage } from "@/lib/types"

interface Props {
  history: ChatMessage[]
  thinking: boolean
}

export function FreudChat({ history, thinking }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history, thinking])

  if (history.length === 0 && !thinking) return null

  return (
    <div className="flex flex-col gap-5 mb-4">
      {history.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          {msg.role === "assistant" && (
            <span
              className="mr-2 mt-1 text-[11px] tracking-[0.1em] uppercase flex-shrink-0"
              style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}
            >
              Freud
            </span>
          )}
          <div
            className="max-w-[85%] text-[15px] leading-[1.65]"
            style={{
              fontFamily: "var(--font-serif)",
              color: msg.role === "user" ? "var(--fg-3)" : "var(--fg)",
              fontStyle: msg.role === "user" ? "italic" : "normal",
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            {msg.content}
          </div>
        </div>
      ))}

      {thinking && (
        <div className="flex justify-start items-center gap-2">
          <span
            className="text-[11px] tracking-[0.1em] uppercase"
            style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}
          >
            Freud
          </span>
          <ThinkingDots />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1" aria-label="Freud pisze...">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block rounded-full"
          style={{
            width: 5,
            height: 5,
            background: "var(--fg-3)",
            animation: `freud-dot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes freud-dot {
          0%, 60%, 100% { opacity: 0.2; transform: scale(0.85); }
          30% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
