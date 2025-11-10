import type { Chat, UserProfile } from '../types/chat'
import ChatList from './ChatList'

interface SidebarProps {
  userProfile: UserProfile
  chats: Chat[]
  activeChatId: string | null
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  onBackToLanding: () => void
  isMobile?: boolean
  onClose?: () => void
}

export default function Sidebar({
  userProfile,
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onBackToLanding,
  isMobile = false,
  onClose
}: SidebarProps) {
  return (
    <div className={`sidebar ${isMobile ? 'sidebar-mobile' : ''}`}>
      {/* Botón cerrar en móvil */}
      {isMobile && onClose && (
        <div className="sidebar-mobile-header">
          <h3 className="sidebar-mobile-title">Menú</h3>
          <button className="sidebar-mobile-close" onClick={onClose} title="Cerrar">
            ✕
          </button>
        </div>
      )}
      {/* Perfil de usuario */}
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          <img 
            src="https://ui-avatars.com/api/?name=Buscador+Iluminado&background=667eea&color=fff&size=128"
            alt="Avatar"
            className="sidebar-avatar-img"
          />
        </div>
        <div className="sidebar-profile-info">
          <div className="sidebar-profile-name">{userProfile.name}</div>
          <div className="sidebar-profile-level">Nivel {userProfile.level}</div>
        </div>
      </div>

      {/* Recursos */}
      <div className="sidebar-resources">
        <div className="sidebar-resource-item">
          <span className="sidebar-resource-icon">🪙</span>
          <span className="sidebar-resource-value">{userProfile.coins.toLocaleString()}</span>
        </div>
        <div className="sidebar-resource-item">
          <span className="sidebar-resource-icon">💎</span>
          <span className="sidebar-resource-value">{userProfile.diamonds.toLocaleString()}</span>
        </div>
      </div>

      {/* Botón nuevo chat */}
      <div className="sidebar-new-chat">
        <button className="sidebar-new-chat-btn" onClick={onNewChat}>
          <span className="sidebar-new-chat-icon">➕</span>
          <span className="sidebar-new-chat-text">Nuevo Chat</span>
        </button>
      </div>

      {/* Lista de chats */}
      <div className="sidebar-chats">
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={onSelectChat}
          onDeleteChat={onDeleteChat}
        />
      </div>

      {/* Botón volver al inicio */}
      <div className="sidebar-back-to-landing">
        <button className="sidebar-back-btn" onClick={onBackToLanding}>
          <span className="sidebar-back-icon">🏠</span>
          <span className="sidebar-back-text">Volver al inicio</span>
        </button>
      </div>
    </div>
  )
}

