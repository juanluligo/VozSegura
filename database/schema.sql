-- BASE DE DATOS VozSegura - SCRIPT COMPLETO

DROP DATABASE IF EXISTS vozsegura;
CREATE DATABASE vozsegura CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vozsegura;


-- TABLAS PRINCIPALES


-- 1. Usuarios (solo usuarios normales, registro web)
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_activo (activo)
);

-- 2. Administradores (solo admins, creados manualmente)
CREATE TABLE administradores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email)
);

-- 3. Instituciones
CREATE TABLE instituciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    INDEX idx_ciudad (ciudad)
);

-- 4. Facultades
CREATE TABLE facultades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    institucion_id INT NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (institucion_id) REFERENCES instituciones(id) ON DELETE CASCADE,
    INDEX idx_institucion (institucion_id)
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
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (facultad_id) REFERENCES facultades(id),
    INDEX idx_codigo (codigo),
    INDEX idx_estado (estado),
    INDEX idx_usuario (usuario_id),
    INDEX idx_facultad (facultad_id),
    INDEX idx_fecha (fecha)
);

-- 6. Recursos de ayuda
CREATE TABLE recursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    url VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE
);

-- 7. Relación denuncia <-> recurso (muchos a muchos)
CREATE TABLE denuncia_recurso (
    denuncia_id INT NOT NULL,
    recurso_id INT NOT NULL,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (denuncia_id, recurso_id),
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id) ON DELETE CASCADE,
    FOREIGN KEY (recurso_id) REFERENCES recursos(id) ON DELETE CASCADE
);

-- 8. Archivos adjuntos a denuncias (Evidencia)
CREATE TABLE archivos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    denuncia_id INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    ruta VARCHAR(255) NOT NULL,
    tamano_kb INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id) ON DELETE CASCADE,
    INDEX idx_denuncia (denuncia_id)
);

-- 9. Seguimiento de denuncia (historial de acciones por admins)
CREATE TABLE seguimiento_denuncia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    denuncia_id INT NOT NULL,
    admin_id INT NOT NULL,
    accion VARCHAR(100) NOT NULL,
    comentario TEXT,
    estado_anterior VARCHAR(30),
    estado_actual VARCHAR(30),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES administradores(id),
    INDEX idx_denuncia (denuncia_id),
    INDEX idx_fecha (fecha)
);

-- 10. Atenciones (registro de sesiones de atención, presencial/virtual)
CREATE TABLE atenciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    denuncia_id INT NOT NULL,
    usuario_id INT NOT NULL,
    admin_id INT NOT NULL,
    tipo_atencion VARCHAR(50),
    modalidad VARCHAR(20) DEFAULT 'virtual',
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    FOREIGN KEY (denuncia_id) REFERENCES denuncias(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (admin_id) REFERENCES administradores(id),
    INDEX idx_denuncia (denuncia_id),
    INDEX idx_tipo (tipo_atencion)
);

-- 11. Log de acciones generales del sistema
CREATE TABLE log_accion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    admin_id INT,
    accion VARCHAR(100) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    descripcion TEXT,
    ip_address VARCHAR(45),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES administradores(id) ON DELETE SET NULL,
    INDEX idx_fecha (fecha),
    INDEX idx_accion (accion)
);

-- 12. Orientaciones (mensajes enviados a usuarios, útiles para chat de ayuda)
CREATE TABLE orientacion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    mensaje TEXT NOT NULL,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'pendiente',
    leido BOOLEAN DEFAULT FALSE,
    fecha_lectura DATETIME,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado)
);

-- VISTAS ÚTILES

-- Vista: Denuncias con información completa
CREATE VIEW vista_denuncias_completas AS
SELECT 
    d.id,
    d.codigo,
    d.tipo,
    d.descripcion,
    d.fecha,
    d.estado,
    d.gravedad,
    d.fecha_creacion,
    d.fecha_actualizacion,
    u.nombre AS usuario_nombre,
    u.email AS usuario_email,
    f.nombre AS facultad_nombre,
    i.nombre AS institucion_nombre,
    i.ciudad AS institucion_ciudad,
    (SELECT COUNT(*) FROM archivos a WHERE a.denuncia_id = d.id) AS total_archivos,
    (SELECT COUNT(*) FROM seguimiento_denuncia s WHERE s.denuncia_id = d.id) AS total_seguimientos
FROM denuncias d
LEFT JOIN usuarios u ON d.usuario_id = u.id
LEFT JOIN facultades f ON d.facultad_id = f.id
LEFT JOIN instituciones i ON f.institucion_id = i.id;

