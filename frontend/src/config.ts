// Configuración de la API
const getBaseURL = (): string => {
  // Si hay una variable de entorno específica, usarla
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // En desarrollo local
  if (import.meta.env.DEV) {
    return 'http://localhost:2900';
  }
  
  // En producción (Render)
  if (import.meta.env.PROD) {
    return 'https://orakh-backend.onrender.com';
  }
  
  // Fallback
  return 'http://localhost:2900';
};

const baseURL = getBaseURL();

// Log para debugging (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🌐 API Config:', {
    baseURL,
    environment: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    prod: import.meta.env.PROD
  });
}

export const API_CONFIG = {
  baseURL,
  endpoints: {
    orakh: '/api/orakh',
    clearMemory: '/api/clear_memory',
    profundizar: '/api/profundizar',
    // Endpoints de autenticación
    register: '/api/auth/register',
    login: '/api/auth/login',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    verifyEmail: '/api/auth/verify-email',
    me: '/api/auth/me'
  }
};

// Función helper para construir URLs completas
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
}; 