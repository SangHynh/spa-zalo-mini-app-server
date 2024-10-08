const { deleteImage } = require("../middlewares/upload.middlewares");
const AppConfig = require("../models/appconfig.model");

class AppConfigController {
  // UPDATE
  async updateHome(req, res) {
    try {
      req.body.deleteImages = JSON.parse(req.body.deleteImages);
      req.body.existingImages = JSON.parse(req.body.existingImages);

      // Get urls from the newly uploaded images
      const newImageurls = req.files.map((file, index) => ({
        index: index,
        url: file.path,
      }));

      // Include existing images if they are provided
      if (Array.isArray(req.body.existingImages)) {
        req.body.existingImages.forEach((url, idx) => {
          newImageurls.push({
            index: newImageurls.length + idx, // Continue Index from where new images stopped
            url: url,
          });
        });
      }

      // Handle deleting images by url
      if (Array.isArray(req.body.deleteImages)) {
        req.body.deleteImages.forEach((url) => {
          const publicId = url
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];

          deleteImage(publicId);
        });

        // Remove deleted images from newImageurls array
        req.body.deleteImages.forEach((url) => {
          const index = newImageurls.findIndex((img) => img.url === url);
          if (index !== -1) {
            newImageurls.splice(index, 1);
          }
        });
      }

      // Retrieve the latest config and update images
      const latestConfig = await AppConfig.findOne().sort({ createdAt: -1 });
      latestConfig.images = newImageurls;

      // Save updated config
      const updated = await latestConfig.save();

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
        message: "An error occurred",
      });
    }
  }

  // GET
  async getConfig(req, res) {
    try {
      const config = await AppConfig.findOne().sort({ createdAt: -1 });

      if (config && Array.isArray(config.images)) {
        // Sắp xếp images theo Index
        config.images.sort((a, b) => a.index - b.index);
      }

      return res.status(200).json(config);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
        message: "An error occurred",
      });
    }
  }
}

module.exports = new AppConfigController();
