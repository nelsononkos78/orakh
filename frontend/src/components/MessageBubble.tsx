import DOMPurify from 'dompurify'
import type { Message } from '../types/chat'
import orakhAvatar from '../assets/images/avatar.jpg'

interface MessageBubbleProps {
  message: Message
  onProfundizar?: (message: Message) => void
  loading?: boolean
}

function formatTime(date: Date): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'p.m.' : 'a.m.'
  const displayHours = hours % 12 || 12
  const displayMinutes = minutes.toString().padStart(2, '0')
  return `${displayHours}:${displayMinutes} ${ampm}`
}

export default function MessageBubble({ message, onProfundizar, loading }: MessageBubbleProps) {
  return (
    <div className={`message-bubble ${message.role}`}>
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
        <div className="message-bubble-text-wrapper">
          <div 
            className={`message-bubble-text message-bubble-text-${message.role}`}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.content) }} 
          />
          <div className="message-bubble-timestamp">
            {formatTime(message.timestamp)}
          </div>
          <div className={`message-bubble-tail message-bubble-tail-${message.role}`}></div>
        </div>
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
    </div>
  )
}

