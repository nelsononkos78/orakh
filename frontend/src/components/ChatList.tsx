import type { Chat } from '../types/chat'
import ChatItem from './ChatItem'

interface ChatListProps {
  chats: Chat[]
  activeChatId: string | null
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
}

export default function ChatList({ chats, activeChatId, onSelectChat, onDeleteChat }: ChatListProps) {
  const groupedChats = chats.reduce((groups, chat) => {
    const now = new Date()
    const chatDate = new Date(chat.updatedAt || chat.createdAt)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date(today)
    monthAgo.setDate(monthAgo.getDate() - 30)

    let groupKey = 'Anteriores'
    if (chatDate >= today) {
      groupKey = 'Hoy'
    } else if (chatDate >= yesterday) {
      groupKey = 'Ayer'
    } else if (chatDate >= weekAgo) {
      groupKey = 'Esta semana'
    } else if (chatDate >= monthAgo) {
      groupKey = 'Este mes'
    }

    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(chat)
    return groups
  }, {} as { [key: string]: Chat[] })

  // Ordenar grupos y chats dentro de cada grupo
  const groupOrder = ['Hoy', 'Ayer', 'Esta semana', 'Este mes', 'Anteriores']
  const sortedGroups = groupOrder
    .filter(key => groupedChats[key] && groupedChats[key].length > 0)
    .map(key => ({
      label: key,
      chats: groupedChats[key].sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt).getTime()
        const dateB = new Date(b.updatedAt || b.createdAt).getTime()
        return dateB - dateA
      })
    }))

  if (sortedGroups.length === 0) {
    return (
      <div className="chat-list-empty">
        <p>No hay chats aún</p>
        <p className="chat-list-empty-hint">Crea tu primer chat para comenzar</p>
      </div>
    )
  }

  return (
    <div className="chat-list">
      {sortedGroups.map(({ label, chats }) => (
        <div key={label} className="chat-list-group">
          <div className="chat-list-group-header">
            <span className="chat-list-group-icon">📅</span>
            <span className="chat-list-group-label">{label}</span>
          </div>
          <div className="chat-list-group-items">
            {chats.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === activeChatId}
                onClick={() => onSelectChat(chat.id)}
                onDelete={onDeleteChat}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

