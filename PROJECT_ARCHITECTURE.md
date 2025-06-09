# 🏗️ ARQUITECTURA DEL PROYECTO iTaxCix

## 📁 ESTRUCTURA DE DIRECTORIOS

```
PanelWeb/
├── 📁 assets/
│   ├── 📁 css/                    → Estilos y diseño visual
│   │   ├── ControlAdmision.css
│   │   ├── login.css
│   │   ├── sidebar.css
│   │   └── profile.css
│   │
│   ├── 📁 js/                     → Lógica JavaScript
│   │   ├── 📁 api/               → Capa de API
│   │   │   ├── 📁 models/        → Modelos de datos
│   │   │   │   └── conductor.js
│   │   │   └── 📁 services/      → Servicios de API
│   │   │       ├── login-service.js
│   │   │       ├── conductor-service.js
│   │   │       ├── password-recovery-service.js
│   │   │       └── profile-service.js
│   │   │
│   │   ├── 📁 ui/                → Interfaz de usuario
│   │   │   └── 📁 controllers/   → Controladores UI
│   │   │       ├── login-controller.js
│   │   │       ├── sidebar-controller.js
│   │   │       ├── profile-controller.js
│   │   │       ├── ui-controller.js
│   │   │       └── app-initializer.js
│   │   │
│   │   └── 📁 utils/             → Utilidades generales
│   │       ├── auth-checker.js
│   │       └── route-guard.js
│   │
│   └── 📁 images/                → Recursos gráficos
│
├── 📁 pages/                     → Páginas de la aplicación
│   └── 📁 usuarios/
│       └── ControlAdmisionConductores.html
│
├── 📄 index.html                 → Página principal
├── 📄 ssl-diagnostic.html        → Herramienta de diagnóstico
└── 📄 DESIGN_PATTERNS_DOCUMENTATION.md
```

## 🔄 FLUJO DE DATOS

```
👤 Usuario
    ↓
📱 Vista (HTML/CSS)
    ↓
🎮 Controlador (UI Controllers)
    ↓
🔧 Servicio (API Services)
    ↓
📊 Modelo (Data Models)
    ↓
🌐 API Externa
```

## 🧩 COMPONENTES PRINCIPALES

### **1. Capa de Presentación**
- **HTML Templates**: Estructura visual
- **CSS Styles**: Diseño y responsive
- **UI Controllers**: Manejo de interacciones

### **2. Capa de Lógica de Negocio**
- **Services**: Comunicación con API
- **Models**: Representación de datos
- **Utils**: Funciones auxiliares

### **3. Capa de Datos**
- **API Endpoints**: Comunicación externa
- **Local Storage**: Datos locales
- **Session Management**: Gestión de sesiones

## 🔐 FLUJO DE AUTENTICACIÓN

```
Login Request → LoginController → LoginService → API → Token Storage → Route Protection
```

## 📈 ESCALABILIDAD

La arquitectura permite:
- ✅ Agregar nuevos módulos fácilmente
- ✅ Implementar nuevos servicios
- ✅ Extender funcionalidades existentes
- ✅ Mantener código limpio y organizado
