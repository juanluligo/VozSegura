# 🎨 Diagramas de Integración - VozSegura + Moodle

## 📊 Arquitectura del Sistema

### Opción 1: Enlace Externo (Más Simple)

```
┌─────────────────────────────────────────────────────────────────┐
│                        INSTITUCIÓN EDUCATIVA                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐              ┌──────────────────────────┐
│                         │              │                          │
│    MOODLE (LMS)        │              │    VOZSEGURA             │
│                         │              │    (Denuncias)           │
│  - Cursos              │◄────Link─────┤                          │
│  - Usuarios            │    externo   │  - Formulario denuncias  │
│  - Contenidos          │              │  - Seguimiento casos     │
│  - Evaluaciones        │              │  - Dashboard admin       │
│                         │              │                          │
│  [Enlace VozSegura]    │              │  Sistema independiente   │
│                         │              │                          │
└────────────┬────────────┘              └───────────┬──────────────┘
             │                                       │
             │                                       │
        ┌────▼───────┐                         ┌────▼───────┐
        │  MySQL DB  │                         │  MySQL DB  │
        │  (Moodle)  │                         │(VozSegura) │
        └────────────┘                         └────────────┘

Ventajas:
✅ Instalación rápida (5 minutos)
✅ Sin cambios en código
✅ Sistemas totalmente independientes

Desventajas:
❌ Usuario debe iniciar sesión dos veces
❌ No hay sincronización automática
```

---

### Opción 2: Plugin de Moodle (Integración Media)

```
┌─────────────────────────────────────────────────────────────────┐
│                        INSTITUCIÓN EDUCATIVA                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         MOODLE (LMS)                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    Menú Principal                         │   │
│  │  - Mis cursos                                            │   │
│  │  - Calificaciones                                        │   │
│  │  - Recursos                                              │   │
│  │  - [Plugin: VozSegura] ◄─── Nueva opción integrada      │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              │ Click                              │
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │        iframe embebido de VozSegura                      │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │                                                     │  │   │
│  │  │        🛡️ VOZSEGURA                                │  │   │
│  │  │                                                     │  │   │
│  │  │  [Crear Denuncia]  [Consultar]  [Mis Denuncias]  │  │   │
│  │  │                                                     │  │   │
│  │  │  Contenido cargado desde:                          │  │   │
│  │  │  https://vozsegura.institucion.edu                 │  │   │
│  │  │                                                     │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │
                              ▼
              ┌──────────────────────────────┐
              │      VozSegura Backend       │
              │                              │
              │  - API REST                  │
              │  - Lógica de negocio        │
              │  - Autenticación            │
              └──────────────┬───────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │   MySQL DB     │
                    │  (VozSegura)   │
                    └────────────────┘

Ventajas:
✅ Integración visual dentro de Moodle
✅ Usuario permanece en interfaz Moodle
✅ Instalación moderada (30-60 minutos)

Desventajas:
❌ Requiere desarrollo de plugin
❌ Usuario debe iniciar sesión dos veces
❌ Necesita mantenimiento del plugin
```

---

### Opción 3: SSO con JWT (Integración Completa)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        INSTITUCIÓN EDUCATIVA                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                              USUARIO                                  │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                          1. Login (una sola vez)
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                         MOODLE (LMS)                                  │
│                                                                       │
│  Usuario autenticado: maria@universidad.edu                          │
│                                                                       │
│  [Click en VozSegura]                                                │
└─────────────────────────┬─────────────────────────────────────────────┘
                          │
            2. Generar token Moodle (automático)
                          │
                          ▼
┌──────────────────────────────────────────────────────────────────────┐
│              CAPA DE AUTENTICACIÓN SSO (JWT)                         │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Flujo de autenticación:                                       │ │
│  │                                                                 │ │
│  │  1. Moodle envía: {                                           │ │
│  │       moodle_token: "abc123...",                              │ │
│  │       usuario: "maria@universidad.edu"                        │ │
│  │    }                                                           │ │
│  │                                                                 │ │
│  │  2. VozSegura verifica token con Moodle Web Services         │ │
│  │                                                                 │ │
│  │  3. VozSegura genera JWT propio                               │ │
│  │                                                                 │ │
│  │  4. Usuario accede automáticamente a VozSegura                │ │
│  └────────────────────────────────────────────────────────────────┘ │
└────────────────────────┬──────────────────────────────────────────────┘
                         │
            3. Token JWT de VozSegura
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        VOZSEGURA                                      │
│                                                                       │
│  ✅ Usuario ya autenticado (sin login)                               │
│  ✅ Datos sincronizados desde Moodle:                                │
│      - Nombre: María García                                          │
│      - Email: maria@universidad.edu                                  │
│      - Rol: Estudiante                                               │
│      - Facultad: Ingeniería                                          │
│                                                                       │
│  [Usuario puede crear denuncias inmediatamente]                      │
└─────────────────────────┬─────────────────────────────────────────────┘
                          │
                          ▼
              ┌────────────────────────┐
              │      MySQL DB          │
              │    (VozSegura)         │
              │                        │
              │  - Usuarios (sync)     │
              │  - Denuncias           │
              │  - Seguimientos        │
              └────────────────────────┘

