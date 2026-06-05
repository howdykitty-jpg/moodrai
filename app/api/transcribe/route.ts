import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured" }, { status: 500 })
  }

  const formData = await req.formData()
  const audio = formData.get("audio") as File
  if (!audio) {
    return NextResponse.json({ error: "No audio file" }, { status: 400 })
  }

  const groqForm = new FormData()
  groqForm.append("file", audio, "recording.webm")
  groqForm.append("model", "whisper-large-v3")

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: groqForm,
  })

  if (!response.ok) {
    const err = await response.text()
    return NextResponse.json({ error: err }, { status: response.status })
  }

  const data = await response.json()
  return NextResponse.json({ text: data.text })
}
