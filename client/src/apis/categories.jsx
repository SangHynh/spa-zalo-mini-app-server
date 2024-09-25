import axios from "../utils/axios";

export const apiGetCategories = () =>
  axios({
    url: "/api/categories/",
    method: "GET",
  });

export const apiCreateCategories = (formData) =>
  axios({
    url: "/api/categories/",
    method: "POST",
    data: formData,
  });
