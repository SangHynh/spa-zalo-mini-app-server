import axios from "../utils/axios";

// GET PRODUCTS
export const apiGetProducts = (page, limit, keyword = "", subCategoryId = "", stockSort = "", priceSort = "", expiryDateSort = "") =>
  axios({
    url: `/api/products?page=${page}&limit=${limit}&keyword=${keyword}&subCategoryId=${subCategoryId}&sortBy=price,stock,expiryDate&sortOrder=${priceSort},${stockSort},${expiryDateSort}`,
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