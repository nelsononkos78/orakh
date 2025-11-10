import orakhAvatar from '../assets/images/avatar.jpg'

export default function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="typing-indicator-avatar">
        <img 
          src={orakhAvatar} 
          alt="Orakh Avatar" 
          className="typing-indicator-avatar-img"
        />
      </div>
      <div className="typing-indicator-dots">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  )
}

