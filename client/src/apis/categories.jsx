import axios from "../utils/axios";

// GET CATEGORIES
export const apiGetCategories = () => axios(
    {
        url: "/api/categories/",
        method: "GET",
    }
)

// GET CATEGORY
export const apiGetCategory = (id) => axios(
    {
        url: "/api/categories/" + id,
        method: "GET",
    }
)

// POST CATEGORY
export const apiCreateCategory = (data) => axios(
    {
        url: "/api/categories/",
        method: "POST",
        data: data
    }
)

// PUT CATEGORY
export const apiUpdateCategory = (id, formData) => axios(
    {
        url: "/api/categories/" + id,
        method: "PUT",
        data: formData
    }
)

// DELETE CATEGORY
export const apiDeleteCategory = (id) => axios(
    {
        url: "/api/categories/" + id,
        method: "DELETE",
    }
)