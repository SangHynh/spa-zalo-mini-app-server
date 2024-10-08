const mongoose = require("mongoose");

const rankSchema = new mongoose.Schema({
  tier: { type: String, required: true, unique: true },
  minPoints: { type: Number, required: true },
  benefits: { type: String, default: "" },
});

const Rank = mongoose.model("Rank", rankSchema);

module.exports = Rank;
