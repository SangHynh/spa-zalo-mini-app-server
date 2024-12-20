const express = require("express");
const router = express.Router();
const recommendationController = require("../../controllers/recommendation.controller");
const { validateUpdateUserInfo } = require("../../validations/user.validation");
const { verifyAccessToken } = require("../../configs/jwt.config");
const { upload } = require("../../middlewares/upload.middlewares");
const MAX_FILES = 10

//đánh giá sản phẩm và thu thập thông tin về danh mục yêu thích của khách hàng
router.put("/rating-product/:id", (req, res, next) => {
  req.folder = process.env.REVIEW_FOLDER; // Folder name in cloud
  next();
},
  upload.array('images', MAX_FILES),
  recommendationController.ratingToUpdateSuggestScoreOfUser
);
//lấy các review qua id của sản phẩm
router.get(
  "/get-reviews-by-product-id/:productId",
  recommendationController.getReviewsByProductId
);
//lấy các danh mục đề xuất cho khách hàng từ những khách hàng khác
router.get(
  "/suggest-products-for-user/:id",
  recommendationController.suggestProductsForUser
);
//chọn các danh mục yêu thích của khách hàng khi lần đầu vào app
router.put('/update-suggest-products-for-multiple-products/:id', recommendationController.updateSuggestedScoresForMultipleProducts);
//tìm kiếm sản phẩm và dựa vào tìm kiếm thu thập thông tin về danh mục yêu thích của khách hàng
router.put('/find-product-to-update-suggest-score-of-user/:productName', recommendationController.findProductToUpdateSuggestScoreOfUser);
//tìm kiếm dịch vụ và dựa vào tìm kiếm thu thập thông tin về danh mục yêu thích của khách hàng
router.put('/find-service-to-update-suggest-score-of-user/:serviceName', recommendationController.findServiceToUpdateSuggestScoreOfUser);
//cập nhật danh sách sản phẩm gợi ý cho khách hàng khi khách hàng mua 1 sản phẩm
router.put('/configure-product-recommendations/:id', recommendationController.configureProductRecommendations);
//danh sách sản phẩm gợi ý (req.body.mainItemId => req.params.id)
router.get('/get-product-recommendations/:id', recommendationController.getProductRecommendations);
//cập nhật danh sách dịch vụ gợi ý cho khách hàng khi khách hàng mua 1 dịch vụ
router.put('/configure-service-recommendations/:id', recommendationController.configureServiceRecommendations);
//danh sách dịch vụ gợi ý (req.body.mainItemId => req.params.id)
router.get('/get-service-recommendations/:id', recommendationController.getServiceRecommendations);
//cập nhật suggestions nhiều khách hàng đề xuất nhiều sản phẩm
router.put('/update-multiple-suggestion-scores', recommendationController.updateMultipleSuggestionScores);
//lấy danh sách sản phẩm gợi ý cho khách hàng gồm từ top sản phẩm config và từ phân tích gợi ý từ các khách hàng khác
router.post('/get-combined-product-recommendations', recommendationController.getCombinedProductRecommendations);
//lấy danh sách dịch vụ gợi ý cho khách hàng gồm từ top sản phẩm config và từ phân tích gợi ý từ các khách hàng khác
router.post('/get-combined-service-recommendations', recommendationController.getCombinedServiceRecommendations);
//cập nhật danh sách sản phẩm gợi ý cho khách hàng khi khách hàng mua 1 sản phẩm (có thể cập nhật cho nhiều sản phẩm)
router.post('/configure-product-to-user', recommendationController.configureProductToUser);
//cập nhật danh sách dịch vụ gợi ý cho khách hàng khi khách hàng mua 1 dịch vụ (có thể cập nhật cho nhiều dịch vụ)
router.post('/configure-service-to-user', recommendationController.configureServiceToUser);
//Lấy danh sách sản phẩm đã được cấu hình cho khách hàng
router.post('/get-product-configuration', recommendationController.getProductConfiguration);
//Lấy danh sách dịch vụ đã được cấu hình cho khách hàng
router.post('/get-service-configuration', recommendationController.getServiceConfiguration);

module.exports = router;
