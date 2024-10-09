const express = require("express");
const router = express.Router();
const recommendationController = require('../../controllers/recommendation.controller');
const {validateUpdateUserInfo} = require('../../validations/user.validation');
const { verifyAccessToken } = require('../../configs/jwt.config')
//đánh giá sản phẩm và thu thập thông tin về danh mục yêu thích của khách hàng
router.put('/rating-product/:id', recommendationController.ratingToUpdateSuggestScoreOfUser);
//lấy các review qua id của sản phẩm
router.get('/get-reviews-by-product-id/:productId', recommendationController.getReviewsByProductId);
//lấy các danh mục đề xuất cho khách hàng từ những khách hàng khác
router.get('/suggest-products-for-user/:id', recommendationController.suggestProductsForUser);
//chọn các danh mục yêu thích của khách hàng khi lần đầu vào app
router.put('/update-suggest-products-for-multiple-products/:id', recommendationController.updateSuggestedScoresForMultipleProducts);
//tìm kiếm và dựa vào tìm kiếm thu thập thông tin về danh mục yêu thích của khách hàng
router.put('/find-product-to-update-suggest-score-of-user/:productName', recommendationController.findProductToUpdateSuggestScoreOfUser);
//cập nhật danh sách sản phẩm gợi ý cho khách hàng khi khách hàng mua 1 sản phẩm
router.put('/configure-product-recommendations/:id', recommendationController.configureProductRecommendations);
//cập nhật danh sách dịch vụ gợi ý cho khách hàng khi khách hàng mua 1 dịch vụ
router.put('/configure-service-recommendations/:id', recommendationController.configureServiceRecommendations);
//cập nhật suggestions nhiều khách hàng đề xuất nhiều sản phẩm
router.put('/update-multiple-suggestion-scores', recommendationController.updateMultipleSuggestionScores);

router.get(
  "/get-product-recommendations/:mainProductId",
  recommendationController.getProductRecommendations
);
module.exports = router;
