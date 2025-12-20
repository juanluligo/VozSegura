# 🎓 Guía de Configuración de Moodle e Integración con VozSegura

## 📋 Índice

1. [Introducción](#introducción)
2. [Configuración de Moodle para Instituciones Educativas](#configuración-de-moodle)
3. [Integración de VozSegura con Moodle](#integración-vozsegura-moodle)
4. [Soporte y Mantenimiento](#soporte-y-mantenimiento)
5. [Casos de Uso](#casos-de-uso)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 📖 Introducción

Esta guía te ayudará a:
- **Configurar Moodle** desde cero para tu institución educativa
- **Integrar VozSegura** con tu plataforma Moodle existente
- **Proporcionar soporte** técnico continuo a ambos sistemas
- **Optimizar** el uso conjunto de ambas plataformas

### ¿Por qué integrar VozSegura con Moodle?

**VozSegura** complementa a Moodle proporcionando:
- ✅ Canal seguro para denuncias de acoso o violencia
- ✅ Sistema de seguimiento de casos confidencial
- ✅ Herramientas administrativas para gestión de incidentes
- ✅ Recursos de ayuda integrados para estudiantes

---

## 🔧 Configuración de Moodle

### Requisitos del Sistema

#### Hardware Mínimo (100-500 usuarios)
- **CPU:** 2 cores (2.0 GHz+)
- **RAM:** 4 GB
- **Disco:** 20 GB SSD
- **Ancho de banda:** 10 Mbps

#### Hardware Recomendado (500+ usuarios)
- **CPU:** 4+ cores (2.5 GHz+)
- **RAM:** 8-16 GB
- **Disco:** 50+ GB SSD
- **Ancho de banda:** 100+ Mbps

#### Software Requerido
- **Sistema Operativo:** Ubuntu 20.04/22.04 LTS o CentOS 8+
- **Servidor Web:** Apache 2.4+ o Nginx 1.18+
- **PHP:** 7.4, 8.0 o 8.1
- **Base de Datos:** MySQL 5.7+/MariaDB 10.3+ o PostgreSQL 10+
- **Otros:** Git, SSL/TLS (Let's Encrypt)

---

### Instalación de Moodle (Ubuntu 22.04)

#### Paso 1: Actualizar el Sistema

```bash
sudo apt update && sudo apt upgrade -y
```

#### Paso 2: Instalar LAMP Stack

```bash
# Instalar Apache
sudo apt install apache2 -y

# Instalar MySQL
sudo apt install mysql-server -y

# Instalar PHP y extensiones necesarias
sudo apt install php8.1 php8.1-{cli,common,mysql,zip,gd,mbstring,curl,xml,bcmath,intl,soap,xmlrpc} -y

# Instalar librerías adicionales
sudo apt install graphviz aspell ghostscript clamav git -y
```

#### Paso 3: Configurar MySQL

```bash
# Asegurar instalación MySQL
sudo mysql_secure_installation

# Crear base de datos y usuario para Moodle
sudo mysql -u root -p
```

```sql
CREATE DATABASE moodle DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'moodleuser'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON moodle.* TO 'moodleuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Paso 4: Configurar PHP

```bash
# Editar configuración PHP
sudo nano /etc/php/8.1/apache2/php.ini
```

Ajustar estos valores:
```ini
memory_limit = 256M
post_max_size = 64M
upload_max_filesize = 64M
max_execution_time = 300
max_input_vars = 5000
```

```bash
# Reiniciar Apache
sudo systemctl restart apache2
```

#### Paso 5: Descargar e Instalar Moodle

```bash
# Ir al directorio web
cd /var/www/html

# Descargar Moodle (versión estable más reciente)
sudo git clone -b MOODLE_402_STABLE git://git.moodle.org/moodle.git

# Crear directorio de datos
sudo mkdir /var/moodledata
sudo chown -R www-data:www-data /var/moodledata
sudo chmod -R 0777 /var/moodledata

# Establecer permisos
sudo chown -R www-data:www-data /var/www/html/moodle
sudo chmod -R 0755 /var/www/html/moodle
```

#### Paso 6: Configurar VirtualHost Apache

```bash
sudo nano /etc/apache2/sites-available/moodle.conf
```

Agregar:
```apache
<VirtualHost *:80>
    ServerAdmin admin@tuinstitucion.edu
    ServerName moodle.tuinstitucion.edu
    DocumentRoot /var/www/html/moodle

    <Directory /var/www/html/moodle>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/moodle_error.log
    CustomLog ${APACHE_LOG_DIR}/moodle_access.log combined
</VirtualHost>
```

```bash
# Habilitar sitio y módulos
sudo a2ensite moodle.conf
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### Paso 7: Completar Instalación Web

1. Navega a: `http://moodle.tuinstitucion.edu`
2. Selecciona idioma: **Español**
3. Confirma rutas:
   - Directorio web: `/var/www/html/moodle`
   - Directorio de datos: `/var/moodledata`
4. Selecciona base de datos: **MySQL/MariaDB**
5. Ingresa credenciales de BD:
   - Host: `localhost`
   - Base de datos: `moodle`
   - Usuario: `moodleuser`
   - Password: `tu_contraseña_segura`
6. Acepta términos y condiciones
7. Instala componentes (puede tardar 10-15 minutos)
8. Crea cuenta de administrador

---

### Configuración Inicial de Moodle

#### 1. Configuración General

**Administración del sitio → Configuración → Ajustes generales**

```
Nombre completo: Universidad/Institución [Nombre]
Nombre corto: [Siglas]
Descripción: Plataforma educativa virtual de [Institución]
Idioma predeterminado: Español - Internacional (es)
País predeterminado: [Tu país]
Zona horaria: [Tu zona horaria]
```

#### 2. Configuración de Correo

**Administración del sitio → Servidor → Correo electrónico**

```bash
# Para usar Gmail (ejemplo):
Host SMTP: smtp.gmail.com
Puerto: 587
Seguridad: TLS
Autenticación: SÍ
Usuario SMTP: tucorreo@institucion.edu
Contraseña SMTP: tu_contraseña_aplicacion
```

#### 3. Configuración de Seguridad

**Administración del sitio → Seguridad → Políticas del sitio**

- ✅ Forzar inicio de sesión: SÍ (recomendado)
- ✅ Política de contraseñas: Longitud mínima 8 caracteres
- ✅ Activar HTTPS para sesiones: SÍ
- ✅ Protección de sesión: Alta

**SSL/TLS con Let's Encrypt:**

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-apache -y

# Obtener certificado
sudo certbot --apache -d moodle.tuinstitucion.edu

# Renovación automática (ya configurado)
sudo certbot renew --dry-run
```

#### 4. Configuración de Apariencia

**Administración del sitio → Apariencia → Temas**

1. Selecciona un tema (Boost recomendado)
2. Personaliza colores institucionales
3. Sube logo de la institución
4. Configura página principal

#### 5. Crear Estructura de Cursos

**Administración del sitio → Cursos → Gestionar cursos y categorías**

Ejemplo de estructura:
```
📁 Facultad de Ingeniería
  📁 Ingeniería de Sistemas
    📘 Programación I
    📘 Base de Datos
  📁 Ingeniería Civil
    📘 Cálculo Diferencial

📁 Facultad de Medicina
  📁 Medicina General
    📘 Anatomía
    📘 Fisiología
```

---

## 🔗 Integración de VozSegura con Moodle

### Opción 1: Integración mediante Enlace Externo

#### Paso 1: Instalar VozSegura

Sigue la guía de instalación en el [README.md](README.md) principal.

```bash
# En el mismo servidor o servidor separado
cd /var/www
git clone https://github.com/juanluligo/VozSegura.git
cd VozSegura

# Instalar dependencias
npm install
cd client && npm install && cd ..

# Configurar .env
cp .env.example .env
nano .env
```

#### Paso 2: Agregar VozSegura al Menú de Moodle

**Como Administrador en Moodle:**

1. **Administración del sitio → Apariencia → Navegación → Enlaces personalizados**

2. Agregar nuevo enlace:
   ```
   Texto: VozSegura - Canal de Denuncias
   URL: https://vozsegura.tuinstitucion.edu
   Descripción: Sistema confidencial de denuncias
   Icono: fa-shield-alt
   Abrir en: Nueva ventana
   ```

3. **Alternativa - Bloque HTML:**

   ```html
   <div style="background: #6366f1; padding: 20px; border-radius: 10px; text-align: center; color: white;">
     <i class="fa fa-shield-alt" style="font-size: 3em;"></i>
     <h3>¿Necesitas reportar un incidente?</h3>
     <p>Usa nuestro sistema confidencial de denuncias</p>
     <a href="https://vozsegura.tuinstitucion.edu" 
        target="_blank" 
        style="background: white; color: #6366f1; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
       Acceder a VozSegura
     </a>
   </div>
   ```

---

### Opción 2: Integración mediante Plugin Moodle

#### Crear Plugin de Actividad Externa

```bash
# En servidor Moodle
cd /var/www/html/moodle/mod
sudo mkdir vozsegura
cd vozsegura
```

Crear archivo `version.php`:

```php
<?php
defined('MOODLE_INTERNAL') || die();

$plugin->component = 'mod_vozsegura';
$plugin->version = 2024011700;
$plugin->requires = 2022041900;
$plugin->maturity = MATURITY_STABLE;
$plugin->release = '1.0';
```

Crear archivo `lib.php`:

```php
<?php
defined('MOODLE_INTERNAL') || die();

function vozsegura_add_instance($data) {
    global $DB;
    $data->timecreated = time();
    return $DB->insert_record('vozsegura', $data);
}

function vozsegura_supports($feature) {
    switch($feature) {
        case FEATURE_MOD_INTRO:
            return true;
        default:
            return null;
    }
}
```

Crear archivo `view.php`:

```php
<?php
require_once('../../config.php');

$id = required_param('id', PARAM_INT);
$cm = get_coursemodule_from_id('vozsegura', $id, 0, false, MUST_EXIST);
$course = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);

require_login($course, true, $cm);

$PAGE->set_url('/mod/vozsegura/view.php', array('id' => $cm->id));
$PAGE->set_title('VozSegura');
$PAGE->set_heading($course->fullname);

echo $OUTPUT->header();
?>

<iframe 
    src="https://vozsegura.tuinstitucion.edu" 
    width="100%" 
    height="800px" 
    frameborder="0"
    style="border: none; border-radius: 10px;">
</iframe>

<?php
echo $OUTPUT->footer();
```

```bash
# Actualizar base de datos Moodle
sudo -u www-data php /var/www/html/moodle/admin/cli/upgrade.php
```

---

### Opción 3: SSO (Single Sign-On) con JWT

#### Configuración en VozSegura

Editar `/home/runner/work/VozSegura/VozSegura/server.js`:

```javascript
// Agregar endpoint de autenticación SSO
app.post('/api/auth/sso/moodle', async (req, res) => {
  try {
    const { moodle_token } = req.body;
    
    // Verificar token de Moodle
    const moodleUser = await verificarTokenMoodle(moodle_token);
    
    // Buscar o crear usuario en VozSegura
    let usuario = await Usuario.findByEmail(moodleUser.email);
    
    if (!usuario) {
      usuario = await Usuario.crear({
        nombre: moodleUser.nombre,
        email: moodleUser.email,
        rol: 'usuario',
        activo: true
      });
    }
    
    // Generar token JWT de VozSegura
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({ token, usuario });
  } catch (error) {
    res.status(401).json({ error: 'Autenticación fallida' });
  }
});

async function verificarTokenMoodle(token) {
  // Llamar a Moodle Web Services API
  const response = await axios.post(
    'https://moodle.tuinstitucion.edu/webservice/rest/server.php',
    {
      wstoken: token,
      wsfunction: 'core_webservice_get_site_info',
      moodlewsrestformat: 'json'
    }
  );
  
  return {
    nombre: response.data.fullname,
    email: response.data.useremail,
    moodle_id: response.data.userid
  };
}
```

#### Configuración en Moodle

**Habilitar Web Services:**

1. **Administración → Plugins → Servicios web → Visión general**
2. Seguir todos los pasos para habilitar web services
3. **Administración → Plugins → Servicios web → Servicios externos**
4. Crear nuevo servicio: `VozSegura SSO`
5. Agregar funciones:
   - `core_webservice_get_site_info`
   - `core_user_get_users`

**Crear Token:**

```bash
# Como administrador Moodle
Administración → Plugins → Servicios web → Administrar tokens
→ Crear token para servicio VozSegura SSO
```

---

## 🛠️ Soporte y Mantenimiento

### Mantenimiento de Moodle

#### Tareas Diarias
- ✅ Verificar disponibilidad del sitio
- ✅ Revisar logs de errores (`/var/log/apache2/moodle_error.log`)
- ✅ Monitorear uso de recursos (CPU, RAM, disco)

#### Tareas Semanales
- ✅ Realizar backup de base de datos
- ✅ Backup de archivos `/var/moodledata`
- ✅ Revisar y responder tickets de soporte
- ✅ Actualizar contenidos

#### Tareas Mensuales
- ✅ Actualizar Moodle a última versión de seguridad
- ✅ Revisar plugins desactualizados
- ✅ Limpiar archivos temporales
- ✅ Optimizar base de datos
- ✅ Revisar estadísticas de uso

#### Script de Backup Automático

```bash
#!/bin/bash
# /usr/local/bin/backup-moodle.sh

FECHA=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/moodle"
DB_NAME="moodle"
DB_USER="moodleuser"
DB_PASS="tu_contraseña"

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup de base de datos
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/moodle_db_$FECHA.sql.gz

# Backup de archivos
tar -czf $BACKUP_DIR/moodledata_$FECHA.tar.gz /var/moodledata

# Eliminar backups antiguos (más de 30 días)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completado: $FECHA"
```

```bash
# Hacer ejecutable
sudo chmod +x /usr/local/bin/backup-moodle.sh

# Agregar a crontab (ejecutar diariamente a las 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-moodle.sh >> /var/log/moodle-backup.log 2>&1
```

### Mantenimiento de VozSegura

Ver [README.md](README.md) para guía completa de mantenimiento.

#### Script de Backup VozSegura

```bash
#!/bin/bash
# /usr/local/bin/backup-vozsegura.sh

FECHA=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/vozsegura"
DB_NAME="vozsegura"
DB_USER="root"
DB_PASS="tu_contraseña"

mkdir -p $BACKUP_DIR

# Backup de base de datos
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/vozsegura_db_$FECHA.sql.gz

# Backup de archivos subidos
if [ -d "/var/www/VozSegura/uploads" ]; then
    tar -czf $BACKUP_DIR/vozsegura_uploads_$FECHA.tar.gz /var/www/VozSegura/uploads
fi

# Eliminar backups antiguos
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup VozSegura completado: $FECHA"
```

### Monitoreo del Sistema

#### Instalar Herramientas de Monitoreo

```bash
# Instalar htop para monitoreo de recursos
sudo apt install htop -y

# Instalar netdata para monitoreo web
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
```

Acceder a: `http://tu-servidor:19999`

---

## 🎯 Casos de Uso

### Caso 1: Estudiante Reporta Acoso

**Flujo en Moodle:**
1. Estudiante accede a curso
2. Ve banner/enlace de VozSegura
3. Click en "Reportar Incidente"

**Flujo en VozSegura:**
1. Redirige a VozSegura (SSO automático)
2. Completa formulario de denuncia
3. Recibe código de seguimiento
4. Puede consultar estado desde Moodle

### Caso 2: Docente Identifica Situación

**Flujo:**
1. Docente reporta desde panel Moodle
2. VozSegura captura información
3. Administrador recibe notificación
4. Se inicia protocolo de atención

### Caso 3: Administrador Gestiona Casos

**Flujo:**
1. Administrador accede a Dashboard VozSegura
2. Ve casos abiertos
3. Asigna recursos de ayuda
4. Actualiza estado
5. Estudiante recibe notificación en Moodle

---

## ❓ Preguntas Frecuentes

### Sobre Moodle

**P: ¿Cuánto espacio en disco necesito?**
R: Mínimo 20 GB. Para 1000+ usuarios con multimedia: 100+ GB.

**P: ¿Puedo usar hosting compartido?**
R: No recomendado. Usa VPS o servidor dedicado.

**P: ¿Cómo actualizo Moodle?**
```bash
cd /var/www/html/moodle
sudo -u www-data git fetch
sudo -u www-data git pull origin MOODLE_402_STABLE
sudo -u www-data php admin/cli/upgrade.php
```

**P: ¿Cómo cambio el logo?**
R: Administración → Apariencia → Logos → Subir archivo

### Sobre Integración VozSegura-Moodle

**P: ¿Es necesario el SSO?**
R: No, pero mejora la experiencia del usuario.

**P: ¿Puedo usar diferentes servidores?**
R: Sí, VozSegura puede estar en servidor separado.

**P: ¿Los datos se sincronizan automáticamente?**
R: Con SSO sí. Sin SSO, son sistemas independientes.

**P: ¿Afecta el rendimiento de Moodle?**
R: No, VozSegura es sistema independiente.

### Soporte Técnico

**P: ¿Dónde obtengo ayuda?**
R: 
- Moodle: https://moodle.org/support/
- VozSegura: https://github.com/juanluligo/VozSegura/issues

**P: ¿Hay versión móvil?**
R: 
- Moodle: Sí, app oficial en tiendas
- VozSegura: Responsive web, accesible desde móviles

---

## 📞 Contacto y Recursos Adicionales

### Documentación Oficial

- **Moodle Docs:** https://docs.moodle.org/
- **Moodle Forum:** https://moodle.org/mod/forum/
- **VozSegura GitHub:** https://github.com/juanluligo/VozSegura

### Comunidad

- **Moodle en Español:** https://moodle.org/course/view.php?id=11
- **Telegram Moodle ES:** https://t.me/moodlespanish

### Capacitación

- **Moodle Academy:** https://moodle.academy/
- **Tutoriales YouTube:** Buscar "Moodle tutorial español"

---

## 🎉 Conclusión

Con esta guía has aprendido a:

✅ Instalar y configurar Moodle desde cero  
✅ Configurar seguridad y SSL  
✅ Integrar VozSegura con Moodle  
✅ Mantener ambos sistemas  
✅ Proporcionar soporte técnico  

**¡Tu institución educativa ahora tiene una plataforma completa de aprendizaje y seguridad estudiantil!**

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0  
**Autor:** Juan Luis - VozSegura Team
