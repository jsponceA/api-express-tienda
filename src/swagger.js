import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env.js";

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
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Development server",
      },
    ],
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
