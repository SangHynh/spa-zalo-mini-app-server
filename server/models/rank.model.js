const mongoose = require("mongoose");

const rankSchema = new mongoose.Schema({
  tier: { type: String, required: true, unique: true },
  minPoints: { type: Number, required: true },
  commissionPercent: { type: Number, default: 0 },
  benefits: { type: String, default: "" },
  color: { type: String, default: "#2979ff" }
});

const Rank = mongoose.model("Rank", rankSchema);

module.exports = Rank;
