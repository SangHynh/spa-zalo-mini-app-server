import axios from "../utils/axios";

// GET PRODUCTS
export const apiGetProducts = () => axios(
  {
    url: "/api/products/",
    method: "GET",
  }
)

// POST PRODUCT
export const apiCreateProducts = (formData) => axios(
  {
    url: "/api/products/",
    method: "POST",
    data: formData
  }
)