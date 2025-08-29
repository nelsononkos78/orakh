import { API_CONFIG } from '../config';

export interface User {
  id: string;
  email: string;
  is_verified: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface VerifyEmailData {
  token: string;
}

class AuthService {
  private baseURL = API_CONFIG.baseURL;

  // Guardar token en localStorage
  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Obtener token de localStorage
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Remover token de localStorage
  private removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  // Registrar usuario
  async register(data: RegisterData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en el registro');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Iniciar sesión
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Credenciales incorrectas');
      }

      const result = await response.json();
      this.setToken(result.access_token);
      return result;
    } catch (error) {
      throw error;
    }
  }

  // Solicitar recuperación de contraseña
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.forgotPassword}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al solicitar recuperación');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Restablecer contraseña
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.resetPassword}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al restablecer contraseña');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Verificar email
  async verifyEmail(data: VerifyEmailData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.verifyEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al verificar email');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Obtener usuario actual
  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.me}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al obtener usuario');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Cerrar sesión
  logout(): void {
    this.removeToken();
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  // Obtener token actual
  getCurrentToken(): string | null {
    return this.getToken();
  }
}

export const authService = new AuthService(); 