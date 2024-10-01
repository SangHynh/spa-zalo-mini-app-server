const { deleteImage } = require('../middlewares/upload.middlewares');
const Product = require('../models/product.model');
const mongoose = require('mongoose');
const moment = require('moment');
const User = require('../models/user.model');
const Recommendation = require('../models/recommendation.model');
exports.findProductToUpdateSuggestScoreOfUser = async (req, res) => {
  const userId = req.body.id;
  const productName = req.params.productName;
  try {
    // Tìm kiếm sản phẩm dựa trên tên với regex
    const products = await Product.find({
      name: { $regex: productName, $options: 'i' } // Tìm kiếm không phân biệt chữ hoa chữ thường
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra và khởi tạo mảng productSuggestions nếu chưa có
    if (!user.productSuggestions) {
      user.productSuggestions = [];
    }

    // Lặp qua các sản phẩm tìm được
    for (const product of products) {
      // Tìm kiếm sản phẩm trong mảng productSuggestions của user
      const existingProduct = user.productSuggestions.find(
        (suggestedProduct) => suggestedProduct.productId && suggestedProduct.productId.toString() === product._id.toString()
      );

      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng điểm suggestedScore lên 1
        existingProduct.suggestedScore += 1;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào mảng
        user.productSuggestions.push({
          productId: product._id,
          productName: product.name,
          suggestedScore: 1
        });
      }
    }

    // Lưu cập nhật vào cơ sở dữ liệu
    const updatedUser = await user.save();

    // Chỉ trả về thông tin cần thiết
    res.status(200).json({
      message: "Updated successfully",
      productSuggestions: updatedUser.productSuggestions
    });
  } catch (error) {
    console.error("Error updating suggested score:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.ratingToUpdateSuggestScoreOfUser = async (req, res) => {
  const userId = req.params.id; // User ID cố định
  const productId = req.body.productID; // Lấy productId từ URL
  const rating = parseInt(req.body.rating, 10); // Lấy rating từ URL và chuyển đổi thành số
  console.log('rating', rating);
  console.log('productId', productId);
  try {
    // Tìm sản phẩm trước
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra và khởi tạo mảng productSuggestions nếu chưa có
    if (!user.productSuggestions) {
      user.productSuggestions = [];
    }

    // Tìm kiếm sản phẩm trong mảng productSuggestions của user
    const existingProduct = user.productSuggestions.find(
      (suggestedProduct) => suggestedProduct.productId && suggestedProduct.productId.toString() === productId
    );

    // Hàm điều chỉnh suggestedScore dựa trên đánh giá
    const adjustSuggestedScore = (rating) => {
      switch (rating) {
        case 1: return -2;
        case 2: return -1;
        case 3: return 1;
        case 4: return 2;
        case 5: return 3;
        default: return 0;
      }
    };

    if (existingProduct) {
      // Nếu sản phẩm đã tồn tại, điều chỉnh điểm suggestedScore
      existingProduct.suggestedScore += adjustSuggestedScore(rating);
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào mảng với điểm suggestedScore ban đầu
      user.productSuggestions.push({
        productId: product._id,
        productName: product.name,
        suggestedScore: adjustSuggestedScore(rating)
      });
    }

    // Lưu cập nhật vào cơ sở dữ liệu
    const updatedUser = await user.save();

    // Chỉ trả về thông tin cần thiết
    res.status(200).json({
      message: "Updated successfully",
      productSuggestions: updatedUser.productSuggestions
    });
  } catch (error) {
    console.error("Error updating suggested score:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
//update suggest product for multiple products
exports.updateSuggestedScoresForMultipleProducts = async (req, res) => {
  const userId = req.body.userID; // Lấy user ID từ body
  const products = req.body.products; // Lấy mảng sản phẩm từ body

  try {
    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra và khởi tạo mảng productSuggestions nếu chưa có
    if (!user.productSuggestions) {
      user.productSuggestions = [];
    }

    for (const productInfo of products) {
      const productId = productInfo.productID;

      // Tìm sản phẩm
      const product = await Product.findById(productId);
      if (!product) {
        // Nếu sản phẩm không tồn tại, bỏ qua và tiếp tục với sản phẩm tiếp theo
        console.log(`Product with ID ${productId} not found`);
        continue;
      }

      // Tìm kiếm sản phẩm trong mảng productSuggestions của user
      const existingProduct = user.productSuggestions.find(
        (suggestedProduct) => suggestedProduct.productId && suggestedProduct.productId.toString() === productId
      );

      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, tăng điểm suggestedScore thêm 1
        existingProduct.suggestedScore += 1;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào mảng với điểm suggestedScore = 0
        user.productSuggestions.push({
          productId: product._id,
          productName: product.name,
          suggestedScore: 0
        });
      }

      // Giới hạn tối đa chỉ giữ 5 sản phẩm trong mảng productSuggestions
      if (user.productSuggestions.length > 5) {
        // Loại bỏ sản phẩm cũ nhất nếu vượt quá 5
        user.productSuggestions.shift();
      }
    }

    // Lưu cập nhật vào cơ sở dữ liệu
    const updatedUser = await user.save();

    // Chỉ trả về thông tin cần thiết
    res.status(200).json({
      message: "Updated successfully",
      productSuggestions: updatedUser.productSuggestions
    });
  } catch (error) {
    console.error("Error updating suggested scores:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// SUGGEST PRODUCTS FOR USER
exports.configureProductRecommendations = async (req, res) => {
  const mainProductId = req.body.mainProductId;
  const suggestions = req.body.suggestions;

  console.log('Main Product ID:', mainProductId);
  console.log('Suggestions:', suggestions);

  try {
    // Tìm sản phẩm chính
    const mainProduct = await Product.findById(mainProductId);
    if (!mainProduct) {
      return res.status(404).json({ message: "Main product not found" });
    }

    const suggestionEntries = [];
    for (const suggestion of suggestions) {
      const { productId } = suggestion;

      // Tìm sản phẩm gợi ý
      const suggestedProduct = await Product.findById(productId);
      if (!suggestedProduct) {
        return res.status(404).json({ message: "Sub product not found" });
      }

      suggestionEntries.push({
        productId: productId,
        productName: suggestedProduct.name
      });
    }

    // Kiểm tra và lưu vào cơ sở dữ liệu
    if (suggestionEntries.length > 0) {
      // Kiểm tra xem đã có recommendation với mainProductId chưa
      let recommendation = await Recommendation.findOne({ mainProductId: mainProductId });

      if (recommendation) {
        // Nếu đã có, cập nhật sản phẩm gợi ý
        recommendation.products = suggestionEntries;
        await recommendation.save();
        console.log('Recommendations updated successfully');
      } else {
        // Nếu chưa có, tạo mới recommendation
        recommendation = new Recommendation({
          mainProductId: mainProductId,
          mainProductName: mainProduct.name, // Đổi tên thuộc tính cho đúng với schema
          products: suggestionEntries // Đảm bảo tên thuộc tính khớp với schema
        });

        await recommendation.save();
        console.log('Recommendations collection created successfully');
      }

      console.log(`Added recommendations for main product: ${mainProduct.name}`);
    } else {
      console.log('No suggestions available to insert');
    }

    res.status(200).json({
      message: "Recommendations processed successfully",
      mainProduct: {
        id: mainProduct._id,
        name: mainProduct.name,
      },
      suggestions: suggestionEntries,
      collection: "Recommendation"
    });
  } catch (error) {
    console.error("Error processing product recommendations:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

