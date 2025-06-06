# 🧪 Manual de Testing - Recuperación de Contraseñas

## ⚡ **Testing Rápido**

### **1. Abrir la Aplicación**
```
file:///c:/PanelWeb/index.html
```

### **2. Flujo Completo de Testing**

#### **Paso 1: Iniciar Recuperación**
1. ✅ Hacer clic en "¿Olvidaste tu contraseña?"
2. ✅ Verificar que se abre el modal de recuperación
3. ✅ Probar cambio entre Email/Teléfono
4. ✅ Ingresar email válido: `test@example.com`
5. ✅ Hacer clic en "Enviar código"

#### **Paso 2: Verificar Código**
1. ✅ Verificar que se abre el modal de verificación
2. ✅ Ver que muestra el email ingresado
3. ✅ Ingresar código mock: `ABC123`
4. ✅ Hacer clic en "Verificar código"

#### **Paso 3: Cambiar Contraseña**
1. ✅ Verificar que se abre el modal de nueva contraseña
2. ✅ Ingresar contraseña débil y ver validaciones en rojo
3. ✅ Ingresar contraseña fuerte: `MiNueva@Contraseña123`
4. ✅ Repetir la misma contraseña
5. ✅ Verificar que todos los requisitos están en verde
6. ✅ Hacer clic en "Cambiar contraseña"
7. ✅ Verificar mensaje de éxito

## 🔍 **Casos de Prueba Específicos**

### **Validaciones de Email**
- ✅ Email inválido: `test` → Debe mostrar error
- ✅ Email válido: `test@example.com` → Debe funcionar

### **Validaciones de Teléfono**
- ✅ Teléfono inválido: `123` → Debe mostrar error
- ✅ Teléfono válido: `987654321` → Debe funcionar

### **Validaciones de Código**
- ✅ Código vacío → Debe mostrar error
- ✅ Código inválido: `wrong` → Debe mostrar error del servidor
- ✅ Código válido: `ABC123` → Debe continuar al siguiente paso

### **Validaciones de Contraseña**
- ❌ `123` → Falta mayúscula, letra, carácter especial
- ❌ `password` → Falta mayúscula, número, carácter especial
- ❌ `Password123` → Falta carácter especial
- ✅ `MiNueva@Contraseña123` → Cumple todos los requisitos

### **Coincidencia de Contraseñas**
- ❌ Nueva: `Password@123`, Repetir: `Different@123` → Error
- ✅ Nueva: `Password@123`, Repetir: `Password@123` → Válido

## 🎯 **Estados Visuales a Verificar**

### **Indicadores de Carga**
- ✅ Botón "Enviando..." durante solicitud de código
- ✅ Botón "Verificando..." durante verificación
- ✅ Botón "Cambiando..." durante cambio de contraseña

### **Estados de Validación**
- ✅ Requisitos en gris (inicial)
- ✅ Requisitos en rojo (no cumplido)
- ✅ Requisitos en verde (cumplido)
- ✅ Border verde en input de repetir contraseña (coincide)
- ✅ Border rojo en input de repetir contraseña (no coincide)

### **Mensajes de Error/Éxito**
- ✅ Mensajes rojos para errores
- ✅ Mensajes verdes para éxito
- ✅ Mensajes se ocultan automáticamente

## 🔧 **Debug en Consola**

### **Logs Esperados**
```
DOM cargado, inicializando PasswordRecoveryController...
Inicializando PasswordRecoveryController...
Elementos encontrados: {forgotPasswordBtn: true, ...}
Configurando eventos de recuperación de contraseña...
Añadiendo event listener al botón de contraseña olvidada
PasswordRecoveryController inicializado exitosamente
```

### **Al hacer clic en "Olvidaste tu contraseña"**
```
Click en botón de contraseña olvidada detectado
Intentando abrir modal de recuperación...
Modal encontrado, mostrando...
```

### **Al enviar código**
```
[MOCK] Solicitando recuperación para email: test@example.com
[MOCK] Código generado: ABC123 para usuario: 12345
```

## 🚨 **Errores Comunes y Soluciones**

### **Modal no se abre**
- Verificar que todos los scripts estén cargados
- Revisar errores en consola
- Verificar que los IDs de elementos coincidan

### **Servicio no responde**
- El mock service debería funcionar siempre
- Si usa API real, verificar conectividad
- Revisar logs de red en DevTools

### **Estilos rotos**
- Verificar que `password-recovery.css` esté cargado
- Verificar que Font Awesome esté disponible
- Probar en modo incógnito

## 📋 **Checklist Final**

- [ ] Modal de recuperación se abre correctamente
- [ ] Cambio entre Email/Teléfono funciona
- [ ] Validaciones de formato funcionan
- [ ] Modal de verificación se abre tras enviar código
- [ ] Contador de reenvío funciona (60s)
- [ ] Modal de cambio de contraseña se abre tras verificar
- [ ] Validaciones de contraseña en tiempo real funcionan
- [ ] Toggle de visibilidad de contraseñas funciona
- [ ] Validación de coincidencia funciona
- [ ] Proceso completo termina con éxito
- [ ] Todos los estilos se ven correctamente
- [ ] Responsive design funciona en móvil

---

**Si todos los puntos del checklist pasan, la funcionalidad está completamente operativa.** ✅
