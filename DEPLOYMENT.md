# Guía de Despliegue en Producción - VPS Debian + Nginx

Esta guía cubre el despliegue de la API Express Tienda en un VPS con Debian usando Nginx como proxy inverso y PM2 como gestor de procesos.

## 📋 Requisitos previos

- VPS con Debian 11/12
- Acceso SSH al servidor
- Dominio o subdominio apuntando a tu VPS (opcional pero recomendado)
- PostgreSQL instalado en el servidor

---

## 🚀 Paso 1: Preparar el servidor VPS

### 1.1 Actualizar el sistema
```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Instalar Node.js (v18 o superior)
```bash
# Instalar Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalación
node --version
npm --version
```

### 1.3 Instalar Git
```bash
sudo apt install -y git
```

### 1.4 Instalar PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib

# Verificar que esté corriendo
sudo systemctl status postgresql
```

### 1.5 Instalar Nginx
```bash
sudo apt install -y nginx

# Verificar instalación
sudo systemctl status nginx
```

### 1.6 Instalar PM2 (gestor de procesos)
```bash
sudo npm install -g pm2
```

---

## 🗄️ Paso 2: Configurar PostgreSQL

### 2.1 Crear usuario y base de datos
```bash
# Acceder a PostgreSQL
sudo -u postgres psql

# Dentro de psql, ejecutar:
CREATE USER tienda_user WITH PASSWORD 'tu_password_seguro_aqui';
CREATE DATABASE tienda_db OWNER tienda_user;
GRANT ALL PRIVILEGES ON DATABASE tienda_db TO tienda_user;
\q
```

### 2.2 Configurar acceso (opcional, si es necesario)
```bash
# Editar pg_hba.conf si necesitas acceso local
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Agregar esta línea si no existe:
# local   all             tienda_user                             md5

# Reiniciar PostgreSQL
sudo systemctl restart postgresql
```

### 2.3 Probar conexión
```bash
psql -U tienda_user -d tienda_db -h localhost
# Ingresar password cuando lo solicite
# Si funciona, escribir \q para salir
```

---

## 📦 Paso 3: Clonar y configurar la aplicación

### 3.1 Crear usuario para la aplicación (buena práctica)
```bash
sudo adduser --disabled-password --gecos "" appuser
sudo usermod -aG sudo appuser
```

### 3.2 Cambiar a ese usuario y crear directorio
```bash
sudo su - appuser
mkdir -p ~/apps
cd ~/apps
```

### 3.3 Clonar el repositorio
```bash
git clone https://github.com/jsponceA/api-express-tienda.git
cd api-express-tienda
```

### 3.4 Instalar dependencias
```bash
npm install --production
```

### 3.5 Crear archivo .env de producción
```bash
nano .env
```

Contenido del archivo `.env`:
```env
NODE_ENV=production
PORT=3000

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tienda_db
DB_USER=tienda_user
DB_PASSWORD=tu_password_seguro_aqui
```

### 3.6 Probar que la aplicación inicia
```bash
npm start
# Si todo funciona correctamente, presiona Ctrl+C para detener
```

---

## ⚙️ Paso 4: Configurar PM2

### 4.1 Crear archivo de configuración PM2
```bash
nano ecosystem.config.js
```

Contenido:
```javascript
module.exports = {
  apps: [{
    name: 'api-tienda',
    script: 'src/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M'
  }]
};
```

### 4.2 Crear directorio de logs
```bash
mkdir -p logs
```

### 4.3 Iniciar la aplicación con PM2
```bash
pm2 start ecosystem.config.js
```

### 4.4 Configurar PM2 para arranque automático
```bash
pm2 startup
# Copiar y ejecutar el comando que aparece

pm2 save
```

### 4.5 Comandos útiles de PM2
```bash
pm2 status              # Ver estado de la app
pm2 logs api-tienda     # Ver logs en tiempo real
pm2 restart api-tienda  # Reiniciar app
pm2 stop api-tienda     # Detener app
pm2 monit              # Monitor de recursos
```

---

## 🌐 Paso 5: Configurar Nginx como Proxy Inverso

### 5.1 Crear configuración de Nginx
```bash
sudo nano /etc/nginx/sites-available/api-tienda
```

**Opción A: Sin dominio (acceso por IP)**
```nginx
server {
    listen 80;
    server_name tu_ip_del_vps;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Aumentar timeouts para requests largos
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Logs
    access_log /var/log/nginx/api-tienda-access.log;
    error_log /var/log/nginx/api-tienda-error.log;
}
```

**Opción B: Con dominio**
```nginx
server {
    listen 80;
    server_name api.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    access_log /var/log/nginx/api-tienda-access.log;
    error_log /var/log/nginx/api-tienda-error.log;
}
```

### 5.2 Habilitar el sitio
```bash
sudo ln -s /etc/nginx/sites-available/api-tienda /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 5.3 Configurar firewall (si está habilitado)
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

---

## 🔒 Paso 6: Configurar SSL con Let's Encrypt (RECOMENDADO)

**Solo si tienes un dominio configurado**

### 6.1 Instalar Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtener certificado SSL
```bash
sudo certbot --nginx -d api.tudominio.com
```

Sigue las instrucciones:
- Ingresa tu email
- Acepta los términos
- Certbot configurará automáticamente Nginx para HTTPS

### 6.3 Renovación automática
```bash
# Probar renovación
sudo certbot renew --dry-run

