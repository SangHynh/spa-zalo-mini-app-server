const mongoose = require("mongoose");

/* Không dùng model này vì sẽ thiết kế db theo model-tree-structures-with-materialized-paths

https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-materialized-paths/

*/

// const referralSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     referredUserId: { type: mongoose.Schema.Types.ObjectId },
//     tierLevel: { type: Number, required: true },
//     commissionPercentage: { type: Number, required: true },
//     referredAt: { type: Date, required: true },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Referral = mongoose.model("Referral", referralSchema);

// module.exports = Referral;
