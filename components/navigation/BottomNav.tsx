"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { href: "/journal", label: "Journal", icon: JournalIcon },
  { href: "/calendar", label: "History", icon: HistoryIcon },
  { href: "/aura", label: "Aura", icon: AuraIcon },
  { href: "/profile", label: "You", icon: ProfileIcon },
]

export function BottomNav() {
  const pathname = usePathname()

  if (["/start", "/login", "/register"].includes(pathname)) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm md:static md:z-auto md:backdrop-blur-none" style={{ borderTop: "1px solid var(--border-2)", background: "var(--nav-bg)" }}>
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2.5 pointer-events-none opacity-30">
        {nav.map(({ href, label, icon: Icon }) => (
          <div
            key={href}
            className="flex flex-col items-center gap-1 px-3 py-1"
          >
            <Icon active={false} />
            <span
              className="text-[9px] tracking-[0.12em] uppercase"
              style={{ fontFamily: "var(--font-sans)", color: "var(--fg)" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </nav>
  )
}

function JournalIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth={active ? 1.75 : 1.25} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function HistoryIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth={active ? 1.75 : 1.25} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}

function AuraIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth={active ? 1.75 : 1.25} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="var(--fg)" stroke="none" />
    </svg>
  )
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth={active ? 1.75 : 1.25} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
