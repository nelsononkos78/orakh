import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { authService } from "../services/auth";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Token de recuperación inválido.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!password || !confirmPassword) {
      setError("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (!token) {
      setError("Token de recuperación inválido.");
      setLoading(false);
      return;
    }

    try {
      await authService.resetPassword({ token, password });
      setSuccess("¡Contraseña actualizada! Redirigiendo al login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al restablecer contraseña");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <p className="error-message">Token de recuperación inválido.</p>
          <a href="/forgot-password" className="send-btn">Solicitar nuevo enlace</a>
        </div>
      </div>
    );
  }

  return (
    <AuthForm title="Nueva Contraseña" onSubmit={handleSubmit}>
      <p className="auth-description">
        Ingresa tu nueva contraseña.
      </p>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Confirmar nueva contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="input-field"
      />
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button type="submit" className="send-btn" disabled={loading}>
        {loading ? "Cambiando contraseña..." : "Cambiar contraseña"}
      </button>
    </AuthForm>
  );
} 