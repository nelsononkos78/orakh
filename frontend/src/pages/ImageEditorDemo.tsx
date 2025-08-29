import React, { useState } from 'react'
import ImageEditor from '../components/ImageEditor'

interface ImageSettings {
  size: 'small' | 'medium' | 'normal' | 'large' | 'custom'
  position: 'left' | 'center' | 'right' | 'custom'
  width?: number
  height?: number
  customWidth?: number
  customHeight?: number
}

const ImageEditorDemo: React.FC = () => {
  const [showEditor, setShowEditor] = useState(false)
  const [currentSettings, setCurrentSettings] = useState<ImageSettings>({
    size: 'normal',
    position: 'center'
  })
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/400/300')

  const handleSave = (settings: ImageSettings) => {
    setCurrentSettings(settings)
    setShowEditor(false)
  }

  const handleCancel = () => {
    setShowEditor(false)
  }

  const getImageStyle = () => {
    const baseStyle: React.CSSProperties = {
      maxWidth: '100%',
      height: 'auto',
      objectFit: 'contain',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }

    if (currentSettings.size === 'custom' && currentSettings.customWidth && currentSettings.customHeight) {
      baseStyle.width = `${currentSettings.customWidth}px`
      baseStyle.height = `${currentSettings.customHeight}px`
    } else if (currentSettings.width && currentSettings.height) {
      baseStyle.width = `${currentSettings.width}px`
      baseStyle.height = `${currentSettings.height}px`
    }

    // Posición
    switch (currentSettings.position) {
      case 'left':
        baseStyle.marginRight = 'auto'
        baseStyle.marginLeft = '0'
        break
      case 'center':
        baseStyle.marginLeft = 'auto'
        baseStyle.marginRight = 'auto'
        break
      case 'right':
        baseStyle.marginLeft = 'auto'
        baseStyle.marginRight = '0'
        break
    }

    return baseStyle
  }

  return (
    <div className="image-editor-demo">
      <div className="demo-header">
        <h1>🖼️ Editor de Imágenes - Demostración</h1>
        <p>Prueba el editor de imágenes con controles rápidos de tamaño y posición</p>
      </div>

      <div className="demo-controls">
        <button 
          onClick={() => setShowEditor(true)}
          className="edit-btn"
        >
          ✏️ Editar Imagen
        </button>
        
        <div className="url-input">
          <label>URL de la imagen:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="url-field"
          />
        </div>
      </div>

      <div className="demo-content">
        <div className="image-container">
          <h3>Resultado:</h3>
          <div className="result-container">
            <img
              src={imageUrl}
              alt="Imagen editada"
              style={getImageStyle()}
              className="result-image"
            />
          </div>
        </div>

        <div className="settings-display">
          <h3>Configuración Actual:</h3>
          <div className="settings-info">
            <p><strong>Tamaño:</strong> {currentSettings.size}</p>
            <p><strong>Posición:</strong> {currentSettings.position}</p>
            {currentSettings.width && currentSettings.height && (
              <p><strong>Dimensiones:</strong> {currentSettings.width}px × {currentSettings.height}px</p>
            )}
            {currentSettings.customWidth && currentSettings.customHeight && (
              <p><strong>Dimensiones personalizadas:</strong> {currentSettings.customWidth}px × {currentSettings.customHeight}px</p>
            )}
          </div>
        </div>
      </div>

      {showEditor && (
        <div className="editor-modal">
          <div className="modal-overlay" onClick={handleCancel}></div>
          <div className="modal-content">
            <ImageEditor
              imageUrl={imageUrl}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .image-editor-demo {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .demo-header h1 {
          color: #1f2937;
          margin-bottom: 10px;
        }

        .demo-header p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        .demo-controls {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .edit-btn {
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .url-input {
          display: flex;
          flex-direction: column;
          gap: 5px;
          flex: 1;
        }

        .url-input label {
          font-weight: bold;
          color: #374151;
        }

        .url-field {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .demo-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }

        .image-container {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .image-container h3 {
          margin-top: 0;
          color: #374151;
          margin-bottom: 15px;
        }

        .result-container {
          background: #f8fafc;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 20px;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-image {
          transition: all 0.3s ease;
        }

        .settings-display {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }

        .settings-display h3 {
          margin-top: 0;
          color: #374151;
          margin-bottom: 15px;
        }

        .settings-info {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .settings-info p {
          margin: 8px 0;
          color: #374151;
        }

        .editor-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
          position: relative;
          z-index: 1001;
          max-width: 90vw;
          max-height: 90vh;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .demo-controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .demo-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default ImageEditorDemo 