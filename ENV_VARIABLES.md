# 🔐 Variables de Entorno - Configuración

## Cómo funcionan las variables de entorno en este proyecto

### 📝 Archivo `src/env.js`

Este archivo valida y carga las variables de entorno usando **Zod**. Define valores por defecto para desarrollo:

```javascript
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default("tienda_db"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),
});
```

### 🔄 Carga de variables según el entorno

#### **Desarrollo (Local)**

```bash
npm run dev
# Ejecuta: node --watch --env-file=.env src/index.js
```

✅ Lee automáticamente el archivo `.env` usando el flag `--env-file=.env`

**Archivo `.env` en desarrollo:**
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tienda_db
DB_USER=postgres
DB_PASSWORD=postgres
```

#### **Producción (VPS con PM2)**

```bash
pm2 start ecosystem.config.cjs
```

✅ PM2 usa el archivo `ecosystem.config.cjs` que incluye:
```javascript
node_args: "--env-file=.env"
```

Esto hace que Node.js cargue el archivo `.env` del servidor.

**Archivo `.env` en producción (en el servidor):**
```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tienda_db
DB_USER=tienda_user
DB_PASSWORD=TU_PASSWORD_SEGURO_AQUI_123!
```

⚠️ **IMPORTANTE:** El archivo `.env` en producción debe tener **contraseñas seguras** diferentes a las de desarrollo.

---

## 🎯 Flujo completo

### 1. Node.js carga el archivo `.env`
El flag `--env-file=.env` inyecta las variables en `process.env`

### 2. `src/env.js` valida las variables
- Si falta alguna variable requerida → **ERROR y cierra la app**
- Si todo está OK → Exporta el objeto `env` validado

### 3. La app usa las variables validadas
```javascript
import { env } from "./env.js";

// Usar variables en toda la app
console.log(env.DB_HOST);    // "localhost"
console.log(env.DB_PASSWORD); // "TU_PASSWORD_SEGURO_AQUI_123!"
```

---

## 🔒 Seguridad

### ✅ Lo que SÍ se hace:
- ✅ `.env` está en `.gitignore` (NO se sube al repositorio)
- ✅ `.env.example` documenta las variables necesarias
- ✅ Validación con Zod asegura que todas las variables existen
- ✅ Valores por defecto para desarrollo (solo desarrollo)

### ❌ Lo que NO se debe hacer:
- ❌ **NUNCA** commitear el archivo `.env` al repositorio
- ❌ **NUNCA** usar las mismas contraseñas en desarrollo y producción
- ❌ **NUNCA** hardcodear contraseñas en el código

---

## 📋 Checklist para producción

Antes de desplegar en el VPS, asegúrate de:

- [ ] Crear el archivo `.env` en el servidor (NO copiarlo de tu PC)
- [ ] Usar contraseñas **fuertes y únicas** para producción
- [ ] Cambiar `NODE_ENV=production`
- [ ] Configurar el usuario de PostgreSQL (no usar `postgres`)
- [ ] Verificar que todas las variables estén definidas
- [ ] Probar la conexión a PostgreSQL antes de iniciar la app

---

## 🧪 Verificar configuración

### En desarrollo:
```bash
# Ver qué variables se están cargando
node -e "import('./src/env.js').then(m => console.log(m.env))"
```

### En producción (servidor):
```bash
# Ver variables que PM2 está usando
pm2 env 0

# Ver logs para detectar errores de variables
pm2 logs api-express-tienda --err
```

---

## 🔄 Alternativas para variables de entorno

Si prefieres otro método, puedes usar:

### Opción 1: Variables del sistema (sin archivo .env)
```bash
# Exportar variables en el shell
export DB_PASSWORD="mi_password_seguro"
export DB_USER="tienda_user"

# Iniciar la app
pm2 start ecosystem.config.cjs
```

### Opción 2: Variables en ecosystem.config.cjs
```javascript
module.exports = {
  apps: [{
    name: "api-express-tienda",
    script: "src/index.js",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      DB_HOST: "localhost",
      DB_USER: "tienda_user",
      DB_PASSWORD: "password_aqui", // ⚠️ No recomendado si el archivo está en git
    }
  }]
};
```

### Opción 3: Usar dotenv (biblioteca adicional)
Instalar `dotenv`:
```bash
npm install dotenv
```

En `src/env.js`:
```javascript
import 'dotenv/config';
import { z } from "zod";
// ... resto del código
```

---

## 📌 Recomendación actual

✅ **Usar `--env-file=.env`** (método actual) porque:
- Es nativo de Node.js 20+ (no necesita bibliotecas)
- Simple y directo
- El archivo `.env` queda en el servidor, no en git
- Funciona igual en desarrollo y producción

---

## 🆘 Problemas comunes

### Error: "Missing environment variables"
```bash
# Verificar que el archivo .env existe
ls -la .env

# Verificar el contenido
cat .env

# Verificar permisos
chmod 600 .env
```

### La app no se conecta a PostgreSQL
```bash
# Probar conexión manualmente
psql -U tienda_user -d tienda_db -h localhost

# Verificar que las credenciales en .env son correctas
cat .env | grep DB_
```

### PM2 no carga las variables
```bash
# Reiniciar PM2 después de cambiar .env
pm2 restart api-express-tienda

# Ver variables que está usando
pm2 env 0

# Ver logs
pm2 logs api-express-tienda
```

---

**Resumen:** ✅ Sí, en producción PM2 carga las variables del archivo `.env` gracias al flag `--env-file=.env` en `ecosystem.config.cjs`.
