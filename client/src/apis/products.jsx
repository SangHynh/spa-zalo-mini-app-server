import axios from "../utils/axios";

// GET PRODUCTS
export const apiGetProducts = () => axios(
  {
    url: "/api/products/",
    method: "GET",
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
export const apiCreateProducts = (formData) => axios(
  {
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