#!/usr/bin/env node

/**
 * CHECKLIST PRE-DESPLIEGUE
 * Script para verificar que todo esté listo antes de desplegar
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🚀 CHECKLIST DE DESPLIEGUE - VOZSEGURA\n');
console.log('='.repeat(50));

let errores = [];
let advertencias = [];
let pasos = 0;

// 1. Verificar Node.js
try {
    pasos++;
    const nodeVersion = process.version;
    const versionNumber = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (versionNumber >= 16) {
        console.log(`✅ ${pasos}. Node.js ${nodeVersion} (OK)`);
    } else {
        errores.push(`Node.js ${nodeVersion} es muy antiguo. Se requiere >= 16.0.0`);
        console.log(`❌ ${pasos}. Node.js ${nodeVersion} (Actualizar a >= 16)`);
    }
} catch (error) {
    errores.push('No se pudo verificar la versión de Node.js');
}

// 2. Verificar archivo .env
try {
    pasos++;
    if (fs.existsSync('.env')) {
        const envContent = fs.readFileSync('.env', 'utf-8');
        
        // Variables requeridas
        const requiredVars = [
            'DB_HOST',
            'DB_USER',
            'DB_PASSWORD',
            'DB_NAME',
            'JWT_SECRET',
            'PORT'
        ];
        
        const missingVars = requiredVars.filter(v => !envContent.includes(v));
        
        if (missingVars.length === 0) {
            console.log(`✅ ${pasos}. Archivo .env existe con todas las variables`);
        } else {
            errores.push(`Variables faltantes en .env: ${missingVars.join(', ')}`);
            console.log(`❌ ${pasos}. .env incompleto (faltan: ${missingVars.join(', ')})`);
        }
        
        // Verificar JWT_SECRET
        if (envContent.includes('JWT_SECRET=cambiar') || envContent.includes('JWT_SECRET=tu_clave')) {
            advertencias.push('JWT_SECRET debe ser cambiado por una clave segura');
            console.log(`⚠️  JWT_SECRET parece ser un placeholder`);
        }
    } else {
        errores.push('Archivo .env no existe');
        console.log(`❌ ${pasos}. Archivo .env NO EXISTE`);
        console.log(`   💡 Copia .env.example a .env y configúralo`);
    }
} catch (error) {
    errores.push('Error al verificar .env');
}

// 3. Verificar .gitignore
try {
    pasos++;
    if (fs.existsSync('.gitignore')) {
        const gitignoreContent = fs.readFileSync('.gitignore', 'utf-8');
        
        if (gitignoreContent.includes('.env') && gitignoreContent.includes('node_modules')) {
            console.log(`✅ ${pasos}. .gitignore configurado correctamente`);
        } else {
            advertencias.push('.gitignore debe incluir .env y node_modules');
            console.log(`⚠️  ${pasos}. .gitignore puede necesitar actualizarse`);
        }
    } else {
        advertencias.push('No existe archivo .gitignore');
        console.log(`⚠️  ${pasos}. .gitignore no existe`);
    }
} catch (error) {
    advertencias.push('Error al verificar .gitignore');
}

// 4. Verificar dependencias instaladas
try {
    pasos++;
    if (fs.existsSync('node_modules')) {
        console.log(`✅ ${pasos}. Dependencias del backend instaladas`);
    } else {
        errores.push('Dependencias no instaladas');
        console.log(`❌ ${pasos}. Ejecutar: npm install`);
    }
} catch (error) {
    errores.push('Error al verificar node_modules');
}

// 5. Verificar dependencias del cliente
try {
    pasos++;
    if (fs.existsSync('client/node_modules')) {
        console.log(`✅ ${pasos}. Dependencias del frontend instaladas`);
    } else {
        advertencias.push('Dependencias del frontend no instaladas');
        console.log(`⚠️  ${pasos}. Ejecutar: cd client && npm install`);
    }
} catch (error) {
    advertencias.push('Error al verificar client/node_modules');
}

// 6. Verificar estructura de carpetas
try {
    pasos++;
    const requiredFolders = [
        'config',
        'controllers',
        'models',
        'routes',
        'middleware',
        'database',
        'client',
        'uploads'
    ];
    
    const missingFolders = requiredFolders.filter(f => !fs.existsSync(f));
    
    if (missingFolders.length === 0) {
        console.log(`✅ ${pasos}. Estructura de carpetas completa`);
    } else {
        advertencias.push(`Carpetas faltantes: ${missingFolders.join(', ')}`);
        console.log(`⚠️  ${pasos}. Faltan carpetas: ${missingFolders.join(', ')}`);
    }
} catch (error) {
    advertencias.push('Error al verificar estructura');
}

// 7. Verificar archivos críticos
try {
    pasos++;
    const criticalFiles = [
        'server.js',
        'package.json',
        'config/database.js',
        'client/package.json',
        'client/vite.config.js'
    ];
    
    const missingFiles = criticalFiles.filter(f => !fs.existsSync(f));
    
    if (missingFiles.length === 0) {
        console.log(`✅ ${pasos}. Todos los archivos críticos existen`);
    } else {
        errores.push(`Archivos críticos faltantes: ${missingFiles.join(', ')}`);
        console.log(`❌ ${pasos}. Archivos faltantes: ${missingFiles.join(', ')}`);
    }
} catch (error) {
    errores.push('Error al verificar archivos críticos');
}

// 8. Verificar Git
try {
    pasos++;
    if (fs.existsSync('.git')) {
        console.log(`✅ ${pasos}. Repositorio Git inicializado`);
        
        // Verificar si hay cambios sin commit
        try {
            const status = execSync('git status --porcelain', { encoding: 'utf-8' });
            if (status.trim()) {
                advertencias.push('Hay cambios sin commit en Git');
                console.log(`   ⚠️  Hay cambios sin commit`);
            }
        } catch (e) {
            // Ignorar si git no está disponible
        }
    } else {
        advertencias.push('Git no inicializado');
        console.log(`⚠️  ${pasos}. Git no inicializado (ejecutar: git init)`);
    }
} catch (error) {
    advertencias.push('Error al verificar Git');
}

// 9. Verificar puerto disponible
try {
    pasos++;
    const port = process.env.PORT || 3000;
    console.log(`✅ ${pasos}. Puerto configurado: ${port}`);
} catch (error) {
    advertencias.push('Error al verificar puerto');
}

// 10. Verificar README
try {
    pasos++;
    if (fs.existsSync('README.md')) {
        const readmeContent = fs.readFileSync('README.md', 'utf-8');
        if (readmeContent.length > 1000) {
            console.log(`✅ ${pasos}. README.md completo`);
        } else {
            advertencias.push('README.md parece estar incompleto');
            console.log(`⚠️  ${pasos}. README.md parece corto`);
        }
    } else {
        advertencias.push('README.md no existe');
        console.log(`⚠️  ${pasos}. README.md no existe`);
    }
} catch (error) {
    advertencias.push('Error al verificar README');
}

// Resumen final
console.log('\n' + '='.repeat(50));
console.log('\n📊 RESUMEN:\n');

if (errores.length === 0 && advertencias.length === 0) {
    console.log('🎉 ¡TODO LISTO PARA DESPLEGAR!');
    console.log('\n📋 Próximos pasos:');
    console.log('   1. git add .');
    console.log('   2. git commit -m "Ready for deployment"');
    console.log('   3. git push origin main');
    console.log('   4. Seguir guía en DEPLOYMENT.md\n');
    process.exit(0);
} else {
    if (errores.length > 0) {
        console.log('❌ ERRORES CRÍTICOS:');
        errores.forEach((e, i) => console.log(`   ${i + 1}. ${e}`));
        console.log('');
    }
    
    if (advertencias.length > 0) {
        console.log('⚠️  ADVERTENCIAS:');
        advertencias.forEach((a, i) => console.log(`   ${i + 1}. ${a}`));
        console.log('');
    }
    
    if (errores.length > 0) {
        console.log('❌ Corrige los errores críticos antes de desplegar.\n');
        process.exit(1);
    } else {
        console.log('⚠️  Puedes desplegar, pero revisa las advertencias.\n');
        process.exit(0);
    }
}
