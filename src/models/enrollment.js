import { DataTypes } from "sequelize";
import sequelize from "../db/config.js";
import Student from "./student.js";

const Enrollment = sequelize.define("Enrollment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Student,
      key: "id",
    },
  },
  course: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  courseCode: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  semester: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  academicYear: {
    type: DataTypes.STRING(10),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  enrollmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM("enrolled", "completed", "dropped", "failed", "in-progress"),
    defaultValue: "enrolled",
  },
  grade: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 100,
    },
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
    },
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: "enrollments",
  timestamps: true,
});

// Definir relaciones
Student.hasMany(Enrollment, {
  foreignKey: "studentId",
  as: "enrollments",
});

Enrollment.belongsTo(Student, {
  foreignKey: "studentId",
  as: "student",
});

export default Enrollment;
