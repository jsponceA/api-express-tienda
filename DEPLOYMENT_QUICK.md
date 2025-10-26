# Guía Rápida de Deployment

## 🚀 Comandos resumidos para despliegue

### En el servidor VPS (primera vez)

```bash
# 1. Actualizar sistema
sudo apt update && sudo apt upgrade -y

# 2. Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx postgresql postgresql-contrib

# 3. Instalar PM2
sudo npm install -g pm2

# 4. Configurar PostgreSQL
sudo -u postgres psql
```

```sql
CREATE USER tienda_user WITH PASSWORD 'tu_password_seguro';
CREATE DATABASE tienda_db OWNER tienda_user;
GRANT ALL PRIVILEGES ON DATABASE tienda_db TO tienda_user;
\q
```

```bash
# 5. Crear usuario y clonar repositorio
sudo adduser --disabled-password --gecos "" appuser
sudo su - appuser
cd ~
mkdir -p apps && cd apps
git clone https://github.com/jsponceA/api-express-tienda.git
cd api-express-tienda

# 6. Configurar aplicación
npm install --production
nano .env  # Configurar variables de entorno
mkdir logs

# 7. Iniciar con PM2
pm2 start ecosystem.config.js
pm2 startup  # Copiar y ejecutar el comando que aparece
pm2 save

# 8. Configurar Nginx
exit  # Salir de appuser
sudo nano /etc/nginx/sites-available/api-tienda
# Copiar configuración de nginx.conf.example

sudo ln -s /etc/nginx/sites-available/api-tienda /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 9. Configurar firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable

# 10. SSL (si tienes dominio)
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.tudominio.com
```

---

## 🔄 Actualizar aplicación

```bash
# Conectarse al servidor
ssh appuser@tu_vps_ip

# Ir al directorio
cd ~/apps/api-express-tienda

# Usar el script de despliegue
chmod +x deploy.sh
./deploy.sh
```

**O manualmente:**
```bash
git pull origin main
npm install --production
pm2 restart api-tienda
pm2 logs api-tienda
```

---

## 📊 Comandos útiles de monitoreo

```bash
# Ver estado de la app
pm2 status

# Ver logs en tiempo real
pm2 logs api-tienda

# Monitorear recursos
pm2 monit

# Reiniciar app
pm2 restart api-tienda

# Ver logs de Nginx
sudo tail -f /var/log/nginx/api-tienda-access.log
sudo tail -f /var/log/nginx/api-tienda-error.log

# Estado de servicios
sudo systemctl status nginx
sudo systemctl status postgresql
```

---

## 🧪 Verificar deployment

```bash
# Desde el servidor
curl http://localhost:3000/api/v1/products

# Desde tu PC
curl http://TU_IP_VPS/api/v1/products
curl https://api.tudominio.com/api/v1/products

# En el navegador
http://TU_IP_VPS/api-docs
https://api.tudominio.com/api-docs
```

---

## 🔧 Solución rápida de problemas

```bash
# App no inicia
pm2 logs api-tienda --err
pm2 restart api-tienda

# Error de PostgreSQL
sudo systemctl status postgresql
psql -U tienda_user -d tienda_db -h localhost

# Nginx 502 Bad Gateway
pm2 status
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/api-tienda-error.log

# Ver procesos en puerto 3000
sudo lsof -i :3000

# Reiniciar todo
pm2 restart api-tienda
sudo systemctl restart nginx
sudo systemctl restart postgresql
```

---

## 📦 Backup de base de datos

```bash
# Crear backup
pg_dump -U tienda_user tienda_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
psql -U tienda_user tienda_db < backup_20250126_120000.sql

# Backup automático (crontab)
crontab -e
# Agregar: 0 2 * * * pg_dump -U tienda_user tienda_db > ~/backups/db_$(date +\%Y\%m\%d).sql
```

---

## 🎯 URLs de producción

- **API:** `http://TU_IP_VPS` o `https://api.tudominio.com`
- **Products:** `http://TU_IP_VPS/api/v1/products`
- **Swagger:** `http://TU_IP_VPS/api-docs`

---

## ✅ Checklist de deployment

- [ ] Node.js, Git, Nginx, PostgreSQL instalados
- [ ] Base de datos y usuario creados
- [ ] Repositorio clonado
- [ ] Dependencias instaladas
- [ ] Archivo .env configurado
- [ ] PM2 corriendo y configurado para autostart
- [ ] Nginx configurado como proxy
- [ ] Firewall configurado
- [ ] SSL instalado (si tienes dominio)
- [ ] App accesible desde internet
- [ ] Swagger funcionando en /api-docs

¡Listo para producción! 🚀
