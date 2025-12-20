# 🛠️ Guía Rápida de Soporte - Moodle + VozSegura

## 📋 Para Personal de Soporte Técnico

Esta guía está diseñada para personal de soporte que necesita dar asistencia sobre la integración de Moodle con VozSegura.

---

## 🔍 Diagnóstico Rápido

### Problema: "No puedo acceder a VozSegura desde Moodle"

**Checklist de verificación:**

```bash
# 1. Verificar que VozSegura esté corriendo
curl http://localhost:3000/api/health
# Respuesta esperada: {"status": "ok"}

# 2. Verificar frontend de VozSegura
curl http://localhost:5173
# Respuesta esperada: HTML de la aplicación

# 3. Verificar conectividad desde Moodle
curl https://vozsegura.tuinstitucion.edu
```

**Solución común:**
- Verificar que el servicio esté corriendo: `pm2 status` o `systemctl status vozsegura`
- Verificar configuración de firewall: `sudo ufw status`
- Verificar logs: `tail -f /var/log/vozsegura.log`

---

### Problema: "El SSO no funciona"

**Verificar:**

1. **Token de Moodle válido:**
```bash
# Desde Moodle
Administración → Plugins → Servicios web → Administrar tokens
# Verificar que el token existe y no ha expirado
```

2. **Web Services habilitados en Moodle:**
```bash
Administración → Plugins → Servicios web → Visión general
# Todos los pasos deben estar en verde
```

3. **Verificar JWT_SECRET en VozSegura:**
```bash
cd /var/www/VozSegura
cat .env | grep JWT_SECRET
# Debe existir y tener un valor
```

4. **Probar autenticación manual:**
```bash
curl -X POST http://localhost:3000/api/auth/sso/moodle \
  -H "Content-Type: application/json" \
  -d '{"moodle_token": "TU_TOKEN_AQUI"}'
```

---

### Problema: "Moodle está lento después de la integración"

**Diagnóstico:**

```bash
# 1. Verificar uso de CPU y RAM
htop

# 2. Verificar procesos MySQL
mysql -u root -p -e "SHOW PROCESSLIST;"

# 3. Verificar logs de Apache
tail -f /var/log/apache2/moodle_error.log

# 4. Verificar espacio en disco
df -h
```

**Solución:**
- VozSegura NO debe afectar el rendimiento de Moodle
- Si hay lentitud, probablemente sea un problema de Moodle independiente
- Verificar caché de Moodle: `Administración → Desarrollo → Purgar todas las cachés`

---

## 🔧 Comandos Útiles

### Gestión de Servicios

```bash
# Backend VozSegura
cd /var/www/VozSegura
npm start  # Modo desarrollo
pm2 start server.js --name vozsegura  # Modo producción
pm2 logs vozsegura  # Ver logs
pm2 restart vozsegura  # Reiniciar

# Moodle (Apache)
sudo systemctl status apache2
sudo systemctl restart apache2
sudo systemctl status mysql

# Ver logs en tiempo real
tail -f /var/log/apache2/moodle_error.log
tail -f /var/www/VozSegura/logs/app.log
```

### Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Verificar estado de BD Moodle
mysql -u root -p -e "USE moodle; SELECT COUNT(*) FROM mdl_user;"

# Verificar estado de BD VozSegura
mysql -u root -p -e "USE vozsegura; SELECT COUNT(*) FROM denuncias;"

# Backup rápido
mysqldump -u root -p moodle > /tmp/moodle_backup_$(date +%Y%m%d).sql
mysqldump -u root -p vozsegura > /tmp/vozsegura_backup_$(date +%Y%m%d).sql
```

### Verificación de Configuración

```bash
# Verificar PHP
php -v
php -m | grep -E 'mysql|curl|json|mbstring'

# Verificar Node.js
node -v
npm -v

# Verificar variables de entorno VozSegura
cd /var/www/VozSegura
cat .env

