const { deleteImage } = require("../middlewares/upload.middlewares");
const Product = require("../models/product.model");
const Service = require("../models/service.model");
const mongoose = require("mongoose");
const moment = require("moment");
const Review = require("../models/review.model");
const User = require("../models/user.model");
const Recommendation = require("../models/recommendation.model");
const Configuration = require("../models/configuration.model");
const Order = require("../models/order.model");
exports.findProductToUpdateSuggestScoreOfUser = async (req, res) => {
  const userId = req.body.id; // Lấy user ID từ body
  const productName = req.params.productName; // Lấy product name từ params

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  try {
    // Tìm kiếm sản phẩm dựa trên tên với regex
    const products = await Product.find({
      name: { $regex: productName, $options: "i" }, // Tìm kiếm không phân biệt chữ hoa chữ thường
    })
      .skip(skip)
      .limit(limit);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const totalProducts = await Product.countDocuments({
      name: { $regex: productName, $options: "i" }, // Tìm kiếm không phân biệt chữ hoa chữ thường
    });

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
        (suggestedCategory) =>
          suggestedCategory.categoryId &&
          suggestedCategory.categoryId.toString() === categoryId.toString()
      );

      if (existingCategory) {
        // Nếu category đã tồn tại, tăng điểm suggestedScore lên 1
        existingCategory.suggestedScore += 1;
      } else {
        // Nếu category chưa tồn tại, thêm category mới vào mảng với điểm suggestedScore = 1
        user.suggestions.push({
          categoryId: categoryId,
          category: category, // Đảm bảo thêm category vào đây
          suggestedScore: 1,
        });
      }
    }

    // Lưu cập nhật vào cơ sở dữ liệu
    const updatedUser = await user.save();

    // Trả về thông tin cần thiết cùng với danh sách sản phẩm tìm kiếm
    res.status(200).json({
      message: "Updated successfully",
      suggestions: updatedUser.suggestions,
      products: products, // Thêm danh sách sản phẩm tìm được vào phản hồi
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.error("Error updating suggested score:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findServiceToUpdateSuggestScoreOfUser = async (req, res) => {
  const userId = req.body.id; // Lấy user ID từ body
  const serviceName = req.params.serviceName; // Lấy service name từ params

  try {
    // Tìm kiếm dịch vụ dựa trên tên với regex
    const services = await Service.find({
      name: { $regex: serviceName, $options: "i" }, // Tìm kiếm không phân biệt chữ hoa chữ thường
    });

    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found" });
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

    // Lặp qua các dịch vụ tìm được
    for (const service of services) {
      const categoryId = service.categoryId; // Lấy categoryId từ dịch vụ
      const category = service.category; // Lấy category từ dịch vụ

      // Tìm kiếm category trong mảng suggestions của user
      const existingCategory = user.suggestions.find(
        (suggestedCategory) =>
          suggestedCategory.categoryId &&
          suggestedCategory.categoryId.toString() === categoryId.toString()
      );

      if (existingCategory) {
        // Nếu category đã tồn tại, tăng điểm suggestedScore lên 1
        existingCategory.suggestedScore += 1;
      } else {
        // Nếu category chưa tồn tại, thêm category mới vào mảng với điểm suggestedScore = 1
        user.suggestions.push({
          categoryId: categoryId,
          category: category, // Đảm bảo thêm category vào đây
          suggestedScore: 1,
        });
      }
    }

    // Lưu cập nhật vào cơ sở dữ liệu
    const updatedUser = await user.save();

    // Trả về thông tin cần thiết cùng với danh sách dịch vụ tìm kiếm
    res.status(200).json({
      message: "Updated successfully",
      suggestions: updatedUser.suggestions,
      services: services, // Thêm danh sách dịch vụ tìm được vào phản hồi
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
  const orderId = req.body.orderID; // Phải mua mới được rating
  const variantId = req.body.variantID;
  const volume = req.body.volume;

  // const images = req.body.images || []; // Mảng hình ảnh từ body, nếu có

  // Nhận vào file hình ảnh
  let images = [];

  if (req.files) {
    images = req.files.map((file) => file.path);
  }

  try {
    // Tìm sản phẩm trước
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Lấy thông tin category từ sản phẩm
    const categoryId = product.categoryId;
    const category = product.category;
    console.log("Category ID:", categoryId);
    console.log("Category Name:", category);

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
      (suggestedCategory) =>
        suggestedCategory.categoryId &&
        suggestedCategory.categoryId.toString() === categoryId.toString()
    );

    // Hàm điều chỉnh suggestedScore dựa trên đánh giá
    const adjustSuggestedScore = (rating) => {
      switch (rating) {
        case 1:
          return -2;
        case 2:
          return -1;
        case 3:
          return 1;
        case 4:
          return 2;
        case 5:
          return 3;
        default:
          return 0;
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
        suggestedScore: adjustSuggestedScore(rating),
      });
    }

    // Lưu cập nhật vào cơ sở dữ liệu
    const updatedUser = await user.save();

    // Tạo mới một review cho sản phẩm
    const review = new Review({
      productId: productId,
      productName: product.name, // Assuming product has 'name' field
      comment: comment,
      rating: rating,
      images: images,
      userId: userId,
      variantId: variantId,
      volume: volume,
    });

    // Lưu đánh giá vào cơ sở dữ liệu
    await review.save();

    // Cập nhật hóa đơn là đã đánh giá
    if (orderId) {
      const order = await Order.findById(orderId);
      if (order) {
        // Tìm sản phẩm trong mảng products
        const productInOrder = order.products.find(
          (product) => product.productId.toString() === productId
        );

        if (productInOrder) {
          // Đánh dấu sản phẩm là đã đánh giá và lưu reviewId
          productInOrder.rated = true;
          productInOrder.reviewId = review._id;
        } else {
          return res
            .status(404)
            .json({ message: "Product not found in the order" });
        }

        // Lưu cập nhật hóa đơn mà không cần validate
        await order.save({ validateBeforeSave: false });
      } else {
        return res.status(404).json({ message: "Order not found" });
      }
    } else {
      return res.status(400).json({ message: "OrderId is required" });
    }

    // Cập nhật điểm của sản phẩm
    if (product) {
      product.totalRatings = (product.totalRatings || 0) + rating;
      product.ratingCount = (product.ratingCount || 0) + 1;
      product.averageRating = product.totalRatings / product.ratingCount;

      await product.save();
    }

    // Chỉ trả về thông tin cần thiết
    res.status(200).json({
      message: "Updated successfully",
      suggestions: updatedUser.suggestions,
      review: {
        productId: review.productId,
        productName: review.productName,
        rating: review.rating,
        comment: review.comment,
        images: review.images,
      },
    });
  } catch (error) {
    console.error(
      "Error updating suggested score and saving review:",
      error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get reviews by product ID
exports.getReviewsByProductId = async (req, res) => {
  const productId = req.params.productId; // Lấy productId từ params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  console.log("Product ID:", productId);
  try {
    // Tìm tất cả review theo productId
    const reviews = await Review.find({ productId: productId })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ productId: productId });
    const totalPages = Math.ceil(totalReviews / limit);

    // Nếu không tìm thấy review nào
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this product." });
    }

    const reviewsWithUserDetails = await Promise.all(
      reviews.map(async (review) => {
        const user = await User.findById(review.userId).select("name avatar");
        return {
          ...review.toObject(),
          userName: user ? user.name : "Unknown User",
          userAvatar: user ? user.avatar : "",
        };
      })
    );

    // Trả về danh sách review
    res.status(200).json({
      message: "Reviews fetched successfully.",
      reviews: reviewsWithUserDetails,
      currentPage: page,
      totalPages: totalPages,
      totalReviews: totalReviews,
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
      console.log("Category ID:", categoryId);
      console.log("Category Name:", category);

      // Tìm kiếm category trong mảng suggestions của user
      const existingCategory = user.suggestions.find(
        (suggestedCategory) =>
          suggestedCategory.categoryId &&
          suggestedCategory.categoryId.toString() ===
            product.categoryId.toString()
      );

      if (!existingCategory) {
        // Nếu category chưa tồn tại, thêm category mới vào mảng với điểm suggestedScore = 3
        user.suggestions.push({
          categoryId: categoryId,
          category: category, // Lưu category name
          suggestedScore: 3,
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
      suggestions: updatedUser.suggestions,
    });
  } catch (error) {
    console.error("Error updating suggested scores:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SUGGEST PRODUCTS FOR USER
exports.configureProductRecommendations = async (req, res) => {
  const mainItemId = req.body.mainProductId;
  const suggestions = req.body.suggestions;

  console.log("Main Product ID:", mainItemId);
  console.log("Suggestions:", suggestions);

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
        itemType: "Product", // Phân biệt đây là sản phẩm
      });
    }

    if (suggestionEntries.length > 0) {
      // Kiểm tra xem đã có recommendation với mainItemId chưa
      let recommendation = await Recommendation.findOne({
        mainItemId: mainItemId,
        itemType: "Product",
      });

      if (recommendation) {
        // Nếu đã có, cập nhật sản phẩm gợi ý
        recommendation.items = suggestionEntries;
        await recommendation.save();
        console.log("Product recommendations updated successfully");
      } else {
        // Nếu chưa có, tạo mới recommendation
        recommendation = new Recommendation({
          mainItemId: mainItemId,
          mainItemName: mainProduct.name,
          itemType: "Product",
          items: suggestionEntries,
        });

        await recommendation.save();
        console.log("Product recommendations collection created successfully");
      }

      console.log(
        `Added recommendations for main product: ${mainProduct.name}`
      );
    } else {
      console.log("No suggestions available to insert");
    }

    res.status(200).json({
      message: "Product recommendations processed successfully",
      mainItem: {
        id: mainProduct._id,
        name: mainProduct.name,
      },
      suggestions: suggestionEntries,
      collection: "Recommendation",
    });
  } catch (error) {
    console.error("Error processing product recommendations:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getProductRecommendations = async (req, res) => {
  const mainItemId = req.params.id; // Lấy mainItemId từ params

  console.log("Main Product ID:", mainItemId);

  try {
    // Tìm kiếm recommendation theo mainItemId
    const recommendation = await Recommendation.findOne({
      mainItemId: mainItemId,
      itemType: "Product",
    });

    if (!recommendation) {
      return res
        .status(404)
        .json({ message: "Recommendations not found for this product" });
    }

    const suggestionsWithDetails = await Promise.all(
      recommendation.items.map(async (item) => {
        if (item.itemType === "Product") {
          const product = await Product.findById(item.itemId)
            .select("images price averageRating name")
            .lean();

          if (product) {
            return {
              ...item,
              images: product.images,
              price: product.price,
              averageRating: product.averageRating,
              name: product.name,
              itemId: product._id,
            };
          }
        }
        return item;
      })
    );

    // Trả về thông tin recommendation
    res.status(200).json({
      message: "Recommendations retrieved successfully",
      mainItem: {
        id: recommendation.mainItemId,
        name: recommendation.mainItemName,
      },
      suggestions: suggestionsWithDetails,
      collection: "Recommendation",
    });
  } catch (error) {
    console.error("Error retrieving product recommendations:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SUGGEST SERVICES FOR USER
exports.configureServiceRecommendations = async (req, res) => {
  const mainItemId = req.body.mainServiceId;
  const suggestions = req.body.suggestions;

  console.log("Main Service ID:", mainItemId);
  console.log("Suggestions:", suggestions);

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
        itemType: "Service", // Phân biệt đây là dịch vụ
      });
    }

    if (suggestionEntries.length > 0) {
      // Kiểm tra xem đã có recommendation với mainItemId chưa
      let recommendation = await Recommendation.findOne({
        mainItemId: mainItemId,
        itemType: "Service",
      });

      if (recommendation) {
        // Nếu đã có, cập nhật dịch vụ gợi ý
        recommendation.items = suggestionEntries;
        await recommendation.save();
        console.log("Service recommendations updated successfully");
      } else {
        // Nếu chưa có, tạo mới recommendation
        recommendation = new Recommendation({
          mainItemId: mainItemId,
          mainItemName: mainService.name,
          itemType: "Service",
          items: suggestionEntries,
        });

        await recommendation.save();
        console.log("Service recommendations collection created successfully");
      }

      console.log(
        `Added recommendations for main service: ${mainService.name}`
      );
    } else {
      console.log("No suggestions available to insert");
    }

    res.status(200).json({
      message: "Service recommendations processed successfully",
      mainItem: {
        id: mainService._id,
        name: mainService.name,
      },
      suggestions: suggestionEntries,
      collection: "Recommendation",
    });
  } catch (error) {
    console.error("Error processing service recommendations:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getServiceRecommendations = async (req, res) => {
  const mainItemId = req.params.id; // Lấy mainItemId từ body của yêu cầu

  console.log("Main Service ID:", mainItemId);

  try {
    // Tìm kiếm recommendation theo mainItemId
    const recommendation = await Recommendation.findOne({
      mainItemId: mainItemId,
      itemType: "Service", // Đảm bảo loại là 'Service'
    });

    // Kiểm tra nếu không tìm thấy recommendation
    if (!recommendation) {
      return res
        .status(404)
        .json({ message: "Recommendations not found for this service." });
    }

    // Trả về thông tin recommendation
    res.status(200).json({
      message: "Service recommendations retrieved successfully.",
      mainItem: {
        id: recommendation.mainItemId,
        name: recommendation.mainItemName,
      },
      suggestions: recommendation.items,
      collection: "Recommendations",
    });
  } catch (error) {
    console.error("Error retrieving service recommendations:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.suggestProductsForUser = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await User.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customerCategoryIds = customer.suggestions.map(
      (suggestion) => suggestion.categoryId
    );
    const otherUsers = await User.find({ _id: { $ne: customerId } });
    const categoryScores = {};

    otherUsers.forEach((user) => {
      user.suggestions.forEach((suggestion) => {
        if (!customerCategoryIds.includes(suggestion.categoryId)) {
          if (!categoryScores[suggestion.categoryId]) {
            categoryScores[suggestion.categoryId] = {
              categoryName: suggestion.categoryName,
              totalScore: 0,
              count: 0,
            };
          }
          categoryScores[suggestion.categoryId].totalScore +=
            suggestion.suggestedScore;
          categoryScores[suggestion.categoryId].count += 1;
        }
      });
    });

    const averageScores = Object.entries(categoryScores).map(
      ([categoryId, { categoryName, totalScore, count }]) => {
        return {
          categoryId,
          categoryName,
          averageScore: totalScore / count,
        };
      }
    );

    const topRecommendations = averageScores
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3);

    // Tìm sản phẩm tương ứng với các category gợi ý
    const topCategoryIds = topRecommendations.map((rec) => rec.categoryId);
    const products = await Product.find({
      categoryId: { $in: topCategoryIds },
    });

    // Trả về danh sách category gợi ý và sản phẩm tương ứng
    return res.status(200).json({
      message: "Suggested categories found successfully",
      recommendations: topRecommendations,
      products, // Thêm sản phẩm vào kết quả
    });
  } catch (error) {
    console.error("Error suggesting categories:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.getCombinedProductRecommendations = async (req, res) => {
  const mainItemId = req.body.mainItemId; // Lấy mainItemId từ body của yêu cầu
  const customerId = req.body.id; // Lấy customerId từ body của yêu cầu

  console.log("Main Product ID:", mainItemId);
  console.log("Customer ID:", customerId);

  try {
    let recommendation = null;

    // Bước 1: Lấy recommendation cho sản phẩm chính nếu có mainItemId
    if (mainItemId) {
      recommendation = await Recommendation.findOne({
        mainItemId: mainItemId,
        itemType: "Product",
      });
    }

    // Bước 2: Lấy thông tin khách hàng và gợi ý từ các category của họ
    const customer = await User.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customerCategoryIds = customer.suggestions.map(
      (suggestion) => suggestion.categoryId
    );
    const otherUsers = await User.find({ _id: { $ne: customerId } });
    const categoryScores = {};

    otherUsers.forEach((user) => {
      user.suggestions.forEach((suggestion) => {
        if (!customerCategoryIds.includes(suggestion.categoryId)) {
          if (!categoryScores[suggestion.categoryId]) {
            categoryScores[suggestion.categoryId] = {
              categoryName: suggestion.categoryName,
              totalScore: 0,
              count: 0,
            };
          }
          categoryScores[suggestion.categoryId].totalScore +=
            suggestion.suggestedScore;
          categoryScores[suggestion.categoryId].count += 1;
        }
      });
    });

    const averageScores = Object.entries(categoryScores).map(
      ([categoryId, { categoryName, totalScore, count }]) => {
        return {
          categoryId,
          categoryName,
          averageScore: totalScore / count,
        };
      }
    );

    const topRecommendations = averageScores
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3);

    // Bước 3: Tìm sản phẩm tương ứng với các category gợi ý, giới hạn 3 sản phẩm mỗi category
    const topCategoryIds = topRecommendations.map((rec) => rec.categoryId);
    const suggestedProductsByCategory = await Promise.all(
      topCategoryIds.map(async (categoryId) => {
        const products = await Product.find({ categoryId }).limit(3);
        return products;
      })
    );

    // Bước 4: Trả về thông tin recommendation kết hợp
    const response = {
      message: "Combined product recommendations retrieved successfully",
      suggestions: [],
      collection: "Recommendation",
    };

    // Nếu có recommendation cho sản phẩm chính, ưu tiên hiển thị trước
    if (recommendation) {
      response.suggestions.push({
        mainItem: {
          id: recommendation.mainItemId,
          name: recommendation.mainItemName,
        },
        products: recommendation.items, // Gợi ý từ sản phẩm chính
      });
    }

    // Gợi ý sản phẩm từ các danh mục dựa trên hành vi người dùng, giới hạn 3 sản phẩm / category
    suggestedProductsByCategory.forEach((products, index) => {
      response.suggestions.push({
        category: topRecommendations[index].categoryName,
        products: products, // Giới hạn 3 sản phẩm cho mỗi danh mục
      });
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving combined recommendations:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getCombinedServiceRecommendations = async (req, res) => {
  const mainItemId = req.body.mainItemId; // Lấy mainItemId từ body của yêu cầu
  const customerId = req.body.id; // Lấy customerId từ body của yêu cầu

  console.log("Main Service ID:", mainItemId);
  console.log("Customer ID:", customerId);

  try {
    // Bước 1: Lấy thông tin khách hàng và gợi ý từ các category của họ
    const customer = await User.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customerCategoryIds = customer.suggestions.map(
      (suggestion) => suggestion.categoryId
    );
    const otherUsers = await User.find({ _id: { $ne: customerId } });
    const categoryScores = {};

    otherUsers.forEach((user) => {
      user.suggestions.forEach((suggestion) => {
        if (!customerCategoryIds.includes(suggestion.categoryId)) {
          if (!categoryScores[suggestion.categoryId]) {
            categoryScores[suggestion.categoryId] = {
              categoryName: suggestion.categoryName,
              totalScore: 0,
              count: 0,
            };
          }
          categoryScores[suggestion.categoryId].totalScore +=
            suggestion.suggestedScore;
          categoryScores[suggestion.categoryId].count += 1;
        }
      });
    });

    const averageScores = Object.entries(categoryScores).map(
      ([categoryId, { categoryName, totalScore, count }]) => {
        return {
          categoryId,
          categoryName,
          averageScore: totalScore / count,
        };
      }
    );

    const topRecommendations = averageScores
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 3);

    // Bước 2: Tìm dịch vụ tương ứng với các category gợi ý, giới hạn 3 dịch vụ mỗi category
    const topCategoryIds = topRecommendations.map((rec) => rec.categoryId);
    const suggestedServicesByCategory = await Promise.all(
      topCategoryIds.map(async (categoryId) => {
        const services = await Service.find({ categoryId }).limit(3);
        return services;
      })
    );

    // Bước 3: Tạo phản hồi
    const response = {
      message: "Combined service recommendations retrieved successfully",
      suggestions: [],
      collection: "Recommendation",
    };

    // Nếu có mainItemId thì lấy recommendation cho sản phẩm chính
    if (mainItemId) {
      const recommendation = await Recommendation.findOne({
        mainItemId: mainItemId,
        itemType: "Service",
      });

      if (recommendation) {
        response.suggestions.push({
          mainItem: {
            id: recommendation.mainItemId,
            name: recommendation.mainItemName,
          },
          services: recommendation.items, // Gợi ý từ sản phẩm chính
        });
      }
    }

    // Gợi ý dịch vụ từ các danh mục dựa trên hành vi người dùng, giới hạn 3 dịch vụ / category
    suggestedServicesByCategory.forEach((services, index) => {
      response.suggestions.push({
        category: topRecommendations[index].categoryName,
        services: services, // Giới hạn 3 dịch vụ cho mỗi danh mục
      });
    });

    res.status(200).json(response);
  } catch (error) {
    console.error("Error retrieving combined recommendations:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update multiple suggestion scores
exports.updateMultipleSuggestionScores = async (req, res) => {
  const { userIds, suggestionsToUpdate } = req.body; // Giả sử body chứa một mảng userId và suggestionsToUpdate

  try {
    // Kiểm tra tính hợp lệ của tất cả userId
    for (const userId of userIds) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: `Invalid userId: ${userId}` });
      }
    }

    // Duyệt qua từng userId trong userIds
    const users = await User.find({ _id: { $in: userIds } }); // Tìm tất cả người dùng theo userIds

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for the provided IDs." });
    }

    // Duyệt qua từng user
    for (const user of users) {
      // Duyệt qua mảng các suggestions cần cập nhật
      suggestionsToUpdate.forEach((update) => {
        let suggestion = user.suggestions.find(
          (sug) => sug.categoryId.toString() === update.categoryId
        );

        if (suggestion) {
          // Cập nhật suggestedScore cho từng mục dựa trên categoryId
          suggestion.suggestedScore = update.suggestedScore;
        } else {
          // Nếu không tìm thấy suggestion tương ứng, tạo mới suggestion
          user.suggestions.push({
            categoryId: update.categoryId,
            suggestedScore: update.suggestedScore,
          });
        }
      });

      // Lưu lại thay đổi vào cơ sở dữ liệu
      await user.save();
    }

    res.status(200).json({
      message: "Multiple suggestions updated successfully",
    });
  } catch (error) {
    console.error("Error updating multiple suggestions:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.configureProductToUser = async (req, res) => {
  const { userIds, productIds } = req.body; // Lấy userIds và productIds từ body

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ message: "Invalid user IDs" });
  }

  try {
    // Tìm kiếm người dùng dựa trên userIds
    const users = await User.find({ _id: { $in: userIds } });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    let newConfigSuggestions = [];
    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      // Tìm các sản phẩm dựa trên danh sách productIds nếu có
      const products = await Product.find({ _id: { $in: productIds } });
      if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found" });
      }

      // Tạo danh sách newConfigSuggestions từ các sản phẩm
      newConfigSuggestions = products.map((product) => ({
        id: product._id,
        name: product.name,
      }));
    }

    // Lặp qua từng người dùng để cập nhật configSuggestions
    for (const user of users) {
      // Tìm kiếm cấu hình hiện tại của người dùng với type là "product"
      let configuration = await Configuration.findOne({
        userId: user._id,
        type: "product",
      });

      // Nếu không tìm thấy cấu hình, khởi tạo mới
      if (!configuration) {
        configuration = new Configuration({
          userId: user._id,
          type: "product",
          configSuggestions: newConfigSuggestions, // Gán configSuggestions mới
        });
      } else {
        // Nếu đã có cấu hình, thay thế configSuggestions với danh sách mới
        configuration.configSuggestions = newConfigSuggestions;
      }

      // Lưu cập nhật vào cơ sở dữ liệu
      await configuration.save();
    }

    // Trả về thông tin cập nhật
    res.status(200).json({
      message: "Products configured successfully",
    });
  } catch (error) {
    console.error("Error configuring products to user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getProductConfiguration = async (req, res) => {
  const { userId } = req.body; // Lấy userId từ body của yêu cầu

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Khởi tạo ObjectId từ userId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Tìm kiếm cấu hình với type là "product"
    const configuration = await Configuration.findOne({
      userId: objectId,
      type: "product",
    });

    if (!configuration) {
      return res.status(404).json({
        message: "Configuration not found for this user with type 'product'",
      });
    }

    // Lấy chi tiết sản phẩm dựa trên configSuggestions
    const productIds = configuration.configSuggestions.map(
      (suggestion) => suggestion.id
    );
    const products = await Product.find({ _id: { $in: productIds } });

    // Thêm các thông tin chi tiết của product vào configSuggestions
    const enrichedConfigSuggestions = configuration.configSuggestions.map(
      (suggestion) => {
        const product = products.find(
          (p) => p._id.toString() === suggestion.id
        );
        return product
          ? {
              _id: product._id,
              name: product.name,
              price: product.price,
              images: product.images,
              averageRating: product.averageRating,
            }
          : suggestion;
      }
    );

    res.status(200).json({
      message: "Configuration retrieved successfully",
      data: enrichedConfigSuggestions,
    });
  } catch (error) {
    console.error("Error retrieving user configuration:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.configureServiceToUser = async (req, res) => {
  const { userIds, serviceIds } = req.body; // Lấy userIds và serviceIds từ body

  if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ message: "Invalid user IDs" });
  }

  try {
    // Tìm kiếm người dùng dựa trên userIds
    const users = await User.find({ _id: { $in: userIds } });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    let newConfigSuggestions = [];
    if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
      // Tìm các dịch vụ dựa trên danh sách serviceIds nếu có
      const services = await Service.find({ _id: { $in: serviceIds } });
      if (!services || services.length === 0) {
        return res.status(404).json({ message: "No services found" });
      }

      // Tạo danh sách newConfigSuggestions từ các dịch vụ
      newConfigSuggestions = services.map((service) => ({
        id: service._id,
        name: service.name,
      }));
    }

    // Lặp qua từng người dùng để cập nhật configSuggestions
    for (const user of users) {
      // Tìm kiếm cấu hình hiện tại của người dùng với type là "service"
      let configuration = await Configuration.findOne({
        userId: user._id,
        type: "service",
      });

      // Nếu không tìm thấy cấu hình, khởi tạo mới
      if (!configuration) {
        configuration = new Configuration({
          userId: user._id,
          type: "service",
          configSuggestions: newConfigSuggestions, // Gán configSuggestions mới
        });
      } else {
        // Nếu đã có cấu hình, thay thế configSuggestions với danh sách mới
        configuration.configSuggestions = newConfigSuggestions;
      }

      // Lưu cập nhật vào cơ sở dữ liệu
      await configuration.save();
    }

    // Trả về thông tin cập nhật
    res.status(200).json({
      message: "Services configured successfully",
    });
  } catch (error) {
    console.error("Error configuring services to user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getServiceConfiguration = async (req, res) => {
  const { userId } = req.body; // Lấy userId từ body của yêu cầu

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Khởi tạo ObjectId từ userId
    const objectId = new mongoose.Types.ObjectId(userId);

    // Tìm kiếm cấu hình với type là "service"
    const configuration = await Configuration.findOne({
      userId: objectId,
      type: "service",
    });

    if (!configuration) {
      return res.status(404).json({
        message: "Configuration not found for this user with type 'service'",
      });
    }

    // Lấy chi tiết dịch vụ dựa trên configSuggestions
    const serviceIds = configuration.configSuggestions.map(
      (suggestion) => suggestion.id
    );
    const services = await Service.find({ _id: { $in: serviceIds } });

    // Thêm các thông tin chi tiết của service vào configSuggestions
    const enrichedConfigSuggestions = configuration.configSuggestions.map(
      (suggestion) => {
        const service = services.find(
          (s) => s._id.toString() === suggestion.id
        );
        return service
          ? {
              _id: service._id,
              name: service.name,
              price: service.price,
              images: service.images,
            }
          : suggestion;
      }
    );

    res.status(200).json({
      message: "Configuration retrieved successfully",
      data: enrichedConfigSuggestions,
    });
  } catch (error) {
    console.error("Error retrieving user configuration:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
