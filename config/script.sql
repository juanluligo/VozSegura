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

use vozsegura;
-- Instituciones
INSERT INTO instituciones (nombre, ciudad) VALUES 
('Universidad Central', 'Bogotá'), 
('Universidad del Norte', 'Barranquilla');

-- Facultades
INSERT INTO facultades (nombre, institucion_id, activa) VALUES
('Ingeniería', 1, TRUE), 
('Derecho', 1, TRUE), 
('Psicología', 2, TRUE);

-- Usuarios (solo normales)
INSERT INTO usuarios (nombre, email, password) VALUES
('Ana Torres', 'ana@correo.com', 'pass1'), 
('Carlos Ruiz', 'carlos@correo.com', 'pass2');

-- Administradores
INSERT INTO administradores (nombre, email, password) VALUES
('Admin General', 'admin1@vozsegura.com', 'adm1'),
('Admin Apoyo', 'admin2@vozsegura.com', 'adm2');

-- Recursos
INSERT INTO recursos (titulo, descripcion, url) VALUES
('Guía de apoyo psicológico', 'Material para primeros auxilios emocionales', 'https://ayuda.com/psicologia'),
('Contacto legal', 'Información sobre asesoría jurídica gratuita', 'https://ayuda.com/legal');

-- Denuncias
INSERT INTO denuncias (codigo, tipo, descripcion, fecha, estado, gravedad, usuario_id, facultad_id) VALUES
('DN-001', 'Acoso', 'Situación de acoso en clase', '2025-09-01', 'recibida', 'alta', 1, 1),
('DN-002', 'Violencia', 'Conflicto físico en campus', '2025-09-02', 'revisando', 'media', 2, 2);

-- Relación denuncia-recurso
INSERT INTO denuncia_recurso (denuncia_id, recurso_id) VALUES
(1, 1), 
(1, 2), 
(2, 2);

-- Archivos (evidencia)
INSERT INTO archivos (denuncia_id, nombre, tipo, ruta) VALUES
(1, 'foto_acoso.jpg', 'imagen', '/files/foto_acoso.jpg'),
(2, 'video_conflicto.mp4', 'video', '/files/video_conflicto.mp4');

-- Seguimiento denuncia
INSERT INTO seguimiento_denuncia (denuncia_id, admin_id, accion, comentario, estado_actual) VALUES
(1, 1, 'Revisión inicial', 'Se recibe la denuncia y se asigna a psicología', 'revisando'),
(2, 2, 'Contacto con denunciante', 'Se contacta testigo para ampliar información', 'en proceso');

-- Atenciones
INSERT INTO atenciones (denuncia_id, usuario_id, admin_id, tipo_atencion, descripcion) VALUES
(1, 1, 1, 'psicológica', 'Primera sesión de apoyo emocional'),
(2, 2, 2, 'legal', 'Orientación sobre proceso disciplinario');

-- Log de acción
INSERT INTO log_accion (usuario_id, admin_id, accion, descripcion) VALUES
(1, NULL, 'Registrar denuncia', 'Ana Torres registró una denuncia de acoso'),
(NULL, 1, 'Actualizar estado', 'Admin General cambió estado a revisando');

-- Orientaciones
INSERT INTO orientacion (usuario_id, mensaje, estado) VALUES
(1, 'Recuerda que puedes pedir ayuda psicológica gratuita.', 'leída'),
(2, 'La asesoría legal está disponible para ti.', 'pendiente');


-- 1. Facultades activas de la Universidad Central
SELECT nombre 
FROM facultades 
WHERE institucion_id = (SELECT id FROM instituciones WHERE nombre = 'Universidad Central')
AND activa = TRUE;

-- -----------------------------------------------
-- 2. Denuncias registradas por Ana Torres
SELECT codigo, tipo, fecha 
FROM denuncias 
WHERE usuario_id = (SELECT id FROM usuarios WHERE nombre = 'Ana Torres');

-- -----------------------------------------------
-- 3. Recursos relacionados con la denuncia DN-001
SELECT titulo 
FROM recursos 
WHERE id IN (
SELECT recurso_id FROM denuncia_recurso
WHERE denuncia_id = (SELECT id FROM denuncias WHERE codigo = 'DN-001')
);

-- -----------------------------------------------
-- 4. Cantidad de atenciones realizadas por el Admin General
SELECT COUNT(*) AS cantidad_atenciones
FROM atenciones
WHERE admin_id = (SELECT id FROM administradores WHERE nombre = 'Admin General');

-- -----------------------------------------------
-- 5. Archivos adjuntos a la denuncia DN-002
SELECT nombre, tipo 
FROM archivos 
WHERE denuncia_id = (SELECT id FROM denuncias WHERE codigo = 'DN-002');

-- -----------------------------------------------
-- 6. Estados de seguimiento de la denuncia DN-001
SELECT accion, estado_actual, fecha 
FROM seguimiento_denuncia 
WHERE denuncia_id = (SELECT id FROM denuncias WHERE codigo = 'DN-001');

-- -----------------------------------------------
-- 7. Usuarios con denuncias de gravedad alta
SELECT nombre 
FROM usuarios 
WHERE id IN (
SELECT usuario_id FROM denuncias WHERE gravedad = 'alta'
);

-- -----------------------------------------------
-- 8. Mensajes de orientación enviados a Carlos Ruiz
SELECT mensaje, estado 
FROM orientacion 
WHERE usuario_id = (SELECT id FROM usuarios WHERE nombre = 'Carlos Ruiz');

-- -----------------------------------------------
-- 9. Denuncias que ya están en proceso
SELECT codigo, estado 
FROM denuncias 
WHERE estado LIKE '%proceso%';

-- -----------------------------------------------
-- 10. Cantidad total de denuncias por cada facultad
SELECT nombre AS facultad,
(SELECT COUNT(*) FROM denuncias WHERE facultad_id = f.id) AS total_denuncias
FROM facultades f;vista_albumes_artistavista_albumes_artistavista_albumes_artistaalbumesinscribir_estudiante



USE vozsegura;

-- =====================================================
-- SECCIÓN 1: VISTAS ADICIONALES (54 vistas)
-- =====================================================

-- VISTAS DE ANÁLISIS TEMPORAL