# Verificar configuración Moodle
cat /var/www/html/moodle/config.php | grep -E 'dbhost|dbname|dbuser'
```

---

## 📞 Respuestas a Preguntas Frecuentes de Usuarios

### "¿Cómo hago una denuncia desde Moodle?"

**Respuesta para dar al usuario:**

1. Inicia sesión en Moodle con tu cuenta
2. Busca el enlace "VozSegura" o "Canal de Denuncias" en el menú lateral
3. Haz clic para acceder al sistema
4. Si es tu primera vez, el sistema te reconocerá automáticamente (SSO)
5. Completa el formulario de denuncia
6. Guarda el código único que recibirás

### "¿Es realmente anónimo?"

**Respuesta para dar al usuario:**

- Las denuncias desde Moodle están vinculadas a tu usuario (para seguimiento)
- Si deseas anonimato total, puedes crear una denuncia sin iniciar sesión
- Ve directamente a: https://vozsegura.tuinstitucion.edu
- Haz clic en "Denuncia Anónima"
- Importante: Guarda el código que recibirás, no podremos recuperarlo

### "¿Quién puede ver mi denuncia?"

**Respuesta para dar al usuario:**

- Solo los administradores designados de VozSegura
- NO es visible para profesores ni otros estudiantes
- NO aparece en Moodle, solo el enlace de acceso
- Los datos están protegidos y encriptados

### "¿Cuánto tarda la respuesta?"

**Respuesta para dar al usuario:**

- El tiempo de respuesta depende de la gravedad del caso
- Casos urgentes: dentro de 24 horas
- Casos normales: 3-5 días hábiles
- Puedes consultar el estado con tu código desde Moodle

---

## 🚨 Escenarios de Emergencia

### Servidor Caído

```bash
# 1. Verificar qué está caído
systemctl status apache2
systemctl status mysql
pm2 status

# 2. Intentar reiniciar servicios
sudo systemctl restart apache2
sudo systemctl restart mysql
pm2 restart all

# 3. Si persiste, verificar logs
tail -n 100 /var/log/apache2/error.log
tail -n 100 /var/log/mysql/error.log

# 4. Verificar espacio en disco
df -h
# Si está lleno, limpiar:
sudo apt autoremove
sudo apt clean
```

### Base de Datos Corrupta

```bash
# 1. Verificar integridad
mysqlcheck -u root -p --all-databases

# 2. Reparar si es necesario
mysqlcheck -u root -p --auto-repair --all-databases

# 3. Restaurar desde backup si falla
mysql -u root -p moodle < /backups/moodle/ultimo_backup.sql
mysql -u root -p vozsegura < /backups/vozsegura/ultimo_backup.sql
```

### Certificado SSL Expirado

```bash
# 1. Verificar fecha de expiración
sudo certbot certificates

# 2. Renovar
sudo certbot renew

# 3. Reiniciar Apache
sudo systemctl restart apache2
```

---

## 📊 Monitoreo Recomendado

### Herramientas a Instalar

```bash
# htop - Monitor de recursos
sudo apt install htop

# iftop - Monitor de red
sudo apt install iftop

# netdata - Dashboard web de monitoreo
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
# Acceder en: http://tu-servidor:19999
```

### Métricas Importantes a Vigilar

**Moodle:**
- Usuarios conectados simultáneos
- Tiempo de respuesta de páginas (< 2 segundos)
- Errores en logs de Apache
- Espacio en `/var/moodledata`

**VozSegura:**
- Denuncias recibidas por día
- Tiempo de respuesta API (< 500ms)
- Errores en logs de aplicación
- Espacio en `/uploads`

**Sistema:**
- CPU: < 70% en promedio
- RAM: < 80% en uso
- Disco: < 85% en uso
- Red: Sin pérdida de paquetes

---

## 📝 Checklist Semanal de Mantenimiento

### Lunes
- [ ] Verificar backups del fin de semana
- [ ] Revisar logs de errores
- [ ] Verificar espacio en disco
- [ ] Probar accesos de usuarios

### Miércoles
- [ ] Actualizar lista de plugins de Moodle
- [ ] Verificar certificados SSL (fecha)
- [ ] Revisar estadísticas de uso
- [ ] Limpiar archivos temporales

### Viernes
- [ ] Realizar backup manual adicional
- [ ] Verificar rendimiento del servidor
- [ ] Revisar casos pendientes en VozSegura
- [ ] Documentar incidencias de la semana

---

## 🔐 Seguridad

### Checklist de Seguridad Mensual

```bash
# 1. Actualizar sistema operativo
sudo apt update && sudo apt upgrade -y

