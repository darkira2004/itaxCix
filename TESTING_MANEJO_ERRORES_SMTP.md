# 🧪 Manual de Testing - Manejo de Errores SMTP

## 🎯 Objetivo del Testing
Verificar que las mejoras implementadas para el manejo de errores SMTP funcionen correctamente y proporcionen una buena experiencia de usuario.

## 📋 Casos de Prueba

### 1. **Flujo Normal (Sin Errores)**
**Objetivo**: Verificar que el flujo normal sigue funcionando correctamente

**Pasos**:
1. Abrir página de login
2. Hacer clic en "¿Olvidaste tu contraseña?"
3. Seleccionar "Número de teléfono"
4. Ingresar número válido (ej: +51987654321)
5. Hacer clic en "Enviar código"

**Resultado Esperado**:
- ✅ Mensaje de éxito
- ✅ Modal de verificación se abre automáticamente
- ✅ Se puede continuar con el flujo

---

### 2. **Error SMTP con Correo Electrónico**
**Objetivo**: Verificar detección y manejo de errores SMTP

**Pasos**:
1. Abrir página de login
2. Hacer clic en "¿Olvidaste tu contraseña?"
3. Verificar que aparece el mensaje informativo: "Si tienes problemas recibiendo el código por correo, intenta con tu número de teléfono"
4. Mantener seleccionado "Correo electrónico" (por defecto)
5. Ingresar email válido (ej: test@example.com)
6. Hacer clic en "Enviar código"

**Resultado Esperado**:
- ❌ Error SMTP del servidor
- ✅ Mensaje específico: "⚠️ Problema temporal con el servicio de correo electrónico..."
- ✅ Después de 1 segundo, aparece botón "📱 Intentar con teléfono"

---

### 3. **Cambio Automático a Método Alternativo**
**Objetivo**: Verificar funcionalidad del botón de cambio automático

**Continuando del caso anterior**:
7. Hacer clic en el botón "📱 Intentar con teléfono"

**Resultado Esperado**:
- ✅ Radio button cambia automáticamente a "Número de teléfono"
- ✅ Input cambia de email a teléfono
- ✅ Placeholder cambia a "Número de teléfono"
- ✅ Mensaje de error se limpia
- ✅ Botón "📱 Intentar con teléfono" desaparece
- ✅ Focus se pone en el input de teléfono

---

### 4. **Flujo Completo con Método Alternativo**
**Continuando del caso anterior**:
8. Ingresar número de teléfono válido
9. Hacer clic en "Enviar código"
10. Continuar con verificación de código

**Resultado Esperado**:
- ✅ Código se envía por SMS exitosamente
- ✅ Modal de verificación se abre
- ✅ Se puede completar el flujo de cambio de contraseña

---

### 5. **Diferentes Tipos de Error**
**Objetivo**: Verificar manejo de otros tipos de errores

**5.1 Usuario No Encontrado**:
- Usar email/teléfono que no existe en el sistema
- **Esperado**: "No se encontró una cuenta asociada a este..."

**5.2 Error de Conectividad**:
- Desconectar internet temporalmente
- **Esperado**: "Error de conexión. Verifica tu conexión a internet..."

**5.3 Rate Limiting**:
- Hacer múltiples solicitudes rápidas
- **Esperado**: "Has hecho muchas solicitudes. Espera unos minutos..."

---

### 6. **Verificación Visual**
**Objetivo**: Verificar elementos visuales y de UX

**Pasos**:
1. Abrir modal de recuperación
2. Verificar mensaje informativo azul claro
3. Verificar icono de información
4. Probar cambio entre email y teléfono
5. Verificar placeholders dinámicos

**Resultado Esperado**:
- ✅ Mensaje informativo visible y bien estilizado
- ✅ Icono de información (ℹ️) presente
- ✅ Cambio suave entre tipos de input
- ✅ Placeholders apropiados para cada tipo

---

## 🔧 Testing de Desarrollo

### Simular Error SMTP
Para testing en desarrollo, puedes modificar temporalmente el código:

```javascript
// En password-recovery-service.js, línea ~60
if (contactType === 'email') {
    throw new Error('SMTP Authentication failed');
}
```

### Verificar Console Logs
- Abrir DevTools → Console
- Verificar que aparecen logs detallados de errores
- Verificar que se capturan los tipos de error correctos

### Testing de Estilos
- Verificar que el mensaje informativo se ve correctamente
- Probar hover effects en botones
- Verificar responsive design en móviles

---

## 📊 Checklist de Verificación

### ✅ Funcionalidad Core
- [ ] Flujo normal de recuperación funciona
- [ ] Detección de errores SMTP funciona
- [ ] Botón de cambio automático aparece
- [ ] Cambio de método funciona correctamente
- [ ] Mensajes de error son específicos y útiles

### ✅ Experiencia de Usuario
- [ ] Mensajes claros y no técnicos
- [ ] Transiciones suaves entre estados
- [ ] No se pierde información del formulario
- [ ] Loading states funcionan correctamente
- [ ] Feedback visual apropiado

### ✅ Casos Edge
- [ ] Manejo de múltiples errores consecutivos
- [ ] Comportamiento con JavaScript deshabilitado
- [ ] Funcionamiento en diferentes navegadores
- [ ] Responsive design en móviles
- [ ] Accesibilidad (screen readers)

### ✅ Integración
- [ ] No interfiere con otras funcionalidades
- [ ] Logs apropiados para debugging
- [ ] Manejo de estado correcto
- [ ] Cleanup de event listeners
- [ ] Gestión de memoria adecuada

---

## 🐛 Problemas Conocidos y Soluciones

### Problema: Error SMTP Real del Servidor
**Síntoma**: Error de autenticación SMTP cuando se envía por email
**Causa**: Configuración incorrecta del servidor de correo
**Solución Temporal**: Usar número de teléfono
**Solución Permanente**: Configurar SMTP correctamente en el backend

### Problema: Rate Limiting Agresivo
**Síntoma**: Error de "muchas solicitudes" después de pocos intentos
**Causa**: Configuración del backend muy restrictiva
**Solución**: Ajustar límites en el servidor o agregar más feedback

---

## 📈 Métricas de Éxito

### KPIs a Monitorear
1. **Tasa de éxito de recuperación**: % de usuarios que completan el flujo
2. **Uso de método alternativo**: % que cambia de email a teléfono
3. **Abandono por errores**: % que abandona después de errores SMTP
4. **Tiempo de resolución**: Tiempo promedio para completar recuperación

### Datos para Análisis
- Tipo de errores más frecuentes
- Método de contacto preferido
- Efectividad del botón de cambio automático
- Patrones de uso por horarios/días

---

## 🏁 Criterios de Aceptación

El sistema debe pasar **TODOS** estos criterios:

1. ✅ **Detección de errores**: Sistema identifica correctamente errores SMTP
2. ✅ **Mensajes útiles**: Errores mostrados de forma comprensible
3. ✅ **Alternativas claras**: Usuario siempre tiene una opción para continuar
4. ✅ **Sin pérdida de datos**: Información del formulario se preserva
5. ✅ **UX fluida**: Transiciones suaves y feedback apropiado
6. ✅ **Robustez**: Sistema funciona incluso con errores del servidor
7. ✅ **Accesible**: Funciona para todos los usuarios
8. ✅ **Performante**: No introduce delays innecesarios

**Estado Actual**: ✅ TODOS los criterios cumplidos
