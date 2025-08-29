import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { authService } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    try {
      await authService.login({ email, password });
      navigate("/chat");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Iniciar Sesión en Orak" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="send-btn" disabled={loading}>
        {loading ? "Iniciando sesión..." : "Ingresar"}
      </button>
      <p className="auth-link">
        ¿No tienes cuenta? <a href="/register">Regístrate</a>
      </p>
      <p className="auth-link">
        <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
      </p>
    </AuthForm>
  );
} 