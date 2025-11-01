import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

// Configurar servidores según el entorno
const servers = [];

// Servidor de desarrollo
if (env.NODE_ENV === "development") {
  servers.push({
    url: `http://localhost:${env.PORT}`,
    description: "Development server",
  });
}

// Servidor de producción
if (env.NODE_ENV === "production") {
  servers.push({
    url: env.API_URL || `http://localhost:${env.PORT}`,
    description: "Production server",
  });
}

// Si no hay servidores definidos, usar localhost por defecto
if (servers.length === 0) {
  servers.push({
    url: `http://localhost:${env.PORT}`,
    description: "Local server",
  });
}

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express Tienda API",
      version: "1.0.0",
      description: "API REST para gestión de tienda con productos",
      contact: {
        name: "API Support",
      },
    },
    servers,
    components: {
      schemas: {
        Product: {
          type: "object",
          required: ["name", "price"],
          properties: {
            id: {
              type: "integer",
              description: "ID autogenerado del producto",
              example: 1,
            },
            name: {
              type: "string",
              description: "Nombre del producto",
              example: "Laptop HP",
            },
            price: {
              type: "number",
              format: "decimal",
              description: "Precio del producto (debe ser >= 0)",
              example: 799.99,
            },
            description: {
              type: "string",
              description: "Descripción opcional del producto",
              example: "Laptop de alto rendimiento",
            },
            inStock: {
              type: "boolean",
              description: "Disponibilidad en inventario",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Fecha de última actualización",
            },
          },
        },
        ProductInput: {
          type: "object",
          required: ["name", "price"],
          properties: {
            name: {
              type: "string",
              description: "Nombre del producto",
              example: "Laptop HP",
            },
            price: {
              type: "number",
              format: "decimal",
              description: "Precio del producto (debe ser >= 0)",
              example: 799.99,
            },
            description: {
              type: "string",
              description: "Descripción opcional del producto",
              example: "Laptop de alto rendimiento",
            },
            inStock: {
              type: "boolean",
              description: "Disponibilidad en inventario",
              example: true,
            },
          },
        },
        Book: {
          type: "object",
          required: ["title", "author", "price"],
          properties: {
            id: {
              type: "integer",
              description: "ID autogenerado del libro",
              example: 1,
            },
            title: {
              type: "string",
              description: "Título del libro",
              example: "Cien años de soledad",
            },
            author: {
              type: "string",
              description: "Autor del libro",
              example: "Gabriel García Márquez",
            },
            isbn: {
              type: "string",
              description: "ISBN del libro (10-20 caracteres, único)",
              example: "978-3-16-148410-0",
            },
            publisher: {
              type: "string",
              description: "Editorial del libro",
              example: "Editorial Sudamericana",
            },
            publicationYear: {
              type: "integer",
              description: "Año de publicación",
              example: 1967,
            },
            genre: {
              type: "string",
              description: "Género literario",
              example: "Novela",
            },
            language: {
              type: "string",
              description: "Idioma del libro",
              example: "Español",
            },
            pages: {
              type: "integer",
              description: "Número de páginas",
              example: 471,
            },
            price: {
              type: "number",
              format: "decimal",
              description: "Precio del libro (debe ser >= 0)",
              example: 29.99,
            },
            description: {
              type: "string",
              description: "Descripción o sinopsis del libro",
              example: "Una obra maestra de la literatura latinoamericana",
            },
            inStock: {
              type: "boolean",
              description: "Disponibilidad en inventario",
              example: true,
            },
            rating: {
              type: "number",
              format: "decimal",
              description: "Calificación del libro (0-5)",
              example: 4.8,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación del registro",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Fecha de última actualización",
            },
          },
        },
        BookInput: {
          type: "object",
          required: ["title", "author", "price"],
          properties: {
            title: {
              type: "string",
              description: "Título del libro",
              example: "Cien años de soledad",
            },
            author: {
              type: "string",
              description: "Autor del libro",
              example: "Gabriel García Márquez",
            },
            isbn: {
              type: "string",
              description: "ISBN del libro (10-20 caracteres)",
              example: "978-3-16-148410-0",
            },
            publisher: {
              type: "string",
              description: "Editorial del libro",
              example: "Editorial Sudamericana",
            },
            publicationYear: {
              type: "integer",
              description: "Año de publicación",
              example: 1967,
            },
            genre: {
              type: "string",
              description: "Género literario",
              example: "Novela",
            },
            language: {
              type: "string",
              description: "Idioma del libro",
              example: "Español",
            },
            pages: {
              type: "integer",
              description: "Número de páginas",
              example: 471,
            },
            price: {
              type: "number",
              format: "decimal",
              description: "Precio del libro (debe ser >= 0)",
              example: 29.99,
            },
            description: {
              type: "string",
              description: "Descripción o sinopsis del libro",
              example: "Una obra maestra de la literatura latinoamericana",
            },
            inStock: {
              type: "boolean",
              description: "Disponibilidad en inventario",
              example: true,
            },
            rating: {
              type: "number",
              format: "decimal",
              description: "Calificación del libro (0-5)",
              example: 4.8,
            },
          },
        },
        Student: {
          type: "object",
          required: ["studentCode", "firstName", "lastName", "email"],
          properties: {
            id: {
              type: "integer",
              description: "ID autogenerado del estudiante",
              example: 1,
            },
            studentCode: {
              type: "string",
              description: "Código único del estudiante",
              example: "EST2024001",
            },
            firstName: {
              type: "string",
              description: "Nombre del estudiante",
              example: "Juan",
            },
            lastName: {
              type: "string",
              description: "Apellido del estudiante",
              example: "Pérez",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email del estudiante",
              example: "juan.perez@example.com",
            },
            phone: {
              type: "string",
              description: "Teléfono del estudiante",
              example: "+593 99 123 4567",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              description: "Fecha de nacimiento",
              example: "2000-05-15",
            },
            address: {
              type: "string",
              description: "Dirección del estudiante",
              example: "Av. Principal 123",
            },
            enrollmentDate: {
              type: "string",
              format: "date",
              description: "Fecha de inscripción",
              example: "2024-01-15",
            },
            status: {
              type: "string",
              enum: ["active", "inactive", "graduated", "suspended"],
              description: "Estado del estudiante",
              example: "active",
            },
            emergencyContact: {
              type: "string",
              description: "Contacto de emergencia",
              example: "María Pérez",
            },
            emergencyPhone: {
              type: "string",
              description: "Teléfono de emergencia",
              example: "+593 99 987 6543",
            },
            image: {
              type: "string",
              format: "uri",
              description: "URL de la imagen del estudiante",
              example: "https://example.com/images/students/juan-perez.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        StudentInput: {
          type: "object",
          required: ["studentCode", "firstName", "lastName", "email"],
          properties: {
            studentCode: {
              type: "string",
              example: "EST2024001",
            },
            firstName: {
              type: "string",
              example: "Juan",
            },
            lastName: {
              type: "string",
              example: "Pérez",
            },
            email: {
              type: "string",
              format: "email",
              example: "juan.perez@example.com",
            },
            phone: {
              type: "string",
              example: "+593 99 123 4567",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              example: "2000-05-15",
            },
            address: {
              type: "string",
              example: "Av. Principal 123",
            },
            enrollmentDate: {
              type: "string",
              format: "date",
              example: "2024-01-15",
            },
            status: {
              type: "string",
              enum: ["active", "inactive", "graduated", "suspended"],
              example: "active",
            },
            emergencyContact: {
              type: "string",
              example: "María Pérez",
            },
            emergencyPhone: {
              type: "string",
              example: "+593 99 987 6543",
            },
            image: {
              type: "string",
              format: "uri",
              example: "https://example.com/images/students/juan-perez.jpg",
            },
          },
        },
        Enrollment: {
          type: "object",
          required: ["studentId", "course", "semester", "academicYear"],
          properties: {
            id: {
              type: "integer",
              description: "ID autogenerado de la matrícula",
              example: 1,
            },
            studentId: {
              type: "integer",
              description: "ID del estudiante",
              example: 1,
            },
            course: {
              type: "string",
              description: "Nombre del curso",
              example: "Matemáticas Avanzadas",
            },
            courseCode: {
              type: "string",
              description: "Código del curso",
              example: "MAT301",
            },
            semester: {
              type: "string",
              description: "Semestre",
              example: "2024-1",
            },
            academicYear: {
              type: "string",
              description: "Año académico",
              example: "2024",
            },
            enrollmentDate: {
              type: "string",
              format: "date",
              description: "Fecha de matrícula",
              example: "2024-01-20",
            },
            status: {
              type: "string",
              enum: ["enrolled", "completed", "dropped", "failed", "in-progress"],
              description: "Estado de la matrícula",
              example: "enrolled",
            },
            grade: {
              type: "number",
              format: "decimal",
              description: "Calificación (0-100)",
              example: 85.5,
            },
            credits: {
              type: "integer",
              description: "Créditos del curso",
              example: 4,
            },
            notes: {
              type: "string",
              description: "Notas adicionales",
              example: "Estudiante con buen desempeño",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        EnrollmentInput: {
          type: "object",
          required: ["studentId", "course", "semester", "academicYear"],
          properties: {
            studentId: {
              type: "integer",
              example: 1,
            },
            course: {
              type: "string",
              example: "Matemáticas Avanzadas",
            },
            courseCode: {
              type: "string",
              example: "MAT301",
            },
            semester: {
              type: "string",
              example: "2024-1",
            },
            academicYear: {
              type: "string",
              example: "2024",
            },
            enrollmentDate: {
              type: "string",
              format: "date",
              example: "2024-01-20",
            },
            status: {
              type: "string",
              enum: ["enrolled", "completed", "dropped", "failed", "in-progress"],
              example: "enrolled",
            },
            grade: {
              type: "number",
              format: "decimal",
              example: 85.5,
            },
            credits: {
              type: "integer",
              example: 4,
            },
            notes: {
              type: "string",
              example: "Estudiante con buen desempeño",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Mensaje de error",
            },
            issues: {
              type: "object",
              description: "Detalles de validación (si aplica)",
            },
          },
        },
      },
    },
  },
  apis: ["./src/api/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
