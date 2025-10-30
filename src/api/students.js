import express from "express";
import * as studentsController from "../controllers/students.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/students:
 *   get:
 *     summary: Obtener todos los estudiantes
 *     tags: [Students]
 *     description: Retorna la lista completa de estudiantes con sus matrículas
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get("/", studentsController.getAllStudents);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   get:
 *     summary: Obtener un estudiante por ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Estudiante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudiante no encontrado
 */
router.get("/:id", studentsController.getStudentById);

/**
 * @swagger
 * /api/v1/students:
 *   post:
 *     summary: Crear un nuevo estudiante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       201:
 *         description: Estudiante creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Código o email duplicado
 */
router.post("/", studentsController.createStudent);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   put:
 *     summary: Actualizar un estudiante
 *     tags: [Students]
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
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       200:
 *         description: Estudiante actualizado
 *       404:
 *         description: Estudiante no encontrado
 */
router.put("/:id", studentsController.updateStudent);

/**
 * @swagger
 * /api/v1/students/{id}:
 *   delete:
 *     summary: Eliminar un estudiante
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Estudiante eliminado
 *       404:
 *         description: Estudiante no encontrado
 */
router.delete("/:id", studentsController.deleteStudent);

export default router;
