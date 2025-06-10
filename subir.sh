#!/bin/bash

# Script automatizado para subir cambios a GitHub - PanelWeb
# Uso: ./subir.sh [mensaje-opcional]

echo "🚀 INICIANDO SUBIDA AUTOMATICA A GITHUB - PanelWeb"
echo "================================================="

# Verificar si estamos en un repositorio Git
if [ ! -d ".git" ]; then
    echo "❌ ERROR: No se detectó un repositorio Git en este directorio"
    echo "💡 Ejecuta primero: git init"
    exit 1
fi

# Verificar estado del repositorio
echo "📊 Verificando estado del repositorio..."
git status

# Mostrar archivos modificados
echo ""
echo "📝 Archivos modificados detectados:"
git diff --name-only

# Agregar todos los cambios
echo ""
echo "➕ Agregando todos los cambios..."
git add .

# Verificar si hay cambios para commitear
if [ -z "$(git diff --cached --name-only)" ]; then
    echo "✅ No hay cambios nuevos para subir"
    exit 0
fi

# Generar mensaje de commit
if [ -n "$1" ]; then
    COMMIT_MESSAGE="$1"
else
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    COMMIT_MESSAGE="Actualización automática - $TIMESTAMP"
fi

# Realizar commit
echo ""
echo "📦 Realizando commit con mensaje: '$COMMIT_MESSAGE'"
git commit -m "$COMMIT_MESSAGE"

# Verificar si el commit fue exitoso
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Falló el commit"
    exit 1
fi

# Obtener rama actual
CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Rama actual: $CURRENT_BRANCH"

# Intentar push
echo ""
echo "⬆️ Subiendo cambios a GitHub..."
git push origin "$CURRENT_BRANCH"

# Verificar si el push fue exitoso
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡ÉXITO! Cambios subidos correctamente a GitHub"
    echo "🔗 Repositorio actualizado en la rama: $CURRENT_BRANCH"
else
    echo ""
    echo "❌ ERROR: Falló la subida a GitHub"
    echo "💡 Posibles soluciones:"
    echo "   - Verifica tu conexión a internet"
    echo "   - Verifica que tengas permisos en el repositorio"
    echo "   - Ejecuta: git remote -v para verificar el origen"
    exit 1
fi

# Mostrar log de los últimos commits
echo ""
echo "📜 Últimos commits:"
git log --oneline -5

echo ""
echo "🎉 PROCESO COMPLETADO"
echo "================================================="
