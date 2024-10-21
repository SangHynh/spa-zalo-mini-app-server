const Minigame = require('../models/minigame.model'); 
const User = require('../models/user.model'); 

// Chơi minigame: Giảm lượt chơi
const playMinigame = async (req, res) => {
    const userId = req.body.userId; // Nhận từ request body client truyền theo param -> web minigame -> server
    try {
        let minigame = await Minigame.findOne({ userId });
        // Người dùng chưa có minigame record thì tạo mới
        if (!minigame) {
            minigame = new Minigame({
                userId: userId,
                playCount: 10, 
                lastPlayed: Date.now(),
            });
        }
        // Kiểm tra xem lần cuối chơi là ngày hôm nay hay không
        const today = new Date();
        const lastPlayed = new Date(minigame.lastPlayed);
        if (
            lastPlayed.getDate() !== today.getDate() ||
            lastPlayed.getMonth() !== today.getMonth() ||
            lastPlayed.getFullYear() !== today.getFullYear()
        ) {
            minigame.playCount = 10;
        }
        // Kiểm tra lượt chơi người dùng
        if (minigame.playCount <= 0) {
            return res.status(400).json({ message: 'You have no more plays left for today!' });
        }
        // Giảm lượt chơi
        minigame.playCount -= 1;
        // Cập nhật thời gian chơi lần cuối
        minigame.lastPlayed = Date.now();
        await minigame.save();
        res.status(200).json({ message: 'You have started playing the minigame!', minigame });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred!', error: err.message });
    }
};

// Cập nhật điểm số sau khi kết thúc trò chơi
const updatePoints = async (req, res) => {
    const userId = req.body.userId; // Nhận từ request body game
    const gamePoints = req.body.points; // Điểm trò chơi từ body
    try {
        let user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Cập nhật điểm số trực tiếp
        user.points += gamePoints;
        await user.save();
        const userInfo = {
            _id: user._id,
            name: user.name,
            points: user.points,
        }
        res.status(200).json({ message: 'Points updated successfully!', userInfo });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred!', error: err.message });
    }
};

module.exports = {
    playMinigame,
    updatePoints,
};
