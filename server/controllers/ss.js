exports.getServiceConfiguration = async (req, res) => {
  const { userId } = req.body; // Lấy userId từ body của yêu cầu

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Khởi tạo ObjectId từ userId
    const objectId = new mongoose.Types.ObjectId(userId);
    
    // Tìm kiếm cấu hình với type là "service"
    const configuration = await Configuration.findOne({ userId: objectId, type: "service" });

    if (!configuration) {
      return res.status(404).json({ message: "Configuration not found for this user with type 'service'" });
    }

    res.status(200).json({
      message: "Configuration retrieved successfully",
      data: configuration,
    });
  } catch (error) {
    console.error("Error retrieving user configuration:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};