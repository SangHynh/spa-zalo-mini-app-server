import axios from "../utils/axios";

// CONFIG PRODUCT
export const apiConfigProductRS = (id, data) =>
  axios({
    url: `/api/recommendations/configure-product-recommendations/${id}`,
    method: "PUT",
    data,
  });

// GET RECOMMENDED PRODUCTS
export const apiGetProductRecommendations = (mainProductId) =>
  axios({
    url: `/api/recommendations/get-product-recommendations/${mainProductId}`,
    method: "GET",
  });
