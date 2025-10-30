import express from "express";
import * as enrollmentsController from "../controllers/enrollments.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/enrollments:
 *   get:
 *     summary: Obtener todas las matrículas
 *     tags: [Enrollments]
 *     description: Retorna la lista de todas las matrículas con información del estudiante
 *     responses:
 *       200:
 *         description: Lista de matrículas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 */
router.get("/", enrollmentsController.getAllEnrollments);

/**
 * @swagger
 * /api/v1/enrollments/{id}:
 *   get:
 *     summary: Obtener una matrícula por ID
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Matrícula encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       404:
 *         description: Matrícula no encontrada
 */
router.get("/:id", enrollmentsController.getEnrollmentById);

/**
 * @swagger
 * /api/v1/enrollments/student/{studentId}:
 *   get:
 *     summary: Obtener matrículas de un estudiante
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Matrículas del estudiante
 *       404:
 *         description: Estudiante no encontrado
 */
router.get("/student/:studentId", enrollmentsController.getEnrollmentsByStudent);

/**
 * @swagger
 * /api/v1/enrollments:
 *   post:
 *     summary: Matricular un estudiante en un curso
 *     tags: [Enrollments]
 *     description: Crea una nueva matrícula para un estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollmentInput'
 *     responses:
 *       201:
 *         description: Matrícula creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Estudiante no encontrado
 *       409:
 *         description: El estudiante ya está matriculado en este curso
 */
router.post("/", enrollmentsController.createEnrollment);

/**
 * @swagger
 * /api/v1/enrollments/{id}:
 *   put:
 *     summary: Actualizar una matrícula
 *     tags: [Enrollments]
 *     description: Actualiza el estado, nota u otros datos de una matrícula
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EnrollmentInput'
 *     responses:
 *       200:
 *         description: Matrícula actualizada
 *       404:
 *         description: Matrícula no encontrada
 */
router.put("/:id", enrollmentsController.updateEnrollment);

/**
 * @swagger
 * /api/v1/enrollments/{id}:
 *   delete:
 *     summary: Eliminar una matrícula
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Matrícula eliminada
 *       404:
 *         description: Matrícula no encontrada
 */
router.delete("/:id", enrollmentsController.deleteEnrollment);

export default router;
