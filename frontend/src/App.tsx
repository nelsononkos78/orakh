import { useState, useRef, useEffect } from 'react'
import { API_CONFIG } from './config'
import type { View, Message, AppState } from './types/chat'
import { getStoredState, saveState, createNewChat } from './utils/chatStorage'
import LandingPage from './components/LandingPage'
import Sidebar from './components/Sidebar'
import ChatHeader from './components/ChatHeader'
import MessageBubble from './components/MessageBubble'
import TypingIndicator from './components/TypingIndicator'
import NewChatModal from './components/NewChatModal'

function App() {
  // Estado principal
  const [view, setView] = useState<View>('landing')
  const [appState, setAppState] = useState<AppState>(getStoredState())
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [systemInfo, setSystemInfo] = useState<{
    provider: string
    provider_code: string
    model: string
    maestro_prompt: string
    profundidad_prompt: string
  } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Estado y referencia para la música de fondo
  const [currentVolume, setCurrentVolume] = useState(() => {
    const savedVolume = localStorage.getItem('orakh_music_volume');
    return savedVolume ? parseInt(savedVolume, 10) : 50;
  });
  const playerRef = useRef<any>(null);
  const isPlayerReady = useRef(false);
  const YOUTUBE_VIDEO_ID = '22i6SofLVRY';

  // Obtener chat actual
  const currentChat = appState.chats.find(c => c.id === appState.currentChatId) || null
  const currentMessages = currentChat?.messages || []

  // Guardar estado cuando cambia
  useEffect(() => {
    saveState(appState)
  }, [appState])

  // Scroll automático
  useEffect(() => {
    const lastMessage = currentMessages[currentMessages.length - 1]
    if (lastMessage && lastMessage.role === 'user') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [currentMessages])

  // Reset textarea height cuando se limpia
  useEffect(() => {
    if (textareaRef.current && !input) {
      textareaRef.current.style.height = 'auto'
    }
  }, [input])

  // Inicializar reproductor de YouTube
  useEffect(() => {
    if (isPlayerReady.current) return;

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    (window as any).onYouTubeIframeAPIReady = () => {
      new (window as any).YT.Player('youtube-player', {
        events: {
          'onReady': (event: { target: any }) => {
            playerRef.current = event.target;
            isPlayerReady.current = true;
            if (currentVolume === 0) {
              event.target.mute();
            } else {
              event.target.setVolume(currentVolume);
              event.target.unMute();
            }
            if (view === 'chat') {
              event.target.playVideo();
            }
          },
          'onStateChange': (event: { data: number, target: any }) => {
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      (window as any).onYouTubeIframeAPIReady = null;
    };
  }, []);

  // Controlar volumen
  useEffect(() => {
    if (playerRef.current && isPlayerReady.current) {
      playerRef.current.setVolume(currentVolume);
      if (currentVolume === 0) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
      localStorage.setItem('orakh_music_volume', String(currentVolume));
    }
  }, [currentVolume]);

  // Despertar backend
  const wakeBackend = async (): Promise<void> => {
    const maxRetries = 4
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await fetch(`${API_CONFIG.baseURL}/health`, { cache: 'no-store' })
        if (res.ok) return
      } catch {
        // ignore
      }
      const delayMs = 500 * Math.pow(2, attempt)
      await new Promise(r => setTimeout(r, delayMs))
    }
  }

  // Crear nuevo chat
  const handleCreateChat = (theme?: string) => {
    const newChat = createNewChat(theme)
    setAppState(prev => ({
      ...prev,
      chats: [...prev.chats, newChat],
      currentChatId: newChat.id
    }))
    setView('chat')
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      playerRef.current.playVideo();
    }
  }

  // Seleccionar chat
  const handleSelectChat = (chatId: string) => {
    setAppState(prev => ({ ...prev, currentChatId: chatId }))
    setView('chat')
  }

  // Eliminar chat
  const handleDeleteChat = (chatId: string) => {
    setAppState(prev => {
      const newChats = prev.chats.filter(c => c.id !== chatId)
      const newCurrentChatId = prev.currentChatId === chatId 
        ? (newChats.length > 0 ? newChats[0].id : null)
        : prev.currentChatId
      return {
        ...prev,
        chats: newChats,
        currentChatId: newCurrentChatId
      }
    })
  }

  // Enviar mensaje
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading || !currentChat) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    const updatedMessages = [...currentMessages, userMessage]
    
    // Actualizar chat con mensaje del usuario
    setAppState(prev => ({
      ...prev,
      chats: prev.chats.map(chat => 
        chat.id === currentChat.id
          ? {
              ...chat,
              messages: updatedMessages,
              lastMessage: userMessage.content.substring(0, 50),
              lastMessageTime: userMessage.timestamp,
              updatedAt: new Date()
            }
          : chat
      )
    }))

    setInput('')
    setLoading(true)

    try {
      await wakeBackend()

      // Preparar historial para enviar al backend
      const history = currentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch(`${API_CONFIG.baseURL}/api/orakh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage.content,
          history: history
        })
      })

      if (!response.ok) {
        throw new Error('Error del servidor')
      }

      const data = await response.json()
      const orakhMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'orakh',
        content: data.response,
        timestamp: new Date()
      }

      const finalMessages = [...updatedMessages, orakhMessage]
      
      setAppState(prev => ({
        ...prev,
        chats: prev.chats.map(chat => 
          chat.id === currentChat.id
            ? {
                ...chat,
                messages: finalMessages,
                lastMessage: orakhMessage.content.substring(0, 50).replace(/<[^>]*>/g, ''),
                lastMessageTime: orakhMessage.timestamp,
                updatedAt: new Date()
              }
            : chat
        )
      }))
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'orakh',
        content: 'Lo siento, ocurrió un error. Por favor intenta nuevamente.',
        timestamp: new Date()
      }
      setAppState(prev => ({
        ...prev,
        chats: prev.chats.map(chat => 
          chat.id === currentChat.id
            ? { ...chat, messages: [...updatedMessages, errorMessage], updatedAt: new Date() }
            : chat
        )
      }))
    } finally {
      setLoading(false)
    }
  }

  // Profundizar
  const handleProfundizar = async (message: Message) => {
    if (!currentChat || loading) return

    try {
      setLoading(true)
      await wakeBackend()
      
      const response = await fetch(`${API_CONFIG.baseURL}/api/profundizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respuesta_anterior: message.content,
          mensaje_usuario: currentMessages[currentMessages.findIndex(m => m.id === message.id) - 1]?.content || ''
        })
      })

      const data = await response.json()
      const profundidadMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'orakh',
        content: data.response,
        timestamp: new Date()
      }

      setAppState(prev => ({
        ...prev,
        chats: prev.chats.map(chat => 
          chat.id === currentChat.id
            ? {
                ...chat,
                messages: [...chat.messages, profundidadMessage],
                updatedAt: new Date()
              }
            : chat
        )
      }))
    } catch (error) {
      console.error('Error al profundizar:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar información del sistema
  const loadSystemInfo = async () => {
    try {
      await wakeBackend()
      const response = await fetch(`${API_CONFIG.baseURL}/api/info`)
      if (!response.ok) throw new Error('Error al cargar información')
      const data = await response.json()
      setSystemInfo(data)
      setShowInfoModal(true)
    } catch (error) {
      console.error('Error al cargar información del sistema:', error)
      alert('Error al cargar información del sistema')
    }
  }

  // Detectar clave secreta "voxnemis"
  useEffect(() => {
    if (input.toLowerCase().trim() === 'voxnemis') {
      setInput('')
      loadSystemInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  // Atajo de teclado: Ctrl+Shift+I
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        const target = e.target as HTMLElement
        const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
        if (!isInput) {
          e.preventDefault()
          e.stopPropagation()
          loadSystemInfo()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentVolume(parseInt(e.target.value, 10));
  };

  const clearMemory = async () => {
    if (!currentChat) return
    try {
      await wakeBackend()
      await fetch(`${API_CONFIG.baseURL}/api/clear_memory`, { method: 'POST' })
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'orakh',
        content: 'Memoria limpiada. ¿En qué puedo ayudarte ahora?',
        timestamp: new Date(),
        isWelcome: true
      }
      setAppState(prev => ({
        ...prev,
        chats: prev.chats.map(chat => 
          chat.id === currentChat.id
            ? { ...chat, messages: [welcomeMessage], updatedAt: new Date() }
            : chat
        )
      }))
    } catch (error) {
      console.error('Error al limpiar memoria:', error)
    }
  }

  return (
    <>
      {/* Reproductor de música de fondo */}
      <iframe
        id="youtube-player"
        width="0"
        height="0"
        src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}
        title="Música de Fondo"
      />

      {/* Modal de Información del Sistema */}
      {showInfoModal && systemInfo && (
        <div className="modal-overlay" onClick={() => setShowInfoModal(false)}>
          <div className="info-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal-header">
              <h2>🔮 Información del Sistema</h2>
              <button 
                className="info-modal-close"
                onClick={() => setShowInfoModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="info-modal-content">
              <div className="info-section">
                <h3>⚙️ Configuración de IA</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Proveedor:</span>
                    <span className="info-value">{systemInfo.provider}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Código:</span>
                    <span className="info-value">{systemInfo.provider_code}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Modelo:</span>
                    <span className="info-value">{systemInfo.model}</span>
                  </div>
                </div>
              </div>
              <div className="info-section">
                <h3>📜 Prompt Maestro</h3>
                <div className="prompt-container">
                  <pre className="prompt-text">{systemInfo.maestro_prompt}</pre>
                </div>
              </div>
              <div className="info-section">
                <h3>🌌 Prompt de Profundización</h3>
                <div className="prompt-container">
                  <pre className="prompt-text">{systemInfo.profundidad_prompt}</pre>
                </div>
              </div>
            </div>
            <div className="info-modal-footer">
              <p className="info-hint">💡 Atajo: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd></p>
              <button className="info-modal-btn" onClick={() => setShowInfoModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vista Landing o Chat */}
      {view === 'landing' ? (
        <LandingPage onStartJourney={() => {
          if (appState.chats.length === 0) {
            handleCreateChat()
          } else {
            setView('chat')
            if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
              playerRef.current.playVideo();
            }
          }
        }} />
      ) : (
        <div className="app-layout">
          {/* Sidebar Desktop - Oculto en móvil */}
          <Sidebar
            userProfile={appState.userProfile}
            chats={appState.chats}
            activeChatId={appState.currentChatId}
            onNewChat={() => setShowNewChatModal(true)}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            onBackToLanding={() => setView('landing')}
            isMobile={false}
          />

          {/* Sidebar Mobile - Overlay */}
          {showMobileSidebar && (
            <>
              <div 
                className="mobile-sidebar-overlay" 
                onClick={() => setShowMobileSidebar(false)}
              ></div>
              <div className="mobile-sidebar-container">
                <Sidebar
                  userProfile={appState.userProfile}
                  chats={appState.chats}
                  activeChatId={appState.currentChatId}
                  onNewChat={() => {
                    setShowNewChatModal(true)
                    setShowMobileSidebar(false)
                  }}
                  onSelectChat={(chatId) => {
                    handleSelectChat(chatId)
                    setShowMobileSidebar(false)
                  }}
                  onDeleteChat={handleDeleteChat}
                  onBackToLanding={() => {
                    setView('landing')
                    setShowMobileSidebar(false)
                  }}
                  isMobile={true}
                  onClose={() => setShowMobileSidebar(false)}
                />
              </div>
            </>
          )}

          {/* Área de Chat */}
          <div className="chat-area">
            {currentChat ? (
              <>
                <ChatHeader 
                  chatTitle={currentChat.title}
                  onMenuClick={() => setShowSettings(!showSettings)}
                  onMobileMenuClick={() => setShowMobileSidebar(true)}
                />

                {/* Menú de configuraciones */}
                {showSettings && (
                  <>
                    <div className="settings-overlay" onClick={() => setShowSettings(false)}></div>
                    <div className="settings-container">
                      <div className="setting-item">
                        <label htmlFor="volume-slider">Volumen:</label>
                        <input 
                          id="volume-slider"
                          type="range" 
                          min="0" 
                          max="100" 
                          value={currentVolume} 
                          onChange={handleVolumeChange}
                          className="volume-slider"
                        />
                      </div>
                      <div className="setting-item">
                        <button onClick={clearMemory} className="clear-btn">
                          🗑️ Limpiar conversación
                        </button>
                      </div>
                      <div className="setting-item setting-item-mobile-only">
                        <button
                          onClick={() => {
                            setShowSettings(false)
                            loadSystemInfo()
                          }}
                          className="info-btn"
                        >
                          🔮 Información del sistema
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Mensajes */}
                <div className="messages-area">
                  {currentMessages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      onProfundizar={handleProfundizar}
                      loading={loading}
                    />
                  ))}
                  {loading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="input-area">
                  <form onSubmit={handleSubmit} className="input-form">
                    <div className="input-wrapper">
                      <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value)
                          // Auto-resize
                          e.target.style.height = 'auto'
                          e.target.style.height = `${e.target.scrollHeight}px`
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit(e)
                          }
                        }}
                        placeholder="¿Qué sabiduría buscas hoy?"
                        disabled={loading}
                        className="input-field"
                        rows={1}
                      />
                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="send-btn"
                      >
                        <span>✨</span>
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <p>Selecciona un chat o crea uno nuevo</p>
                <button onClick={() => setShowNewChatModal(true)} className="create-chat-btn">
                  ➕ Crear nuevo chat
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de nuevo chat */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onCreateChat={handleCreateChat}
      />
    </>
  )
}

export default App
