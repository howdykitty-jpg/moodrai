import { Mood, Tag } from "@/lib/types"

export const DEFAULT_MOODS: Mood[] = [
  { id: "calm",    label: "Calm",    emoji: "😌", color: "#70B8E8", isDefault: true },  // sky blue
  { id: "happy",   label: "Happy",   emoji: "😊", color: "#F0A0B8", isDefault: true },  // blush pink
  { id: "neutral", label: "Neutral", emoji: "😐", color: "#D4B890", isDefault: true },  // warm sand
  { id: "tired",   label: "Tired",   emoji: "😴", color: "#C8A0D8", isDefault: true },  // warm lilac
  { id: "anxious", label: "Anxious", emoji: "😔", color: "#E878A8", isDefault: true },  // hot rose
  { id: "sad",     label: "Sad",     emoji: "😢", color: "#4A6FA5", isDefault: true },  // deep blue
  { id: "angry",   label: "Angry",   emoji: "😠", color: "#D94F3D", isDefault: true },  // red
  { id: "love",    label: "Love",    emoji: "🥰", color: "#F2A0B8", isDefault: true },  // soft rose
]

export const DEFAULT_TAGS: Tag[] = [
  { id: "work", label: "Work", isDefault: true },
  { id: "family", label: "Family", isDefault: true },
  { id: "health", label: "Health", isDefault: true },
  { id: "friends", label: "Friends", isDefault: true },
  { id: "study", label: "Study", isDefault: true },
  { id: "relationship", label: "Relationship", isDefault: true },
]

export const MOOD_DESCRIPTIONS: Record<string, string> = {
  calm: "You've been feeling calm and balanced.",
  happy: "Joy has been your companion this month.",
  neutral: "A steady, grounded month for you.",
  tired: "Your body and mind have been asking for rest.",
  anxious: "A challenging month — be gentle with yourself.",
  sad: "Some heaviness this month — let it pass.",
  angry: "A fiery month — your feelings are valid.",
  love: "Your heart has been wide open this month.",
}
