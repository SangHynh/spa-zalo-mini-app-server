const User = require('../models/user.model');
const Account = require('../models/account.model');

// Controller để tạo người dùng mới
const createUser = async (req, res) => {
  try {
    const { name, phone, membershipTier, points, history, referralCode, discountsUsed, serviceHistory } = req.body;

    const user = new User({
      name,
      phone,
      membershipTier,
      points,
      history,
      referralCode,
      discountsUsed,
      serviceHistory
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Controller để lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller để lấy thông tin người dùng theo ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller để sửa người dùng theo ID
const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Controller để xóa người dùng theo ID
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(204).json();
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin người dùng theo ID Zalo
const getUserInfo = async (req, res) => {
  const { zaloId } = await req.params; // Lấy zaloId từ path parameters
  try {
    // Tìm kiếm người dùng theo zaloId từ mô hình Account
    const account = await Account.findOne({ zaloId });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    // Tìm kiếm người dùng theo accountId từ mô hình User
    const user = await User.findOne({ accountId: account._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Trả về thông tin người dùng cùng với zaloId
    const userInfo = {
      _id: user._id,
      accountId: user.accountId,
      name: user.name,
      urlImage: user.urlImage,
      phone: user.phone,
      membershipTier: user.membershipTier,
      points: user.points,
      zaloId: account.zaloId, 
    };
    res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin người dùng theo ID Zalo
const updateUserInfo = async (req, res) => {
  const { zaloId } = req.params; 
  const { name, phone } = req.body;   
  try {
    // Tìm kiếm người dùng theo zaloId từ mô hình Account
    const account = await Account.findOne({ zaloId });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }
    // Tìm kiếm người dùng theo accountId từ mô hình User
    const user = await User.findOne({ accountId: account._id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();
    const userInfo = {
      _id: user._id,
      accountId: user.accountId,
      name: user.name,
      phone: user.phone
    };
    res.status(200).json({ message: "User info updated successfully", userInfo });
  } catch (error) {
    console.error("Error updating user:", error.message);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserInfo,
  updateUserInfo,
};
