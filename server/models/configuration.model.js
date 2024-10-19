const mongoose = require("mongoose");

const configurationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Thêm trường userId
  type: { type: String, enum: ["service", "product"], required: true },
  configSuggestions: [
    {
     
      id: { type: String },  // ID của sản phẩm/ dịch vụ
      name: { type: String },  // Tên sản phẩm/ dịch vụ
    }
  ],
});

const Configuration = mongoose.model("Configuration", configurationSchema);

module.exports = Configuration;
