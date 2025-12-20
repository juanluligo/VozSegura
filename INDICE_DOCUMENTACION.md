# 📚 Índice de Documentación - VozSegura

## Documentación Disponible

### 🚀 Inicio Rápido
- **[README.md](README.md)** - Guía principal de instalación y uso de VozSegura
  - Instalación completa del sistema
  - Características y funcionalidades
  - API endpoints
  - Credenciales de prueba
  - Solución de problemas

### 🎓 Integración con Moodle
- **[GUIA_MOODLE_INTEGRACION.md](GUIA_MOODLE_INTEGRACION.md)** - Guía completa de integración
  - Instalación de Moodle desde cero
  - Configuración para instituciones educativas
  - 3 opciones de integración con VozSegura:
    1. Enlace externo (más simple)
    2. Plugin de Moodle (integración media)
    3. SSO con JWT (integración completa)
  - Scripts de backup y mantenimiento
  - Casos de uso y mejores prácticas

### 🛠️ Soporte Técnico
- **[SOPORTE_MOODLE.md](SOPORTE_MOODLE.md)** - Guía rápida para personal de soporte
  - Diagnóstico rápido de problemas comunes
  - Comandos útiles de administración
  - Checklist de mantenimiento semanal
  - Procedimientos de emergencia
  - Plantillas de respuesta
  - Escalamiento de incidencias

### 🎯 Entrega Final
- **[GUIA_ENTREGA_FINAL.md](GUIA_ENTREGA_FINAL.md)** - Documentación del proyecto completo
  - Funcionalidades implementadas
  - Checklist de entrega
  - Script para presentación
  - Casos de prueba

---

## 🗺️ Flujo de Lectura Recomendado

### Para Desarrolladores
1. Leer **README.md** primero
2. Instalar y probar VozSegura
3. Si se requiere integración con Moodle: **GUIA_MOODLE_INTEGRACION.md**

### Para Administradores de Sistemas
1. Leer **README.md** para entender VozSegura
2. Leer **GUIA_MOODLE_INTEGRACION.md** secciones de instalación
3. Implementar según opción de integración elegida
4. Configurar backups y monitoreo

### Para Personal de Soporte
1. Leer **README.md** sección de uso
2. Estudiar **SOPORTE_MOODLE.md** completamente
3. Familiarizarse con comandos de diagnóstico
4. Tener a mano las plantillas de respuesta

### Para Usuarios Finales
1. **README.md** sección "Cómo Usar la Aplicación"
2. Para denuncias: seguir pasos en la interfaz web
3. Para consultas: usar código de seguimiento

---

## 📂 Estructura de Archivos del Proyecto

```
VozSegura/
│
├── 📄 README.md                      # Guía principal
├── 📄 GUIA_MOODLE_INTEGRACION.md    # Integración con Moodle
├── 📄 SOPORTE_MOODLE.md             # Guía de soporte técnico
├── 📄 GUIA_ENTREGA_FINAL.md         # Documentación de entrega
├── 📄 INDICE_DOCUMENTACION.md       # Este archivo
│
├── 📁 client/                        # Frontend React
│   ├── src/
│   │   ├── components/              # Componentes UI
│   │   ├── services/                # Servicios API
│   │   └── App.jsx                  # App principal
│   └── package.json
│
├── 📁 config/
│   ├── database.js                  # Configuración MySQL
│   └── script.sql                   # Script SQL completo
│
├── 📁 controllers/                   # Lógica de negocio
│   ├── authController.js
│   └── denunciaController.js
│
├── 📁 models/                        # Modelos de datos
│   ├── Usuario.js
│   ├── Denuncia.js
│   └── ...
│
├── 📁 routes/                        # Rutas API
│   ├── auth.js
│   ├── denuncias.js
│   └── catalogo.js
│
├── 📁 middleware/                    # Middleware
│   └── auth.js                      # Autenticación JWT
│
├── 📁 database/                      # Scripts de BD
│   ├── setup-database.js            # Instalación
│   └── test-connection.js           # Pruebas
│
├── 📄 .env.example                   # Variables de entorno
├── 📄 package.json                   # Dependencias Node
└── 📄 server.js                      # Servidor Express
```

---

## 🎯 Casos de Uso Principales

### Caso 1: Instalación Nueva (Sin Moodle)
```
1. Seguir README.md → Instalación y Configuración
2. Ejecutar setup de base de datos
3. Iniciar servidor backend y frontend
4. Acceder a http://localhost:5173
5. Registrar usuarios y crear denuncias de prueba
```

### Caso 2: Integración con Moodle Existente
```
1. Tener Moodle ya funcionando
2. Instalar VozSegura según README.md
3. Seguir GUIA_MOODLE_INTEGRACION.md
4. Elegir opción de integración (enlace/plugin/SSO)
5. Configurar según opción elegida
6. Probar flujo completo
```

### Caso 3: Instalación Nueva (Moodle + VozSegura)
```
1. Seguir GUIA_MOODLE_INTEGRACION.md → Instalación Moodle
2. Configurar Moodle completamente
3. Instalar VozSegura según README.md
4. Integrar usando GUIA_MOODLE_INTEGRACION.md
5. Configurar backups automáticos
6. Capacitar personal de soporte con SOPORTE_MOODLE.md
```

### Caso 4: Soporte Técnico Diario
```
1. Recibir ticket de usuario
2. Consultar SOPORTE_MOODLE.md
3. Ejecutar diagnóstico rápido
4. Aplicar solución o escalar
5. Documentar resolución
```

