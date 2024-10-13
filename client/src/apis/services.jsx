import axios from "../utils/axios";

// GET SERVICES
export const apiGetServices = (page, limit, keyword = "", subCategoryId = "", priceSort = "") =>
  axios({
    url: `/api/services/?page=${page}&limit=${limit}&keyword=${keyword}&subCategoryId=${subCategoryId}&sortBy=price&sortOrder=${priceSort}`,
    method: "GET",
  });

// POST IDS TO GET SERVICES
export const apiGetServicesByIDs = (body) =>
  axios({
    url: "/api/services/byIDs",
    method: "POST",
    data: body
  });

// CREATE SERVICE
export const apiCreateServices = (formData) =>
  axios({
    url: "/api/services/",
    method: "POST",
    data: formData,
  });

// GET SERVICE
export const apiGetService = (id) =>
  axios({
    url: "/api/services/" + id,
    method: "GET",
  });

// UPDATE SERVICE
export const apiUpdateService = (id, formData) =>
  axios({
    url: "/api/services/" + id,
    method: "PUT",
    data: formData,
  });

// DELETE SERVICE
export const apiDeleteService = (id) =>
  axios({
    url: "/api/services/" + id,
    method: "DELETE",
  });