-- Vista: Estadísticas por estado
CREATE VIEW vista_estadisticas_estado AS
SELECT 
    estado,
    COUNT(*) as total_denuncias,
    COUNT(CASE WHEN gravedad = 'alta' THEN 1 END) as denuncias_alta,
    COUNT(CASE WHEN gravedad = 'media' THEN 1 END) as denuncias_media,
    COUNT(CASE WHEN gravedad = 'baja' THEN 1 END) as denuncias_baja
FROM denuncias
GROUP BY estado;

-- Vista: Denuncias recientes (últimos 30 días)
CREATE VIEW vista_denuncias_recientes AS
SELECT 
    d.*,
    u.nombre AS usuario_nombre,
    f.nombre AS facultad_nombre
FROM denuncias d
LEFT JOIN usuarios u ON d.usuario_id = u.id
LEFT JOIN facultades f ON d.facultad_id = f.id
WHERE d.fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY d.fecha_creacion DESC;

-- Vista: Actividad de administradores
CREATE VIEW vista_actividad_admins AS
SELECT 
    a.id,
    a.nombre,
    a.email,
    COUNT(DISTINCT s.denuncia_id) as denuncias_atendidas,
    COUNT(DISTINCT at.id) as atenciones_realizadas,
    MAX(s.fecha) as ultima_actividad
FROM administradores a
LEFT JOIN seguimiento_denuncia s ON a.id = s.admin_id
LEFT JOIN atenciones at ON a.id = at.admin_id
WHERE a.activo = TRUE
GROUP BY a.id, a.nombre, a.email;

-- Vista: Usuarios con denuncias
CREATE VIEW vista_usuarios_denunciantes AS
SELECT 
    u.id,
    u.nombre,
    u.email,
    u.fecha_registro,
    COUNT(d.id) as total_denuncias,
    MAX(d.fecha_creacion) as ultima_denuncia,
    COUNT(CASE WHEN d.estado = 'resuelta' THEN 1 END) as denuncias_resueltas,
    COUNT(CASE WHEN d.estado IN ('recibida', 'en_proceso') THEN 1 END) as denuncias_pendientes
FROM usuarios u
LEFT JOIN denuncias d ON u.id = d.usuario_id
WHERE u.activo = TRUE
GROUP BY u.id, u.nombre, u.email, u.fecha_registro;

-- Vista: Facultades con más denuncias
CREATE VIEW vista_facultades_denuncias AS
SELECT 
    f.id,
    f.nombre AS facultad,
    i.nombre AS institucion,
    i.ciudad,
    COUNT(d.id) as total_denuncias,
    COUNT(CASE WHEN d.estado = 'recibida' THEN 1 END) as denuncias_nuevas,
    COUNT(CASE WHEN d.gravedad = 'alta' THEN 1 END) as denuncias_urgentes
FROM facultades f
JOIN instituciones i ON f.institucion_id = i.id
LEFT JOIN denuncias d ON f.id = d.facultad_id
WHERE f.activa = TRUE
GROUP BY f.id, f.nombre, i.nombre, i.ciudad
ORDER BY total_denuncias DESC;

-- PROCEDIMIENTOS ALMACENADOS


DELIMITER //

-- Procedimiento: Crear nueva denuncia con código automático
CREATE PROCEDURE sp_crear_denuncia(
    IN p_tipo VARCHAR(50),
    IN p_descripcion TEXT,
    IN p_fecha DATE,
    IN p_gravedad VARCHAR(20),
    IN p_usuario_id INT,
    IN p_facultad_id INT,
    OUT p_codigo VARCHAR(20),
    OUT p_denuncia_id INT
)
BEGIN
    DECLARE v_codigo VARCHAR(20);
    DECLARE v_contador INT;
    
    -- Generar código único
    SET v_contador = (SELECT COUNT(*) FROM denuncias) + 1;
    SET v_codigo = CONCAT('DEN-', YEAR(CURDATE()), LPAD(v_contador, 6, '0'));
    
    -- Insertar denuncia
    INSERT INTO denuncias (codigo, tipo, descripcion, fecha, gravedad, usuario_id, facultad_id, estado)
    VALUES (v_codigo, p_tipo, p_descripcion, p_fecha, p_gravedad, p_usuario_id, p_facultad_id, 'recibida');
    
    SET p_codigo = v_codigo;
    SET p_denuncia_id = LAST_INSERT_ID();
    
    -- Registrar en log
    INSERT INTO log_accion (usuario_id, accion, descripcion)
    VALUES (p_usuario_id, 'CREAR_DENUNCIA', CONCAT('Denuncia creada: ', v_codigo));
END //