---

## 🔍 Búsqueda Rápida de Temas

### Instalación
- **VozSegura:** README.md → Sección "Instalación y Configuración"
- **Moodle:** GUIA_MOODLE_INTEGRACION.md → "Instalación de Moodle"
- **MySQL:** README.md → "Paso 4: Configurar la Base de Datos"

### Configuración
- **Variables de entorno:** README.md → "Paso 3: Configurar Variables de Entorno"
- **Moodle inicial:** GUIA_MOODLE_INTEGRACION.md → "Configuración Inicial de Moodle"
- **SSL/HTTPS:** GUIA_MOODLE_INTEGRACION.md → "SSL/TLS con Let's Encrypt"

### Integración
- **Enlace simple:** GUIA_MOODLE_INTEGRACION.md → "Opción 1: Integración mediante Enlace Externo"
- **Plugin Moodle:** GUIA_MOODLE_INTEGRACION.md → "Opción 2: Integración mediante Plugin"
- **SSO/JWT:** GUIA_MOODLE_INTEGRACION.md → "Opción 3: SSO (Single Sign-On)"

### Mantenimiento
- **Backups:** GUIA_MOODLE_INTEGRACION.md → "Script de Backup Automático"
- **Monitoreo:** SOPORTE_MOODLE.md → "Monitoreo Recomendado"
- **Checklist semanal:** SOPORTE_MOODLE.md → "Checklist Semanal"

### Soporte
- **Diagnóstico:** SOPORTE_MOODLE.md → "Diagnóstico Rápido"
- **Comandos útiles:** SOPORTE_MOODLE.md → "Comandos Útiles"
- **Plantillas:** SOPORTE_MOODLE.md → "Plantillas de Respuesta"

### API
- **Endpoints:** README.md → "API Endpoints"
- **Autenticación:** README.md → "Autenticación"
- **SSO endpoint:** GUIA_MOODLE_INTEGRACION.md → "Configuración en VozSegura"

---

## 📞 Contacto y Recursos

### Documentación Oficial
- **Moodle:** https://docs.moodle.org/
- **Node.js:** https://nodejs.org/docs/
- **React:** https://react.dev/
- **MySQL:** https://dev.mysql.com/doc/

### Comunidades
- **Moodle en Español:** https://moodle.org/course/view.php?id=11
- **Stack Overflow Moodle:** https://stackoverflow.com/questions/tagged/moodle
- **GitHub VozSegura:** https://github.com/juanluligo/VozSegura

### Soporte
- **Issues VozSegura:** https://github.com/juanluligo/VozSegura/issues
- **Foro Moodle:** https://moodle.org/mod/forum/

---

## ✅ Checklist de Implementación Completa

### Fase 1: Instalación Base
- [ ] Servidor con Ubuntu/CentOS configurado
- [ ] MySQL instalado y configurado
- [ ] Node.js y npm instalados
- [ ] VozSegura instalado y funcionando
- [ ] Base de datos VozSegura creada
- [ ] Credenciales de administrador creadas

### Fase 2: Instalación Moodle (si aplica)
- [ ] Apache/Nginx instalado
- [ ] PHP y extensiones instaladas
- [ ] Moodle descargado e instalado
- [ ] Base de datos Moodle configurada
- [ ] SSL/HTTPS configurado
- [ ] Configuración inicial completada

### Fase 3: Integración
- [ ] Opción de integración seleccionada
- [ ] Enlace/Plugin/SSO configurado
- [ ] Pruebas de acceso realizadas
- [ ] Flujo de usuario verificado
- [ ] Documentación de integración revisada

### Fase 4: Seguridad y Backups
- [ ] Contraseñas seguras configuradas
- [ ] Firewall configurado
- [ ] SSL certificado instalado
- [ ] Scripts de backup creados
- [ ] Backup automático programado
- [ ] Backup manual realizado y verificado

### Fase 5: Capacitación y Documentación
- [ ] Personal de soporte capacitado
- [ ] Usuarios piloto capacitados
- [ ] Documentación entregada
- [ ] Manual de usuario creado
- [ ] Procedimientos de escalamiento definidos

### Fase 6: Monitoreo y Mantenimiento
- [ ] Herramientas de monitoreo instaladas
- [ ] Alertas configuradas
- [ ] Checklist de mantenimiento en calendario
- [ ] Plan de actualización definido
- [ ] Contactos de escalamiento documentados

---

## 🎓 Glosario

- **Moodle:** Learning Management System (LMS) de código abierto
- **VozSegura:** Sistema de denuncias confidenciales
- **SSO:** Single Sign-On, autenticación única
- **JWT:** JSON Web Token, estándar de token de autenticación
- **API:** Application Programming Interface
- **LAMP:** Linux + Apache + MySQL + PHP
- **SSL/TLS:** Secure Sockets Layer / Transport Layer Security
- **LMS:** Learning Management System
- **VPS:** Virtual Private Server

---

**Última actualización:** Diciembre 2024  
**Versión de documentación:** 1.0  
**Mantenedor:** VozSegura Team

---

## 📋 Registro de Cambios

### v1.0 - Diciembre 2024
- ✅ Documentación inicial completa
- ✅ Guía de integración con Moodle
- ✅ Guía de soporte técnico
- ✅ Casos de uso y ejemplos
- ✅ Scripts de instalación y mantenimiento
