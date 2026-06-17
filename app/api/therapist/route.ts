import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Entry, ChatMessage } from "@/lib/types"

const FREUD_SYSTEM_PROMPT = `Jesteś Zygmuntem Freudem — wiedeńskim psychiatrą i twórcą psychoanalizy. Rozmawiasz z pacjentem który prowadzi dziennik nastroju. Masz pełny wgląd w jego zapiski i analizujesz je przez pryzmat psychoanalizy.

Zwracaj się do pacjenta per "ty". Mów po polsku. Możesz używać archaicznego, dostojnego tonu.

Twoje zasady:
- Odpowiadaj zwięźle: 1-3 akapity. Kończ każdą odpowiedź pytaniem skłaniającym do refleksji.
- Zadawaj pytania pogłębiające. Prowadź pacjenta do samodzielnego odkrycia — rzadko dawaj gotowe odpowiedzi.
- Używaj terminologii psychoanalitycznej (wypieranie, projekcja, id, ego, superego, przeniesienie, nieświadomość), ale wplataj ją naturalnie w zdanie.
- Masz lekki dystans i powagę. Zamiast "Jak się czujesz?" pytaj "Co cię niepokoi?". Możesz pozwolić sobie na lakoniczne "hmm, to ciekawe..." — nigdy sarkazm.
- Możesz cytować po niemiecku lub łacinie — zawsze z tłumaczeniem w nawiasie.
- Nigdy nie oceniaj wprost. Interpretuj. Szukaj wzorców i powtarzających się motywów w dzienniku.
- NIE diagnozuj klinicznie. NIE proponuj leków. Jeśli widzisz sygnały kryzysu — delikatnie wskaż potrzebę wsparcia profesjonalisty.
- Nie przypominaj, że jesteś AI ani botem. Jesteś Freudem.
- Markdown jest dozwolony.`

const DAYS_PL = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"]

function formatAllEntries(entries: Entry[]): string {
  if (entries.length === 0) return "Pacjent nie ma jeszcze żadnych wpisów w dzienniku."

  const sorted = [...entries].sort((a, b) => a.timestamp - b.timestamp)
  const formatted = sorted.map((e) => {
    const text = e.content.replace(/<[^>]+>/g, "").trim()
    return `[${e.date}, ${e.mood || "nastrój nieokreślony"}]\n${text}\n---`
  }).join("\n")

  return formatted
}

function buildUiContext(activeDate: string | null, entries: Entry[]): string {
  const today = new Date().toISOString().split("T")[0]
  const todayDay = DAYS_PL[new Date().getDay()]
  const lines: string[] = []

  lines.push(`Data dzisiejsza: ${today} (${todayDay})`)

  if (activeDate) {
    const d = new Date(activeDate + "T00:00:00")
    const dayName = DAYS_PL[d.getDay()]
    lines.push(`Użytkownik ma obecnie otwarty dzień: ${activeDate} (${dayName})`)

    const dayEntries = entries.filter((e) => e.date === activeDate)
    if (dayEntries.length > 0) {
      const firstText = dayEntries[0].content.replace(/<[^>]+>/g, "").trim().slice(0, 80)
      if (firstText) lines.push(`Treść wpisu tego dnia (fragment): "${firstText}..."`)
    }
  }

  return lines.join("\n")
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 })
  }

  const { message, activeDate, entries, history } = (await req.json()) as {
    message: string
    activeDate: string | null
    entries: Entry[]
    history: ChatMessage[]
  }

  const journalBlock = formatAllEntries(entries)
  const uiContext = buildUiContext(activeDate, entries)

  const systemInstruction = `${FREUD_SYSTEM_PROMPT}

[DZIENNIK PACJENTA]
${journalBlock}

[KONTEKST UI]
${uiContext}`

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction,
  })

  const geminiHistory = history.map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }))

  const chat = model.startChat({ history: geminiHistory })
  const result = await chat.sendMessage(message)
  const text = result.response.text()

  return NextResponse.json({ text })
}
