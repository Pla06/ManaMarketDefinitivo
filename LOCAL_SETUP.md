# 🎮 Instrucciones para Ejecutar el Proyecto Localmente

## ✅ Lo que se ha arreglado:

1. **Base de datos**: Seed.js corregido para conectarse correctamente
2. **Backend**: Devuelve 20 cartas desde MongoDB correctamente
3. **Frontend Angular**: Mejorado manejo de carga y errores
4. **Frontend React**: Configurado para buscar datos en backend
5. **URLs dinámicas**: Ambos frontends detectan localhost vs producción
6. **Archivo .env**: Creado para fácil configuración

## 🚀 Para Ejecutar Localmente:

### Terminal 1: Backend
```bash
cd backend
npm install  # Solo la primera vez
npm run start
# El backend estará disponible en: http://localhost:3000/api/v1/cards/
```

### Terminal 2: Frontend Angular
```bash
cd "frontend angular"
npm install  # Solo la primera vez
npm start
# Angular estará disponible en: http://localhost:4200
```

### Terminal 3: Frontend React
```bash
cd "frontend react"
npm install  # Solo la primera vez
npm run dev
# React estará disponible en: http://localhost:5173
```

### Terminal 4: Verificar datos (opcional)
```bash
curl http://localhost:3000/api/v1/cards/
# Debe devolver JSON con 20 cartas
```

## 📦 Si la base de datos está vacía:
```bash
cd backend
node seed.js
# Esto poblará la BD con 20 cartas de ejemplo
```

## 🔍 Verificación:

✅ **Backend funcionando**: Abre http://localhost:3000/api/v1/cards/ en el navegador
✅ **Angular funcionando**: Abre http://localhost:4200 - deberías ver las cartas
✅ **React funcionando**: Abre http://localhost:5173 - deberías ver las mismas cartas

## 🌐 URLs en Desarrollo:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Backend API | http://localhost:3000/api/v1/cards/ | Endpoint de cartas |
| Angular | http://localhost:4200 | Frontend con Angular |
| React | http://localhost:5173 | Frontend con React (Vite) |

## 🆘 Si algo falla:

### Las cartas no cargan en los frontends
```bash
# Verifica que el backend esté devolviendo datos:
curl http://localhost:3000/api/v1/cards/

# Si devuelve status: [], entonces la BD está vacía:
cd backend
node seed.js

# Luego recarga los frontends (F5)
```

### Puerto ya en uso
Si el puerto está ocupado (por ejemplo, Angular querría puerto 4200 pero está ocupado), simplemente usa el que Vercel te proporciona. Los frontends ahora se configuran automáticamente.

### Errores de CORS
✅ CORS ya está habilitado en el backend
✅ Verifica que los frontends apunten a la URL correcta del backend

---

## 📝 Próximos Pasos para Producción:

Ver `DEPLOYMENT_GUIDE.md` para instrucciones de despliegue en Vercel
