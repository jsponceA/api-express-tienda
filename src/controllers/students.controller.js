import { z } from "zod";
import Student from "../models/student.js";
import Enrollment from "../models/enrollment.js";

const studentSchema = z.object({
  studentCode: z.string().min(1, "El código de estudiante es requerido"),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  enrollmentDate: z.string().optional(),
  status: z.enum(["active", "inactive", "graduated", "suspended"]).optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  image: z.string().optional(), // Se maneja con req.file
});

/**
 * Get all students
 */
export async function getAllStudents(req, res, next) {
  try {
    const students = await Student.findAll({
      order: [["createdAt", "DESC"]],
      include: [{
        model: Enrollment,
        as: "enrollments",
      }],
    });
    res.json(students);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Get student by ID
 */
export async function getStudentById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const student = await Student.findByPk(id, {
      include: [{
        model: Enrollment,
        as: "enrollments",
      }],
    });
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.json(student);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Create a new student
 */
export async function createStudent(req, res, next) {
  try {
    const parse = studentSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        issues: parse.error.format(),
      });
    }

    const payload = parse.data;
    
    // Si se subió una imagen, agregar la ruta
    if (req.file) {
      payload.image = `/uploads/students/${req.file.filename}`;
    }

    const student = await Student.create(payload);
    res.status(201).json(student);
  }
  catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "El código de estudiante o email ya existe",
      });
    }
    next(error);
  }
}

/**
 * Update an existing student
 */
export async function updateStudent(req, res, next) {
  try {
    const id = Number(req.params.id);
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const parse = studentSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        issues: parse.error.format(),
      });
    }

    const payload = parse.data;
    
    // Si se subió una nueva imagen, actualizar la ruta
    if (req.file) {
      payload.image = `/uploads/students/${req.file.filename}`;
    }

    await student.update(payload);
    res.json(student);
  }
  catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "El código de estudiante o email ya existe",
      });
    }
    next(error);
  }
}

/**
 * Delete a student
 */
export async function deleteStudent(req, res, next) {
  try {
    const id = Number(req.params.id);
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    await student.destroy();
    res.status(204).send();
  }
  catch (error) {
    next(error);
  }
}
