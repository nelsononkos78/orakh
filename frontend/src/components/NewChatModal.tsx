import { useState } from 'react'

interface NewChatModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateChat: (theme?: string) => void
}

export default function NewChatModal({ isOpen, onClose, onCreateChat }: NewChatModalProps) {
  const [theme, setTheme] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateChat(theme.trim() || undefined)
    setTheme('')
    onClose()
  }

  return (
    <div className="new-chat-modal-overlay" onClick={onClose}>
      <div className="new-chat-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="new-chat-modal-header">
          <h2>Nuevo Chat</h2>
          <button className="new-chat-modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="new-chat-modal-form">
          <div className="new-chat-modal-field">
            <label htmlFor="chat-theme">Tema del chat (opcional)</label>
            <input
              id="chat-theme"
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ej: Filosofía, Meditación, Reflexiones..."
              autoFocus
            />
            <p className="new-chat-modal-hint">
              Si no especificas un tema, se usará la fecha como título
            </p>
          </div>
          <div className="new-chat-modal-actions">
            <button type="button" onClick={onClose} className="new-chat-modal-cancel">
              Cancelar
            </button>
            <button type="submit" className="new-chat-modal-create">
              Crear Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

