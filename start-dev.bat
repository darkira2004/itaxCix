@echo off
echo 🚀 Iniciando entorno de desarrollo PanelWeb...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado.
    echo 📥 Por favor, instala Node.js desde https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

REM Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencias ya instaladas
)

echo.
echo 🌐 Iniciando servidor proxy CORS...
echo 📋 El servidor estará disponible en: http://localhost:3001
echo 🔗 API será proxificada desde: https://149.130.161.148/api/v1
echo.
echo 💡 Para detener el servidor, presiona Ctrl+C
echo.

node proxy-server.js
