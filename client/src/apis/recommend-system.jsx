import axios from "../utils/axios";

// PRODUCTS
// CONFIG
export const apiConfigProductRecommendations = (id, data) =>
  axios({
    url: `/api/recommendations/configure-product-recommendations/${id}`,
    method: "PUT",
    data,
  });

// GET RECOMMENDED
export const apiGetProductRecommendations = (id) =>
  axios({
    url: `/api/recommendations/get-product-recommendations/` + id,
    method: "GET",
  });

// SERVICES
// CONFIG
export const apiConfigServiceRecommendations = (id, data) =>
  axios({
    url: `/api/recommendations/configure-service-recommendations/${id}`,
    method: "PUT",
    data,
  });

// GET RECOMMENDED
export const apiGetServiceRecommendations = (id) =>
  axios({
    url: `/api/recommendations/get-service-recommendations/` + id,
    method: "GET",
  });

// USERS - CATEGORIES
export const apiUpdateMultipleSuggestionScores = (
  userIds,
  suggestionsToUpdate
) =>
  axios({
    url: "/api/recommendations/update-multiple-suggestion-scores",
    method: "PUT",
    data: {
      userIds,
      suggestionsToUpdate,
    },
  });
