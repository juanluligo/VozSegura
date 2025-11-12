USE vozsegura;

-- Ver todos los usuarios
SELECT id, nombre, email, rol FROM usuarios;

-- Cambiar el usuario recién creado a admin (ajusta el email si usaste otro)
UPDATE usuarios 
SET rol = 'admin' 
WHERE email = 'admin@uniautonoma.edu.co';

-- Verificar el cambio
SELECT id, nombre, email, rol FROM usuarios WHERE email = 'admin@test.com';
