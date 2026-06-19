"use client"

import { useEffect, useRef } from "react"
import { ChatMessage } from "@/lib/types"

interface Props {
  history: ChatMessage[]
  thinking: boolean
}

export function FreudChatMessages({ history, thinking }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [history, thinking])

  return (
    <div className="flex flex-col gap-3">
      {history.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          {msg.role === "user" ? (
            <div
              className="max-w-[72%] rounded-[20px] px-4 py-2.5"
              style={{ background: "var(--fg)", color: "var(--background)" }}
            >
              <p className="text-[14px] leading-[1.55]" style={{ fontFamily: "var(--font-serif)" }}>
                {msg.content}
              </p>
            </div>
          ) : (
            <div
              className="w-full rounded-[18px] px-5 py-4"
              style={{ background: "var(--surface-3, #EBEBEA)" }}
            >
              <p className="text-[15px] leading-[1.75]" style={{ fontFamily: "var(--font-serif)", color: "var(--fg)" }}>
                {msg.content}
              </p>
            </div>
          )}
        </div>
      ))}

      {thinking && (
        <div
          className="inline-flex items-center gap-1.5 rounded-[18px] px-5 py-4 w-full"
          style={{ background: "var(--surface-3, #EBEBEA)" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="inline-block rounded-full"
              style={{
                width: 5,
                height: 5,
                background: "var(--fg-3)",
                animation: `freud-dot 1.2s ease-in-out ${i * 0.22}s infinite`,
              }}
            />
          ))}
          <style>{`
            @keyframes freud-dot {
              0%, 60%, 100% { opacity: 0.25; transform: scale(0.8); }
              30% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
