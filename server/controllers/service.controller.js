const { deleteImage } = require("../middlewares/upload.middlewares")
const Service = require("../models/service.model")
const mongoose = require('mongoose');

class ServiceController {
    // GET SERVICES
    async getServices(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const skip = (page - 1) * limit;

            const { keyword, subCategoryId, sortBy, sortOrder } = req.query;

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

            if (subCategoryId) {
                query.subCategoryId = subCategoryId;
            }

            // Cấu hình sắp xếp
            let sortCriteria = {};
            if (sortBy) {
                const sortFields = sortBy.split(',');
                const sortOrders = sortOrder ? sortOrder.split(',') : [];
                sortFields.forEach((field, index) => {
                    const order = sortOrders[index] === 'desc' ? -1 : 1;
                    if (['price'].includes(field)) {
                        sortCriteria[field] = order;
                    }
                });
            }

            const services = await Service.find(query)
                .skip(skip)
                .limit(limit)
                .sort(sortCriteria)

            const totalService = await Service.countDocuments(query)

            // return res.status(200).json(services)

            return res.status(200).json({
                totalServices: totalService,
                currentPage: page,
                totalPages: Math.ceil(totalService / limit),
                services
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            })
        }
    }

    // GET SERVICE BY ID
    async getServiceById(req, res) {
        try {
            const service = await Service.findById(req.params.id)
            if (!service) {
                return res.status(404).json({ message: 'Service not found' })
            }
            return res.status(200).json(service)
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            })
        }
    }

    // POST SERVICE
    async createService(req, res) {
        try {
            if (!req.files) {
                return res.status(400).json({ error: 'No images uploaded' });
            }

            const imageUrls = req.files.map(file => file.path);

            const service = new Service({
                ...req.body,
                images: imageUrls
            })

            const savedService = await service.save();
            return res.status(201).json(savedService);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // PUT SERVICE BY ID
    async updateService(req, res) {
        try {
            // Convert Text to Json
            req.body.existingImages = JSON.parse(req.body.existingImages);
            req.body.deleteImages = JSON.parse(req.body.deleteImages);

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

            const service = await Service.findByIdAndUpdate(req.params.id, { ...req.body, images: imageUrls }, { new: true });

            if (!service) return res.status(404).json({ message: 'Service not found' });
            return res.status(200).json(service);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    }

    // DELETE SERVICE BY ID
    async deleteService(req, res) {
        try {
            const service = await Service.findByIdAndDelete(req.params.id);

            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            // Ensure service is deleted
            if (Array.isArray(service.images) && service.images.length > 0) {
                const deleteImagePromises = service.images.map(async (url) => {
                    const publicIdWithFolder = url
                        .split('/').slice(-2).join('/')
                        .split('.')[0];

                    return await deleteImage(publicIdWithFolder);
                });

                // Wait for all image deleted
                await Promise.all(deleteImagePromises);
            }
            return res.status(200).json({ message: 'Serive deleted successfully' });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new ServiceController()