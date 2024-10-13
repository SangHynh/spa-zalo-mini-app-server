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

// GET ALL PRODUCTS WITH PAGINATION
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { keyword, subCategoryId, sortBy, sortOrder } = req.query;

    // Tạo điều kiện tìm kiếm
    const query = {};

    if (subCategoryId) {
      query.subCategoryId = subCategoryId;
    }

    if (keyword) {
      const isObjectId = mongoose.Types.ObjectId.isValid(keyword);

      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
      ];

      if (isObjectId) {
        query.$or.push({ _id: new mongoose.Types.ObjectId(keyword) });
      }
    }

    // Cấu hình sắp xếp
    let sortCriteria = {};
    if (sortBy) {
      const sortFields = sortBy.split(',');
      const sortOrders = sortOrder ? sortOrder.split(',') : [];
      sortFields.forEach((field, index) => {
        if (sortOrders[index] === 'asc' || sortOrders[index] === 'desc') {
          const order = sortOrders[index] === 'desc' ? -1 : 1;
          if (['stock', 'price', 'expiryDate'].includes(field)) {
            sortCriteria[field] = order;
          }
        }
      });
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortCriteria)

    const totalProducts = await Product.countDocuments(query);

    return res.status(200).json({
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET PRODUCTS BY PRODUCT'S IDS
exports.getProductsByIDs = async (req, res) => {
  try {
    const { productIds } = req.body;

    const products = await Product.find({ _id: { $in: productIds } })
      .select('_id name category subCategory');

    return res.status(200).json({ products });
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
      // Chỉ định _id ObjectId cho các variant mới nếu không có
      if (!variant._id || typeof variant._id !== 'string') {
        variant._id = new mongoose.Types.ObjectId(); // Tạo ID ObjectId duy nhất
      }

      if (existingVariants[variant._id]) {
        existingVariants[variant._id] = { ...existingVariants[variant._id], ...variant };
      } else {
        existingVariants[variant._id] = variant; // Cập nhật variant mới
      }
    });

    // Update ingredients
    const existingIngredients = product.ingredients.reduce((acc, ingredient) => {
      acc[ingredient._id.toString()] = ingredient;
      return acc;
    }, {});

    req.body.ingredients.forEach(ingredient => {
      // Chỉ định _id ObjectId cho các ingredient mới nếu không có
      if (!ingredient._id || typeof ingredient._id !== 'string') {
        ingredient._id = new mongoose.Types.ObjectId(); // Tạo ID ObjectId duy nhất
      }

      if (existingIngredients[ingredient._id]) {
        existingIngredients[ingredient._id] = { ...existingIngredients[ingredient._id], ...ingredient };
      } else {
        existingIngredients[ingredient._id] = ingredient; // Cập nhật ingredient mới
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
