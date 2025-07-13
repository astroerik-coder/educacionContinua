# Academic Management App

Aplicación de gestión académica construida con Next.js, Prisma y NextAuth.

## 🚀 Deploy en Vercel

### Configuración Automática

El proyecto está configurado para deploy automático en Vercel con las siguientes optimizaciones:

- **Gestor de paquetes**: npm (configurado en `vercel.json`)
- **Build optimizado**: Script `vercel-build` específico para Vercel
- **Prisma**: Generación automática del cliente en build
- **Next.js**: Configuración optimizada para producción

### Variables de Entorno Requeridas

Asegúrate de configurar estas variables en Vercel:

```env
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Solución de Problemas

Si encuentras errores de build:

1. **Problemas de dependencias**: El proyecto usa npm, no pnpm
2. **Errores de Prisma**: El cliente se genera automáticamente en build
3. **Timeouts**: Las funciones API tienen un límite de 30 segundos

### Comandos Útiles

```bash
# Preparar para deploy
npm run prepare-deploy

# Build local
npm run build

# Desarrollo
npm run dev
```

## 📁 Estructura del Proyecto

- `app/` - Páginas y componentes de Next.js 13+
- `prisma/` - Esquema de base de datos
- `components/` - Componentes reutilizables
- `lib/` - Utilidades y configuraciones 