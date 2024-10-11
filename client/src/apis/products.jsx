import axios from "../utils/axios";

// GET PRODUCTS
export const apiGetProducts = (page, limit, keyword) =>
  axios({
    url: `/api/products?page=${page}&limit=${limit}&keyword=${keyword}`,
    method: "GET",
  }
)

// POST IDS TO GET PRODUCTS
export const apiGetProductsByIDs = (body) =>
  axios({
    url: "/api/products/byIDs",
    method: "POST",
    data: body
  }
)

// GET PRODUCT
export const apiGetProduct = (id) => axios(
  {
    url: "/api/products/" + id,
    method: "GET",
  }
)

// POST PRODUCT
export const apiCreateProducts = (formData) =>
  axios({
    url: "/api/products/",
    method: "POST",
    data: formData
  }
)

// PUT PRODUCT
export const apiUpdateProduct = (id, formData) => axios(
  {
    url: "/api/products/" + id,
    method: "PUT",
    data: formData
  }
)

// DELETE PRODUCT
export const apiDeleteProduct = (id) => axios(
  {
      url: "/api/products/" + id,
      method: "DELETE",
  }
)