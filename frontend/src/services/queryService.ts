import { API_CONFIG } from '../config'

export interface QueryStatus {
  can_query: boolean
  remaining: number
  limit: number
  used: number
  requires_registration: boolean
  message?: string
}

export interface QueryRecordResponse {
  message: string
  remaining: number
  requires_registration: boolean
}

class QueryService {
  private baseURL = API_CONFIG.baseURL





  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('orakh_token')
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  async getQueryStatus(): Promise<QueryStatus> {
    try {
      const response = await fetch(`${this.baseURL}/api/queries/status`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Error al obtener el estado de consultas')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting query status:', error)
      // Retornar estado por defecto para usuarios anónimos
      return {
        can_query: true,
        remaining: 5,
        limit: 5,
        used: 0,
        requires_registration: false
      }
    }
  }

  async recordQuery(): Promise<QueryRecordResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/queries/record`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Error al registrar consulta')
      }

      return await response.json()
    } catch (error) {
      console.error('Error recording query:', error)
      throw error
    }
  }



  // Método para verificar si el usuario debe registrarse
  shouldRequireRegistration(remaining: number, requires_registration: boolean): boolean {
    return remaining === 0 || requires_registration
  }

  // Método para obtener el mensaje de límite alcanzado
  getLimitMessage(remaining: number, limit: number, requires_registration: boolean): string {
    if (remaining === 0) {
      if (requires_registration) {
        return `Has alcanzado el límite de ${limit} consultas gratuitas. ¡Regístrate para continuar!`
      } else {
        return `Has alcanzado tu límite diario de ${limit} consultas. Vuelve mañana.`
      }
    }
    return `Te quedan ${remaining} consultas de ${limit}`
  }
}

export const queryService = new QueryService() 