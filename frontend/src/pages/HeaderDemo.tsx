import React from 'react'
import Header from '../components/Header'

const HeaderDemo: React.FC = () => {
  return (
    <div className="header-demo">
      <Header 
        title="🔬 Lector de Exámenes con IA"
        showBackButton={true}
        showHomeButton={true}
      />
      
      <div className="demo-content">
        <div className="demo-section">
          <h2>✅ Header con Logo Funcionando</h2>
          <p>El header superior ahora muestra correctamente el logo de Orakh junto con el título de la página.</p>
        </div>

        <div className="demo-section">
          <h3>🎯 Características del Header:</h3>
          <ul>
            <li>✅ Logo circular con imagen de Orakh</li>
            <li>✅ Fallback con emoji 🌊 si la imagen no carga</li>
            <li>✅ Botón "← Volver" funcional</li>
            <li>✅ Botón "🏠 Inicio" funcional</li>
            <li>✅ Diseño responsive</li>
            <li>✅ Gradiente de fondo atractivo</li>
          </ul>
        </div>

        <div className="demo-section">
          <h3>🔧 Configuración Técnica:</h3>
          <ul>
            <li>✅ Importación correcta del logo desde assets</li>
            <li>✅ Manejo de errores de carga de imagen</li>
            <li>✅ Estilos CSS-in-JS encapsulados</li>
            <li>✅ Navegación con React Router</li>
            <li>✅ Componente reutilizable</li>
          </ul>
        </div>

        <div className="demo-section">
          <h3>📱 Responsive Design:</h3>
          <ul>
            <li>✅ Desktop: Layout horizontal completo</li>
            <li>✅ Tablet: Layout adaptativo</li>
            <li>✅ Mobile: Layout vertical optimizado</li>
            <li>✅ Logo y botones redimensionados automáticamente</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .header-demo {
          min-height: 100vh;
          background: #f8fafc;
        }

        .demo-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .demo-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .demo-section h2 {
          color: #2d3748;
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }

        .demo-section h3 {
          color: #4a5568;
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .demo-section p {
          color: #718096;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .demo-section ul {
          color: #4a5568;
          line-height: 1.8;
        }

        .demo-section li {
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .demo-content {
            padding: 1rem;
          }

          .demo-section {
            padding: 1.5rem;
          }

          .demo-section h2 {
            font-size: 1.5rem;
          }

          .demo-section h3 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  )
}

export default HeaderDemo 