-- Procedimiento: Actualizar estado de denuncia con seguimiento
CREATE PROCEDURE sp_actualizar_estado_denuncia(
    IN p_denuncia_id INT,
    IN p_admin_id INT,
    IN p_nuevo_estado VARCHAR(30),
    IN p_comentario TEXT
)
BEGIN
    DECLARE v_estado_anterior VARCHAR(30);
    
    -- Obtener estado anterior
    SELECT estado INTO v_estado_anterior FROM denuncias WHERE id = p_denuncia_id;
    
    -- Actualizar estado
    UPDATE denuncias SET estado = p_nuevo_estado WHERE id = p_denuncia_id;
    
    -- Registrar seguimiento
    INSERT INTO seguimiento_denuncia (denuncia_id, admin_id, accion, comentario, estado_anterior, estado_actual)
    VALUES (p_denuncia_id, p_admin_id, 'CAMBIO_ESTADO', p_comentario, v_estado_anterior, p_nuevo_estado);
    
    -- Registrar en log
    INSERT INTO log_accion (admin_id, accion, descripcion)
    VALUES (p_admin_id, 'ACTUALIZAR_ESTADO', CONCAT('Denuncia #', p_denuncia_id, ' cambió de ', v_estado_anterior, ' a ', p_nuevo_estado));
END //

-- Procedimiento: Registrar atención
CREATE PROCEDURE sp_registrar_atencion(
    IN p_denuncia_id INT,
    IN p_usuario_id INT,
    IN p_admin_id INT,
    IN p_tipo_atencion VARCHAR(50),
    IN p_modalidad VARCHAR(20),
    IN p_descripcion TEXT
)
BEGIN
    INSERT INTO atenciones (denuncia_id, usuario_id, admin_id, tipo_atencion, modalidad, descripcion)
    VALUES (p_denuncia_id, p_usuario_id, p_admin_id, p_tipo_atencion, p_modalidad, p_descripcion);
    
    -- Registrar seguimiento
    INSERT INTO seguimiento_denuncia (denuncia_id, admin_id, accion, comentario)
    VALUES (p_denuncia_id, p_admin_id, 'ATENCION_REGISTRADA', CONCAT('Atención ', p_tipo_atencion, ' - ', p_modalidad));
    
    INSERT INTO log_accion (admin_id, accion, descripcion)
    VALUES (p_admin_id, 'REGISTRAR_ATENCION', CONCAT('Atención registrada para denuncia #', p_denuncia_id));
END //

-- Procedimiento: Obtener denuncias por usuario
CREATE PROCEDURE sp_obtener_denuncias_usuario(IN p_usuario_id INT)
BEGIN
    SELECT 
        d.id,
        d.codigo,
        d.tipo,
        d.descripcion,
        d.fecha,
        d.estado,
        d.gravedad,
        d.fecha_creacion,
        f.nombre AS facultad,
        i.nombre AS institucion,
        (SELECT COUNT(*) FROM seguimiento_denuncia WHERE denuncia_id = d.id) as seguimientos
    FROM denuncias d
    LEFT JOIN facultades f ON d.facultad_id = f.id
    LEFT JOIN instituciones i ON f.institucion_id = i.id
    WHERE d.usuario_id = p_usuario_id
    ORDER BY d.fecha_creacion DESC;
END //

