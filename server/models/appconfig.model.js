const mongoose = require("mongoose");

const appConfigSchema = new mongoose.Schema(
  {
    version: { type: String, required: true },
    images: [
      {
        index: { type: Number, required: true },
        url: { type: String, required: true },
      },
    ],
    orderPoints: [
      {
        price: { type: Number, required: true, default: 0 },
        minPoints: { type: Number, required: true, default: 0 },
      },
    ],
    baseCommissionPercent: { type: Number, required: true, default: 10 },
    reductionPerLevelPercent: { type: Number, required: true, default: 20 }
    // ...
  },
  {
    timestamps: true,
  }
);

const AppConfig = mongoose.model("AppConfig", appConfigSchema);

module.exports = AppConfig;