CREATE VIEW vista_denuncias_por_mes AS
SELECT 
    YEAR(fecha) AS anio,
    MONTH(fecha) AS mes,
    COUNT(*) AS total_denuncias,
    COUNT(CASE WHEN gravedad = 'alta' THEN 1 END) AS denuncias_urgentes,
    COUNT(CASE WHEN estado = 'resuelta' THEN 1 END) AS denuncias_resueltas
FROM denuncias
GROUP BY YEAR(fecha), MONTH(fecha)
ORDER BY anio DESC, mes DESC;

CREATE VIEW vista_denuncias_por_trimestre AS
SELECT 
    YEAR(fecha) AS anio,
    QUARTER(fecha) AS trimestre,
    COUNT(*) AS total_denuncias,
    AVG(DATEDIFF(fecha_actualizacion, fecha_creacion)) AS dias_promedio_resolucion
FROM denuncias
GROUP BY YEAR(fecha), QUARTER(fecha);

CREATE VIEW vista_denuncias_por_semana AS
SELECT 
    YEARWEEK(fecha, 1) AS semana,
    COUNT(*) AS total_denuncias,
    tipo,
    estado
FROM denuncias
GROUP BY YEARWEEK(fecha, 1), tipo, estado;

CREATE VIEW vista_tendencia_mensual_denuncias AS
SELECT 
    DATE_FORMAT(fecha_creacion, '%Y-%m') AS mes,
    COUNT(*) AS total,
    COUNT(CASE WHEN tipo = 'acoso' THEN 1 END) AS acoso,
    COUNT(CASE WHEN tipo = 'discriminacion' THEN 1 END) AS discriminacion,
    COUNT(CASE WHEN tipo = 'violencia' THEN 1 END) AS violencia
FROM denuncias
GROUP BY DATE_FORMAT(fecha_creacion, '%Y-%m')
ORDER BY mes DESC;

CREATE VIEW vista_denuncias_fin_semana AS
SELECT 
    d.*,
    DAYNAME(d.fecha) AS dia_semana
FROM denuncias d
WHERE DAYOFWEEK(d.fecha) IN (1, 7);

-- VISTAS DE ANÁLISIS POR TIPO

CREATE VIEW vista_denuncias_por_tipo AS
SELECT 
    tipo,
    COUNT(*) AS total,
    COUNT(CASE WHEN estado = 'recibida' THEN 1 END) AS nuevas,
    COUNT(CASE WHEN estado = 'en_proceso' THEN 1 END) AS en_proceso,
    COUNT(CASE WHEN estado = 'resuelta' THEN 1 END) AS resueltas,
    COUNT(CASE WHEN estado = 'archivada' THEN 1 END) AS archivadas
FROM denuncias
GROUP BY tipo;

CREATE VIEW vista_tipos_mas_frecuentes AS
SELECT 
    tipo,
    COUNT(*) AS cantidad,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM denuncias), 2) AS porcentaje
FROM denuncias
GROUP BY tipo
ORDER BY cantidad DESC;

CREATE VIEW vista_denuncias_acoso AS
SELECT d.*, u.nombre AS usuario, f.nombre AS facultad
FROM denuncias d
JOIN usuarios u ON d.usuario_id = u.id
JOIN facultades f ON d.facultad_id = f.id
WHERE d.tipo = 'acoso';

CREATE VIEW vista_denuncias_discriminacion AS
SELECT d.*, u.nombre AS usuario, f.nombre AS facultad
FROM denuncias d
JOIN usuarios u ON d.usuario_id = u.id
JOIN facultades f ON d.facultad_id = f.id
WHERE d.tipo = 'discriminacion';

CREATE VIEW vista_denuncias_violencia AS
SELECT d.*, u.nombre AS usuario, f.nombre AS facultad
FROM denuncias d
JOIN usuarios u ON d.usuario_id = u.id
JOIN facultades f ON d.facultad_id = f.id
WHERE d.tipo = 'violencia';

-- VISTAS DE ANÁLISIS POR GRAVEDAD

CREATE VIEW vista_denuncias_urgentes AS
SELECT 
    d.*,
    u.nombre AS usuario,
    f.nombre AS facultad,
    DATEDIFF(NOW(), d.fecha_creacion) AS dias_sin_resolver
FROM denuncias d
JOIN usuarios u ON d.usuario_id = u.id
JOIN facultades f ON d.facultad_id = f.id
WHERE d.gravedad = 'alta' AND d.estado != 'resuelta';

CREATE VIEW vista_denuncias_gravedad_alta AS
SELECT d.*, COUNT(s.id) AS seguimientos
FROM denuncias d
LEFT JOIN seguimiento_denuncia s ON d.id = s.denuncia_id
WHERE d.gravedad = 'alta'
GROUP BY d.id;

CREATE VIEW vista_distribucion_gravedad AS
SELECT 
    gravedad,
    COUNT(*) AS total,
    AVG(DATEDIFF(fecha_actualizacion, fecha_creacion)) AS dias_promedio
FROM denuncias
GROUP BY gravedad;

-- VISTAS DE ANÁLISIS POR ESTADO

CREATE VIEW vista_denuncias_pendientes AS
SELECT 
    d.*,
    u.nombre AS usuario,
    u.email AS email_usuario,
    f.nombre AS facultad,
    DATEDIFF(NOW(), d.fecha_creacion) AS dias_pendiente
FROM denuncias d
JOIN usuarios u ON d.usuario_id = u.id
JOIN facultades f ON d.facultad_id = f.id
WHERE d.estado IN ('recibida', 'en_proceso')
ORDER BY d.gravedad DESC, d.fecha_creacion ASC;

CREATE VIEW vista_denuncias_resueltas_mes_actual AS
SELECT d.*, u.nombre AS usuario
FROM denuncias d
JOIN usuarios u ON d.usuario_id = u.id
WHERE d.estado = 'resuelta' 
AND MONTH(d.fecha_actualizacion) = MONTH(NOW())
AND YEAR(d.fecha_actualizacion) = YEAR(NOW());

CREATE VIEW vista_denuncias_archivadas AS
SELECT d.*, 
    DATEDIFF(fecha_actualizacion, fecha_creacion) AS dias_hasta_archivo
FROM denuncias d
WHERE d.estado = 'archivada';

CREATE VIEW vista_tiempo_resolucion_por_estado AS
SELECT 
    estado,
    COUNT(*) AS cantidad,
    AVG(DATEDIFF(fecha_actualizacion, fecha_creacion)) AS dias_promedio,
    MIN(DATEDIFF(fecha_actualizacion, fecha_creacion)) AS dias_minimo,
    MAX(DATEDIFF(fecha_actualizacion, fecha_creacion)) AS dias_maximo
