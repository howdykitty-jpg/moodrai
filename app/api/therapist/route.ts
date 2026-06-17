import { NextRequest, NextResponse } from "next/server"
import { Entry, ChatMessage } from "@/lib/types"

const FREUD_SYSTEM_PROMPT = `Jesteś Zygmuntem Freudem — wiedeńskim psychiatrą i twórcą psychoanalizy. Rozmawiasz z pacjentem który prowadzi dziennik nastroju. Masz pełny wgląd w jego zapiski i analizujesz je przez pryzmat psychoanalizy.

Zwracaj się do pacjenta per "ty". Mów po polsku. Możesz używać archaicznego, dostojnego tonu.

Twoje zasady:
- Odpowiadaj zwięźle: 1-3 akapity. Kończ każdą odpowiedź pytaniem skłaniającym do refleksji.
- Zadawaj pytania pogłębiające. Prowadź pacjenta do samodzielnego odkrycia — rzadko dawaj gotowe odpowiedzi.
- Używaj terminologii psychoanalitycznej (wypieranie, projekcja, id, ego, superego, przeniesienie, nieświadomość), ale wplataj ją naturalnie w zdanie.
- Zamiast "Jak się czujesz?" pytaj "Co cię niepokoi?". Możesz pozwolić sobie na lakoniczne "hmm, to ciekawe..." — nigdy sarkazm.
- Możesz cytować po niemiecku lub łacinie — zawsze z tłumaczeniem w nawiasie.
- Nigdy nie oceniaj wprost. Interpretuj. Szukaj wzorców i powtarzających się motywów w dzienniku.
- NIE diagnozuj klinicznie. NIE proponuj leków. Jeśli widzisz sygnały kryzysu — delikatnie wskaż potrzebę wsparcia profesjonalisty.
- Nie przypominaj, że jesteś AI ani botem. Jesteś Freudem.`

const DAYS_PL = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"]

function formatAllEntries(entries: Entry[]): string {
  if (entries.length === 0) return "Pacjent nie ma jeszcze żadnych wpisów w dzienniku."
  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp)
  return sorted.map((e) => {
    const text = e.content.replace(/<[^>]+>/g, "").trim()
    return `[${e.date}, ${e.mood || "nastrój nieokreślony"}]\n${text}\n---`
  }).join("\n")
}

function buildUiContext(activeDate: string | null, entries: Entry[]): string {
  const today = new Date().toISOString().split("T")[0]
  const todayDay = DAYS_PL[new Date().getDay()]
  const lines: string[] = [`Data dzisiejsza: ${today} (${todayDay})`]

  if (activeDate) {
    const d = new Date(activeDate + "T00:00:00")
    lines.push(`Użytkownik ma obecnie otwarty dzień: ${activeDate} (${DAYS_PL[d.getDay()]})`)
    const dayEntries = entries.filter((e) => e.date === activeDate)
    if (dayEntries.length > 0) {
      const fragment = dayEntries[0].content.replace(/<[^>]+>/g, "").trim().slice(0, 80)
      if (fragment) lines.push(`Treść wpisu tego dnia (fragment): "${fragment}..."`)
    }
  }

  return lines.join("\n")
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 })
  }

  const { message, activeDate, entries, history } = (await req.json()) as {
    message: string
    activeDate: string | null
    entries: Entry[]
    history: ChatMessage[]
  }

  const journalBlock = formatAllEntries(entries)
  const uiContext = buildUiContext(activeDate, entries)

  const systemContent = `${FREUD_SYSTEM_PROMPT}

[DZIENNIK PACJENTA]
${journalBlock}

[KONTEKST UI]
${uiContext}`

  const messages = [
    { role: "system", content: systemContent },
    ...history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
    { role: "user", content: message },
  ]

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      max_tokens: 600,
      temperature: 0.85,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: err }, { status: res.status })
  }

  const data = await res.json()
  const text = data.choices?.[0]?.message?.content ?? ""
  return NextResponse.json({ text })
}
