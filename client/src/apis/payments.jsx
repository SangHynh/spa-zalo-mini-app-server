import axios from "../utils/axios";

// GET ORDERS
export const apiGetOrders = (page, limit, keyword) => axios(
    {
        url: `/api/payments?page=${page}&limit=${limit}&keyword=${keyword}`,
        method: "GET",
    }
)

export const apiDeleteOrder = (id) => axios(
    {
        url: `/api/payments/single/${id}`,
        method: "DELETE",
    }
)

export const apiDeleteOrders = (data) => axios(
    {
        url: `/api/payments/mass`,
        method: "DELETE",
        data
    }
)