FROM denuncias
GROUP BY estado;

-- VISTAS DE ANÁLISIS GEOGRÁFICO E INSTITUCIONAL

CREATE VIEW vista_denuncias_por_ciudad AS
SELECT 
    i.ciudad,
    COUNT(d.id) AS total_denuncias,
    COUNT(CASE WHEN d.estado = 'resuelta' THEN 1 END) AS resueltas
FROM denuncias d
JOIN facultades f ON d.facultad_id = f.id
JOIN instituciones i ON f.institucion_id = i.id
GROUP BY i.ciudad
ORDER BY total_denuncias DESC;

CREATE VIEW vista_denuncias_por_institucion AS
SELECT 
    i.nombre AS institucion,
    i.ciudad,
    COUNT(d.id) AS total_denuncias,
    COUNT(DISTINCT d.usuario_id) AS usuarios_unicos,
    COUNT(DISTINCT f.id) AS facultades_afectadas
FROM instituciones i
LEFT JOIN facultades f ON i.id = f.institucion_id
LEFT JOIN denuncias d ON f.id = d.facultad_id
GROUP BY i.id, i.nombre, i.ciudad;

CREATE VIEW vista_instituciones_ranking AS
SELECT 
    i.nombre,
    i.ciudad,
    COUNT(d.id) AS total_denuncias,
    RANK() OVER (ORDER BY COUNT(d.id) DESC) AS ranking
FROM instituciones i
LEFT JOIN facultades f ON i.id = f.institucion_id
LEFT JOIN denuncias d ON f.id = d.facultad_id
GROUP BY i.id, i.nombre, i.ciudad;

CREATE VIEW vista_facultades_mas_denuncias AS
SELECT 
    f.nombre AS facultad,
    i.nombre AS institucion,
    COUNT(d.id) AS total_denuncias,
    COUNT(CASE WHEN d.gravedad = 'alta' THEN 1 END) AS urgentes
FROM facultades f
JOIN instituciones i ON f.institucion_id = i.id
LEFT JOIN denuncias d ON f.id = d.facultad_id
WHERE f.activa = TRUE
GROUP BY f.id, f.nombre, i.nombre
HAVING total_denuncias > 0
ORDER BY total_denuncias DESC
LIMIT 10;

CREATE VIEW vista_facultades_sin_denuncias AS
SELECT f.*, i.nombre AS institucion
FROM facultades f
JOIN instituciones i ON f.institucion_id = i.id
LEFT JOIN denuncias d ON f.id = d.facultad_id
WHERE d.id IS NULL AND f.activa = TRUE;

-- VISTAS DE USUARIOS

CREATE VIEW vista_usuarios_activos AS
SELECT u.*, COUNT(d.id) AS total_denuncias
FROM usuarios u
LEFT JOIN denuncias d ON u.id = d.usuario_id
WHERE u.activo = TRUE
GROUP BY u.id;

CREATE VIEW vista_usuarios_nuevos_mes AS
SELECT u.*, COUNT(d.id) AS denuncias_realizadas
FROM usuarios u
LEFT JOIN denuncias d ON u.id = d.usuario_id
WHERE MONTH(u.fecha_registro) = MONTH(NOW())
AND YEAR(u.fecha_registro) = YEAR(NOW())
GROUP BY u.id;

CREATE VIEW vista_usuarios_sin_denuncias AS
SELECT u.*
FROM usuarios u
LEFT JOIN denuncias d ON u.id = d.usuario_id
WHERE d.id IS NULL AND u.activo = TRUE;

CREATE VIEW vista_usuarios_con_multiples_denuncias AS
SELECT 
    u.id,
    u.nombre,
    u.email,
    COUNT(d.id) AS total_denuncias,
    MAX(d.fecha_creacion) AS ultima_denuncia
FROM usuarios u
JOIN denuncias d ON u.id = d.usuario_id
GROUP BY u.id, u.nombre, u.email
HAVING total_denuncias >= 2;

CREATE VIEW vista_registro_usuarios_diario AS
SELECT 
    DATE(fecha_registro) AS fecha,
    COUNT(*) AS registros
FROM usuarios
GROUP BY DATE(fecha_registro)
ORDER BY fecha DESC;

-- VISTAS DE ADMINISTRADORES

CREATE VIEW vista_administradores_activos AS
SELECT 
    a.*,
    COUNT(DISTINCT s.denuncia_id) AS denuncias_gestionadas
FROM administradores a
LEFT JOIN seguimiento_denuncia s ON a.id = s.admin_id
WHERE a.activo = TRUE
GROUP BY a.id;

CREATE VIEW vista_rendimiento_administradores AS
SELECT 
    a.id,
    a.nombre,
    COUNT(DISTINCT s.denuncia_id) AS denuncias_atendidas,
    COUNT(DISTINCT at.id) AS atenciones_realizadas,
    COUNT(s.id) AS acciones_totales,
    MAX(s.fecha) AS ultima_accion
FROM administradores a
LEFT JOIN seguimiento_denuncia s ON a.id = s.admin_id
LEFT JOIN atenciones at ON a.id = at.admin_id
GROUP BY a.id, a.nombre;

CREATE VIEW vista_admins_mas_activos AS
SELECT 
    a.nombre,
    COUNT(s.id) AS total_acciones,
    COUNT(DISTINCT s.denuncia_id) AS denuncias_unicas
FROM administradores a
JOIN seguimiento_denuncia s ON a.id = s.admin_id
WHERE MONTH(s.fecha) = MONTH(NOW())
GROUP BY a.id, a.nombre
ORDER BY total_acciones DESC;

-- VISTAS DE SEGUIMIENTO Y ATENCIONES

CREATE VIEW vista_seguimientos_recientes AS
SELECT 
    s.*,
    d.codigo AS codigo_denuncia,
    a.nombre AS admin_nombre
FROM seguimiento_denuncia s
JOIN denuncias d ON s.denuncia_id = d.id
JOIN administradores a ON s.admin_id = a.id
ORDER BY s.fecha DESC
LIMIT 50;

CREATE VIEW vista_denuncias_sin_seguimiento AS
SELECT d.*, u.nombre AS usuario
FROM denuncias d
JOIN usuarios u ON d.usuario_id = u.id
LEFT JOIN seguimiento_denuncia s ON d.id = s.denuncia_id
WHERE s.id IS NULL;

