# 🚀 Guía de Despliegue en Vercel - Proyectos Separados

Este proyecto está dividido en 3 carpetas independientes que pueden desplegarse por separado en Vercel:

- **`backend/`** - API Node.js/Express con MongoDB
- **`frontend angular/`** - Frontend con Angular 
- **`frontend react/`** - Frontend con React + Vite

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com)
2. Repositorio Git (GitHub, GitLab, o Bitbucket)
3. Credenciales de MongoDB Atlas
4. Node.js v18+ instalado

## 🔧 Configuración Local

### 1. Backend

```bash
cd backend
npm install
# Crear archivo .env (ya existe con credenciales)
npm run start
```

El backend se ejecutará en `http://localhost:3000`

### 2. Frontend Angular

```bash
cd "frontend angular"
npm install
npm start
```

Se ejecutará en `http://localhost:4200` (o un puerto disponible)

### 3. Frontend React

```bash
cd "frontend react"
npm install
npm run dev
```

Se ejecutará en `http://localhost:5173`

## 🌐 Despliegue en Vercel

### Opción A: Tres Repositorios Separados (Recomendado)

Separa cada carpeta en su propio repositorio:

```bash
# Backend
cd backend
git init
git remote add origin https://github.com/tu-usuario/mana-market-backend.git
git push -u origin main

# Frontend Angular
cd "frontend angular"
git init
git remote add origin https://github.com/tu-usuario/mana-market-frontend-angular.git
git push -u origin main

# Frontend React
cd "frontend react"
git init
git remote add origin https://github.com/tu-usuario/mana-market-frontend-react.git
git push -u origin main
```

### Opción B: Un Repositorio con Monorepo

Mejor para mantener sincronizados los proyectos:

```bash
git init
git add .
git commit -m "Initial commit with all projects"
git remote add origin https://github.com/tu-usuario/mana-market.git
git push -u origin main
```

## 📦 Deploying Backend

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"Add New Project"**
3. Selecciona tu repositorio del backend
4. **Configuración importante:**
   - **Root Directory**: `/backend` (si usas monorepo) o `/` (si es repo separado)
   - **Framework**: Node.js
   - **Build Command**: Dejar vacío (no se necesita build)
   - **Output Directory**: Dejar vacío

5. **Variables de Entorno** (Environment Variables):
   ```
   MONGODB_URI=mongodb+srv://hecmardom_db_user:dyGkaFn7LiHdVjEc@manamarket.3lsst8d.mongodb.net/ManaMarket?retryWrites=true&w=majority&appName=ManaMarket
   PORT=3000
   ```

6. Haz clic en **"Deploy"**

**URL del Backend**: `https://tu-proyecto-backend.vercel.app`

## 🎨 Deploying Frontend Angular

1. **New Project** en Vercel
2. Selecciona tu repositorio del frontend Angular
3. **Configuración:**
   - **Root Directory**: `/` (o `frontend angular` si monorepo)
   - **Framework**: Angular
   - **Build Command**: `ng build` (Vercel lo detecta automáticamente)
   - **Output Directory**: `dist/frontend` o `dist/mana-market` (Vercel lo detecta)

4. **Variables de Entorno**:
   ```
   ANGULAR_APP_API_URL=https://tu-proyecto-backend.vercel.app/api/v1/cards/
   ```

5. Haz clic en **"Deploy"**

**URL del Frontend Angular**: `https://tu-proyecto-angular.vercel.app`

## ⚛️ Deploying Frontend React

1. **New Project** en Vercel
2. Selecciona tu repositorio del frontend React
3. **Configuración:**
   - **Root Directory**: `/` (o `frontend react` si monorepo)
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Variables de Entorno**:
   ```
   VITE_API_URL=https://tu-proyecto-backend.vercel.app/api/v1/cards/
   ```

5. Haz clic en **"Deploy"**

**URL del Frontend React**: `https://tu-proyecto-react.vercel.app`

## ✅ Verificación Post-Despliegue

### 1. Backend
```bash
curl https://tu-proyecto-backend.vercel.app/api/v1/cards/
# Debe devolver JSON con las cartas
```

### 2. Frontends
- Abre `https://tu-proyecto-angular.vercel.app/`
- Abre `https://tu-proyecto-react.vercel.app/`
- Verifica que carguen las cartas correctamente

## 🔗 Configurar Dominios Personalizados

En cada proyecto en Vercel:
1. Ve a **Settings → Domains**
2. Añade tu dominio personalizado
3. Sigue las instrucciones DNS

Ejemplo:
- Backend: `api.tudominio.com`
- Angular: `app-angular.tudominio.com`
- React: `app-react.tudominio.com`

## 🔄 Actualizar Después del Despliegue

Cada vez que hagas push a la rama principal (main), Vercel se redeploy automáticamente.

```bash
git add .
git commit -m "Nueva actualización"
git push origin main
```

## 🐛 Troubleshooting

### Las cartas no cargan
- ✅ Verifica que `MONGODB_URI` esté correcta en el backend
- ✅ Ejecuta `node seed.js` en el backend para poblar datos
- ✅ Verifica que la URL del backend es correcta en los frontends

### CORS errors
- ✅ El backend tiene CORS habilitado (`cors()` en index.js)
- ✅ Verifica que las URLs de frontend estén permitidas

### Build falsa en Angular
- ✅ Asegúrate de que `@angular/cli` esté en `devDependencies`
- ✅ Verifica `angular.json` tenga la configuración correcta

### Errores en Vite/React
- ✅ Verifica `tsconfig.json` y `vite.config.ts`
- ✅ Asegúrate que `package.json` tenga `type: "module"`

## 📱 Acceder a los Proyectos

Después del despliegue:

**Angular**: Acceso general, todas las funcionalidades
**React**: Acceso general, todas las funcionalidades
**Backend API**: `https://tu-proyecto-backend.vercel.app/api/v1/cards/`

---

**¿Preguntas?** Revisa los archivos `vercel.json` en cada carpeta para más configuraciones.
