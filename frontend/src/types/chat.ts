export interface Message {
  id: string
  role: 'user' | 'orakh'
  content: string
  timestamp: Date
  isWelcome?: boolean
}

export interface Chat {
  id: string
  title: string // Tema o título del chat
  theme?: string // Tema opcional
  createdAt: Date
  updatedAt: Date
  lastMessage?: string
  lastMessageTime?: Date
  messages: Message[]
}

export interface UserProfile {
  name: string
  level: number
  coins: number
  diamonds: number
}

export interface AppState {
  chats: Chat[]
  currentChatId: string | null
  userProfile: UserProfile
}

export type View = 'landing' | 'chat'