CREATE VIEW vista_atenciones_programadas AS
SELECT 
    at.*,
    d.codigo,
    u.nombre AS usuario,
    a.nombre AS admin
FROM atenciones at
JOIN denuncias d ON at.denuncia_id = d.id
JOIN usuarios u ON at.usuario_id = u.id
JOIN administradores a ON at.admin_id = a.id
WHERE DATE(at.fecha) >= CURDATE();

CREATE VIEW vista_atenciones_por_modalidad AS
SELECT 
    modalidad,
    COUNT(*) AS total,
    tipo_atencion
FROM atenciones
GROUP BY modalidad, tipo_atencion;

-- VISTAS DE ARCHIVOS Y EVIDENCIAS

CREATE VIEW vista_denuncias_con_archivos AS
SELECT 
    d.id,
    d.codigo,
    d.tipo,
    COUNT(a.id) AS total_archivos,
    SUM(a.tamano_kb) AS tamano_total_kb
FROM denuncias d
JOIN archivos a ON d.id = a.denuncia_id
GROUP BY d.id, d.codigo, d.tipo;

CREATE VIEW vista_denuncias_sin_archivos AS
SELECT d.*
FROM denuncias d
LEFT JOIN archivos a ON d.id = a.denuncia_id
WHERE a.id IS NULL;

CREATE VIEW vista_archivos_recientes AS
SELECT 
    a.*,
    d.codigo AS codigo_denuncia
FROM archivos a
JOIN denuncias d ON a.denuncia_id = d.id
ORDER BY a.fecha DESC
LIMIT 100;

CREATE VIEW vista_estadisticas_archivos AS
SELECT 
    COUNT(*) AS total_archivos,
    SUM(tamano_kb) AS tamano_total_kb,
    AVG(tamano_kb) AS tamano_promedio_kb,
    COUNT(DISTINCT denuncia_id) AS denuncias_con_archivos
FROM archivos;

-- VISTAS DE RECURSOS

CREATE VIEW vista_recursos_activos AS
SELECT * FROM recursos WHERE activo = TRUE;

CREATE VIEW vista_recursos_mas_asignados AS
SELECT 
    r.*,
    COUNT(dr.denuncia_id) AS veces_asignado
FROM recursos r
LEFT JOIN denuncia_recurso dr ON r.id = dr.recurso_id
GROUP BY r.id
ORDER BY veces_asignado DESC;

CREATE VIEW vista_denuncias_recursos_asignados AS
SELECT 
    d.codigo,
    d.tipo,
    r.titulo AS recurso,
    dr.fecha_asignacion
FROM denuncias d
JOIN denuncia_recurso dr ON d.id = dr.denuncia_id
JOIN recursos r ON dr.recurso_id = r.id;

-- VISTAS DE ORIENTACIÓN

CREATE VIEW vista_orientaciones_pendientes AS
SELECT 
    o.*,
    u.nombre AS usuario_nombre,
    u.email AS usuario_email
FROM orientacion o
JOIN usuarios u ON o.usuario_id = u.id
WHERE o.estado = 'pendiente' AND o.leido = FALSE;

CREATE VIEW vista_orientaciones_por_usuario AS
SELECT 
    u.nombre,
    u.email,
    COUNT(o.id) AS total_orientaciones,
    COUNT(CASE WHEN o.leido = TRUE THEN 1 END) AS leidas,
    COUNT(CASE WHEN o.leido = FALSE THEN 1 END) AS pendientes
FROM usuarios u
LEFT JOIN orientacion o ON u.id = o.usuario_id
GROUP BY u.id, u.nombre, u.email;

-- VISTAS DE LOG Y AUDITORÍA

CREATE VIEW vista_log_ultimas_acciones AS
SELECT 
    l.*,
    COALESCE(u.nombre, a.nombre) AS usuario_sistema
FROM log_accion l
LEFT JOIN usuarios u ON l.usuario_id = u.id
LEFT JOIN administradores a ON l.admin_id = a.id
ORDER BY l.fecha DESC
LIMIT 100;

CREATE VIEW vista_acciones_por_tipo AS
SELECT 
    accion,
    COUNT(*) AS total,
    DATE(MAX(fecha)) AS ultima_vez
FROM log_accion
GROUP BY accion
ORDER BY total DESC;

CREATE VIEW vista_actividad_diaria AS
SELECT 
    DATE(fecha) AS fecha,
    COUNT(*) AS total_acciones,
    COUNT(DISTINCT usuario_id) AS usuarios_activos,
    COUNT(DISTINCT admin_id) AS admins_activos
FROM log_accion
GROUP BY DATE(fecha)
ORDER BY fecha DESC;

-- VISTAS DE ESTADÍSTICAS GENERALES

CREATE VIEW vista_resumen_general AS
SELECT 
    (SELECT COUNT(*) FROM denuncias) AS total_denuncias,
    (SELECT COUNT(*) FROM denuncias WHERE estado = 'recibida') AS denuncias_nuevas,
    (SELECT COUNT(*) FROM denuncias WHERE estado = 'en_proceso') AS denuncias_proceso,
    (SELECT COUNT(*) FROM denuncias WHERE estado = 'resuelta') AS denuncias_resueltas,
    (SELECT COUNT(*) FROM usuarios WHERE activo = TRUE) AS usuarios_activos,
    (SELECT COUNT(*) FROM administradores WHERE activo = TRUE) AS admins_activos,
    (SELECT COUNT(*) FROM instituciones) AS instituciones_total,
    (SELECT COUNT(*) FROM facultades WHERE activa = TRUE) AS facultades_activas;

CREATE VIEW vista_indicadores_rendimiento AS
SELECT 
    COUNT(*) AS denuncias_totales,
    AVG(DATEDIFF(fecha_actualizacion, fecha_creacion)) AS tiempo_promedio_dias,
    COUNT(CASE WHEN estado = 'resuelta' THEN 1 END) * 100.0 / COUNT(*) AS porcentaje_resueltas,
    COUNT(CASE WHEN gravedad = 'alta' AND estado != 'resuelta' THEN 1 END) AS urgentes_pendientes
FROM denuncias;