# La renovación automática ya está configurada por defecto
```

---

## 🔄 Paso 7: Actualizar la aplicación (proceso de deployment)

Cuando hagas cambios en tu código y quieras actualizar producción:

```bash
# 1. Conectarse al servidor
ssh appuser@tu_vps_ip

# 2. Ir al directorio de la app
cd ~/apps/api-express-tienda

# 3. Obtener últimos cambios
git pull origin main

# 4. Instalar nuevas dependencias (si las hay)
npm install --production

# 5. Reiniciar la aplicación
pm2 restart api-tienda

# 6. Verificar que funciona
pm2 logs api-tienda
```

### Script de actualización automática
Crear archivo `deploy.sh`:
```bash
nano deploy.sh
```

Contenido:
```bash
#!/bin/bash
echo "🚀 Iniciando despliegue..."

# Pull últimos cambios
git pull origin main

# Instalar dependencias
npm install --production

# Reiniciar con PM2
pm2 restart api-tienda

echo "✅ Despliegue completado"
pm2 status
```

Darle permisos:
```bash
chmod +x deploy.sh
```

Usar:
```bash
./deploy.sh
```

---

## 📊 Paso 8: Monitoreo y Logs

### Ver logs de la aplicación
```bash
pm2 logs api-tienda --lines 100
```

### Ver logs de Nginx
```bash
sudo tail -f /var/log/nginx/api-tienda-access.log
sudo tail -f /var/log/nginx/api-tienda-error.log
```

### Monitorear recursos
```bash
pm2 monit
```

### Verificar estado de servicios
```bash
sudo systemctl status nginx
sudo systemctl status postgresql
pm2 status
```

---

## 🧪 Paso 9: Verificar el deployment

### Desde el servidor
```bash
curl http://localhost:3000
curl http://localhost:3000/api/v1
curl http://localhost:3000/api/v1/products
```

### Desde tu computadora
```bash
# Sin SSL
curl http://tu_ip_vps
curl http://tu_ip_vps/api/v1/products

# Con SSL (si configuraste dominio)
curl https://api.tudominio.com
curl https://api.tudominio.com/api/v1/products
curl https://api.tudominio.com/api-docs
```

### Probar en el navegador
```
http://tu_ip_vps/api-docs
https://api.tudominio.com/api-docs
```

---

## 🔧 Solución de problemas comunes

### La aplicación no inicia
```bash
# Ver logs detallados
pm2 logs api-tienda --err

# Verificar que el puerto 3000 no esté en uso
sudo lsof -i :3000

# Verificar variables de entorno
pm2 env 0
```

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Probar conexión manual
psql -U tienda_user -d tienda_db -h localhost

# Verificar .env tiene las credenciales correctas
cat .env
```

### Nginx retorna 502 Bad Gateway
```bash
# Verificar que la app esté corriendo
pm2 status

# Verificar logs de Nginx
sudo tail -f /var/log/nginx/api-tienda-error.log

# Reiniciar servicios
pm2 restart api-tienda
sudo systemctl restart nginx
```

### No se puede acceder desde fuera del servidor
```bash
# Verificar firewall
sudo ufw status

# Asegurarse que Nginx permite conexiones
sudo ufw allow 'Nginx Full'

# Verificar que Nginx esté corriendo
sudo systemctl status nginx
```

---

## 📝 Checklist final de producción

- [ ] PostgreSQL configurado y corriendo
- [ ] Base de datos creada con usuario
- [ ] Aplicación clonada y dependencias instaladas
- [ ] Archivo .env configurado con credenciales correctas
- [ ] PM2 iniciado y configurado para arranque automático
- [ ] Nginx configurado como proxy inverso
- [ ] Firewall configurado (puertos 80, 443, 22)
- [ ] SSL configurado (si tienes dominio)
- [ ] Logs funcionando correctamente
- [ ] Aplicación accesible desde internet
- [ ] Documentación Swagger accesible en /api-docs

---

## 🎯 URLs finales

- **API Base:** `http://tu_ip_vps` o `https://api.tudominio.com`
- **Endpoints:** `http://tu_ip_vps/api/v1/products`
- **Documentación:** `http://tu_ip_vps/api-docs`

---

## 💡 Recomendaciones adicionales

1. **Backups regulares de la base de datos:**
   ```bash
   # Crear backup
   pg_dump -U tienda_user tienda_db > backup_$(date +%Y%m%d).sql
   
   # Restaurar backup
   psql -U tienda_user tienda_db < backup_20250126.sql
   ```

2. **Configurar límites de rate limiting en Nginx** (prevenir ataques)

3. **Usar variables de entorno seguras** (nunca commitear .env al repositorio)

4. **Monitorear recursos del servidor** con herramientas como `htop`

5. **Configurar alertas** cuando la aplicación caiga

---

¡Tu API está lista para producción! 🚀
