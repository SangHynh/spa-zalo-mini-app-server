const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../configs/cloudinary.config');

// UPLOAD IMAGES
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const originalName = file.originalname
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_\.]/g, '') // Remove any non-URL-safe characters
    .split('.')[0]
    .toLowerCase();

    return {
      folder: req.folder || 'default_folder',
      allowed_formats: ['jpg', 'png', 'gif', 'mp4'],
      public_id: `${Date.now()}-${originalName}`,
    };
  },
});

const upload = multer({ storage: storage });

// DELETE IMAGES
const deleteImage = async (publicId) => {
  try {
    console.log(publicId)
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

module.exports = { upload, deleteImage };
