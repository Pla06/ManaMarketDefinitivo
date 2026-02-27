# Mana Market - Frontend React con TypeScript

Este es un proyecto React con TypeScript que replica exactamente la funcionalidad del frontend Angular de Mana Market.

## 🎴 Características

- **Catálogo de cartas**: Explora todas las cartas disponibles con filtros avanzados
- **Gestión de favoritos**: Añade y gestiona tus cartas favoritas
- **Carrito de compras**: Añade cartas al carrito y realiza compras
- **CRUD de cartas**: Crea, edita y elimina cartas del catálogo
- **Almacenamiento local**: Los favoritos y carrito se guardan en localStorage
- **Diseño temático**: Tema de Magic: The Gathering con colores y estilos personalizados
- **Interfaz responsiva**: Funciona perfectamente en dispositivos móviles y desktop

## 🛠️ Tecnologías

- **React 18** - Framework de UI
- **TypeScript** - Tipos estáticos
- **React Router v6** - Enrutamiento
- **Axios** - Cliente HTTP
- **SweetAlert2** - Notificaciones
- **Bootstrap 5** - Framework CSS
- **Vite** - Build tool

## 📁 Estructura del Proyecto

```
src/
├── common/
│   └── interfaces.ts         # Tipos e interfaces
├── services/
│   ├── cardService.ts        # API de cartas
│   ├── cartStateService.ts   # Estado del carrito
│   └── favoritesService.ts   # Estado de favoritos
├── components/
│   ├── navbar/               # Barra de navegación
│   ├── footer/               # Pie de página
│   ├── home/                 # Página de inicio
│   ├── card/
│   │   ├── CardList/         # Listado de cartas
│   │   ├── CardDetail/       # Detalle de carta
│   │   └── CardEdit/         # Crear/editar carta
│   ├── cart/
│   │   └── CartPage/         # Página del carrito
│   └── favorites/            # Página de favoritos
├── App.tsx                   # Componente raíz
├── main.tsx                  # Entrada de la app
├── index.css                 # Estilos globales
└── App.css                   # Estilos de App
```

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview de la build
npm run preview
```

## ⚙️ Configuración

La aplicación se conecta al backend en `http://localhost:3000/api/v1/cards/`

Asegúrate de que:
1. El backend esté ejecutándose en `http://localhost:3000`
2. Los endpoints están disponibles y funcionan correctamente

## 📋 Componentes Principales

### Home
- Muestra cartas recientes
- Preview del carrito
- Preview de favoritos
- Estadísticas rápidas

### CardList
- Listado completo de cartas
- Filtros por:
  - Colección/Edición
  - Condición/Estado
  - Rango de precios
- Ordenamiento por precio (ascendente/descendente)
- Paginación
- Marcado de favoritos

### CardDetail
- Detalles completos de la carta
- Navegación entre cartas (anterior/siguiente)
- Botones para:
  - Añadir al carrito
  - Marcar como favorito
  - Editar la carta
  - Volver al listado

### CardEdit
- Formulario para crear nuevas cartas
- Formulario para editar cartas existentes
- Validación de todos los campos
- Eliminación de cartas

### CartPage
- Lista de cartas en el carrito
- Modificación de cantidades
- Eliminación de artículos
- Resumen de compra
- Proceder al pago

### Favorites
- Listado de cartas favoritas
- Opciones para:
  - Añadir al carrito
  - Remover de favoritos
  - Ver detalle
  - Limpiar todos

## 🎨 Tema y Estilos

El proyecto utiliza un tema personalizado basado en los colores de Magic: The Gathering:
- Blanco: #F0E68C
- Azul: #0E68AB
- Negro: #150B00
- Rojo: #D3202A
- Verde: #00733E
- Fondo oscuro: #1a1a1a

## 📱 Responsive Design

La aplicación es completamente responsiva:
- Mobile: Vista optimizada para dispositivos pequeños
- Tablet: Máximo aprovechamiento del espacio
- Desktop: Interfaz completa con todas las características

## 🔄 Estado y Persistencia

- **Carrito**: Se persiste en `localStorage` con la clave `mana-cart`
- **Favoritos**: Se persisten en `localStorage` con la clave `mana-favorites`
- **Actualizaciones en tiempo real**: Todos los cambios se sincronizan automáticamente entre componentes

## 📝 Notas de Desarrollo

- Los servicios utilizan un patrón Singleton para gestionar el estado
- Se implementó un sistema de suscripción para actualizar componentes cuando el estado cambia
- Los formularios usan validación nativa de HTML5
- Se incluyen alertas con SweetAlert2 para feedback al usuario

## 🚨 Manejo de Errores

- Errores de conexión se manejan gracefully
- Mensajes de error amigables al usuario
- Confirmaciones antes de acciones destructivas
- Logging en consola para debugging

## 📄 Licencia

Este proyecto es parte de DAW MEAN EXAMPLE v2
