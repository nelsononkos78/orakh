#!/usr/bin/env python3
"""
Script de prueba para enviar email usando el EmailService
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from email_service_test import email_service
from datetime import datetime

def test_email():
    """Envía un email de prueba"""
    test_email = "ngimenez@disnovo.com"
    
    print("=== PRUEBA DE ENVÍO DE EMAIL ===")
    print(f"📧 Enviando email de prueba a: {test_email}")
    print()
    
    # Verificar configuración SMTP
    print("🔧 Configuración SMTP:")
    print(f"   Host: {email_service.smtp_host}")
    print(f"   Port: {email_service.smtp_port}")
    print(f"   User: {email_service.smtp_user}")
    print(f"   Password length: {len(email_service.smtp_password) if email_service.smtp_password else 0}")
    print()
    
    # Email de prueba
    subject = "🧪 Prueba de Email - Orakh Vox Nemis"
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Prueba de Email - Orakh</title>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .success {{ background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; }}
            .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🧪 Prueba de Email</h1>
                <p>Orakh Vox Nemis - Sistema de Emails</p>
            </div>
            <div class="content">
                <h2>¡Email de Prueba Exitoso!</h2>
                <p>Hola,</p>
                <p>Este es un email de prueba para verificar que el sistema de envío de emails de Orakh está funcionando correctamente.</p>
                
                <div class="success">
                    <h3>✅ Configuración SMTP Verificada</h3>
                    <ul>
                        <li><strong>Host:</strong> smtp.gmail.com</li>
                        <li><strong>Puerto:</strong> 587</li>
                        <li><strong>TLS:</strong> Habilitado</li>
                        <li><strong>Autenticación:</strong> Funcionando</li>
                    </ul>
                </div>
                
                <h3>🎯 Próximos Pasos</h3>
                <p>Si recibes este email, significa que:</p>
                <ul>
                    <li>✅ La configuración SMTP es correcta</li>
                    <li>✅ Las credenciales de Gmail son válidas</li>
                    <li>✅ El sistema puede enviar emails de verificación</li>
                    <li>✅ El sistema puede enviar emails de bienvenida</li>
                </ul>
                
                <p><strong>Timestamp:</strong> {timestamp}</p>
                <p><strong>Usuario SMTP:</strong> {email_service.smtp_user}</p>
            </div>
            <div class="footer">
                <p>🌊 Orakh Vox Nemis - Asistente Espiritual con IA</p>
                <p>© 2025 Sistema de Emails. Todos los derechos reservados.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Enviar email
    print("📤 Enviando email...")
    success = email_service.send_email(test_email, subject, html_content)
    
    if success:
        print("✅ Email enviado exitosamente!")
        print(f"📧 Revisa tu bandeja de entrada: {test_email}")
    else:
        print("❌ Error al enviar email")
        print("🔍 Verifica la configuración SMTP en el archivo .env")
    
    print()
    print("=== FIN DE PRUEBA ===")

if __name__ == "__main__":
    test_email() 