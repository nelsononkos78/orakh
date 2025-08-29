import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { authService } from "../services/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!email || !password || !confirmPassword) {
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

    try {
      await authService.register({ email, password });
      setSuccess("¡Cuenta creada! Revisa tu correo para verificar tu cuenta.");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Regístrate en Orak" onSubmit={handleSubmit}>
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
      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="input-field"
      />
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button type="submit" className="send-btn" disabled={loading}>
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>
      <p className="auth-link">
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </AuthForm>
  );
} 