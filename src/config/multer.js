import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para crear configuración de almacenamiento específica
const createStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../../uploads/${folder}`));
    },
    filename: (req, file, cb) => {
      // Generar nombre único: timestamp-nombreoriginal
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
  });
};

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  else {
    cb(new Error("Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)"));
  }
};

// Configuración de multer para estudiantes
export const uploadStudentImage = multer({
  storage: createStorage("students"),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter,
});

// Configuración de multer para productos
export const uploadProductImage = multer({
  storage: createStorage("products"),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter,
});

// Configuración de multer para clientes
export const uploadCustomerImage = multer({
  storage: createStorage("customers"),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
  },
  fileFilter,
});
