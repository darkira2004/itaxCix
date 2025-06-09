const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3001;

// Configuración de CORS
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'null' // Para archivos locales
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
    console.log(`🔄 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('📋 Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('📦 Body:', req.body);
    }
    next();
});

// Configuración del proxy para la API
const apiProxy = createProxyMiddleware({
    target: 'https://taximeter-api-production.up.railway.app',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api' // mantener /api en la ruta
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log('🚀 Proxy request to:', proxyReq.getHeader('host') + proxyReq.path);
        
        // Agregar headers necesarios
        proxyReq.setHeader('Accept', 'application/json');
        proxyReq.setHeader('Content-Type', 'application/json');
        
        // Pasar el token de autorización si existe
        if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers.authorization);
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log('📡 Proxy response:', proxyRes.statusCode, proxyRes.statusMessage);
        console.log('📄 Response headers:', proxyRes.headers);
        
        // Agregar headers CORS a la respuesta
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
    },
    onError: (err, req, res) => {
        console.error('❌ Proxy error:', err.message);
        res.status(500).json({
            error: 'Proxy Error',
            message: err.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Ruta del proxy para la API
app.use('/api', apiProxy);

// Ruta de salud del proxy
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Proxy server is running',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Ruta para servir archivos estáticos (opcional)
app.use(express.static(path.join(__dirname)));

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('💥 Server error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`🔗 API requests will be proxied to: https://taximeter-api-production.up.railway.app`);
    console.log(`🌐 CORS enabled for multiple origins`);
    console.log(`📋 Health check available at: http://localhost:${PORT}/health`);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down proxy server...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down proxy server...');
    process.exit(0);
});
