import orakhAvatar from '../assets/images/avatar.jpg'
import orackAvatar from '../assets/images/orack.png'

interface ChatHeaderProps {
  chatTitle: string
  onMenuClick: () => void
  onMobileMenuClick?: () => void
}

export default function ChatHeader({ chatTitle, onMenuClick, onMobileMenuClick }: ChatHeaderProps) {
  return (
    <div className="chat-header-new">
      <div className="chat-header-left">
        {onMobileMenuClick && (
          <button 
            className="chat-header-mobile-menu-btn" 
            onClick={onMobileMenuClick}
            title="Abrir menú"
          >
            ☰
          </button>
        )}
        {!onMobileMenuClick && <div className="chat-header-icon">🌊</div>}
        <div className="chat-header-orakh-avatar">
          <img 
            src={orakhAvatar} 
            alt="Orakh Avatar" 
            className="chat-header-orakh-avatar-img"
          />
        </div>
        <div className="chat-header-title">
          {onMobileMenuClick ? 'Orakh Vox Nemis' : (chatTitle || 'ORACK')}
        </div>
      </div>
      <div className="chat-header-right">
        <button className="chat-header-search" title="Buscar">
          🔍
        </button>
        <button className="chat-header-menu" onClick={onMenuClick} title="Configuración">
          ⋯
        </button>
        <div className="chat-header-user-avatar">
          <img 
            src={orackAvatar} 
            alt="Orack Avatar" 
            className="chat-header-user-avatar-img"
          />
        </div>
      </div>
    </div>
  )
}

