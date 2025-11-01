import express from "express";
import * as studentsController from "../controllers/students.controller.js";
import { uploadStudentImage } from "../config/multer.js";

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - studentCode
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               studentCode:
 *                 type: string
 *                 example: "EST2024001"
 *               firstName:
 *                 type: string
 *                 example: "Juan"
 *               lastName:
 *                 type: string
 *                 example: "Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan.perez@example.com"
 *               phone:
 *                 type: string
 *                 example: "+593 99 123 4567"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "2000-05-15"
 *               address:
 *                 type: string
 *                 example: "Av. Principal 123"
 *               enrollmentDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, inactive, graduated, suspended]
 *                 example: "active"
 *               emergencyContact:
 *                 type: string
 *                 example: "María Pérez"
 *               emergencyPhone:
 *                 type: string
 *                 example: "+593 99 987 6543"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del estudiante (jpeg, jpg, png, gif, webp - max 5MB)
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
router.post("/", uploadStudentImage.single("image"), studentsController.createStudent);

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               studentCode:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               address:
 *                 type: string
 *               enrollmentDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [active, inactive, graduated, suspended]
 *               emergencyContact:
 *                 type: string
 *               emergencyPhone:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Nueva imagen del estudiante (opcional)
 *     responses:
 *       200:
 *         description: Estudiante actualizado
 *       404:
 *         description: Estudiante no encontrado
 */
router.put("/:id", uploadStudentImage.single("image"), studentsController.updateStudent);

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
