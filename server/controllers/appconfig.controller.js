const { deleteImage } = require("../middlewares/upload.middlewares");
const AppConfig = require("../models/appconfig.model");

class AppConfigController {
    // UPDATE
    async updateHome(req, res) {
        try {
            req.body.deleteImages = JSON.parse(req.body.deleteImages);
            req.body.existingImages = JSON.parse(req.body.existingImages);

            const imageUrls = req.files.map(file => file.path);

            if (Array.isArray(req.body.existingImages)) {
                imageUrls.push(...req.body.existingImages);
            }

            if (Array.isArray(req.body.deleteImages)) {
                req.body.deleteImages.forEach(url => {
                    const publicId = url
                        .split('/').slice(-2).join('/') // Get the last two parts: folder and filename
                        .split('.')[0];

                    deleteImage(publicId);
                });
            }

            const latestConfig = await AppConfig.findOne().sort({ createdAt: -1 });

            latestConfig.images = imageUrls;

            const updated = await latestConfig.save();

            return res.status(200).json(updated);
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }

    // GET
    async getConfig(req, res) {
        try {
            const config = await AppConfig.findOne().sort({ createdAt: -1 });
            return res.status(200).json(config);
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }
}

module.exports = new AppConfigController();