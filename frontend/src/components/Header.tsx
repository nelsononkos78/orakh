import React from 'react'
import { useNavigate } from 'react-router-dom'
import orakhLogo from '../assets/images/orack.jpg'
import { getAssetUrl, isOnkosweb } from '../config/onkosweb'

interface HeaderProps {
  title?: string
  showBackButton?: boolean
  showHomeButton?: boolean
  onBackClick?: () => void
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Orakh Vox Nemis", 
  showBackButton = false, 
  showHomeButton = true,
  onBackClick 
}) => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick()
    } else {
      navigate(-1)
    }
  }

  const handleHomeClick = () => {
    navigate('/')
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          {showBackButton && (
            <button onClick={handleBackClick} className="back-btn">
              ← Volver
            </button>
          )}
        </div>
        
        <div className="header-center">
          <div className="logo-container">
            <img 
              src={isOnkosweb() ? getAssetUrl('/src/assets/images/orack.jpg') : orakhLogo} 
              alt="Orakh Logo" 
              className="logo-image"
              onError={(e) => {
                // Fallback si la imagen no carga
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                target.nextElementSibling?.classList.remove('hidden')
              }}
            />
            <div className="logo-fallback hidden">🌊</div>
          </div>
          <h1 className="header-title">{title}</h1>
        </div>
        
        <div className="header-right">
          {showHomeButton && (
            <button onClick={handleHomeClick} className="home-btn">
              🏠 Inicio
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .app-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .header-left, .header-right {
          flex: 0 0 auto;
        }

        .header-center {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .logo-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .logo-image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .logo-fallback {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .logo-fallback.hidden {
          display: none;
        }

        .header-title {
          margin: 0;
          font-size: 1.5rem;
          font-weight: bold;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .back-btn, .home-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .back-btn:hover, .home-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        .back-btn:active, .home-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .app-header {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 0.5rem;
          }

          .header-center {
            order: 1;
          }

          .header-left, .header-right {
            order: 2;
          }

          .header-title {
            font-size: 1.2rem;
          }

          .logo-image, .logo-fallback {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .header-title {
            font-size: 1rem;
          }

          .back-btn, .home-btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </header>
  )
}

export default Header 