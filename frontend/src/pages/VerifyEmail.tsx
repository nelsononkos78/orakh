import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export default function VerifyEmail() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail();
    } else {
      setError("Token de verificación inválido.");
    }
  }, [token]);

  const verifyEmail = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      await authService.verifyEmail({ token });
      setSuccess("¡Email verificado exitosamente! Redirigiendo al login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al verificar email");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h1>Verificando email...</h1>
          <p>Por favor espera mientras verificamos tu cuenta.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h1>Verificación de Email</h1>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <p className="auth-link">
          <a href="/login">Volver al inicio de sesión</a>
        </p>
      </div>
    </div>
  );
} 