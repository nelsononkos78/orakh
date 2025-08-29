import React, { useState, useRef } from 'react'

interface ImageEditorProps {
  imageUrl: string
  onSave?: (settings: ImageSettings) => void
  onCancel?: () => void
}

interface ImageSettings {
  size: 'small' | 'medium' | 'normal' | 'large' | 'custom'
  position: 'left' | 'center' | 'right' | 'custom'
  width?: number
  height?: number
  customWidth?: number
  customHeight?: number
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onSave, onCancel }) => {
  const [settings, setSettings] = useState<ImageSettings>({
    size: 'normal',
    position: 'center'
  })
  const [showCustomSize, setShowCustomSize] = useState(false)
  const [showCustomPosition, setShowCustomPosition] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  const sizeOptions = [
    { value: 'small', label: 'Pequeño', width: 200, height: 150 },
    { value: 'medium', label: 'Mediano', width: 300, height: 225 },
    { value: 'normal', label: 'Normal', width: 400, height: 300 },
    { value: 'large', label: 'Grande', width: 600, height: 450 }
  ]

  const positionOptions = [
    { value: 'left', label: 'Izquierda' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Derecha' }
  ]

  const handleSizeChange = (size: ImageSettings['size']) => {
    setSettings(prev => ({
      ...prev,
      size,
      width: sizeOptions.find(opt => opt.value === size)?.width,
      height: sizeOptions.find(opt => opt.value === size)?.height
    }))
    setShowCustomSize(size === 'custom')
  }

  const handlePositionChange = (position: ImageSettings['position']) => {
    setSettings(prev => ({ ...prev, position }))
    setShowCustomPosition(position === 'custom')
  }

  const handleCustomSizeChange = (field: 'width' | 'height', value: number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getImageStyle = () => {
    const baseStyle: React.CSSProperties = {
      maxWidth: '100%',
      height: 'auto',
      objectFit: 'contain'
    }

    if (settings.size === 'custom' && settings.customWidth && settings.customHeight) {
      baseStyle.width = `${settings.customWidth}px`
      baseStyle.height = `${settings.customHeight}px`
    } else if (settings.width && settings.height) {
      baseStyle.width = `${settings.width}px`
      baseStyle.height = `${settings.height}px`
    }

    // Posición
    switch (settings.position) {
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

  const handleSave = () => {
    onSave?.(settings)
  }

  return (
    <div className="image-editor">
      <div className="editor-header">
        <h3>🖼️ Editor de Imagen</h3>
        <div className="header-actions">
          <button onClick={handleSave} className="save-btn">
            💾 Guardar
          </button>
          <button onClick={onCancel} className="cancel-btn">
            ❌ Cancelar
          </button>
        </div>
      </div>

      <div className="editor-content">
        <div className="controls-section">
          {/* Controles de Tamaño */}
          <div className="control-group">
            <label className="control-label">📏 Tamaño:</label>
            <div className="size-controls">
              {sizeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSizeChange(option.value as ImageSettings['size'])}
                  className={`size-btn ${settings.size === option.value ? 'active' : ''}`}
                >
                  {option.label}
                </button>
              ))}
              <button
                onClick={() => handleSizeChange('custom')}
                className={`size-btn ${settings.size === 'custom' ? 'active' : ''}`}
              >
                Personalizado
              </button>
            </div>
            
            {showCustomSize && (
              <div className="custom-size-inputs">
                <div className="input-group">
                  <label>Ancho (px):</label>
                  <input
                    type="number"
                    value={settings.customWidth || ''}
                    onChange={(e) => handleCustomSizeChange('width', parseInt(e.target.value) || 0)}
                    min="50"
                    max="1200"
                    className="size-input"
                  />
                </div>
                <div className="input-group">
                  <label>Alto (px):</label>
                  <input
                    type="number"
                    value={settings.customHeight || ''}
                    onChange={(e) => handleCustomSizeChange('height', parseInt(e.target.value) || 0)}
                    min="50"
                    max="800"
                    className="size-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Controles de Posición */}
          <div className="control-group">
            <label className="control-label">📍 Posición:</label>
            <div className="position-controls">
              {positionOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handlePositionChange(option.value as ImageSettings['position'])}
                  className={`position-btn ${settings.position === option.value ? 'active' : ''}`}
                >
                  {option.label}
                </button>
              ))}
              <button
                onClick={() => handlePositionChange('custom')}
                className={`position-btn ${settings.position === 'custom' ? 'active' : ''}`}
              >
                Personalizado
              </button>
            </div>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="preview-section">
          <label className="preview-label">👁️ Vista Previa:</label>
          <div className="preview-container">
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Vista previa"
              style={getImageStyle()}
              className="preview-image"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .image-editor {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
        }

        .editor-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.5rem;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .save-btn, .cancel-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }

        .save-btn {
          background: #3b82f6;
          color: white;
        }

        .save-btn:hover {
          background: #2563eb;
        }

        .cancel-btn {
          background: #ef4444;
          color: white;
        }

        .cancel-btn:hover {
          background: #dc2626;
        }

        .editor-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .controls-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .control-group {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .control-label {
          display: block;
          font-weight: bold;
          margin-bottom: 10px;
          color: #374151;
        }

        .size-controls, .position-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 10px;
        }

        .size-btn, .position-btn {
          padding: 6px 12px;
          border: 2px solid #d1d5db;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .size-btn:hover, .position-btn:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .size-btn.active, .position-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .custom-size-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .input-group label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .size-input {
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .preview-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .preview-label {
          font-weight: bold;
          color: #374151;
        }

        .preview-container {
          background: #f8fafc;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          padding: 20px;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .preview-image {
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 768px) {
          .editor-content {
            grid-template-columns: 1fr;
          }
          
          .custom-size-inputs {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default ImageEditor 