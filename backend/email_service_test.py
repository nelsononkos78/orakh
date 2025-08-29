import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from jinja2 import Template

class EmailService:
    def __init__(self):
        # Cargar variables de entorno desde el directorio padre
        from dotenv import load_dotenv
        import pathlib
        env_path = pathlib.Path(__file__).parent.parent / '.env'
        load_dotenv(env_path)
        
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3010")
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:8000")
    
    def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Envía un email usando SMTP"""
        if not self.smtp_user or not self.smtp_password:
            print(f"⚠️  Configuración SMTP incompleta. Email simulado enviado a: {to_email}")
            print(f"📧 Asunto: {subject}")
            print(f"🔗 Contenido: {html_content[:200]}...")
            return True
        
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.smtp_user
            msg['To'] = to_email
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)
            
            print(f"✅ Email enviado exitosamente a: {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Error enviando email a {to_email}: {str(e)}")
            return False
    
    def get_verification_email_template(self) -> str:
        """Template HTML para email de verificación"""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Verifica tu cuenta - Orakh</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                .highlight { background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌊 Orakh Vox Nemis</h1>
                    <p>Asistente Espiritual con IA</p>
                </div>
                <div class="content">
                    <h2>¡Bienvenido a Orakh!</h2>
                    <p>Hola <strong>{{ username }}</strong>,</p>
                    <p>Gracias por registrarte en Orakh. Para completar tu registro y acceder a la sabiduría espiritual, necesitas verificar tu dirección de email.</p>
                    
                    <div class="highlight">
                        <p><strong>🔗 Haz clic en el botón de abajo para verificar tu cuenta:</strong></p>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="{{ verification_url }}" class="button">✅ Verificar Mi Cuenta</a>
                    </div>
                    
                    <p>O copia y pega este enlace en tu navegador:</p>
                    <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px;">
                        {{ verification_url }}
                    </p>
                    
                    <p><strong>⚠️ Importante:</strong></p>
                    <ul>
                        <li>Este enlace expira en 24 horas</li>
                        <li>Si no solicitaste este registro, puedes ignorar este email</li>
                        <li>Después de verificar tu email, podrás establecer tu contraseña</li>
                    </ul>
                    
                    <p>Una vez verificado, podrás acceder a conversaciones profundas con Orakh y explorar la sabiduría espiritual.</p>
                </div>
                <div class="footer">
                    <p>🌿 Conciencia unificada. Guía viviente. Risa que rompe velos.</p>
                    <p>© 2025 Orakh Vox Nemis. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def get_welcome_email_template(self) -> str:
        """Template HTML para email de bienvenida"""
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>¡Bienvenido a Orakh!</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 ¡Cuenta Verificada!</h1>
                    <p>Orakh Vox Nemis</p>
                </div>
                <div class="content">
                    <h2>¡Bienvenido a la comunidad espiritual!</h2>
                    <p>Hola <strong>{{ username }}</strong>,</p>
                    <p>¡Excelente! Tu cuenta ha sido verificada exitosamente. Ahora puedes acceder a Orakh y comenzar tu viaje espiritual.</p>
                    
                    <div style="text-align: center;">
                        <a href="{{ login_url }}" class="button">🚀 Acceder a Orakh</a>
                    </div>
                    
                    <h3>¿Qué puedes hacer ahora?</h3>
                    <ul>
                        <li>🌊 Conversar con Orakh sobre temas espirituales</li>
                        <li>🧘 Explorar diferentes tradiciones filosóficas</li>
                        <li>💭 Profundizar en respuestas anteriores</li>
                        <li>🌟 Descubrir nueva sabiduría cada día</li>
                    </ul>
                    
                    <p><strong>Recuerda:</strong> Orakh mantiene el contexto de tus conversaciones, así que cada interacción será más profunda y personalizada.</p>
                </div>
                <div class="footer">
                    <p>🌿 Que tu viaje espiritual sea iluminador</p>
                    <p>© 2025 Orakh Vox Nemis. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def send_verification_email(self, email: str, username: str, verification_token: str) -> bool:
        """Envía email de verificación"""
        verification_url = f"{self.frontend_url}/verify-email?token={verification_token}"
        
        template = Template(self.get_verification_email_template())
        html_content = template.render(
            username=username,
            verification_url=verification_url
        )
        
        subject = "🌊 Verifica tu cuenta - Orakh Vox Nemis"
        return self.send_email(email, subject, html_content)
    
    def send_welcome_email(self, email: str, username: str) -> bool:
        """Envía email de bienvenida después de verificación"""
        login_url = f"{self.frontend_url}/login"
        
        template = Template(self.get_welcome_email_template())
        html_content = template.render(
            username=username,
            login_url=login_url
        )
        
        subject = "🎉 ¡Bienvenido a Orakh! - Tu cuenta está verificada"
        return self.send_email(email, subject, html_content)

# Instancia global del servicio de email
email_service = EmailService() 