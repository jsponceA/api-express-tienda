import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import api from "./api/index.js";
import * as middlewares from "./middlewares.js";

import { swaggerSpec } from "./swagger.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Permitir recursos cross-origin
}));
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Aumentar límite para imágenes
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Para form-data

// Servir archivos estáticos (imágenes subidas)
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({
    message: "PRIVATE API - Express Tienda",
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "Express Tienda API Docs",
}));

app.use("/api/v1", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
