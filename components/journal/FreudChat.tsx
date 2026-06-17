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
    <div
      className="fixed left-0 right-0 z-30 overflow-y-auto"
      style={{
        bottom: "calc(max(env(safe-area-inset-bottom, 0px), 12px) + 60px)",
        maxHeight: "45vh",
        background: "var(--surface-2)",
        borderTop: "1px solid var(--border-2)",
        padding: "16px 20px 8px",
      }}
    >
      <div className="mx-auto max-w-md flex flex-col gap-4">
        <p
          className="text-[9px] tracking-[0.22em] uppercase mb-1"
          style={{ fontFamily: "var(--font-sans)", color: "var(--fg-3)" }}
        >
          Sigmund Freud
        </p>

        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <p
                className="max-w-[80%] text-[14px] leading-[1.6]"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  color: "var(--fg-3)",
                  textAlign: "right",
                }}
              >
                {msg.content}
              </p>
            ) : (
              <p
                className="max-w-[88%] text-[15px] leading-[1.7]"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--fg)",
                }}
              >
                {msg.content}
              </p>
            )}
          </div>
        ))}

        {thinking && <ThinkingDots />}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5" aria-label="Freud pisze...">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block rounded-full"
          style={{
            width: 4,
            height: 4,
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
