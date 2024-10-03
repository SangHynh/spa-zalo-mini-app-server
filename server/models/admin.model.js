const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

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
