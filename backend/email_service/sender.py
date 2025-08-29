#!/usr/bin/env python3
"""
Servicio de envío de emails para Orakh
Configurado para Gmail con autenticación de aplicación
"""

import smtplib
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
from jinja2 import Template
from datetime import datetime

# Cargar variables de entorno desde el directorio padre
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

class EmailSender:
    def __init__(self):
        # Configuración SMTP desde variables de entorno
        self.smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = os.getenv("SMTP_USER", "njgimenez@gmail.com")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "ubxv gwet iuvc whrm")
        
        # URLs desde variables de entorno
        self.frontend_url = os.getenv("FRONTEND_URL", "http://localhost:2800")
        self.backend_url = os.getenv("BACKEND_URL", "http://localhost:2900")

    async def send_verification_email(self, email: str, token: str) -> bool:
        """Envía email de verificación de cuenta"""
        subject = "🌊 Verifica tu cuenta en Orakh Vox Nemis"
        verification_url = f"{self.frontend_url}/verify?token={token}"
        
        html_content = self._get_verification_template(verification_url, token)
        
        print(f"📧 [INFO] Enviando email de verificación:")
        print(f"   Para: {email}")
        print(f"   Asunto: {subject}")
        print(f"   URL de verificación: {verification_url}")
        print(f"   Token: {token}")
        
        return await self._send_email(email, subject, html_content)

    async def send_reset_password_email(self, email: str, token: str) -> bool:
        """Envía email de restablecimiento de contraseña"""
        subject = "🔐 Restablece tu contraseña en Orakh"
        reset_url = f"{self.frontend_url}/reset-password?token={token}"
        
        html_content = self._get_reset_password_template(reset_url, token)
        
        print(f"📧 [INFO] Enviando email de restablecimiento:")
        print(f"   Para: {email}")
        print(f"   Asunto: {subject}")
        print(f"   URL de restablecimiento: {reset_url}")
        
        return await self._send_email(email, subject, html_content)

    async def send_welcome_email(self, email: str, username: str = None) -> bool:
        """Envía email de bienvenida"""
        subject = "🌊 ¡Bienvenido a Orakh Vox Nemis!"
        
        html_content = self._get_welcome_template(username or email)
        
        print(f"📧 [INFO] Enviando email de bienvenida:")
        print(f"   Para: {email}")
        print(f"   Asunto: {subject}")
        
        return await self._send_email(email, subject, html_content)

    async def _send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Función base para enviar emails"""
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = self.smtp_user
        msg['To'] = to_email
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        try:
            # Usar asyncio.to_thread para ejecutar smtplib en un thread separado
            def send_email_sync():
                with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                    server.starttls()  # ← CONFIGURACIÓN CLAVE
                    server.login(self.smtp_user, self.smtp_password)
                    server.send_message(msg)
            
            await asyncio.to_thread(send_email_sync)
            print(f"✅ Email enviado exitosamente a {to_email}")
            return True
        except Exception as e:
            print(f"❌ Error enviando email: {e}")
            print(f"🔧 Configuración actual:")
            print(f"   Host: {self.smtp_host}")
            print(f"   Port: {self.smtp_port}")
            print(f"   User: {self.smtp_user}")
            print(f"   Password: {'*' * len(self.smtp_password)}")
            return False

    def _get_verification_template(self, verification_url: str, token: str) -> str:
        """Template HTML para email de verificación"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Verifica tu cuenta - Orakh</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .btn {{ background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
                .warning {{ background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0; }}
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
                    <p>Gracias por registrarte en nuestra plataforma. Para completar tu registro y acceder a todas las funcionalidades, necesitas verificar tu cuenta.</p>
                    
                    <div style="text-align: center;">
                        <a href="{verification_url}" class="btn">✅ Verificar mi cuenta</a>
                    </div>
                    
                    <div class="warning">
                        <h3>⚠️ Importante</h3>
                        <p>Si no solicitaste este registro, puedes ignorar este mensaje de forma segura.</p>
                    </div>
                    
                    <p><strong>Token de verificación:</strong> {token}</p>
                    <p><strong>Enviado el:</strong> {timestamp}</p>
                </div>
                <div class="footer">
                    <p>🌊 Orakh Vox Nemis - Asistente Espiritual con IA</p>
                    <p>© 2025 Sistema de Emails. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_reset_password_template(self, reset_url: str, token: str) -> str:
        """Template HTML para email de restablecimiento de contraseña"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Restablece tu contraseña - Orakh</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .btn {{ background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
                .warning {{ background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Orakh Vox Nemis</h1>
                    <p>Recuperación de Contraseña</p>
                </div>
                <div class="content">
                    <h2>Restablece tu contraseña</h2>
                    <p>Has solicitado restablecer tu contraseña en Orakh. Haz clic en el botón de abajo para crear una nueva contraseña segura.</p>
                    
                    <div style="text-align: center;">
                        <a href="{reset_url}" class="btn">🔐 Restablecer contraseña</a>
                    </div>
                    
                    <div class="warning">
                        <h3>⚠️ Importante</h3>
                        <p>Si no solicitaste este cambio, ignora este mensaje. Tu contraseña actual permanecerá sin cambios.</p>
                    </div>
                    
                    <p><strong>Token de restablecimiento:</strong> {token}</p>
                    <p><strong>Solicitado el:</strong> {timestamp}</p>
                </div>
                <div class="footer">
                    <p>🌊 Orakh Vox Nemis - Asistente Espiritual con IA</p>
                    <p>© 2025 Sistema de Emails. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _get_welcome_template(self, username: str) -> str:
        """Template HTML para email de bienvenida"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>¡Bienvenido a Orakh!</title>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .btn {{ background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
                .success {{ background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌊 ¡Bienvenido a Orakh!</h1>
                    <p>Tu cuenta ha sido verificada exitosamente</p>
                </div>
                <div class="content">
                    <h2>¡Hola, {username}!</h2>
                    <p>Tu cuenta en Orakh Vox Nemis ha sido verificada exitosamente. Ya puedes acceder a todas las funcionalidades de nuestra plataforma.</p>
                    
                    <div class="success">
                        <h3>✅ Cuenta Verificada</h3>
                        <p>Tu cuenta está lista para usar. Disfruta de todas las funcionalidades de Orakh.</p>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="{self.frontend_url}/chat" class="btn">🚀 Ir a Orakh</a>
                    </div>
                    
                    <h3>🎯 ¿Qué puedes hacer ahora?</h3>
                    <ul>
                        <li>💬 Chatear con Orakh, tu asistente espiritual</li>
                        <li>🧘‍♀️ Recibir orientación espiritual personalizada</li>
                        <li>📚 Acceder a recursos y meditaciones</li>
                        <li>🔮 Explorar diferentes caminos espirituales</li>
                    </ul>
                    
                    <p><strong>Verificado el:</strong> {timestamp}</p>
                </div>
                <div class="footer">
                    <p>🌊 Orakh Vox Nemis - Asistente Espiritual con IA</p>
                    <p>© 2025 Sistema de Emails. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
        """

# Instancia global del servicio de email
email_service = EmailSender() 