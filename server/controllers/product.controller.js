const { deleteImage } = require('../middlewares/upload.middlewares');
const Product = require('../models/product.model');
const moment = require('moment');

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
exports.getProductById = async (req, res) => {
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
    // Convert Text to Json
    req.body.variants = JSON.parse(req.body.variants);
    req.body.ingredients = JSON.parse(req.body.ingredients);
    req.body.benefits = JSON.parse(req.body.benefits);
    req.body.images = JSON.parse(req.body.images);
    req.body.deleteImages = JSON.parse(req.body.deleteImages);

    const imageUrls = req.files.map(file => file.path);

    console.log(req.body)

    if (Array.isArray(req.body.images)) {
      imageUrls.push(...req.body.images);
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

    const product = await Product.findByIdAndUpdate(req.params.id, {...req.body, images: imageUrls}, { new: true });

    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json(product);
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