CREATE VIEW vista_tasa_resolucion_mensual AS
SELECT 
    DATE_FORMAT(fecha_creacion, '%Y-%m') AS mes,
    COUNT(*) AS total,
    COUNT(CASE WHEN estado = 'resuelta' THEN 1 END) AS resueltas,
    ROUND(COUNT(CASE WHEN estado = 'resuelta' THEN 1 END) * 100.0 / COUNT(*), 2) AS tasa_resolucion
FROM denuncias
GROUP BY DATE_FORMAT(fecha_creacion, '%Y-%m')
ORDER BY mes DESC;

CREATE VIEW vista_denuncias_criticas AS
SELECT 
    d.*,
    u.nombre AS usuario,
    f.nombre AS facultad,
    DATEDIFF(NOW(), d.fecha_creacion) AS dias_abierta
FROM denuncias d
JOIN usuarios u ON d.usuario_id = u.id
JOIN facultades f ON d.facultad_id = f.id
WHERE d.gravedad = 'alta' 
AND d.estado IN ('recibida', 'en_proceso')
AND DATEDIFF(NOW(), d.fecha_creacion) > 7;

CREATE VIEW vista_comparativa_trimestral AS
SELECT 
    YEAR(fecha) AS anio,
    QUARTER(fecha) AS trimestre,
    COUNT(*) AS total,
    COUNT(CASE WHEN estado = 'resuelta' THEN 1 END) AS resueltas,
    AVG(DATEDIFF(fecha_actualizacion, fecha_creacion)) AS dias_promedio
FROM denuncias
GROUP BY YEAR(fecha), QUARTER(fecha)
ORDER BY anio DESC, trimestre DESC;


-- SECCIÓN 2: PROCEDIMIENTOS ALMACENADOS 

DELIMITER //

-- PROCEDIMIENTOS CRUD PARA USUARIOS

