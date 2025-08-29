#!/usr/bin/env python3
"""
Script de prueba para verificar el envío de email usando el sender actual
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from email_service.sender import EmailSender

def test_sender():
    """Prueba el envío de email usando el sender actual"""
    test_email = "ngimenez@disnovo.com"
    
    print("=== PRUEBA DEL SENDER ACTUAL ===")
    print(f"📧 Enviando email de prueba a: {test_email}")
    print()
    
    # Crear instancia del sender
    sender = EmailSender()
    
    # Verificar configuración SMTP
    print("🔧 Configuración SMTP:")
    print(f"   Host: {sender.smtp_host}")
    print(f"   Port: {sender.smtp_port}")
    print(f"   User: {sender.smtp_user}")
    print(f"   Password length: {len(sender.smtp_password) if sender.smtp_password else 0}")
    print(f"   Frontend URL: {sender.frontend_url}")
    print()
    
    # Probar envío de email de verificación
    token = "test-token-12345"
    success = sender.send_verification_email(test_email, token)
    
    if success:
        print("✅ Email enviado exitosamente!")
        print(f"📧 Revisa tu bandeja de entrada: {test_email}")
    else:
        print("❌ Error al enviar email")
        print("🔍 Verifica la configuración SMTP")
    
    print()
    print("=== FIN DE PRUEBA ===")

if __name__ == "__main__":
    test_sender() 