import axios from "../utils/axios";

// GET ORDERS
export const apiGetOrders = (page, limit, keyword, status) => axios(
    {
        url: `/api/payments?page=${page}&limit=${limit}&keyword=${keyword}&status=${status}`,
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