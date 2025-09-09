create database vozsegura;
use vozsegura;

-- 1. Usuarios (solo usuarios normales, registro web)
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- 2. Administradores (solo admins, creados manualmente)
CREATE TABLE administradores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- 3. Instituciones
CREATE TABLE instituciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    ciudad VARCHAR(100) NOT NULL
);

-- 4. Facultades
CREATE TABLE facultades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    institucion_id INT NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (institucion_id) REFERENCES instituciones(id)
);

-- 5. Denuncias
CREATE TABLE denuncias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha DATE NOT NULL,
    estado VARCHAR(30) DEFAULT 'recibida',
    gravedad VARCHAR(20) DEFAULT 'media',
    usuario_id INT NOT NULL,
    facultad_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (facultad_id) REFERENCES facultades(id)
);

-- 6. Recursos de ayuda
CREATE TABLE recursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    url VARCHAR(255)
);

-- 7. Relación denuncia <-> recurso (muchos a muchos)
CREATE TABLE denuncia_recurso (
    denuncia_id INT NOT NULL,
    recurso_id INT NOT NULL,
    PRIMARY KEY (denuncia_id, recurso_id),
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id),
    FOREIGN KEY (recurso_id) REFERENCES recursos(id)
);

-- 8. Archivos adjuntos a denuncias (Evidencia)
CREATE TABLE archivos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    denuncia_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    ruta VARCHAR(255) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id)
);

-- 9. Seguimiento de denuncia (historial de acciones por admins)
CREATE TABLE seguimiento_denuncia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    denuncia_id INT NOT NULL,
    admin_id INT NOT NULL,
    accion VARCHAR(100) NOT NULL,       -- ej: "Cambio de estado", "Asignación", "Comentario"
    comentario TEXT,
    estado_actual VARCHAR(30),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id),
    FOREIGN KEY (admin_id) REFERENCES administradores(id)
);

-- 10. Atenciones (registro de sesiones de atención, presencial/virtual)
CREATE TABLE atenciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    denuncia_id INT NOT NULL,
    usuario_id INT NOT NULL,
    admin_id INT NOT NULL,
    tipo_atencion VARCHAR(50),          -- ej: "psicológica", "legal", "social"
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (admin_id) REFERENCES administradores(id)
);

-- 11. Log de acciones generales del sistema
CREATE TABLE log_accion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    admin_id INT,
    accion VARCHAR(100) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (admin_id) REFERENCES administradores(id)
);

-- 12. Orientaciones (mensajes enviados a usuarios, útiles para chat de ayuda)
CREATE TABLE orientacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50),                 -- leída, pendiente, etc.
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);