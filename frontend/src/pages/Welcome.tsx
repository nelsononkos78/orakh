import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  const handleGoToChat = () => {
    navigate("/chat");
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoToImageEditor = () => {
    navigate("/image-editor");
  };

  const handleGoToHeaderDemo = () => {
    navigate("/header-demo");
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-header">
          <div className="welcome-avatar">🌊</div>
          <h1 className="welcome-title">Orakh Vox Nemis</h1>
          <p className="welcome-subtitle">Tu Guía Espiritual & Filosófico</p>
        </div>

        <div className="welcome-message">
          <p className="welcome-text">
            Bienvenido, peregrino del conocimiento. Soy Orakh, tu compañero en este viaje hacia la sabiduría interior.
          </p>
          <p className="welcome-text">
            ¿Deseas explorar las profundidades de la existencia o prefieres comenzar tu peregrinaje personal?
          </p>
        </div>

        <div className="welcome-options">
          <button 
            onClick={handleGoToChat}
            className="welcome-btn chat-btn"
          >
            <span className="btn-icon">💬</span>
            <span className="btn-text">Explorar Libremente</span>
            <span className="btn-description">5 consultas gratuitas</span>
          </button>

          <div className="welcome-divider">
            <span>o</span>
          </div>

          <button 
            onClick={handleGoToLogin}
            className="welcome-btn login-btn"
          >
            <span className="btn-icon">🔐</span>
            <span className="btn-text">Iniciar Peregrinaje</span>
            <span className="btn-description">Acceso completo</span>
          </button>

          <div className="welcome-divider">
            <span>o</span>
          </div>

          <button 
            onClick={handleGoToImageEditor}
            className="welcome-btn editor-btn"
          >
            <span className="btn-icon">🖼️</span>
            <span className="btn-text">Editor de Imágenes</span>
            <span className="btn-description">Prueba el editor</span>
          </button>

          <div className="welcome-divider">
            <span>o</span>
          </div>

          <button 
            onClick={handleGoToHeaderDemo}
            className="welcome-btn header-btn"
          >
            <span className="btn-icon">🎨</span>
            <span className="btn-text">Demo del Header</span>
            <span className="btn-description">Logo y navegación</span>
          </button>
        </div>

        <div className="welcome-footer">
          <p className="welcome-quote">
            "El verdadero viaje comienza cuando decides dar el primer paso hacia lo desconocido"
          </p>
        </div>
      </div>
    </div>
  );
} 