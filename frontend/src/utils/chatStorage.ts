import type { Chat, AppState, UserProfile } from '../types/chat'

const STORAGE_KEY = 'orakh_app_state'

const defaultUserProfile: UserProfile = {
  name: 'Buscador Iluminado',
  level: 7,
  coins: 1250,
  diamonds: 300
}

export const getStoredState = (): AppState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convertir fechas de string a Date
      parsed.chats = parsed.chats.map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        lastMessageTime: chat.lastMessageTime ? new Date(chat.lastMessageTime) : undefined,
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
      return parsed
    }
  } catch (error) {
    console.error('Error loading state from storage:', error)
  }
  
  return {
    chats: [],
    currentChatId: null,
    userProfile: defaultUserProfile
  }
}

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Error saving state to storage:', error)
  }
}

export const createNewChat = (theme?: string): Chat => {
  const now = new Date()
  const title = theme || now.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  return {
    id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    theme,
    createdAt: now,
    updatedAt: now,
    messages: [{
      id: `msg-${Date.now()}`,
      role: 'orakh',
      content: 'Bienvenido a Orakh. Soy tu guía espiritual y filosófico. ¿En qué puedo ayudarte hoy?',
      timestamp: now,
      isWelcome: true
    }]
  }
}

export const groupChatsByDate = (chats: Chat[]) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const monthAgo = new Date(today)
  monthAgo.setDate(monthAgo.getDate() - 30)

  const groups: { [key: string]: Chat[] } = {
    'Hoy': [],
    'Ayer': [],
    'Esta semana': [],
    'Este mes': [],
    'Anteriores': []
  }

  chats.forEach(chat => {
    const chatDate = new Date(chat.updatedAt || chat.createdAt)
    
    if (chatDate >= today) {
      groups['Hoy'].push(chat)
    } else if (chatDate >= yesterday) {
      groups['Ayer'].push(chat)
    } else if (chatDate >= weekAgo) {
      groups['Esta semana'].push(chat)
    } else if (chatDate >= monthAgo) {
      groups['Este mes'].push(chat)
    } else {
      groups['Anteriores'].push(chat)
    }
  })

  // Filtrar grupos vacíos y ordenar chats por fecha (más reciente primero)
  return Object.entries(groups)
    .filter(([_, chats]) => chats.length > 0)
    .map(([label, chats]) => ({
      label,
      chats: chats.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt).getTime()
        const dateB = new Date(b.updatedAt || b.createdAt).getTime()
        return dateB - dateA
      })
    }))
}

