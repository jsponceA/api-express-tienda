# API Express Tienda

API REST para gestión de tienda con CRUD de productos, construida con Express.js, PostgreSQL, Sequelize y documentada con Swagger.

## 🚀 Características

- **Express v5** - Framework web moderno
- **PostgreSQL + Sequelize** - Base de datos relacional con ORM
- **Swagger/OpenAPI** - Documentación interactiva de la API
- **Arquitectura MVC** - Separación de responsabilidades (Models, Controllers, Routes)
- **Validación con Zod** - Validación de schemas robusta
- **Security** - Helmet, CORS configurado
- **Logging** - Morgan para logs HTTP
- **Testing** - Vitest + Supertest

## 📋 Requisitos previos

- Node.js 18+ 
- PostgreSQL 12+
- npm o pnpm

## 🛠️ Instalación local

### 1. Clonar el repositorio
```bash
git clone https://github.com/jsponceA/api-express-tienda.git
cd api-express-tienda
```

### 2. Instalar dependencias
```bash
npm install
# o
pnpm install
```

### 3. Configurar base de datos
```sql
CREATE DATABASE tienda_db;
```

### 4. Configurar variables de entorno
Copiar `.env.example` a `.env` y configurar:
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=tienda_db
DB_USER=postgres
DB_PASSWORD=tu_password
```

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

## 📚 Documentación API

Una vez iniciado el servidor, accede a la documentación interactiva:

```
http://localhost:3000/api-docs
```

## 🔌 Endpoints

### Productos

- `GET /api/v1/products` - Listar todos los productos
- `GET /api/v1/products/:id` - Obtener producto por ID
- `POST /api/v1/products` - Crear nuevo producto
- `PUT /api/v1/products/:id` - Actualizar producto
- `DELETE /api/v1/products/:id` - Eliminar producto

### Ejemplo de uso

**Crear producto:**
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop HP",
    "price": 799.99,
    "description": "Laptop de alto rendimiento",
    "inStock": true
  }'
```

## 🏗️ Estructura del proyecto

```
api-express-tienda/
├── src/
│   ├── api/              # Rutas/Endpoints
│   │   ├── index.js
│   │   ├── products.js
│   │   └── emojis.js
│   ├── controllers/      # Lógica de negocio
│   │   └── products.controller.js
│   ├── models/           # Modelos de Sequelize
│   │   └── product.js
│   ├── db/              # Configuración de base de datos
│   │   └── config.js
│   ├── app.js           # Configuración de Express
│   ├── index.js         # Entrada de la aplicación
│   ├── env.js           # Validación de variables de entorno
│   ├── middlewares.js   # Middlewares personalizados
│   └── swagger.js       # Configuración de Swagger
├── test/                # Tests
├── ecosystem.config.js  # Configuración PM2
├── deploy.sh           # Script de deployment
└── package.json
```

## 🧪 Testing

```bash
npm test
```

## 🔍 Linting

```bash
npm run lint
```

## 🚀 Deployment en Producción

Para desplegar en un VPS con Debian y Nginx:

**Guía completa:** [DEPLOYMENT.md](./DEPLOYMENT.md)

**Guía rápida:** [DEPLOYMENT_QUICK.md](./DEPLOYMENT_QUICK.md)

### Resumen rápido:

1. Instalar Node.js, PostgreSQL, Nginx, PM2
2. Clonar repositorio y configurar .env
3. Instalar dependencias con `npm install --production`
4. Iniciar con PM2: `pm2 start ecosystem.config.js`
5. Configurar Nginx como proxy inverso
6. (Opcional) Configurar SSL con Let's Encrypt

**Script de actualización:**
```bash
./deploy.sh
```

## 📦 Scripts disponibles

- `npm start` - Iniciar en producción
- `npm run dev` - Desarrollo con hot-reload
- `npm test` - Ejecutar tests
- `npm run lint` - Verificar código con ESLint

## 🔒 Seguridad

- Helmet configurado para headers HTTP seguros
- CORS habilitado
- Variables de entorno para datos sensibles
- Validación de entrada con Zod
- Prepared statements con Sequelize (previene SQL injection)

## 📄 Licencia

MIT

## 👤 Autor

jsponceA

---

**Documentación adicional:**
- [Configuración de Base de Datos](./DATABASE_SETUP.md)
- [Guía de Deployment](./DEPLOYMENT.md)
- [Configuración de Nginx](./nginx.conf.example)
