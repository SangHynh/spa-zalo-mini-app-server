const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const PERMISSIONS = {
  READ_PRODUCTS: "read_products",
  WRITE_PRODUCTS: "write_products",
  DELETE_PRODUCTS: "delete_products",
  READ_SERVICES: "read_services",
  WRITE_SERVICES: "write_services",
  DELETE_SERVICES: "delete_services",
  READ_USERS: "read_users",
  WRITE_USERS: "write_users",
  DELETE_USERS: "delete_users",
  READ_CATEGORIES: "read_categories",
  WRITE_CATEGORIES: "write_categories",
  DELETE_CATEGORIES: "delete_categories",
  READ_BOOKINGS: "read_bookings",
  WRITE_BOOKINGS: "write_bookings",
  DELETE_BOOKINGS: "delete_bookings",
  ADMIN: "admin",
};

const AdminSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    sparse: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "",
    unique: false,
  },
  branch: {
    type: String,
    default: "",
    unique: false,
  },
  permissions: {
    type: [String],
    enum: Object.values(PERMISSIONS),
    default: [
      PERMISSIONS.ADMIN,
    ],
  },
  zaloId: {
    type: String,
    default: null,
    unique: true,
    sparse: true,
  },
  avatar: {
    type: String,
    default: "",
    unique: false,
  },
});

// Hàm hash mật khẩu
AdminSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Hàm kiểm tra mật khẩu hợp lệ
AdminSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = { Admin, PERMISSIONS };