-- Procedimiento: Obtener estadísticas generales
CREATE PROCEDURE sp_estadisticas_generales()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM denuncias) as total_denuncias,
        (SELECT COUNT(*) FROM denuncias WHERE estado = 'recibida') as denuncias_nuevas,
        (SELECT COUNT(*) FROM denuncias WHERE estado = 'en_proceso') as denuncias_en_proceso,
        (SELECT COUNT(*) FROM denuncias WHERE estado = 'resuelta') as denuncias_resueltas,
        (SELECT COUNT(*) FROM denuncias WHERE gravedad = 'alta') as denuncias_urgentes,
        (SELECT COUNT(*) FROM usuarios WHERE activo = TRUE) as usuarios_activos,
        (SELECT COUNT(*) FROM administradores WHERE activo = TRUE) as administradores_activos,
        (SELECT COUNT(*) FROM denuncias WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as denuncias_ultimo_mes;
END //

-- Procedimiento: Asignar recursos a denuncia
CREATE PROCEDURE sp_asignar_recursos_denuncia(
    IN p_denuncia_id INT,
    IN p_recursos_ids TEXT -- IDs separados por coma: "1,2,3"
)
BEGIN
    DECLARE v_recurso_id INT;
    DECLARE v_pos INT;
    DECLARE v_remaining TEXT;
    
    SET v_remaining = p_recursos_ids;
    
    WHILE LENGTH(v_remaining) > 0 DO
        SET v_pos = LOCATE(',', v_remaining);
        
        IF v_pos > 0 THEN
            SET v_recurso_id = CAST(SUBSTRING(v_remaining, 1, v_pos - 1) AS UNSIGNED);
            SET v_remaining = SUBSTRING(v_remaining, v_pos + 1);
        ELSE
            SET v_recurso_id = CAST(v_remaining AS UNSIGNED);
            SET v_remaining = '';
        END IF;
        
        -- Insertar si no existe
        INSERT IGNORE INTO denuncia_recurso (denuncia_id, recurso_id)
        VALUES (p_denuncia_id, v_recurso_id);
    END WHILE;
END //

-- Procedimiento: Enviar orientación a usuario
CREATE PROCEDURE sp_enviar_orientacion(
    IN p_usuario_id INT,
    IN p_mensaje TEXT
)
BEGIN
    INSERT INTO orientacion (usuario_id, mensaje, estado)
    VALUES (p_usuario_id, p_mensaje, 'pendiente');
    
    INSERT INTO log_accion (usuario_id, accion, descripcion)
    VALUES (p_usuario_id, 'ORIENTACION_ENVIADA', LEFT(p_mensaje, 100));
END //

-- Procedimiento: Marcar orientación como leída
CREATE PROCEDURE sp_marcar_orientacion_leida(IN p_orientacion_id INT)
BEGIN
    UPDATE orientacion 
    SET estado = 'leida', leido = TRUE, fecha_lectura = NOW()
    WHERE id = p_orientacion_id;
END //

DELIMITER ;

-- ===================================================
-- TRIGGERS
-- ===================================================

DELIMITER //

-- Trigger: Registrar log cuando se crea un usuario
CREATE TRIGGER trg_usuario_creado
AFTER INSERT ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO log_accion (usuario_id, accion, descripcion)
    VALUES (NEW.id, 'REGISTRO_USUARIO', CONCAT('Usuario registrado: ', NEW.email));
END //

-- Trigger: Validar gravedad al crear denuncia
CREATE TRIGGER trg_validar_gravedad_denuncia
BEFORE INSERT ON denuncias
FOR EACH ROW
BEGIN
    IF NEW.gravedad NOT IN ('baja', 'media', 'alta') THEN
        SET NEW.gravedad = 'media';
    END IF;
END //

DELIMITER ;


-- DATOS INICIALES


-- Instituciones
INSERT INTO instituciones (nombre, ciudad) VALUES
('Universidad Nacional de Colombia', 'Bogotá'),
('Universidad de Antioquia', 'Medellín'),
('Universidad del Valle', 'Cali'),
('Universidad Industrial de Santander', 'Bucaramanga'),
('Universidad Tecnológica de Pereira', 'Pereira');

-- Facultades
INSERT INTO facultades (nombre, institucion_id) VALUES
('Facultad de Ingeniería', 1),
('Facultad de Ciencias Humanas', 1),
('Facultad de Medicina', 1),
('Facultad de Derecho', 1),
('Facultad de Ingeniería', 2),
('Facultad de Educación', 2),
('Facultad de Salud', 3),
('Facultad de Ingenierías', 4),
('Facultad de Ciencias', 5);

-- Recursos de ayuda
INSERT INTO recursos (titulo, descripcion, url) VALUES
('Línea Nacional de Atención - 155', 'Línea gratuita 24/7 para denunciar violencia', 'tel:155'),
('Instituto Colombiano de Bienestar Familiar', 'Protección de derechos de niños y adolescentes', 'https://www.icbf.gov.co'),
('Fiscalía General de la Nación', 'Denuncia de delitos', 'https://www.fiscalia.gov.co'),
('Policía Nacional - CAI Virtual', 'Denuncia en línea', 'https://caivirtual.policia.gov.co'),
('Profamilia - Orientación', 'Atención psicológica y legal', 'https://profamilia.org.co'),
('Ministerio de Educación - Sistema de Alertas', 'Reportar situaciones en instituciones educativas', 'https://www.mineducacion.gov.co');

-- Administrador por defecto (password: Admin123!)
-- Hash bcrypt de "Admin123!": $2a$10$XqKXz5RZ5yzYEKqZxMxQHO7hJmX7v8aJqq5kN8UUJ3CW5Jz2Bb8Vu
INSERT INTO administradores (nombre, email, password) VALUES
('Administrador Principal', 'admin@vozsegura.com', '$2a$10$XqKXz5RZ5yzYEKqZxMxQHO7hJmX7v8aJqq5kN8UUJ3CW5Jz2Bb8Vu');


SELECT 'Base de datos VozSegura creada exitosamente!' as mensaje;
SELECT COUNT(*) as total_instituciones FROM instituciones;
SELECT COUNT(*) as total_facultades FROM facultades;
SELECT COUNT(*) as total_recursos FROM recursos;
SELECT COUNT(*) as total_administradores FROM administradores;
