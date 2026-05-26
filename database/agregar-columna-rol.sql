-- Agregar columna 'rol' a la tabla usuarios

USE vozsegura;

-- Agregar la columna rol (sin IF NOT EXISTS para MySQL 8.0)
ALTER TABLE usuarios 
ADD COLUMN rol VARCHAR(20) DEFAULT 'estudiante';

-- Ver la estructura actualizada
DESCRIBE usuarios;
