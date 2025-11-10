import DOMPurify from 'dompurify'
import type { Message } from '../types/chat'
import orakhAvatar from '../assets/images/avatar.jpg'

interface MessageBubbleProps {
  message: Message
  onProfundizar?: (message: Message) => void
  loading?: boolean
}

export default function MessageBubble({ message, onProfundizar, loading }: MessageBubbleProps) {
  return (
    <div className={`message-bubble ${message.role}`}>
      {message.role === 'orakh' && (
        <div className="message-bubble-avatar message-bubble-avatar-external">
          <img 
            src={orakhAvatar} 
            alt="Orakh Avatar" 
            className="message-bubble-avatar-img"
          />
        </div>
      )}
      <div className="message-bubble-content">
        {message.role === 'orakh' && (
          <div className="message-bubble-avatar message-bubble-avatar-internal">
            <img 
              src={orakhAvatar} 
              alt="Orakh Avatar" 
              className="message-bubble-avatar-img"
            />
          </div>
        )}
        {message.role === 'user' && (
          <div className="message-bubble-avatar message-bubble-avatar-internal user">
            <div className="message-bubble-avatar-placeholder">
              👤
            </div>
          </div>
        )}
        <div 
          className="message-bubble-text"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content) }} 
        />
        {message.role === 'orakh' && !message.isWelcome && onProfundizar && (
          <button
            onClick={() => onProfundizar(message)}
            disabled={loading}
            className="message-bubble-profundizar"
          >
            <span>🪄</span>
            <span>Desplegar el velo</span>
          </button>
        )}
      </div>
      {message.role === 'user' && (
        <div className="message-bubble-avatar user message-bubble-avatar-external">
          <div className="message-bubble-avatar-placeholder">
            👤
          </div>
        </div>
      )}
    </div>
  )
}

