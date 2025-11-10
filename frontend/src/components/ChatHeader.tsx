import orakhAvatar from '../assets/images/avatar.jpg'

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
        <div className="chat-header-title">
          {onMobileMenuClick ? 'Orakh Vox Nemis' : (chatTitle || 'ORACK')}
        </div>
      </div>
      <button className="chat-header-menu" onClick={onMenuClick} title="Configuración">
        ⋯
      </button>
    </div>
  )
}

