#!/usr/bin/env node

/**
 * Script de Verificación Pre-Despliegue para Vercel
 * Verifica que todo esté listo antes de desplegar a producción
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando proyecto antes del despliegue a Vercel...\n');

let errors = [];
let warnings = [];
let success = [];

// 1. Verificar archivos esenciales
console.log('📁 Verificando archivos esenciales...');
const requiredFiles = [
    'server.js',
    'package.json',
    '.env',
    'vercel.json',
    '.vercelignore',
    'client/package.json',
    'client/vite.config.js'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, '..', file))) {
        success.push(`✅ ${file} encontrado`);
    } else {
        errors.push(`❌ ${file} no encontrado`);
    }
});

// 2. Verificar .gitignore
console.log('\n🔒 Verificando .gitignore...');
const gitignorePath = path.join(__dirname, '..', '.gitignore');
if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const criticalEntries = ['.env', 'node_modules', 'uploads'];
    
    criticalEntries.forEach(entry => {
        if (gitignoreContent.includes(entry)) {
            success.push(`✅ .gitignore incluye: ${entry}`);
        } else {
            warnings.push(`⚠️  .gitignore debería incluir: ${entry}`);
        }
    });
} else {
    errors.push('❌ .gitignore no encontrado');
}

// 3. Verificar que .env no esté en Git
console.log('\n🔐 Verificando seguridad...');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    success.push('✅ .env existe localmente');
    warnings.push('⚠️  IMPORTANTE: Asegúrate de configurar variables de entorno en Vercel Dashboard');
} else {
    warnings.push('⚠️  .env no encontrado - asegúrate de configurar variables en Vercel');
}

// 4. Verificar package.json scripts
console.log('\n📦 Verificando scripts de package.json...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const requiredScripts = ['start', 'build', 'vercel-build'];
    
    requiredScripts.forEach(script => {
        if (packageJson.scripts && packageJson.scripts[script]) {
            success.push(`✅ Script "${script}" configurado`);
        } else {
            errors.push(`❌ Script "${script}" no encontrado en package.json`);
        }
    });
}

// 5. Verificar estructura del cliente
console.log('\n🎨 Verificando cliente (React + Vite)...');
const clientDirs = ['client/src', 'client/public'];
clientDirs.forEach(dir => {
    if (fs.existsSync(path.join(__dirname, '..', dir))) {
        success.push(`✅ ${dir} encontrado`);
    } else {
        errors.push(`❌ ${dir} no encontrado`);
    }
});

// 6. Verificar build del cliente
console.log('\n🏗️  Verificando build del cliente...');
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
    success.push('✅ client/dist existe (build previo encontrado)');
} else {
    warnings.push('⚠️  client/dist no existe - ejecuta "npm run build" antes de desplegar');
}

// Resumen
console.log('\n' + '='.repeat(60));
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(60));

if (success.length > 0) {
    console.log('\n✅ EXITOSO:');
    success.forEach(msg => console.log('  ' + msg));
}

if (warnings.length > 0) {
    console.log('\n⚠️  ADVERTENCIAS:');
    warnings.forEach(msg => console.log('  ' + msg));
}

if (errors.length > 0) {
    console.log('\n❌ ERRORES:');
    errors.forEach(msg => console.log('  ' + msg));
}

console.log('\n' + '='.repeat(60));

if (errors.length > 0) {
    console.log('❌ HAY ERRORES QUE DEBEN SER CORREGIDOS ANTES DE DESPLEGAR');
    console.log('\n📖 Consulta DEPLOY_VERCEL.md para más información');
    process.exit(1);
} else if (warnings.length > 0) {
    console.log('⚠️  HAY ADVERTENCIAS - Revísalas antes de continuar');
    console.log('\n📖 Consulta DEPLOY_VERCEL.md para más información');
} else {
    console.log('✅ ¡TODO LISTO PARA DESPLEGAR A VERCEL!');
    console.log('\n📖 Sigue las instrucciones en DEPLOY_VERCEL.md');
}

console.log('\n🚀 Próximos pasos:');
console.log('1. git add .');
console.log('2. git commit -m "Ready for Vercel deployment"');
console.log('3. git push');
console.log('4. Ir a https://vercel.com e importar el proyecto');
console.log('5. Configurar variables de entorno en Vercel');
console.log('6. Deploy! 🎉\n');
