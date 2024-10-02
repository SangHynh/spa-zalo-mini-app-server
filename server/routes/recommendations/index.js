const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const productController = require("../../controllers/product.controller");
const recommendationController = require("../../controllers/recommendation.controller");
const { validateUpdateUserInfo } = require("../../validations/user.validation");
const { verifyAccessToken } = require("../../configs/jwt.config");
router.put(
  "/suggested-score/:id",
  productController.findProductToUpdateSuggestScoreOfUser
);
router.put(
  "/rating-product/:id",
  productController.ratingToUpdateSuggestScoreOfUser
);
router.put(
  "/suggest-products-for-user/:id",
  userController.suggestProductsForUser
);
router.put(
  "/update-suggest-products-for-multiple-products/:id",
  productController.updateSuggestedScoresForMultipleProducts
);
router.put(
  "/find-product-to-update-suggest-score-of-user/:productName",
  productController.findProductToUpdateSuggestScoreOfUser
);
router.put(
  "/configure-product-recommendations/:id",
  recommendationController.configureProductRecommendations
);
router.get(
  "/get-product-recommendations/:mainProductId",
  recommendationController.getProductRecommendations
);

module.exports = router;