Ventajas:
✅ Una sola autenticación (seamless)
✅ Datos sincronizados automáticamente
✅ Mejor experiencia de usuario
✅ Seguridad con JWT

Desventajas:
❌ Configuración más compleja (2-3 horas)
❌ Requiere habilitar Web Services en Moodle
❌ Necesita desarrollo personalizado
```

---

## 🔄 Flujo de Creación de Denuncia

### Con SSO Habilitado

```
┌──────────┐
│ USUARIO  │
└─────┬────┘
      │
      │ 1. Ya está en Moodle (autenticado)
      │
      ▼
┌─────────────────────────┐
│  Click en "VozSegura"   │
│  desde menú Moodle      │
└───────────┬─────────────┘
            │
            │ 2. Redirección automática con token
            │
            ▼
┌─────────────────────────────────────────┐
│  VozSegura valida token y autentica    │
│  automáticamente                        │
└───────────┬─────────────────────────────┘
            │
            │ 3. Acceso directo (sin login)
            │
            ▼
┌─────────────────────────────────────────┐
│  Usuario ve formulario de denuncia     │
│                                         │
│  Datos pre-llenados:                   │
│  ✓ Nombre                              │
│  ✓ Email                               │
│  ✓ Facultad                            │
└───────────┬─────────────────────────────┘
            │
            │ 4. Llenar detalles de denuncia
            │
            ▼
┌─────────────────────────────────────────┐
│  - Tipo de violencia                   │
│  - Descripción                          │
│  - Fecha del incidente                 │
│  - Gravedad                            │
│  - Adjuntar evidencias (opcional)      │
└───────────┬─────────────────────────────┘
            │
            │ 5. Enviar denuncia
            │
            ▼
┌─────────────────────────────────────────┐
│  Sistema genera código único:          │
│                                         │
│     🔑 VZ-2024-A7B3C9                  │
│                                         │
│  ✅ Denuncia registrada                │
│  ✅ Estado: Recibida                   │
└───────────┬─────────────────────────────┘
            │
            │ 6. Usuario guarda código
            │
            ▼
┌─────────────────────────────────────────┐
│  Puede consultar desde:                │
│  • Moodle → VozSegura → Consultar     │
│  • Directamente en VozSegura          │
│  • Sin necesidad de login (con código)│
└─────────────────────────────────────────┘
```

---

## 📱 Flujo de Usuario Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                      EXPERIENCIA DEL USUARIO                         │
└─────────────────────────────────────────────────────────────────────┘

DÍA 1: Creación de Denuncia
─────────────────────────────
📅 Lunes 9:00 AM
  Usuario: María (Estudiante de Ingeniería)
  
  1. Inicia sesión en Moodle
  2. Ve banner "¿Necesitas reportar un incidente?"
  3. Click → Redirige a VozSegura (SSO automático)
  4. Completa formulario de denuncia
  5. Recibe código: VZ-2024-A7B3C9
  6. Guarda captura de pantalla del código

DÍA 2: Primera Consulta
────────────────────────
📅 Martes 10:30 AM
  
  1. María entra a Moodle
  2. Navega a VozSegura → "Consultar"
  3. Ingresa código: VZ-2024-A7B3C9
  4. Ve estado: "En Revisión"
  5. Lee comentario del admin: "Caso asignado a coordinador"

DÍA 5: Seguimiento
───────────────────
📅 Viernes 2:00 PM
  
  1. María recibe notificación en Moodle
  2. "Tu caso VZ-2024-A7B3C9 tiene actualizaciones"
  3. Accede a VozSegura
  4. Ve nuevo estado: "En Proceso"
  5. Se le han asignado recursos:
     • Psicóloga: Dra. Ana López
     • Fecha de cita: Lunes 8:00 AM
     • Ubicación: Oficina de Bienestar

DÍA 10: Resolución
───────────────────
📅 Siguiente miércoles 4:00 PM
  
  1. María consulta nuevamente
  2. Estado: "Resuelta"
  3. Resumen de acciones tomadas
  4. Opción de cerrar el caso
  5. Encuesta de satisfacción

─────────────────────────────────────────────────────────────────────

EXPERIENCIA DEL ADMINISTRADOR
───────────────────────────────

📅 Lunes 10:00 AM - Llega nueva denuncia
  
  Dashboard muestra:
  🔔 Nueva denuncia: VZ-2024-A7B3C9
  📊 Total denuncias del mes: 12
  ⚠️  Casos urgentes: 2
  
  Acciones del admin:
  1. Abre la denuncia
  2. Lee descripción completa
  3. Cambia estado a "En Revisión"
  4. Asigna caso a coordinador
  5. Agrega comentario para usuario
  6. Programa notificación

📅 Jueves 9:00 AM - Actualización del caso
  
  1. Coordinador reporta avances
  2. Admin actualiza estado a "En Proceso"
  3. Asigna recursos de ayuda:
     • Atención psicológica
     • Asesoría legal
  4. Programa seguimiento semanal
  5. Envía notificación a usuario

📅 Siguiente miércoles - Cierre del caso
  
  1. Admin verifica todas las acciones
  2. Confirma que usuario está satisfecho
  3. Cambia estado a "Resuelta"
  4. Genera reporte del caso
  5. Archiva caso
  6. Actualiza estadísticas
```

