const { deleteImage } = require("../middlewares/upload.middlewares");
const AppConfig = require("../models/appconfig.model");

class AppConfigController {
  // UPDATE CONFIG
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
          const publicId = url.split("/").slice(-2).join("/").split(".")[0];

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

  // GET CONFIG
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

  // GET ORDER-POINT
  async getOrderPoints(req, res) {
    try {
      const appConfig = await AppConfig.findOne().sort({ minPoints: 1 });
      const orderPoints = appConfig ? appConfig.orderPoints : [];

      // Sắp xếp orderPoints theo minPoints
      orderPoints.sort((a, b) => a.minPoints - b.minPoints);

      return res.status(200).json(orderPoints);
    } catch (error) {
      console.error("Error fetching order points:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching order points" });
    }
  }

  // UPDATE ORDER-POINT
  async updateOrderPoint(req, res) {
    const { orderPointId } = req.params;
    const { price, minPoints } = req.body;

    try {
      const appConfig = await AppConfig.findOne().sort({ createdAt: -1 });
      if (!appConfig) {
        return res.status(404).json({ error: "AppConfig not found" });
      }

      const orderPointIndex = appConfig.orderPoints.findIndex(
        (point) => point._id.toString() === orderPointId
      );
      if (orderPointIndex === -1) {
        return res.status(404).json({ error: "OrderPoint not found" });
      }

      const oldMinPoints = appConfig.orderPoints[orderPointIndex].minPoints;

      // Cập nhật các trường
      if (price !== undefined) {
        appConfig.orderPoints[orderPointIndex].price = price;
      }
      if (minPoints !== undefined) {
        appConfig.orderPoints[orderPointIndex].minPoints = minPoints;
      }

      // Kiểm tra nếu minPoints đã thay đổi
      if (minPoints !== undefined && minPoints !== oldMinPoints) {
        const conflictingOrderPoints = appConfig.orderPoints.filter(
          (_, index) =>
            index !== orderPointIndex &&
            appConfig.orderPoints[index].minPoints >= minPoints &&
            appConfig.orderPoints[index].minPoints < oldMinPoints
        );

        // Nếu có bản ghi bị xung đột, tăng minPoints của chúng lên
        for (let conflictingOrderPoint of conflictingOrderPoints) {
          conflictingOrderPoint.minPoints += 1; // Hoặc một giá trị nào đó phù hợp
        }
      }

      // Lưu bản ghi đã cập nhật
      await appConfig.save();
      return res.status(200).json({
        message: "OrderPoint updated successfully",
        orderPoint: appConfig.orderPoints[orderPointIndex],
      });
    } catch (error) {
      console.error("Error updating orderPoint:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating orderPoint" });
    }
  }

  // CREATE ORDER-POINT
  async createOrderPoint(req, res) {
    const { price, minPoints } = req.body;

    try {
      const appConfig = await AppConfig.findOne().sort({ createdAt: -1 });
      if (!appConfig) {
        return res.status(404).json({ error: "AppConfig not found" });
      }

      // Kiểm tra các bản ghi hiện có trong orderPoints
      const existingOrderPoints = appConfig.orderPoints.sort(
        (a, b) => a.minPoints - b.minPoints
      );

      // Nếu minPoints nhỏ hơn bản ghi nhỏ nhất hiện có, cập nhật chúng
      if (
        existingOrderPoints.length > 0 &&
        minPoints < existingOrderPoints[0].minPoints
      ) {
        // Tăng minPoints của các bản ghi hiện có
        for (let orderPoint of existingOrderPoints) {
          orderPoint.minPoints += 1; // Hoặc một giá trị nào đó phù hợp
        }
      }

      // Tạo orderPoint mới và thêm vào mảng
      const newOrderPoint = { price, minPoints };
      appConfig.orderPoints.push(newOrderPoint);

      // Lưu bản ghi AppConfig đã cập nhật
      await appConfig.save();
      return res.status(201).json({
        message: "OrderPoint created successfully",
        orderPoint: newOrderPoint,
      });
    } catch (error) {
      console.error("Error creating orderPoint:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating orderPoint" });
    }
  }

  // DELETE
  async deleteOrderPoint(req, res) {
    const { orderPointId } = req.params;

    try {
      const appConfig = await AppConfig.findOne().sort({ createdAt: -1 });
      if (!appConfig) {
        return res.status(404).json({ error: "AppConfig not found" });
      }

      // Tìm chỉ số của orderPoint cần xóa
      const orderPointIndex = appConfig.orderPoints.findIndex(
        (point) => point._id.toString() === orderPointId
      );
      if (orderPointIndex === -1) {
        return res.status(404).json({ error: "OrderPoint not found" });
      }

      // Lưu trữ orderPoint đã xóa
      const deletedOrderPoint = appConfig.orderPoints[orderPointIndex];

      // Xóa orderPoint khỏi mảng
      appConfig.orderPoints.splice(orderPointIndex, 1);

      // Lưu bản ghi AppConfig đã cập nhật
      await appConfig.save();

      return res.status(200).json({
        message: "OrderPoint deleted successfully",
        orderPoint: deletedOrderPoint,
      });
    } catch (error) {
      console.error("Error deleting orderPoint:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting orderPoint" });
    }
  }
}

module.exports = new AppConfigController();
