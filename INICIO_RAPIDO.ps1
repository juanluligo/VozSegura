# ============================================
# VOZSEGURA - SCRIPT DE INICIO RÁPIDO
# ============================================
# Este script inicia tanto el backend como el frontend

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  VozSegura - Inicio Rápido" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js no encontrado. Por favor instala Node.js primero." -ForegroundColor Red
    exit 1
}

# Verificar MySQL
Write-Host "Verificando MySQL..." -ForegroundColor Yellow
$mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
if ($mysqlService) {
    if ($mysqlService.Status -eq "Running") {
        Write-Host "✓ MySQL está corriendo" -ForegroundColor Green
    } else {
        Write-Host "⚠ MySQL no está corriendo. Intentando iniciar..." -ForegroundColor Yellow
        Start-Service $mysqlService.Name
        Write-Host "✓ MySQL iniciado" -ForegroundColor Green
    }
} else {
    Write-Host "⚠ Servicio MySQL no encontrado. Asegúrate de que MySQL esté instalado." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Iniciando VozSegura..." -ForegroundColor Cyan
Write-Host ""

# Obtener la ruta del script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Iniciar Backend
Write-Host "1. Iniciando Backend (Express)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    npm start
} -ArgumentList $scriptPath

Start-Sleep -Seconds 3
Write-Host "   ✓ Backend iniciado en http://localhost:3000" -ForegroundColor Green

# Iniciar Frontend
Write-Host "2. Iniciando Frontend (React)..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location "$path\client"
    npm run dev
} -ArgumentList $scriptPath

Start-Sleep -Seconds 3
Write-Host "   ✓ Frontend iniciado en http://localhost:5173" -ForegroundColor Green

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  ✓ VozSegura está corriendo" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "URLs disponibles:" -ForegroundColor Cyan
Write-Host "  • Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "  • Backend:   http://localhost:3000" -ForegroundColor White
Write-Host "  • API Test:  http://localhost:3000/api/test/conexion" -ForegroundColor White
Write-Host ""
Write-Host "Credenciales Admin:" -ForegroundColor Cyan
Write-Host "  • Email:    admin@vozsegura.com" -ForegroundColor White
Write-Host "  • Password: Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "Para detener los servicios:" -ForegroundColor Yellow
Write-Host "  Presiona Ctrl+C en las ventanas del terminal" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para abrir el navegador..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Abrir navegador
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✓ Navegador abierto. ¡Disfruta de VozSegura!" -ForegroundColor Green
Write-Host ""
Write-Host "Los servicios seguirán corriendo en segundo plano." -ForegroundColor Yellow
Write-Host "Para ver los logs, revisa las terminales abiertas." -ForegroundColor Yellow
Write-Host ""

# Mantener el script activo
Write-Host "Presiona Ctrl+C para salir..." -ForegroundColor Cyan
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host ""
    Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
    Stop-Job $backendJob, $frontendJob
    Remove-Job $backendJob, $frontendJob
    Write-Host "✓ Servicios detenidos" -ForegroundColor Green
}
