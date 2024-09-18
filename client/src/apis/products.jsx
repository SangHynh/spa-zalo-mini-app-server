import axios from "../utils/axios";

// GET PRODUCTS
export const apiGetProducts = () => axios(
  {
    url: "/products/",
    method: "GET",
  }
)

// POST PRODUCT
export const apiCreateProducts = (formData) => axios(
  {
    url: "/products/",
    method: "POST",
    data: formData
  }
)