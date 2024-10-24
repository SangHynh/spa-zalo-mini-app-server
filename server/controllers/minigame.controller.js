const Minigame = require("../models/minigame.model");
const User = require("../models/user.model");

// Lấy lượt chơi hiện tại của người dùng
const getPlayCount = async (req, res) => {
  const userId = req.body.userId; // Nhận từ request body
  try {
    let minigame = await Minigame.findOne({ userId });
    // Nếu người dùng chưa có minigame record thì tạo mới
    if (!minigame) {
      let user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      minigame = new Minigame({
        userId: user._id,
        playCount: 10,
        lastPlayed: Date.now(),
      });
      await minigame.save();
    }
    res.status(200).json({ playCount: minigame });
  } catch (err) {
    res.status(500).json({ message: "An error occurred!", error: err.message });
  }
};

// Chơi minigame: Giảm lượt chơi
const playMinigame = async (req, res) => {
  const userId = req.body.userId; // Nhận từ request body
  try {
    let minigame = await Minigame.findOne({ userId });
    // Kiểm tra xem người dùng có record minigame không
    if (!minigame) {
      return res.status(404).json({ message: "Minigame record not found" });
    }
    // Kiểm tra xem lần cuối chơi là ngày hôm nay hay không
    const today = new Date();
    const lastPlayed = new Date(minigame.lastPlayed);
    if (
      lastPlayed.getDate() !== today.getDate() ||
      lastPlayed.getMonth() !== today.getMonth() ||
      lastPlayed.getFullYear() !== today.getFullYear()
    ) {
      minigame.playCount = 10; // Reset lượt chơi về 10
    }
    // Kiểm tra lượt chơi người dùng
    if (minigame.playCount <= 0) {
      return res
        .status(400)
        .json({ message: "You have no more plays left for today!" });
    }
    // Giảm lượt chơi
    minigame.playCount -= 1;
    // Cập nhật thời gian chơi lần cuối
    minigame.lastPlayed = Date.now();
    await minigame.save();
    res
      .status(200)
      .json({ message: "You have started playing the minigame!", minigame });
  } catch (err) {
    res.status(500).json({ message: "An error occurred!", error: err.message });
  }
};

// Cập nhật điểm số sau khi kết thúc trò chơi
const updatePoints = async (req, res) => {
  const userId = req.body.userId; // Nhận từ request body game
  const gamePoints = req.body.points; // Điểm trò chơi từ body
  try {
    console.log(userId);
    
    let user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Cập nhật điểm số trực tiếp
    user.points += gamePoints;
    user.rankPoints += gamePoints;
    await user.save();
    const userInfo = {
      _id: user._id,
      name: user.name,
      points: user.points,
      rankPoints: user.rankPoints
    };
    res.status(200).json({ message: "Points updated successfully!", userInfo });
  } catch (err) {
    res.status(500).json({ message: "An error occurred!", error: err.message });
  }
};

// Update lượt chơi người dùng cấu hình theo CMS
const updatePlayCount = async (req, res) => {
  const userId = req.body.userId;
  const bonusPlayCount = req.body.playCount; //thêm số lượt chơi
  try {
    let minigame = await Minigame.findOne({ userId });    
    if (!minigame) {
      let user = await User.findOne({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      minigame = new Minigame({
        userId: user._id,
        playCount: 10 + bonusPlayCount,
        lastPlayed: Date.now(),
      });
      await minigame.save();
    }
    else {
      minigame.playCount += bonusPlayCount;
      await minigame.save();
    }
    res.status(200).json({ message: "Play count updated successfully!", minigame });
  } catch (err) {
    res.status(500).json({ message: "An error occurred!", error: err.message });
  }
};

module.exports = {
  getPlayCount,
  playMinigame,
  updatePoints,
  updatePlayCount
};
