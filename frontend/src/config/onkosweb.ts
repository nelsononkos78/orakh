// Configuración específica para onkosweb.com:8080
export const ONKOSWEB_CONFIG = {
  // URL base para assets en onkosweb
  assetsBaseUrl: 'http://onkosweb.com:8080',
  
  // Configuración de la API
  apiBaseUrl: 'http://localhost:2900', // O la URL del backend de onkosweb
  
  // Configuración de rutas
  routes: {
    home: '/',
    examenes: '/examenes',
    headerDemo: '/header-demo',
    imageEditor: '/image-editor'
  },
  
  // Configuración de assets
  assets: {
    logo: '/src/assets/images/orack.jpg',
    logoFallback: '🌊',
    favicon: '/orakh-favicon.svg'
  },
  
  // Configuración de CORS
  cors: {
    allowedOrigins: [
      'http://localhost:2800',
      'http://127.0.0.1:2800',
      'http://onkosweb.com:8080'
    ]
  }
}

// Función para obtener la URL completa de un asset
export const getAssetUrl = (assetPath: string): string => {
  if (assetPath.startsWith('http')) {
    return assetPath
  }
  
  // Si estamos en onkosweb, usar la URL base
  if (window.location.hostname === 'onkosweb.com') {
    return `${ONKOSWEB_CONFIG.assetsBaseUrl}${assetPath}`
  }
  
  // En desarrollo local, usar la ruta relativa
  return assetPath
}

// Función para verificar si estamos en onkosweb
export const isOnkosweb = (): boolean => {
  return window.location.hostname === 'onkosweb.com'
}

// Función para obtener la configuración de la API según el entorno
export const getApiConfig = () => {
  if (isOnkosweb()) {
    return {
      baseURL: ONKOSWEB_CONFIG.apiBaseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
  
  // Configuración por defecto para desarrollo local
  return {
    baseURL: 'http://localhost:2900',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  }
} 