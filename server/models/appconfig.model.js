const mongoose = require("mongoose");

const appConfigSchema = new mongoose.Schema(
  {
    version: { type: String, required: true },
    images: {
      type: [
        {
          index: { type: Number, required: true },
          url: { type: String, required: true },
        },
      ],
      required: true,
      default: [],
    },
    // ...
  },
  {
    timestamps: true,
  }
);

const AppConfig = mongoose.model("AppConfig", appConfigSchema);

module.exports = AppConfig;
