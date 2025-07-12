# Utiliza una imagen oficial de Node.js como base
FROM node:20-alpine AS base

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Instala pnpm si existe pnpm-lock.yaml, si no usa npm
env PNPM_HOME="/pnpm"
RUN if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copia el resto de la aplicación
COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

# Construye la aplicación Next.js
RUN npm run build

# Producción: solo los archivos necesarios
FROM node:20-alpine AS prod
WORKDIR /app

# Copia node_modules y la app compilada desde la etapa anterior
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/package.json ./
COPY --from=base /app/public ./public
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/.env ./
COPY --from=base /app/lib ./lib

# Expone el puerto
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"] 