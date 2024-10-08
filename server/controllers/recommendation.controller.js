const { deleteImage } = require('../middlewares/upload.middlewares');
const Product = require('../models/product.model');
const Service = require('../models/service.model');
const mongoose = require('mongoose');
const moment = require('moment');
const Review = require('../models/review.model');
const User = require('../models/user.model');
const Recommendation = require('../models/recommendation.model');
exports.findProductToUpdateSuggestScoreOfUser = async (req, res) => {
  const userId = req.body.id; // Lấy user ID từ body
  const productName = req.params.productName; // Lấy product name từ params

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

    // Kiểm tra và khởi tạo mảng suggestions nếu chưa có
    if (!user.suggestions) {
      user.suggestions = [];
    }

    // Lặp qua các sản phẩm tìm được
    for (const product of products) {
      const categoryId = product.categoryId; // Lấy categoryId từ sản phẩm
      const category = product.category; // Lấy category từ sản phẩm

      // Tìm kiếm category trong mảng suggestions của user
      const existingCategory = user.suggestions.find(
        (suggestedCategory) => suggestedCategory.categoryId && suggestedCategory.categoryId.toString() === categoryId.toString()
      );

      if (existingCategory) {
        // Nếu category đã tồn tại, tăng điểm suggestedScore lên 1
        existingCategory.suggestedScore += 1;
      } else {
        // Nếu category chưa tồn tại, thêm category mới vào mảng với điểm suggestedScore = 1
        user.suggestions.push({
          categoryId: categoryId,
          category: category, // Đảm bảo thêm category vào đây
          suggestedScore: 1
        });
      }
    }

    // Lưu cập nhật vào cơ sở dữ liệu
    const updatedUser = await user.save();

    // Trả về thông tin cần thiết cùng với danh sách sản phẩm tìm kiếm
    res.status(200).json({
      message: "Updated successfully",
      suggestions: updatedUser.suggestions,
      products: products // Thêm danh sách sản phẩm tìm được vào phản hồi
    });
  } catch (error) {
    console.error("Error updating suggested score:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.ratingToUpdateSuggestScoreOfUser = async (req, res) => {
  const userId = req.params.id; // User ID cố định
  const productId = req.body.productID; // Lấy productId từ body
  const rating = parseInt(req.body.rating, 10); // Lấy rating từ body và chuyển đổi thành số
  const comment = req.body.comment;
  const images = req.body.images || []; // Mảng hình ảnh từ body, nếu có
  try {
    // Tìm sản phẩm trước
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Lấy thông tin category từ sản phẩm
    const categoryId = product.categoryId;
    const category = product.category;
    console.log('Category ID:', categoryId);
    console.log('Category Name:', category);

    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra và khởi tạo mảng suggestions nếu chưa có
    if (!user.suggestions) {
      user.suggestions = [];
    }

    // Tìm kiếm category trong mảng suggestions của user
    const existingCategory = user.suggestions.find(
      (suggestedCategory) => suggestedCategory.categoryId && suggestedCategory.categoryId.toString() === categoryId.toString()
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

    if (existingCategory) {
      // Nếu category đã tồn tại, điều chỉnh điểm suggestedScore
      existingCategory.suggestedScore += adjustSuggestedScore(rating);
    } else {
      // Nếu category chưa tồn tại, thêm category mới vào mảng với điểm suggestedScore ban đầu
      user.suggestions.push({
        categoryId: categoryId,
        category: category, 
        suggestedScore: adjustSuggestedScore(rating)
      });
    }

    // Lưu cập nhật vào cơ sở dữ liệu
    const updatedUser = await user.save();

    // Tạo mới một review cho sản phẩm
    const review = new Review({
      productId: productId,
      productName: product.name,  // Assuming product has 'name' field
      comment: comment,
      rating: rating,
      images: images,
      userId: userId,
    });

    // Lưu đánh giá vào cơ sở dữ liệu
    await review.save();

    // Chỉ trả về thông tin cần thiết
    res.status(200).json({
      message: "Updated successfully",
      suggestions: updatedUser.suggestions,
      review: {
        productId: review.productId,
        productName: review.productName,
        rating: review.rating,
        comment: review.comment,
        images: review.images
      }
    });
  } catch (error) {
    console.error("Error updating suggested score and saving review:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get reviews by product ID
exports.getReviewsByProductId = async (req, res) => {
  const productId = req.params.productId; // Lấy productId từ params
  console.log('Product ID:', productId);
  try {
    // Tìm tất cả review theo productId
    const reviews = await Review.find({ productId: productId });

    // Nếu không tìm thấy review nào
    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this product." });
    }

    // Trả về danh sách review
    res.status(200).json({
      message: "Reviews fetched successfully.",
      reviews: reviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

//update suggest product for multiple products
// Update suggested scores for multiple products
exports.updateSuggestedScoresForMultipleProducts = async (req, res) => {
  const userId = req.body.userID; // Lấy user ID từ body
  const products = req.body.products; // Lấy mảng sản phẩm từ body

  try {
    // Tìm người dùng
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra và khởi tạo mảng suggestions nếu chưa có
    if (!user.suggestions) {
      user.suggestions = []; // Sửa lỗi đánh máy từ saveuggestions thành suggestions
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
      const categoryId = product.categoryId;
      const category = product.category;
      console.log('Category ID:', categoryId);
      console.log('Category Name:', category);

      // Tìm kiếm category trong mảng suggestions của user
      const existingCategory = user.suggestions.find(
        (suggestedCategory) => suggestedCategory.categoryId && suggestedCategory.categoryId.toString() === product.categoryId.toString()
      );

      if (!existingCategory) {
        // Nếu category chưa tồn tại, thêm category mới vào mảng với điểm suggestedScore = 3
        user.suggestions.push({
          categoryId: categoryId,
          category: category, // Lưu category name
          suggestedScore: 3
        });

      }
      
      // Giới hạn tối đa chỉ giữ 5 sản phẩm trong mảng suggestions
      if (user.suggestions.length > 5) {
        // Loại bỏ sản phẩm cũ nhất nếu vượt quá 5
        user.suggestions.shift();
      }
    }

    // Lưu cập nhật vào cơ sở dữ liệu
    const updatedUser = await user.save();

    // Chỉ trả về thông tin cần thiết
    res.status(200).json({
      message: "Updated successfully",
      suggestions: updatedUser.suggestions
    });
  } catch (error) {
    console.error("Error updating suggested scores:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SUGGEST PRODUCTS FOR USER
// SUGGEST PRODUCTS FOR USER
exports.configureProductRecommendations = async (req, res) => {
  const mainItemId = req.body.mainProductId;
  const suggestions = req.body.suggestions;

  console.log('Main Product ID:', mainItemId);
  console.log('Suggestions:', suggestions);

  try {
    // Tìm sản phẩm chính
    const mainProduct = await Product.findById(mainItemId);
    if (!mainProduct) {
      return res.status(404).json({ message: "Main product not found" });
    }

    const suggestionEntries = [];
    for (const suggestion of suggestions) {
      const { productId } = suggestion;

      // Tìm sản phẩm gợi ý
      const suggestedProduct = await Product.findById(productId);
      if (!suggestedProduct) {
        return res.status(404).json({ message: "Suggested product not found" });
      }

      suggestionEntries.push({
        itemId: productId,
        itemName: suggestedProduct.name,
        itemType: 'Product' // Phân biệt đây là sản phẩm
      });
    }

    if (suggestionEntries.length > 0) {
      // Kiểm tra xem đã có recommendation với mainItemId chưa
      let recommendation = await Recommendation.findOne({ mainItemId: mainItemId, itemType: 'Product' });

      if (recommendation) {
        // Nếu đã có, cập nhật sản phẩm gợi ý
        recommendation.items = suggestionEntries;
        await recommendation.save();
        console.log('Product recommendations updated successfully');
      } else {
        // Nếu chưa có, tạo mới recommendation
        recommendation = new Recommendation({
          mainItemId: mainItemId,
          mainItemName: mainProduct.name,
          itemType: 'Product',
          items: suggestionEntries
        });

        await recommendation.save();
        console.log('Product recommendations collection created successfully');
      }

      console.log(`Added recommendations for main product: ${mainProduct.name}`);
    } else {
      console.log('No suggestions available to insert');
    }

    res.status(200).json({
      message: "Product recommendations processed successfully",
      mainItem: {
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


// SUGGEST SERVICES FOR USER
// SUGGEST SERVICES FOR USER
exports.configureServiceRecommendations = async (req, res) => {
  const mainItemId = req.body.mainServiceId;
  const suggestions = req.body.suggestions;

  console.log('Main Service ID:', mainItemId);
  console.log('Suggestions:', suggestions);

  try {
    // Tìm dịch vụ chính
    const mainService = await Service.findById(mainItemId);
    if (!mainService) {
      return res.status(404).json({ message: "Main service not found" });
    }

    const suggestionEntries = [];
    for (const suggestion of suggestions) {
      const { serviceId } = suggestion;

      // Tìm dịch vụ gợi ý
      const suggestedService = await Service.findById(serviceId);
      if (!suggestedService) {
        return res.status(404).json({ message: "Suggested service not found" });
      }

      suggestionEntries.push({
        itemId: serviceId,
        itemName: suggestedService.name,
        itemType: 'Service' // Phân biệt đây là dịch vụ
      });
    }

    if (suggestionEntries.length > 0) {
      // Kiểm tra xem đã có recommendation với mainItemId chưa
      let recommendation = await Recommendation.findOne({ mainItemId: mainItemId, itemType: 'Service' });

      if (recommendation) {
        // Nếu đã có, cập nhật dịch vụ gợi ý
        recommendation.items = suggestionEntries;
        await recommendation.save();
        console.log('Service recommendations updated successfully');
      } else {
        // Nếu chưa có, tạo mới recommendation
        recommendation = new Recommendation({
          mainItemId: mainItemId,
          mainItemName: mainService.name,
          itemType: 'Service',
          items: suggestionEntries
        });

        await recommendation.save();
        console.log('Service recommendations collection created successfully');
      }

      console.log(`Added recommendations for main service: ${mainService.name}`);
    } else {
      console.log('No suggestions available to insert');
    }

    res.status(200).json({
      message: "Service recommendations processed successfully",
      mainItem: {
        id: mainService._id,
        name: mainService.name,
      },
      suggestions: suggestionEntries,
      collection: "Recommendation"
    });
  } catch (error) {
    console.error("Error processing service recommendations:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.suggestProductsForUser = async (req, res) => {
  try {
    // Lấy thông tin của khách hàng hiện tại từ req.params.id
    const customerId = req.params.id;
    const customer = await User.findById(customerId);
    
    // Kiểm tra nếu không tìm thấy khách hàng
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Lấy danh sách categoryId mà khách hàng hiện tại đã có
    const customerCategoryIds = customer.suggestions.map(suggestion => suggestion.categoryId);

    // Tìm category từ các khách hàng khác không phải là khách hàng hiện tại
    const otherUsers = await User.find({ _id: { $ne: customerId } });

    // Tạo một đối tượng để lưu trữ điểm gợi ý trung bình cho các category
    const categoryScores = {};

    // Duyệt qua các category của khách hàng khác
    otherUsers.forEach(user => {
      user.suggestions.forEach(suggestion => {
        // Nếu category không có trong danh sách của khách hàng hiện tại
        if (!customerCategoryIds.includes(suggestion.categoryId)) {
          if (!categoryScores[suggestion.categoryId]) {
            categoryScores[suggestion.categoryId] = {
              categoryName: suggestion.categoryName, // Thêm thuộc tính tên danh mục
              totalScore: 0,
              count: 0
            };
          }
          // Cộng dồn điểm và số lượng
          categoryScores[suggestion.categoryId].totalScore += suggestion.suggestedScore;
          categoryScores[suggestion.categoryId].count += 1;
        }
      });
    });

    // Tính điểm trung bình cho mỗi category
    const averageScores = Object.entries(categoryScores).map(([categoryId, { categoryName, totalScore, count }]) => {
      return {
        categoryId,
        categoryName,
        averageScore: totalScore / count
      };
    });

    // Sắp xếp category dựa trên điểm trung bình (cao đến thấp) và lấy top 3
    const topRecommendations = averageScores.sort((a, b) => b.averageScore - a.averageScore).slice(0, 3);

    // Trả về danh sách category gợi ý
    return res.status(200).json({
      message: "Suggested categories found successfully",
      recommendations: topRecommendations
    });
  } catch (error) {
    console.error("Error suggesting categories:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.updateMultipleSuggestionScores = async (req, res) => {
  const { usersToUpdate } = req.body; // Giả sử body chứa một mảng các user cần cập nhật

  try {
    // Duyệt qua từng user trong usersToUpdate
    for (const userUpdate of usersToUpdate) {
      const { userId, suggestionsToUpdate } = userUpdate;

      // Chuyển đổi userId thành ObjectId để kiểm tra
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: `Invalid userId: ${userId}` });
      }

      // Tìm user theo ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: `User not found for ID: ${userId}` });
      }

      // Duyệt qua mảng các suggestions cần cập nhật
      suggestionsToUpdate.forEach(update => {
        const suggestion = user.suggestions.find(sug => sug.categoryId.toString() === update.categoryId);

        if (suggestion) {
          // Cập nhật suggestedScore cho từng mục dựa trên categoryId
          suggestion.suggestedScore = update.suggestedScore;
        }
      });

      // Lưu lại thay đổi vào cơ sở dữ liệu
      await user.save();
    }

    res.status(200).json({
      message: 'Multiple suggestions updated successfully',
    });
  } catch (error) {
    console.error('Error updating multiple suggestions:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
