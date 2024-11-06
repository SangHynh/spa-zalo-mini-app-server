const Minigame = require("../models/minigame.model");
const User = require("../models/user.model");

// Lấy danh sách người dùng kèm theo lượt chơi
const getUsersPlayCount = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { keyword } = req.query;

    const query = {};
    if (keyword) {
      const isObjectId = mongoose.Types.ObjectId.isValid(keyword);
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { phone: { $regex: keyword, $options: 'i' } }
      ];
      if (isObjectId) {
        query.$or.push({ _id: new mongoose.Types.ObjectId(keyword) });
      }
    }

    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments(query);

    const userIds = users.map(user => user._id);
    const minigameRecords = await Minigame.find({ userId: { $in: userIds } });

    const playCountMap = {};
    minigameRecords.forEach(record => {
      playCountMap[record.userId] = {
        playCount: record.playCount,
        lastPlayed: record.lastPlayed
      };
    });

    const usersWithPlayCount = users.map(user => ({
      ...user,
      playCount: playCountMap[user._id]?.playCount || 0,
      lastPlayed: playCountMap[user._id]?.lastPlayed || null 
    }));

    return res.status(200).json({
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users: usersWithPlayCount
    });
  } catch (err) {
    res.status(500).json({ message: "An error occurred!", error: err.message });
  }
};

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
  console.log(req.body);
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
    console.log(userInfo);
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
        playCount: bonusPlayCount,
        lastPlayed: Date.now(),
      });
      await minigame.save();
    }
    else {
      minigame.playCount = bonusPlayCount;
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
  updatePlayCount,
  getUsersPlayCount
};
