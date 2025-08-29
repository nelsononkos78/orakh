import { useState } from "react";
import AuthForm from "../components/AuthForm";
import { authService } from "../services/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
      setLoading(false);
      return;
    }

    try {
      await authService.forgotPassword({ email });
      setSuccess("¡Enlace enviado! Revisa tu correo para restablecer tu contraseña.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al solicitar recuperación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Recuperar Contraseña" onSubmit={handleSubmit}>
      <p className="auth-description">
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </p>
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button type="submit" className="send-btn" disabled={loading}>
        {loading ? "Enviando..." : "Enviar enlace"}
      </button>
      <p className="auth-link">
        <a href="/login">Volver al inicio de sesión</a>
      </p>
    </AuthForm>
  );
} 