---

## 🔒 Diagrama de Seguridad

```
┌────────────────────────────────────────────────────────────────────┐
│                      CAPAS DE SEGURIDAD                             │
└────────────────────────────────────────────────────────────────────┘

CAPA 1: Red y Servidor
────────────────────────
┌──────────────────────────────────────────┐
│  🔒 Firewall (UFW/iptables)             │
│     • Solo puertos 80, 443, 22 abiertos │
│     • Bloqueo de IPs sospechosas        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│  🔐 SSL/TLS (Let's Encrypt)             │
│     • Certificado válido                 │
│     • HTTPS obligatorio                  │
│     • TLS 1.2+ únicamente               │
└──────────────────────────────────────────┘

CAPA 2: Aplicación
──────────────────
┌──────────────────────────────────────────┐
│  🛡️ Moodle                               │
│     • Política de contraseñas fuerte    │
│     • Sesiones con timeout              │
│     • Protección CSRF                   │
│     • Logs de auditoría                 │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│  🔑 Autenticación JWT                   │
│     • Token con expiración (7 días)     │
│     • Secret key segura                 │
│     • Verificación en cada request      │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│  🛡️ VozSegura                            │
│     • Bcrypt para passwords (10 rounds) │
│     • Validación de inputs              │
│     • Prepared statements (SQL)         │
│     • CORS configurado                  │
│     • Headers de seguridad (Helmet)     │
└──────────────────────────────────────────┘

CAPA 3: Datos
─────────────
┌──────────────────────────────────────────┐
│  🗄️ Base de Datos MySQL                 │
│     • Usuario con mínimos privilegios   │
│     • Conexión local únicamente         │
│     • Backups encriptados               │
│     • Logs de auditoría                 │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│  💾 Backups                              │
│     • Diarios automáticos               │
│     • Encriptados                       │
│     • Almacenamiento externo            │
│     • Retención 30 días                 │
└──────────────────────────────────────────┘

MONITOREO
─────────
┌──────────────────────────────────────────┐
│  👁️ Logs y Alertas                       │
│     • Intentos de login fallidos        │
│     • Accesos sospechosos               │
│     • Cambios en configuración          │
│     • Errores de aplicación             │
└──────────────────────────────────────────┘
```

---

## 📊 Comparación de Opciones de Integración

```
╔════════════════════╦═══════════════╦═══════════════╦═══════════════╗
║                    ║ OPCIÓN 1      ║ OPCIÓN 2      ║ OPCIÓN 3      ║
║                    ║ Enlace Simple ║ Plugin Moodle ║ SSO con JWT   ║
╠════════════════════╬═══════════════╬═══════════════╬═══════════════╣
║ Tiempo instalación ║ 5 min         ║ 30-60 min     ║ 2-3 horas     ║
╠════════════════════╬═══════════════╬═══════════════╬═══════════════╣
║ Dificultad         ║ Muy fácil     ║ Media         ║ Alta          ║
╠════════════════════╬═══════════════╬═══════════════╬═══════════════╣
║ Login único (SSO)  ║ ❌ No         ║ ❌ No         ║ ✅ Sí         ║
╠════════════════════╬═══════════════╬═══════════════╬═══════════════╣
║ Sincronización     ║ ❌ No         ║ ❌ No         ║ ✅ Sí         ║
║ de usuarios        ║               ║               ║               ║
╠════════════════════╬═══════════════╬═══════════════╬═══════════════╣
║ Integración visual ║ ❌ Externa    ║ ✅ iframe     ║ ✅ Seamless   ║
╠════════════════════╬═══════════════╬═══════════════╬═══════════════╣
║ Mantenimiento      ║ Bajo          ║ Medio         ║ Alto          ║
╠════════════════════╬═══════════════╬═══════════════╬═══════════════╣
║ Experiencia        ║ 6/10          ║ 7.5/10        ║ 9.5/10        ║
║ de usuario         ║               ║               ║               ║
╠════════════════════╬═══════════════╬═══════════════╬═══════════════╣
║ Código requerido   ║ Mínimo        ║ Medio         ║ Alto          ║
╠════════════════════╬═══════════════╬═══════════════╬═══════════════╣
║ Recomendado para   ║ Pruebas       ║ Producción    ║ Producción    ║
║                    ║ Inicio rápido ║ estándar      ║ empresarial   ║
╚════════════════════╩═══════════════╩═══════════════╩═══════════════╝

RECOMENDACIÓN:
───────────────
🟢 Empezar con: Opción 1 (Enlace Simple)
   → Probar y validar el sistema

🟡 Mejorar con: Opción 2 (Plugin)
   → Cuando haya usuarios activos

🔵 Optimizar con: Opción 3 (SSO)
   → Para mejor experiencia de usuario
```

---

**Guía visual completa para integración Moodle + VozSegura**  
**Última actualización:** Diciembre 2024
