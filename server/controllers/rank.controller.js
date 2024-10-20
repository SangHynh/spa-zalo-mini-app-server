const Rank = require("../models/rank.model");
const User = require("../models/user.model");

class RankController {
  // GET
  async getRanks(req, res) {
    try {
      const ranks = await Rank.find().sort({ minPoints: 1 });
      return res.status(200).json(ranks);
    } catch (error) {
      console.error("Error fetching ranks:", error);
      res.status(500).json({ error: "An error occurred while fetching ranks" });
    }
  }

  // UPDATE
  async updateRank(req, res) {
    const { rankId } = req.params;
    const { tier, minPoints, commissionPercent, benefits } = req.body;

    try {
      const rank = await Rank.findById(rankId);
      if (!rank) return res.status(404).json({ error: "Rank not found" });

      // Lưu trữ giá trị cũ của minPoints
      const oldMinPoints = rank.minPoints;

      // Cập nhật các trường
      rank.tier = tier || rank.tier;
      rank.minPoints = minPoints !== undefined ? minPoints : rank.minPoints;
      rank.commissionPercent =
        commissionPercent !== undefined
          ? commissionPercent
          : rank.commissionPercent;
      rank.benefits = Array.isArray(benefits)
        ? benefits.join(", ")
        : benefits || rank.benefits;

      // Kiểm tra nếu minPoints đã thay đổi
      if (minPoints !== undefined && minPoints !== oldMinPoints) {
        // Kiểm tra và cập nhật các bản ghi khác nếu cần
        const conflictingRanks = await Rank.find({
          minPoints: { $gte: minPoints, $lt: oldMinPoints },
        });

        // Nếu có bản ghi bị xung đột, tăng minPoints của chúng lên
        for (let conflictingRank of conflictingRanks) {
          conflictingRank.minPoints += 1; // Hoặc một giá trị nào đó phù hợp
          await conflictingRank.save();
        }
      }

      // Lưu bản ghi đã cập nhật
      await rank.save();
      return res
        .status(200)
        .json({ message: "Rank updated successfully", rank });
    } catch (error) {
      console.error("Error updating rank:", error);
      res.status(500).json({ error: "An error occurred while updating rank" });
    }
  }

  // CREATE
  async createRank(req, res) {
    const { tier, minPoints, commissionPercent, benefits } = req.body;

    try {
      // Kiểm tra các bản ghi hiện có
      const existingRanks = await Rank.find().sort({ minPoints: 1 });

      // Nếu minPoints nhỏ hơn bản ghi nhỏ nhất hiện có, cập nhật chúng
      if (existingRanks.length > 0 && minPoints < existingRanks[0].minPoints) {
        // Tăng minPoints của các bản ghi hiện có
        for (let rank of existingRanks) {
          rank.minPoints += 1; // Hoặc một giá trị nào đó phù hợp với logic của bạn
          await rank.save();
        }
      }

      const newRank = new Rank({
        tier,
        minPoints,
        commissionPercent,
        benefits,
      });

      await newRank.save();
      return res
        .status(201)
        .json({ message: "Rank created successfully", rank: newRank });
    } catch (error) {
      console.error("Error creating rank:", error);
      res.status(500).json({ error: "An error occurred while creating rank" });
    }
  }

  // DELETE
  async deleteRank(req, res) {
    const { rankId } = req.params;

    try {
      const deletedRank = await Rank.findByIdAndDelete(rankId);
      if (!deletedRank) {
        return res.status(404).json({ error: "Rank not found" });
      }
      res.json({ message: "Rank deleted successfully", rank: deletedRank });
    } catch (error) {
      console.error("Error deleting rank:", error);
      res.status(500).json({ error: "An error occurred while deleting rank" });
    }
  }

  // // CHECK USER'S RANK (REMOVE)
  // async getCurrentUserRank(req, res) {
  //   try {
  //     const userId = req.payload.aud

  //     const user = await User.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }

  //     const ranks = await Rank.find().sort({ minPoints: -1 });

  //     let updatedTier = user.membershipTier;
  //     for (const rank of ranks) {
  //       if (user.rankPoints >= rank.minPoints) {
  //         updatedTier = rank.tier;
  //         break;
  //       }
  //     }

  //     if (user.membershipTier !== updatedTier) {
  //       user.membershipTier = updatedTier;
  //       await user.save();
  //     }

  //     return res.status(200).json({
  //       message: `User's rank checked and updated`,
  //       userId: user._id,
  //       membershipTier: user.membershipTier,
  //       rankPoints: user.rankPoints,
  //     });
  //   } catch (error) {
  //     return res.status(500).json({ message: "An error occurred: " + error.message });
  //   }
  // }
}

module.exports = new RankController();
