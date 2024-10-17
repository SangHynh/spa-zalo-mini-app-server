const { signAccessToken, signRefreshToken } = require("../configs/jwt.config");
const { Admin } = require("../models/admin.model");
const User = require("../models/user.model");
const { zaloPhoneService } = require("../services/zalo.service");
const mongoose = require('mongoose');
const createError = require("http-errors");

// Controller để tạo người dùng mới
const createUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      membershipTier,
      points,
      history,
      referralCode,
      discountsUsed,
      serviceHistory,
    } = req.body;

    const user = new User({
      name,
      phone,
      membershipTier,
      points,
      history,
      referralCode,
      discountsUsed,
      serviceHistory,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(400).json({ message: error.message });
  }
};

const createStaff = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      permissions,
      role
    } = req.body;

    // Kiểm tra role không khớp
    if (!role || !["admin"].includes(role)) {
      throw createError.BadRequest("Invalid role");
    }

    if (!email || !password) {
      throw createError.BadRequest("Email and password are required");
    }

    const doesExist = await Admin.findOne({ email });
    if (doesExist) {
      throw createError.Conflict(`Admin is already registered`);
    }

    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const avatar = imageUrls.length > 0 ? imageUrls[0] : '';

    // Tạo tài khoản admin mới
    const newAdmin = new Admin({ email, password, zaloId: email, name, permissions, avatar });
    const savedAdmin = await newAdmin.save();

    // Chuyển đối tượng Mongoose thành object và loại bỏ thuộc tính password
    const adminData = savedAdmin.toObject();
    delete adminData.password;

    // Tạo access token và refresh token
    const accessToken = await signAccessToken(savedAdmin.id);
    const refreshToken = await signRefreshToken(savedAdmin.id);

    // Trả về kết quả đăng ký thành công
    return res.status(201).json({ admin: adminData, accessToken, refreshToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller để lấy tất cả nhân viên
const getAllStaffs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { keyword, sortBy, sortOrder } = req.query;

    // Tạo điều kiện tìm kiếm
    const query = {};

    if (keyword) {
      const isObjectId = mongoose.Types.ObjectId.isValid(keyword);

      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
      ];

      if (isObjectId) {
        query.$or.push({ _id: new mongoose.Types.ObjectId(keyword) });
      }
    }

    const staffs = await Admin.find(query)
      .skip(skip)
      .limit(limit)
      .select('-password');
    // .sort(sortCriteria)

    const totalStaffs = await Admin.countDocuments(query);

    return res.status(200).json({
      totalStaffs,
      currentPage: page,
      totalPages: Math.ceil(totalStaffs / limit),
      staffs
    });
  } catch (error) {
    console.error("Error fetching staffs:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Controller để lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { keyword, sortBy, sortOrder } = req.query;

    // Tạo điều kiện tìm kiếm
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
    // .sort(sortCriteria)

    const totalUsers = await User.countDocuments(query);

    return res.status(200).json({
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users
    });
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
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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

// Cập nhật thông tin người dùng theo ID Zalo
const updateUserInfo = async (req, res) => {
  const { zaloId } = req.params;
  const { name, gender } = req.body;
  try {
    // Tìm kiếm người dùng theo zaloId từ mô hình User
    const user = await User.findOne({ zaloId: zaloId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    await user.save();
    const userInfo = {
      _id: user._id,
      zaloId: user.zaloId,
      name: user.name,
      gender: user.gender,
    };
    res
      .status(200)
      .json({ message: "User info updated successfully", userInfo });
  } catch (error) {
    console.error("Error updating user:", error.message);
  }
};

// Cập nhật số điện thoại người dùng
const updateUserPhone = async (req, res) => {
  const { zaloId } = req.params;
  const phoneToken = req.headers["phone-token"];
  const zaloAccessToken = req.headers["zalo-access-token"];
  try {
    // Tìm kiếm người dùng theo zaloId từ mô hình User
    const user = await User.findOne({ zaloId: zaloId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const phoneData = await zaloPhoneService(phoneToken, zaloAccessToken);
    console.log(phoneData);
    const phone = phoneData?.data?.data?.number ?? null;

    // Cấp nhật số điện thoại người dùng
    if (user.phone !== phone && phone) {
      user.phone = phone;
      await user.save();
      const userInfo = {
        _id: user._id,
        zaloId: user.zaloId,
        phone: user.phone,
      };
      res
        .status(200)
        .json({ message: "User info updated successfully", userInfo });
    } else {
      return res.status(204).send();
    }
  } catch (error) {
    console.error("Error updating user:", error.message);
  }
};
const suggestProductsForUser = async (req, res) => {
  try {
    // Lấy thông tin của khách hàng hiện tại từ req.params.id
    const customerId = req.params.id;
    const customer = await User.findById(customerId);

    // Kiểm tra nếu không tìm thấy khách hàng
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Lấy danh sách productId mà khách hàng hiện tại đã có
    const customerProductIds = customer.suggestions.map(
      (suggestion) => suggestion.productId
    );

    // Tìm sản phẩm từ các khách hàng khác không phải là khách hàng hiện tại
    const otherUsers = await User.find({ _id: { $ne: customerId } });

    // Tạo một đối tượng để lưu trữ điểm gợi ý trung bình cho các sản phẩm
    const productScores = {};

    // Duyệt qua các sản phẩm của khách hàng khác
    otherUsers.forEach((user) => {
      user.suggestions.forEach((suggestion) => {
        // Nếu sản phẩm không có trong danh sách của khách hàng hiện tại
        if (!customerProductIds.includes(suggestion.productId)) {
          if (!productScores[suggestion.productId]) {
            productScores[suggestion.productId] = {
              productName: suggestion.productName,
              totalScore: 0,
              count: 0,
            };
          }
          // Cộng dồn điểm và số lượng
          productScores[suggestion.productId].totalScore +=
            suggestion.suggestedScore;
          productScores[suggestion.productId].count += 1;
        }
      });
    });

    // Tính điểm trung bình cho mỗi sản phẩm
    const averageScores = Object.entries(productScores).map(
      ([productId, { productName, totalScore, count }]) => {
        return {
          productId,
          productName,
          averageScore: totalScore / count,
        };
      }
    );

    // Sắp xếp sản phẩm dựa trên điểm trung bình (cao đến thấp) và lấy top 3
    const topRecommendations = averageScores
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3);

    // Trả về danh sách sản phẩm gợi ý
    return res.status(200).json({
      message: "Suggested products found successfully",
      recommendations: topRecommendations,
    });
  } catch (error) {
    console.error("Error suggesting products:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin người dùng theo ID Zalo
const getUserInfo = async (req, res) => {
  const { zaloId } = await req.params; // Lấy zaloId từ path parameters
  try {
    // Tìm kiếm người dùng theo accountId từ mô hình User
    const user = await User.findOne({ zaloId: zaloId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Trả về thông tin người dùng cùng với zaloId
    const userInfo = {
      _id: user._id,
      // accountId: user.accountId,
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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserPhone,
  updateUserInfo,
  suggestProductsForUser,
  getUserInfo,
  createStaff,
  getAllStaffs,
};
