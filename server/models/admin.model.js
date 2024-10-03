const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
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
    default: [PERMISSIONS.ADMIN],
  },
  zaloId: {
    type: String,
    default: null,
    unique: true,
    sparse: true,
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
module.exports = Admin;