# 2. Actualizar Moodle
cd /var/www/html/moodle
sudo -u www-data git pull
sudo -u www-data php admin/cli/upgrade.php

# 3. Actualizar VozSegura
cd /var/www/VozSegura
git pull
npm install
pm2 restart vozsegura

# 4. Revisar usuarios de Moodle
# Administración → Usuarios → Examinar lista de usuarios
# Buscar usuarios sospechosos o inactivos

# 5. Revisar logs de seguridad
grep -i "failed" /var/log/auth.log | tail -20
grep -i "error" /var/log/apache2/moodle_error.log | tail -20

# 6. Verificar permisos de archivos
ls -la /var/www/html/moodle/config.php
# Debe ser: -rw-r----- www-data www-data

ls -la /var/www/VozSegura/.env
# Debe ser: -rw------- usuario usuario
```

### Contraseñas Seguras

**Para Moodle:**
- Mínimo 8 caracteres
- Al menos 1 mayúscula, 1 minúscula, 1 número, 1 símbolo
- Cambiar cada 90 días (administradores)

**Para VozSegura:**
- Administrador por defecto: CAMBIAR INMEDIATAMENTE
- Mismas reglas que Moodle

```bash
# Generar contraseña segura
openssl rand -base64 24
```

---

## 📚 Recursos Adicionales

### Documentación

- **Moodle Docs:** https://docs.moodle.org/
- **VozSegura README:** [README.md](README.md)
- **Guía de Integración:** [GUIA_MOODLE_INTEGRACION.md](GUIA_MOODLE_INTEGRACION.md)

### Comunidades de Soporte

- **Foro Moodle:** https://moodle.org/mod/forum/
- **Stack Overflow:** https://stackoverflow.com/questions/tagged/moodle
- **VozSegura GitHub Issues:** https://github.com/juanluligo/VozSegura/issues

### Capacitación

- **Moodle Academy:** https://moodle.academy/
- **YouTube Moodle en Español:** Buscar tutoriales específicos

---

## 📞 Contacto para Escalamiento

### Nivel 1 - Soporte Básico (Tú)
- Problemas de acceso
- Preguntas de uso básico
- Reset de contraseñas
- Consultas generales

### Nivel 2 - Soporte Técnico
- Problemas de rendimiento
- Errores de aplicación
- Problemas de integración
- Configuraciones avanzadas

### Nivel 3 - Desarrollo
- Bugs en el código
- Nuevas funcionalidades
- Cambios estructurales
- Vulnerabilidades de seguridad

---

## ✅ Plantillas de Respuesta

### Problema Resuelto

```
Hola [Nombre],

Hemos resuelto tu problema con [descripción breve].

La solución implementada fue:
- [Paso 1]
- [Paso 2]

El sistema ya está funcionando correctamente. Por favor verifica e infórmanos si tienes algún inconveniente.

Saludos,
Soporte Técnico
```

### Escalamiento Necesario

```
Hola [Nombre],

Gracias por reportar el problema con [descripción].

Este caso requiere atención especializada, por lo que lo hemos escalado al equipo de [Nivel 2/3].

Tiempo estimado de resolución: [X horas/días]
Ticket #: [número]

Te mantendremos informado sobre el progreso.

Saludos,
Soporte Técnico
```

### Solicitud de Información

```
Hola [Nombre],

Para poder ayudarte mejor con [problema], necesitamos la siguiente información:

1. ¿Qué navegador estás usando?
2. ¿Cuándo comenzó el problema?
3. ¿Puedes enviar una captura de pantalla del error?
4. ¿Has intentado [solución básica]?

Quedamos atentos a tu respuesta.

Saludos,
Soporte Técnico
```

---

**Última actualización:** Diciembre 2024  
**Para consultas sobre esta guía:** Contactar al equipo de desarrollo
