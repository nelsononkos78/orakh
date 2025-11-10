import type { Chat } from '../types/chat'

interface ChatItemProps {
  chat: Chat
  isActive: boolean
  onClick: () => void
  onDelete: (chatId: string) => void
}

export default function ChatItem({ chat, isActive, onClick, onDelete }: ChatItemProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`¿Eliminar el chat "${chat.title}"?`)) {
      onDelete(chat.id)
    }
  }

  const formatTime = (date: Date, isMobile: boolean = false) => {
    const now = new Date()
    const chatDate = new Date(date)
    const diffMs = now.getTime() - chatDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (isMobile) {
      // Formato más corto para móvil
      if (diffMins < 1) return 'Ahora'
      if (diffMins < 60) return `${diffMins}m`
      if (diffHours < 24) return `${diffHours}h`
      if (diffDays === 1) return 'Ayer'
      if (diffDays < 7) return `${diffDays}d`
      return chatDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(' de ', '/')
    }

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins}m`
    if (diffHours < 24) return `Hace ${diffHours}h`
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays}d`
    return chatDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  const lastMessageTime = chat.lastMessageTime || chat.updatedAt || chat.createdAt
  const isMobile = window.innerWidth <= 768

  return (
    <div 
      className={`chat-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="chat-item-content">
        <div className="chat-item-title">{chat.title}</div>
        {chat.lastMessage && (
          <div className="chat-item-preview">{chat.lastMessage}</div>
        )}
      </div>
      <div className="chat-item-meta">
        <span className="chat-item-time">{formatTime(lastMessageTime, isMobile)}</span>
        <button 
          className="chat-item-delete"
          onClick={handleDelete}
          title="Eliminar chat"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

