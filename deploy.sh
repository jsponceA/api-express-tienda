#!/bin/bash

echo "🚀 Iniciando despliegue de API Express Tienda..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Pull últimos cambios
echo -e "${YELLOW}📥 Obteniendo últimos cambios del repositorio...${NC}"
git pull origin main

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al obtener cambios de git${NC}"
    exit 1
fi

# Instalar/actualizar dependencias
echo -e "${YELLOW}📦 Instalando dependencias...${NC}"
npm install --production

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi

# Reiniciar aplicación con PM2
echo -e "${YELLOW}🔄 Reiniciando aplicación...${NC}"
pm2 restart api-tienda

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al reiniciar la aplicación${NC}"
    exit 1
fi

# Guardar configuración PM2
pm2 save

echo -e "${GREEN}✅ Despliegue completado exitosamente${NC}"
echo -e "${YELLOW}📊 Estado de la aplicación:${NC}"
pm2 status

echo ""
echo -e "${GREEN}🎉 La aplicación se ha actualizado correctamente${NC}"