CREATE PROCEDURE sp_crear_usuario(
    IN p_nombre VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    INSERT INTO usuarios (nombre, email, password)
    VALUES (p_nombre, p_email, p_password);
    
    SELECT LAST_INSERT_ID() AS usuario_id;
END //

CREATE PROCEDURE sp_actualizar_usuario(
    IN p_usuario_id INT,
    IN p_nombre VARCHAR(100),
    IN p_email VARCHAR(100)
)
BEGIN
    UPDATE usuarios 
    SET nombre = p_nombre, email = p_email
    WHERE id = p_usuario_id;
END //

CREATE PROCEDURE sp_desactivar_usuario(IN p_usuario_id INT)
BEGIN
    UPDATE usuarios SET activo = FALSE WHERE id = p_usuario_id;
    
    INSERT INTO log_accion (usuario_id, accion, descripcion)
    VALUES (p_usuario_id, 'USUARIO_DESACTIVADO', 'Usuario desactivado del sistema');
END //

CREATE PROCEDURE sp_activar_usuario(IN p_usuario_id INT)
BEGIN
    UPDATE usuarios SET activo = TRUE WHERE id = p_usuario_id;
    
    INSERT INTO log_accion (usuario_id, accion, descripcion)
    VALUES (p_usuario_id, 'USUARIO_ACTIVADO', 'Usuario reactivado en el sistema');
END //

CREATE PROCEDURE sp_eliminar_usuario(IN p_usuario_id INT)
BEGIN
    DELETE FROM usuarios WHERE id = p_usuario_id;
END //

CREATE PROCEDURE sp_buscar_usuario_por_email(IN p_email VARCHAR(100))
BEGIN
    SELECT * FROM usuarios WHERE email = p_email;
END //

CREATE PROCEDURE sp_listar_usuarios_activos()
BEGIN
    SELECT * FROM vista_usuarios_activos ORDER BY fecha_registro DESC;
END //

-- PROCEDIMIENTOS CRUD PARA ADMINISTRADORES

CREATE PROCEDURE sp_crear_administrador(
    IN p_nombre VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    INSERT INTO administradores (nombre, email, password)
    VALUES (p_nombre, p_email, p_password);
    
    SELECT LAST_INSERT_ID() AS admin_id;
END //

CREATE PROCEDURE sp_actualizar_administrador(
    IN p_admin_id INT,
    IN p_nombre VARCHAR(100),
    IN p_email VARCHAR(100)
)
BEGIN
    UPDATE administradores 
    SET nombre = p_nombre, email = p_email
    WHERE id = p_admin_id;
END //

CREATE PROCEDURE sp_desactivar_administrador(IN p_admin_id INT)
BEGIN
    UPDATE administradores SET activo = FALSE WHERE id = p_admin_id;
END //

-- PROCEDIMIENTOS CRUD PARA INSTITUCIONES

CREATE PROCEDURE sp_crear_institucion(
    IN p_nombre VARCHAR(200),
    IN p_ciudad VARCHAR(100)
)
BEGIN
    INSERT INTO instituciones (nombre, ciudad)
    VALUES (p_nombre, p_ciudad);
    
    SELECT LAST_INSERT_ID() AS institucion_id;
END //

CREATE PROCEDURE sp_actualizar_institucion(
    IN p_institucion_id INT,
    IN p_nombre VARCHAR(200),
    IN p_ciudad VARCHAR(100)
)
BEGIN
    UPDATE instituciones 
    SET nombre = p_nombre, ciudad = p_ciudad
    WHERE id = p_institucion_id;
END //

CREATE PROCEDURE sp_eliminar_institucion(IN p_institucion_id INT)
BEGIN
    DELETE FROM instituciones WHERE id = p_institucion_id;
END //

CREATE PROCEDURE sp_listar_instituciones()
BEGIN
    SELECT * FROM instituciones ORDER BY nombre;
END //

CREATE PROCEDURE sp_buscar_instituciones_por_ciudad(IN p_ciudad VARCHAR(100))
BEGIN
    SELECT * FROM instituciones WHERE ciudad = p_ciudad;
END //

-- PROCEDIMIENTOS CRUD PARA FACULTADES

CREATE PROCEDURE sp_crear_facultad(
    IN p_nombre VARCHAR(200),
    IN p_institucion_id INT
)
BEGIN
    INSERT INTO facultades (nombre, institucion_id)
    VALUES (p_nombre, p_institucion_id);
    
    SELECT LAST_INSERT_ID() AS facultad_id;
END //

CREATE PROCEDURE sp_actualizar_facultad(
    IN p_facultad_id INT,
    IN p_nombre VARCHAR(200),
    IN p_institucion_id INT
)
BEGIN
    UPDATE facultades 
    SET nombre = p_nombre, institucion_id = p_institucion_id
    WHERE id = p_facultad_id;
END //

CREATE PROCEDURE sp_desactivar_facultad(IN p_facultad_id INT)
BEGIN
    UPDATE facultades SET activa = FALSE WHERE id = p_facultad_id;
END //

CREATE PROCEDURE sp_activar_facultad(IN p_facultad_id INT)
BEGIN
    UPDATE facultades SET activa = TRUE WHERE id = p_facultad_id;
END //

CREATE PROCEDURE sp_listar_facultades_por_institucion(IN p_institucion_id INT)
BEGIN
    SELECT * FROM facultades 
    WHERE institucion_id = p_institucion_id AND activa = TRUE;
END //

-- PROCEDIMIENTOS CRUD PARA RECURSOS

CREATE PROCEDURE sp_crear_recurso(
    IN p_titulo VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_url VARCHAR(255)
)
BEGIN
    INSERT INTO recursos (titulo, descripcion, url)
    VALUES (p_titulo, p_descripcion, p_url);
    
    SELECT LAST_INSERT_ID() AS recurso_id;
END //

CREATE PROCEDURE sp_actualizar_recurso(
    IN p_recurso_id INT,
    IN p_titulo VARCHAR(100),
    IN p_descripcion TEXT,
    IN p_url VARCHAR(255)
)
BEGIN
    UPDATE recursos 
    SET titulo = p_titulo, descripcion = p_descripcion, url = p_url
    WHERE id = p_recurso_id;
END //

CREATE PROCEDURE sp_desactivar_recurso(IN p_recurso_id INT)
BEGIN
    UPDATE recursos SET activo = FALSE WHERE id = p_recurso_id;
END //

CREATE PROCEDURE sp_activar_recurso(IN p_recurso_id INT)
BEGIN
    UPDATE recursos SET activo = TRUE WHERE id = p_recurso_id;
END //

CREATE PROCEDURE sp_listar_recursos_activos()
BEGIN
    SELECT * FROM recursos WHERE activo = TRUE;
END //

-- PROCEDIMIENTOS AVANZADOS PARA DENUNCIAS

CREATE PROCEDURE sp_buscar_denuncias_por_codigo(IN p_codigo VARCHAR(20))
BEGIN
    SELECT * FROM vista_denuncias_completas WHERE codigo = p_codigo;
END //

CREATE PROCEDURE sp_buscar_denuncias_por_tipo(IN p_tipo VARCHAR(50))
BEGIN
    SELECT * FROM vista_denuncias_completas WHERE tipo = p_tipo;
END //

CREATE PROCEDURE sp_buscar_denuncias_por_estado(IN p_estado VARCHAR(30))
BEGIN
    SELECT * FROM vista_denuncias_completas WHERE estado = p_estado;
END //

CREATE PROCEDURE sp_buscar_denuncias_por_gravedad(IN p_gravedad VARCHAR(20))
BEGIN
    SELECT * FROM vista_denuncias_completas WHERE gravedad = p_gravedad;
END //

CREATE PROCEDURE sp_buscar_denuncias_por_fecha_rango(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT * FROM vista_denuncias_completas 
    WHERE fecha BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY fecha DESC;
END //

CREATE PROCEDURE sp_buscar_denuncias_por_facultad(IN p_facultad_id INT)
BEGIN
    SELECT * FROM vista_denuncias_completas 
    WHERE facultad_id = p_facultad_id;
END //

CREATE PROCEDURE sp_archivar_denuncia(
    IN p_denuncia_id INT,
    IN p_admin_id INT,
    IN p_motivo TEXT
)
BEGIN
    UPDATE denuncias SET estado = 'archivada' WHERE id = p_denuncia_id;
    
    INSERT INTO seguimiento_denuncia (denuncia_id, admin_id, accion, comentario)
    VALUES (p_denuncia_id, p_admin_id, 'ARCHIVADA', p_motivo);
END //

CREATE PROCEDURE sp_reabrir_denuncia(
    IN p_denuncia_id INT,
    IN p_admin_id INT,
    IN p_motivo TEXT
)
BEGIN
    UPDATE denuncias SET estado = 'en_proceso' WHERE id = p_denuncia_id;
    
    INSERT INTO seguimiento_denuncia (denuncia_id, admin_id, accion, comentario)
    VALUES (p_denuncia_id, p_admin_id, 'REABIERTA', p_motivo);
END //

CREATE PROCEDURE sp_cambiar_gravedad_denuncia(
    IN p_denuncia_id INT,
    IN p_admin_id INT,
    IN p_nueva_gravedad VARCHAR(20),
    IN p_justificacion TEXT
)
BEGIN
    UPDATE denuncias SET gravedad = p_nueva_gravedad WHERE id = p_denuncia_id;
    
    INSERT INTO seguimiento_denuncia (denuncia_id, admin_id, accion, comentario)
    VALUES (p_denuncia_id, p_admin_id, 'CAMBIO_GRAVEDAD', p_justificacion);
END //

-- PROCEDIMIENTOS DE ARCHIVOS

CREATE PROCEDURE sp_agregar_archivo_denuncia(
    IN p_denuncia_id INT,
    IN p_nombre VARCHAR(255),
    IN p_tipo VARCHAR(20),
    IN p_ruta VARCHAR(255),
    IN p_tamano_kb INT
)
BEGIN
    INSERT INTO archivos (denuncia_id, nombre, tipo, ruta, tamano_kb)
    VALUES (p_denuncia_id, p_nombre, p_tipo, p_ruta, p_tamano_kb);
    
    SELECT LAST_INSERT_ID() AS archivo_id;
END //

CREATE PROCEDURE sp_eliminar_archivo(IN p_archivo_id INT)
BEGIN
    DELETE FROM archivos WHERE id = p_archivo_id;
END //

CREATE PROCEDURE sp_listar_archivos_denuncia(IN p_denuncia_id INT)
BEGIN
    SELECT * FROM archivos WHERE denuncia_id = p_denuncia_id ORDER BY fecha DESC;
END //

-- PROCEDIMIENTOS DE ORIENTACIÓN

CREATE PROCEDURE sp_listar_orientaciones_usuario(IN p_usuario_id INT)
BEGIN
    SELECT * FROM orientacion 
    WHERE usuario_id = p_usuario_id 
    ORDER BY fecha_envio DESC;
END //

CREATE PROCEDURE sp_contar_orientaciones_pendientes(IN p_usuario_id INT)
BEGIN
    SELECT COUNT(*) AS pendientes 
    FROM orientacion 
    WHERE usuario_id = p_usuario_id AND leido = FALSE;
END //

-- PROCEDIMIENTOS DE REPORTES Y ESTADÍSTICAS

CREATE PROCEDURE sp_reporte_denuncias_por_mes(IN p_anio INT)
BEGIN
    SELECT 
        MONTH(fecha) AS mes,
        COUNT(*) AS total,
        COUNT(CASE WHEN estado = 'resuelta' THEN 1 END) AS resueltas
    FROM denuncias
    WHERE YEAR(fecha) = p_anio
    GROUP BY MONTH(fecha)
    ORDER BY mes;
END //

CREATE PROCEDURE sp_reporte_denuncias_por_institucion()
BEGIN
    SELECT * FROM vista_denuncias_por_institucion 
    ORDER BY total_denuncias DESC;
END //

CREATE PROCEDURE sp_reporte_rendimiento_admins(IN p_mes INT, IN p_anio INT)
BEGIN
    SELECT 
        a.nombre,
        COUNT(DISTINCT s.denuncia_id) AS denuncias_atendidas,
        COUNT(s.id) AS acciones_realizadas
    FROM administradores a
    LEFT JOIN seguimiento_denuncia s ON a.id = s.admin_id
    WHERE MONTH(s.fecha) = p_mes AND YEAR(s.fecha) = p_anio
    GROUP BY a.id, a.nombre
    ORDER BY denuncias_atendidas DESC;
END //

CREATE PROCEDURE sp_estadisticas_tiempo_resolucion()
BEGIN
    SELECT 
        tipo,
        gravedad,
        AVG(DATEDIFF(fecha_actualizacion, fecha_creacion)) AS dias_promedio,
        MIN(DATEDIFF(fecha_actualizacion, fecha_creacion)) AS dias_minimo,
        MAX(DATEDIFF(fecha_actualizacion, fecha_creacion)) AS dias_maximo
    FROM denuncias
    WHERE estado = 'resuelta'
    GROUP BY tipo, gravedad;
END //

CREATE PROCEDURE sp_alertas_denuncias_antiguas(IN p_dias INT)
BEGIN
    SELECT 
        d.*,
        u.nombre AS usuario,
        DATEDIFF(NOW(), d.fecha_creacion) AS dias_pendiente
    FROM denuncias d
    JOIN usuarios u ON d.usuario_id = u.id
    WHERE d.estado IN ('recibida', 'en_proceso')
    AND DATEDIFF(NOW(), d.fecha_creacion) > p_dias
    ORDER BY dias_pendiente DESC;
END //

CREATE PROCEDURE sp_resumen_actividad_mes_actual()
BEGIN
    SELECT 
        COUNT(DISTINCT d.id) AS denuncias_creadas,
        COUNT(DISTINCT s.id) AS seguimientos_registrados,
        COUNT(DISTINCT at.id) AS atenciones_realizadas,
        COUNT(DISTINCT u.id) AS usuarios_nuevos
    FROM denuncias d
    LEFT JOIN seguimiento_denuncia s ON d.id = s.denuncia_id
    LEFT JOIN atenciones at ON d.id = at.denuncia_id
    LEFT JOIN usuarios u ON d.usuario_id = u.id
    WHERE MONTH(d.fecha_creacion) = MONTH(NOW())
    AND YEAR(d.fecha_creacion) = YEAR(NOW());
END //

-- PROCEDIMIENTOS DE MANTENIMIENTO

CREATE PROCEDURE sp_limpiar_logs_antiguos(IN p_dias INT)
BEGIN
    DELETE FROM log_accion 
    WHERE fecha < DATE_SUB(NOW(), INTERVAL p_dias DAY);
    
    SELECT ROW_COUNT() AS registros_eliminados;
END //

CREATE PROCEDURE sp_limpiar_orientaciones_leidas_antiguas(IN p_dias INT)
BEGIN
    DELETE FROM orientacion 
    WHERE leido = TRUE 
    AND fecha_lectura < DATE_SUB(NOW(), INTERVAL p_dias DAY);
    
    SELECT ROW_COUNT() AS orientaciones_eliminadas;
END //

CREATE PROCEDURE sp_backup_denuncias_antiguas(IN p_anios INT)
BEGIN
    CREATE TABLE IF NOT EXISTS denuncias_archivo LIKE denuncias;
    
    INSERT INTO denuncias_archivo
    SELECT * FROM denuncias
    WHERE fecha < DATE_SUB(CURDATE(), INTERVAL p_anios YEAR);
    
    SELECT ROW_COUNT() AS denuncias_archivadas;
END //

-- PROCEDIMIENTOS DE VALIDACIÓN

CREATE PROCEDURE sp_validar_integridad_denuncias()
BEGIN
    SELECT 
        'Denuncias sin usuario' AS problema,
        COUNT(*) AS cantidad
    FROM denuncias d
    LEFT JOIN usuarios u ON d.usuario_id = u.id
    WHERE u.id IS NULL
    UNION ALL
    SELECT 
        'Denuncias sin facultad' AS problema,
        COUNT(*) AS cantidad
    FROM denuncias d
    LEFT JOIN facultades f ON d.facultad_id = f.id
    WHERE f.id IS NULL;
END //

CREATE PROCEDURE sp_contar_registros_totales()
BEGIN
    SELECT 
        'usuarios' AS tabla, COUNT(*) AS total FROM usuarios
    UNION ALL
    SELECT 'administradores', COUNT(*) FROM administradores
    UNION ALL
    SELECT 'instituciones', COUNT(*) FROM instituciones
    UNION ALL
    SELECT 'facultades', COUNT(*) FROM facultades
    UNION ALL
    SELECT 'denuncias', COUNT(*) FROM denuncias
    UNION ALL
    SELECT 'seguimiento', COUNT(*) FROM seguimiento_denuncia
    UNION ALL
    SELECT 'atenciones', COUNT(*) FROM atenciones
    UNION ALL
    SELECT 'archivos', COUNT(*) FROM archivos
    UNION ALL
    SELECT 'recursos', COUNT(*) FROM recursos
    UNION ALL
    SELECT 'orientaciones', COUNT(*) FROM orientacion;
END //

DELIMITER ;


-- SECCIÓN 3: TRIGGERS ADICIONALES 

DELIMITER //

-- TRIGGERS PARA DENUNCIAS

CREATE TRIGGER trg_denuncia_insertada
AFTER INSERT ON denuncias
FOR EACH ROW
BEGIN
    INSERT INTO log_accion (usuario_id, accion, descripcion)
    VALUES (NEW.usuario_id, 'DENUNCIA_CREADA', CONCAT('Nueva denuncia: ', NEW.codigo));
END //

CREATE TRIGGER trg_denuncia_actualizada
AFTER UPDATE ON denuncias
FOR EACH ROW
BEGIN
    IF OLD.estado != NEW.estado THEN
        INSERT INTO log_accion (accion, descripcion)
        VALUES ('ESTADO_CAMBIADO', CONCAT('Denuncia ', NEW.codigo, ' cambió de ', OLD.estado, ' a ', NEW.estado));
    END IF;
END //

CREATE TRIGGER trg_validar_estado_denuncia
BEFORE UPDATE ON denuncias
FOR EACH ROW
BEGIN
    IF NEW.estado NOT IN ('recibida', 'en_proceso', 'resuelta', 'archivada') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Estado de denuncia no válido';
    END IF;
END //

CREATE TRIGGER trg_fecha_actualizacion_denuncia
BEFORE UPDATE ON denuncias
FOR EACH ROW
BEGIN
    SET NEW.fecha_actualizacion = NOW();
END //

-- TRIGGERS PARA USUARIOS

CREATE TRIGGER trg_validar_email_usuario
BEFORE INSERT ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.email NOT LIKE '%_@__%.__%' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email no válido';
    END IF;
END //

CREATE TRIGGER trg_usuario_actualizado
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    INSERT INTO log_accion (usuario_id, accion, descripcion)
    VALUES (NEW.id, 'USUARIO_ACTUALIZADO', CONCAT('Usuario actualizado: ', NEW.email));
END //

CREATE TRIGGER trg_usuario_desactivado
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    IF OLD.activo = TRUE AND NEW.activo = FALSE THEN
        INSERT INTO log_accion (usuario_id, accion, descripcion)
        VALUES (NEW.id, 'USUARIO_DESACTIVADO', 'Usuario desactivado del sistema');
    END IF;
END //

-- TRIGGERS PARA SEGUIMIENTO

CREATE TRIGGER trg_seguimiento_creado
AFTER INSERT ON seguimiento_denuncia
FOR EACH ROW
BEGIN
    INSERT INTO log_accion (admin_id, accion, descripcion)
    VALUES (NEW.admin_id, 'SEGUIMIENTO_REGISTRADO', CONCAT('Seguimiento en denuncia #', NEW.denuncia_id));
END //

-- TRIGGERS PARA ATENCIONES

CREATE TRIGGER trg_atencion_registrada
AFTER INSERT ON atenciones
FOR EACH ROW
BEGIN
    INSERT INTO log_accion (admin_id, accion, descripcion)
    VALUES (NEW.admin_id, 'ATENCION_REGISTRADA', CONCAT('Atención para denuncia #', NEW.denuncia_id));
END //

CREATE TRIGGER trg_validar_modalidad_atencion
BEFORE INSERT ON atenciones
FOR EACH ROW
BEGIN
    IF NEW.modalidad NOT IN ('virtual', 'presencial', 'telefonica', 'email') THEN
        SET NEW.modalidad = 'virtual';
    END IF;
END //

-- TRIGGERS PARA ARCHIVOS

CREATE TRIGGER trg_archivo_agregado
AFTER INSERT ON archivos
FOR EACH ROW
BEGIN
    INSERT INTO log_accion (accion, descripcion)
    VALUES ('ARCHIVO_SUBIDO', CONCAT('Archivo agregado a denuncia #', NEW.denuncia_id, ': ', NEW.nombre));
END //

CREATE TRIGGER trg_archivo_eliminado
AFTER DELETE ON archivos
FOR EACH ROW
BEGIN
    INSERT INTO log_accion (accion, descripcion)
    VALUES ('ARCHIVO_ELIMINADO', CONCAT('Archivo eliminado de denuncia #', OLD.denuncia_id, ': ', OLD.nombre));
END //

-- TRIGGERS PARA ORIENTACIÓN

CREATE TRIGGER trg_orientacion_enviada
AFTER INSERT ON orientacion
FOR EACH ROW
BEGIN
    INSERT INTO log_accion (usuario_id, accion, descripcion)
    VALUES (NEW.usuario_id, 'ORIENTACION_ENVIADA', LEFT(NEW.mensaje, 50));
END //

CREATE TRIGGER trg_orientacion_leida
AFTER UPDATE ON orientacion
FOR EACH ROW
BEGIN
    IF OLD.leido = FALSE AND NEW.leido = TRUE THEN
        INSERT INTO log_accion (usuario_id, accion, descripcion)
        VALUES (NEW.usuario_id, 'ORIENTACION_LEIDA', CONCAT('Orientación #', NEW.id, ' leída'));
    END IF;
END //

-- TRIGGERS PARA ADMINISTRADORES

CREATE TRIGGER trg_admin_creado
AFTER INSERT ON administradores
FOR EACH ROW
BEGIN
    INSERT INTO log_accion (admin_id, accion, descripcion)
    VALUES (NEW.id, 'ADMIN_CREADO', CONCAT('Nuevo administrador: ', NEW.email));
END //

CREATE TRIGGER trg_validar_email_admin
BEFORE INSERT ON administradores
FOR EACH ROW
BEGIN
    IF NEW.email NOT LIKE '%_@__%.__%' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email de administrador no válido';
    END IF;
END //

-- TRIGGERS PARA RECURSOS

CREATE TRIGGER trg_recurso_creado
AFTER INSERT ON recursos
FOR EACH ROW
BEGIN
    INSERT INTO log_accion (accion, descripcion)
    VALUES ('RECURSO_CREADO', CONCAT('Nuevo recurso: ', NEW.titulo));
END //

CREATE TRIGGER trg_recurso_asignado
AFTER INSERT ON denuncia_recurso
FOR EACH ROW
BEGIN
    INSERT INTO log_accion (accion, descripcion)
    VALUES ('RECURSO_ASIGNADO', CONCAT('Recurso asignado a denuncia #', NEW.denuncia_id));
END //

DELIMITER ;
