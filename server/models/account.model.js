const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const AccountSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: function () {
      return this.role === "admin";
    },
  },
  zaloId: {
    type: String,
    unique: function () {
      return this.role === "user";
    },
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
