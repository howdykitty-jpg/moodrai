import { Entry, Mood } from "@/lib/types"

export interface AuraProportion {
  mood: Mood
  percentage: number
}

export interface AuraData {
  proportions: AuraProportion[]
  gradient: string
  dominantMood: Mood | null
  description: string
}

export function calculateAura(entries: Entry[], moods: Mood[], month: string): AuraData {
  const monthEntries = entries.filter((e) => e.date.startsWith(month))

  if (monthEntries.length === 0) {
    return {
      proportions: [],
      gradient: "radial-gradient(circle at 50% 50%, #E8E8E8 0%, #D0D0D0 100%)",
      dominantMood: null,
      description: "No entries this month yet. Start writing to reveal your aura.",
    }
  }

  const counts: Record<string, number> = {}
  for (const entry of monthEntries) {
    counts[entry.mood] = (counts[entry.mood] || 0) + 1
  }

  const total = monthEntries.length
  const proportions: AuraProportion[] = Object.entries(counts)
    .map(([moodId, count]) => {
      const mood = moods.find((m) => m.id === moodId)
      return mood ? { mood, percentage: Math.round((count / total) * 100) } : null
    })
    .filter(Boolean)
    .sort((a, b) => b!.percentage - a!.percentage) as AuraProportion[]

  const dominantMood = proportions[0]?.mood ?? null

  const gradient = buildGradient(proportions)
  const description = buildDescription(proportions, dominantMood)

  return { proportions, gradient, dominantMood, description }
}

function buildGradient(proportions: AuraProportion[]): string {
  if (proportions.length === 0) {
    return "radial-gradient(circle at 50% 50%, #E8E8E8 0%, #D0D0D0 100%)"
  }
  if (proportions.length === 1) {
    const c = proportions[0].mood.color
    return `radial-gradient(circle at 40% 40%, ${c} 0%, ${c}99 100%)`
  }

  let cumulative = 0
  const stops = proportions.map(({ mood, percentage }) => {
    const start = cumulative
    cumulative += percentage
    return `${mood.color} ${start}%, ${mood.color} ${cumulative}%`
  })

  return `conic-gradient(from 0deg at 50% 50%, ${stops.join(", ")})`
}

function buildDescription(proportions: AuraProportion[], dominant: Mood | null): string {
  if (!dominant) return "No entries this month yet."

  const pct = proportions[0]?.percentage ?? 0

  if (pct >= 60) {
    return `Your aura is deeply ${dominant.label.toLowerCase()}. ${dominant.emoji} This energy defined your month.`
  }
  if (proportions.length >= 3) {
    return "Your aura is richly layered — many moods, many moments. A full and textured month."
  }
  return `Your aura is balanced, with ${dominant.label.toLowerCase()} leading the way.`
}

export function getTopTags(entries: Entry[], month: string, limit = 3): string[] {
  const monthEntries = entries.filter((e) => e.date.startsWith(month))
  const counts: Record<string, number> = {}
  for (const entry of monthEntries) {
    for (const tag of entry.tags) {
      counts[tag] = (counts[tag] || 0) + 1
    }
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag)
}
