import { z } from "zod";
import Enrollment from "../models/enrollment.js";
import Student from "../models/student.js";

const enrollmentSchema = z.object({
  studentId: z.number().int().positive("El ID del estudiante es requerido"),
  course: z.string().min(1, "El nombre del curso es requerido"),
  courseCode: z.string().optional(),
  semester: z.string().min(1, "El semestre es requerido"),
  academicYear: z.string().min(1, "El año académico es requerido"),
  enrollmentDate: z.string().optional(),
  status: z.enum(["enrolled", "completed", "dropped", "failed", "in-progress"]).optional(),
  grade: z.number().min(0).max(100).optional(),
  credits: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

/**
 * Get all enrollments
 */
export async function getAllEnrollments(req, res, next) {
  try {
    const enrollments = await Enrollment.findAll({
      order: [["createdAt", "DESC"]],
      include: [{
        model: Student,
        as: "student",
        attributes: ["id", "studentCode", "firstName", "lastName", "email"],
      }],
    });
    res.json(enrollments);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Get enrollment by ID
 */
export async function getEnrollmentById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const enrollment = await Enrollment.findByPk(id, {
      include: [{
        model: Student,
        as: "student",
      }],
    });
    if (!enrollment) {
      return res.status(404).json({ message: "Matrícula no encontrada" });
    }
    res.json(enrollment);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Get enrollments by student ID
 */
export async function getEnrollmentsByStudent(req, res, next) {
  try {
    const studentId = Number(req.params.studentId);
    
    // Verificar que el estudiante existe
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const enrollments = await Enrollment.findAll({
      where: { studentId },
      order: [["createdAt", "DESC"]],
    });
    res.json(enrollments);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Create a new enrollment (matricular estudiante)
 */
export async function createEnrollment(req, res, next) {
  try {
    const parse = enrollmentSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        issues: parse.error.format(),
      });
    }

    const payload = parse.data;

    // Verificar que el estudiante existe
    const student = await Student.findByPk(payload.studentId);
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    // Verificar si ya está matriculado en el mismo curso y semestre
    const existingEnrollment = await Enrollment.findOne({
      where: {
        studentId: payload.studentId,
        course: payload.course,
        semester: payload.semester,
        academicYear: payload.academicYear,
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({
        message: "El estudiante ya está matriculado en este curso para este semestre",
      });
    }

    const enrollment = await Enrollment.create(payload);
    
    // Cargar la matrícula con los datos del estudiante
    const enrollmentWithStudent = await Enrollment.findByPk(enrollment.id, {
      include: [{
        model: Student,
        as: "student",
        attributes: ["id", "studentCode", "firstName", "lastName", "email"],
      }],
    });

    res.status(201).json(enrollmentWithStudent);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Update an existing enrollment
 */
export async function updateEnrollment(req, res, next) {
  try {
    const id = Number(req.params.id);
    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ message: "Matrícula no encontrada" });
    }

    const parse = enrollmentSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        issues: parse.error.format(),
      });
    }

    const payload = parse.data;
    await enrollment.update(payload);
    
    // Cargar con datos del estudiante
    const updatedEnrollment = await Enrollment.findByPk(id, {
      include: [{
        model: Student,
        as: "student",
        attributes: ["id", "studentCode", "firstName", "lastName", "email"],
      }],
    });

    res.json(updatedEnrollment);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Delete an enrollment
 */
export async function deleteEnrollment(req, res, next) {
  try {
    const id = Number(req.params.id);
    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ message: "Matrícula no encontrada" });
    }
    await enrollment.destroy();
    res.status(204).send();
  }
  catch (error) {
    next(error);
  }
}
