# Sistema de Carga de Imágenes para Estudiantes

## Descripción

El API de estudiantes soporta la carga de imágenes usando `multer`. Las imágenes se almacenan en el servidor en la carpeta `uploads/students/`.

## Configuración

### Multer
- **Ubicación**: `src/config/multer.js`
- **Tamaño máximo**: 5MB
- **Formatos permitidos**: jpeg, jpg, png, gif, webp
- **Carpeta de destino**: `uploads/students/`

### Archivos estáticos
Las imágenes subidas están disponibles públicamente en:
```
http://localhost:3000/uploads/students/nombre-archivo.jpg
```

## Uso

### Crear estudiante con imagen

**Endpoint**: `POST /api/v1/students`

**Content-Type**: `multipart/form-data`

**Campos**:
- `studentCode` (requerido): Código del estudiante
- `firstName` (requerido): Nombre
- `lastName` (requerido): Apellido
- `email` (requerido): Email
- `phone` (opcional): Teléfono
- `dateOfBirth` (opcional): Fecha de nacimiento (YYYY-MM-DD)
- `address` (opcional): Dirección
- `enrollmentDate` (opcional): Fecha de inscripción
- `status` (opcional): active, inactive, graduated, suspended
- `emergencyContact` (opcional): Contacto de emergencia
- `emergencyPhone` (opcional): Teléfono de emergencia
- `image` (opcional): Archivo de imagen (campo tipo file)

**Ejemplo con cURL**:
```bash
curl -X POST http://localhost:3000/api/v1/students \
  -F "studentCode=EST2024001" \
  -F "firstName=Juan" \
  -F "lastName=Pérez" \
  -F "email=juan.perez@example.com" \
  -F "phone=+593 99 123 4567" \
  -F "image=@/ruta/a/imagen.jpg"
```

**Ejemplo con JavaScript (Fetch)**:
```javascript
const formData = new FormData();
formData.append('studentCode', 'EST2024001');
formData.append('firstName', 'Juan');
formData.append('lastName', 'Pérez');
formData.append('email', 'juan.perez@example.com');
formData.append('image', fileInput.files[0]); // fileInput es un input type="file"

const response = await fetch('http://localhost:3000/api/v1/students', {
  method: 'POST',
  body: formData
});

const student = await response.json();
console.log(student.image); // "/uploads/students/foto-1234567890.jpg"
```

### Actualizar imagen de estudiante

**Endpoint**: `PUT /api/v1/students/:id`

**Content-Type**: `multipart/form-data`

**Ejemplo**:
```bash
curl -X PUT http://localhost:3000/api/v1/students/1 \
  -F "image=@/ruta/a/nueva-imagen.jpg"
```

### Respuesta

La respuesta incluye la ruta de la imagen:
```json
{
  "id": 1,
  "studentCode": "EST2024001",
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "image": "/uploads/students/foto-1698765432100-123456789.jpg",
  "createdAt": "2024-10-31T10:00:00.000Z",
  "updatedAt": "2024-10-31T10:00:00.000Z"
}
```

## Validaciones

- **Formato**: Solo se aceptan archivos de imagen (jpeg, jpg, png, gif, webp)
- **Tamaño**: Máximo 5MB
- **Error por formato inválido**:
  ```json
  {
    "message": "Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)"
  }
  ```

## Testing en Swagger UI

1. Ve a http://localhost:3000/api-docs
2. Busca el endpoint `POST /api/v1/students`
3. Haz clic en "Try it out"
4. Completa los campos requeridos
5. En el campo `image`, haz clic en "Choose File" y selecciona una imagen
6. Haz clic en "Execute"

## Estructura de archivos

```
api-express-tienda/
├── uploads/
│   └── students/
│       ├── .gitignore          # Ignora las imágenes en git
│       ├── .gitkeep            # Mantiene la carpeta en git
│       └── foto-*.jpg          # Imágenes subidas
├── src/
│   ├── config/
│   │   └── multer.js           # Configuración de multer
│   ├── api/
│   │   └── students.js         # Rutas con multer middleware
│   └── controllers/
│       └── students.controller.js  # Lógica para manejar archivos
```

## Notas importantes

1. **Producción**: En producción, considera usar servicios de almacenamiento en la nube como:
   - Cloudinary
   - AWS S3
   - Google Cloud Storage
   
2. **Seguridad**: Las imágenes son públicas. No subas información sensible.

3. **Limpieza**: Las imágenes antiguas no se eliminan automáticamente al actualizar. Considera implementar limpieza de archivos huérfanos.

4. **Git**: Las imágenes están en `.gitignore` para no saturar el repositorio.
