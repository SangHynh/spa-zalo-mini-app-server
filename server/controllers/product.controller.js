const { deleteImage } = require('../middlewares/upload.middlewares');
const Product = require('../models/product.model');
const mongoose = require('mongoose');
const moment = require('moment');
const User = require('../models/user.model');
// CREATE
exports.createProduct = async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    // Convert Text to Json
    req.body.variants = JSON.parse(req.body.variants);
    req.body.ingredients = JSON.parse(req.body.ingredients);
    req.body.benefits = JSON.parse(req.body.benefits);

    const imageUrls = req.files.map(file => file.path);

    if (req.body.expiryDate) {
      req.body.expiryDate = moment(req.body.expiryDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }

    const product = new Product({
      ...req.body,
      images: imageUrls
    })
    
    const savedProduct = await product.save();
    return res.status(201).json(savedProduct);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// GET ALL
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET BY ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
// UPDATE SUGGEST SCORE
// exports.findProductToUpdateSuggestScoreOfUser = async (req, res) => {
//   const userId = '66efa37153dac92d48b2849f';
//   const productId = req.params.id; // Đảm bảo đây là đúng
//   try {
//     // Tìm sản phẩm trước
//     const product = await Product.findById(productId); // Sử dụng productId ở đây
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Tìm người dùng
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Kiểm tra và khởi tạo mảng productSuggestions nếu chưa có
//     if (!user.productSuggestions) {
//       user.productSuggestions = [];
//     }

//     // Tìm kiếm sản phẩm trong mảng productSuggestions của user
//     const existingProduct = user.productSuggestions.find(
//       (suggestedProduct) => suggestedProduct.productId && suggestedProduct.productId.toString() === productId
//     );

//     if (existingProduct) {
//       // Nếu sản phẩm đã tồn tại, tăng điểm suggestedScore lên 1
//       existingProduct.suggestedScore += 1;
//     } else {
//       // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào mảng
//       user.productSuggestions.push({
//         productId: product._id,
//         productName: product.name,
//         suggestedScore: 1
//       });
//     }

//     // Lưu cập nhật vào cơ sở dữ liệu
//     const updatedUser = await user.save();

//     res.status(200).json({
//       message: "Updated successfully",
//       productSuggestions: updatedUser.productSuggestions
//     });
//   } catch (error) {
//     console.error("Error updating suggested score:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
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


// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    console.log(req.body)
    // Convert Text to Json
    req.body.variants = JSON.parse(req.body.variants);
    req.body.ingredients = JSON.parse(req.body.ingredients);
    req.body.benefits = JSON.parse(req.body.benefits);
    req.body.existingImages = JSON.parse(req.body.existingImages);
    req.body.deleteImages = JSON.parse(req.body.deleteImages);

    const imageUrls = req.files.map(file => file.path);

    console.log(req.body)

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (Array.isArray(req.body.existingImages)) {
      imageUrls.push(...req.body.existingImages);
    }

    if (req.body.expiryDate) {
      req.body.expiryDate = moment(req.body.expiryDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }

    if (Array.isArray(req.body.deleteImages)) {
      req.body.deleteImages.forEach(url => {
        const publicId = url
          .split('/').slice(-2).join('/') // Get the last two parts: folder and filename
          .split('.')[0];
        
        deleteImage(publicId);
      });
    }

    // Update variants
    const existingVariants = product.variants.reduce((acc, variant) => {
      acc[variant._id.toString()] = variant;
      return acc;
    }, {});

    req.body.variants.forEach(variant => {
      if (existingVariants[variant._id]) {
        existingVariants[variant._id] = { ...existingVariants[variant._id], ...variant };
      } else {
        existingVariants[new mongoose.Types.ObjectId()] = variant;
      }
    });

    // Update ingredients
    const existingIngredients = product.ingredients.reduce((acc, ingredient) => {
      acc[ingredient._id.toString()] = ingredient;
      return acc;
    }, {});

    req.body.ingredients.forEach(ingredient => {
      if (existingIngredients[ingredient._id]) {
        existingIngredients[ingredient._id] = { ...existingIngredients[ingredient._id], ...ingredient };
      } else {
        existingIngredients[new mongoose.Types.ObjectId()] = ingredient;
      }
    });

    product.images = imageUrls;
    product.variants = Object.values(existingVariants);
    product.ingredients = Object.values(existingIngredients);
    Object.assign(product, req.body);

    const updatedProduct = await product.save();

    return res.status(200).json(updatedProduct);

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ensure product is deleted
    if (Array.isArray(product.images) && product.images.length > 0) {
      const deleteImagePromises = product.images.map(async (url) => {
        const publicIdWithFolder = url
          .split('/').slice(-2).join('/')
          .split('.')[0];

        return await deleteImage(publicIdWithFolder);
      });

      // Wait for all image deleted
      await Promise.all(deleteImagePromises);
    }
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
