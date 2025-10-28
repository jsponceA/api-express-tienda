import { z } from "zod";
import Book from "../models/book.js";

const bookSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  author: z.string().min(1, "El autor es requerido"),
  isbn: z.string().min(10).max(20).optional(),
  publisher: z.string().optional(),
  publicationYear: z.number().int().min(1000).max(new Date().getFullYear() + 1).optional(),
  genre: z.string().optional(),
  language: z.string().optional(),
  pages: z.number().int().positive().optional(),
  price: z.number().nonnegative(),
  description: z.string().optional(),
  inStock: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
});

/**
 * Get all books
 */
export async function getAllBooks(req, res, next) {
  try {
    const books = await Book.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(books);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Get book by ID
 */
export async function getBookById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    res.json(book);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Create a new book
 */
export async function createBook(req, res, next) {
  try {
    const parse = bookSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        issues: parse.error.format(),
      });
    }

    const payload = parse.data;
    const book = await Book.create({
      title: payload.title,
      author: payload.author,
      isbn: payload.isbn,
      publisher: payload.publisher,
      publicationYear: payload.publicationYear,
      genre: payload.genre,
      language: payload.language || "Español",
      pages: payload.pages,
      price: payload.price,
      description: payload.description,
      inStock: payload.inStock ?? true,
      rating: payload.rating,
    });
    res.status(201).json(book);
  }
  catch (error) {
    // Manejar error de ISBN duplicado
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "El ISBN ya existe en la base de datos",
      });
    }
    next(error);
  }
}

/**
 * Update an existing book
 */
export async function updateBook(req, res, next) {
  try {
    const id = Number(req.params.id);
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }

    const parse = bookSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        issues: parse.error.format(),
      });
    }

    const payload = parse.data;
    await book.update(payload);
    res.json(book);
  }
  catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "El ISBN ya existe en la base de datos",
      });
    }
    next(error);
  }
}

/**
 * Delete a book
 */
export async function deleteBook(req, res, next) {
  try {
    const id = Number(req.params.id);
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    await book.destroy();
    res.status(204).send();
  }
  catch (error) {
    next(error);
  }
}
