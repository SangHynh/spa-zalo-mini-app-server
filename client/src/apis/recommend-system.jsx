import axios from "../utils/axios";

// CONFIG PRODUCT
export const apiConfigProductRecommendations = (id, data) =>
  axios({
    url: `/api/recommendations/configure-product-recommendations/${id}`,
    method: "PUT",
    data,
  });

// GET RECOMMENDED PRODUCTS
export const apiGetProductRecommendations = () =>
  axios({
    url: `/api/recommendations/get-product-recommendations`,
    method: "GET",
  });
