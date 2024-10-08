const Rank = require("../models/rank.model");

class RankController {
  // GET
  async getRanks(req, res) {
    try {
      const ranks = await Rank.find().sort({ minPoints: 1 });
      res.json(ranks);
    } catch (error) {
      console.error("Error fetching ranks:", error);
      res.status(500).json({ error: "An error occurred while fetching ranks" });
    }
  }

  // UPDATE
  async updateRank(req, res) {
    const { rankId } = req.params;
    const { tier, minPoints } = req.body;

    try {
      const rank = await Rank.findById(rankId);
      if (!rank) return res.status(404).json({ error: "Rank not found" });

      rank.tier = tier;
      rank.minPoints = minPoints;

      await rank.save();
      res.json({ message: "Rank updated successfully", rank });
    } catch (error) {
      console.error("Error updating rank:", error);
      res.status(500).json({ error: "An error occurred while updating rank" });
    }
  }
}

module.exports = new RankController();
