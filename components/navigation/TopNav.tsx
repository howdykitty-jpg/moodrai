"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { href: "/journal", label: "Journal" },
  { href: "/calendar", label: "History" },
  { href: "/aura", label: "Aura" },
  { href: "/profile", label: "You" },
]

export function TopNav() {
  const pathname = usePathname()

  if (["/start", "/login", "/register"].includes(pathname)) return null

  return (
    <nav
      className="flex items-center justify-around px-2"
      style={{
        height: 44,
        borderBottom: "1px solid var(--border-2)",
        background: "var(--background)",
        flexShrink: 0,
      }}
    >
      {nav.map(({ href, label }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-1 px-4 py-2 transition-opacity duration-200"
            style={{ opacity: active ? 1 : 0.38 }}
          >
            <span
              className="text-[9px] tracking-[0.18em] uppercase"
              style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}
            >
              {label}
            </span>
            {active && (
              <span
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: "50%",
                  background: "var(--fg)",
                  display: "block",
                }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
