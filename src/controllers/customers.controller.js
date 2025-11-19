import { z } from "zod";
import Customer from "../models/customer.js";

const customerSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  dateOfBirth: z.string().optional(),
  status: z.enum(["active", "inactive", "blocked"]).optional(),
  image: z.string().optional(),
});

/**
 * Get all customers
 */
export async function getAllCustomers(req, res, next) {
  try {
    const customers = await Customer.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(customers);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(customer);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Create a new customer
 */
export async function createCustomer(req, res, next) {
  try {
    const parse = customerSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        issues: parse.error.format(),
      });
    }

    const payload = parse.data;
    
    // Si se subió una imagen, agregar la ruta
    if (req.file) {
      payload.image = `/uploads/customers/${req.file.filename}`;
    }

    const customer = await Customer.create(payload);
    res.status(201).json(customer);
  }
  catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "El email ya existe",
      });
    }
    next(error);
  }
}

/**
 * Update an existing customer
 */
export async function updateCustomer(req, res, next) {
  try {
    const id = Number(req.params.id);
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const parse = customerSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        issues: parse.error.format(),
      });
    }

    const payload = parse.data;
    
    // Si se subió una imagen, agregar la ruta
    if (req.file) {
      payload.image = `/uploads/customers/${req.file.filename}`;
    }

    await customer.update(payload);
    res.json(customer);
  }
  catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "El email ya existe",
      });
    }
    next(error);
  }
}

/**
 * Delete a customer
 */
export async function deleteCustomer(req, res, next) {
  try {
    const id = Number(req.params.id);
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    await customer.destroy();
    res.status(204).send();
  }
  catch (error) {
    next(error);
  }
}
