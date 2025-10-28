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
