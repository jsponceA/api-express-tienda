import { z } from "zod";
import Product from "../models/product.js";

const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  description: z.string().optional(),
  inStock: z.boolean().optional(),
  image: z.string().optional(),
});

/**
 * Get all products
 */
export async function getAllProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.json(products);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Get product by ID
 */
export async function getProductById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Create a new product
 */
export async function createProduct(req, res, next) {
  try {
    const parse = productSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Invalid product",
        issues: parse.error.format(),
      });
    }

    const payload = parse.data;
    
    // Si se subió una imagen, agregar la ruta
    if (req.file) {
      payload.image = `/uploads/products/${req.file.filename}`;
    }
    
    const product = await Product.create({
      name: payload.name,
      price: payload.price,
      description: payload.description,
      inStock: payload.inStock ?? true,
      image: payload.image,
    });
    res.status(201).json(product);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const parse = productSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({
        message: "Invalid product",
        issues: parse.error.format(),
      });
    }

    const payload = parse.data;
    
    // Si se subió una imagen, agregar la ruta
    if (req.file) {
      payload.image = `/uploads/products/${req.file.filename}`;
    }
    
    await product.update({
      name: payload.name,
      price: payload.price,
      description: payload.description,
      inStock: payload.inStock,
      image: payload.image,
    });
    res.json(product);
  }
  catch (error) {
    next(error);
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await product.destroy();
    res.status(204).send();
  }
  catch (error) {
    next(error);
  }
}
