const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const AccountSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    sparse: true, // Cho phép bỏ qua các giá trị null trong email
  },
  zaloId: {
    type: String,
    sparse: true, // Cho phép bỏ qua các giá trị null trong zaloId
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: true,
  },
});

// Index cho email chỉ khi role là admin và email không null
AccountSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { role: "admin", email: { $ne: null } } }
);

// Index cho zaloId chỉ khi role là user và zaloId không null
AccountSchema.index(
  { zaloId: 1 },
  { unique: true, partialFilterExpression: { role: "user", zaloId: { $ne: null } } }
);


AccountSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

AccountSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error; 
  }
}

const Account = mongoose.model("Account", AccountSchema);
module.exports = Account;
