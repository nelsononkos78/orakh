// Configuración de la API
export const API_CONFIG = {
  // En desarrollo usa localhost, en producción usa la variable de entorno
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  endpoints: {
    orakh: '/api/orakh',
    clearMemory: '/api/clear_memory',
    profundizar: '/api/profundizar'
  }
};

// Función helper para construir URLs completas
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
}; 