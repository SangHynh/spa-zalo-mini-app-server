import axios from "../utils/axios";

// GET ORDERS
export const apiGetOrders = (page, limit, keyword) => axios(
    {
        url: `/api/payments?page=${page}&limit=${limit}&keyword=${keyword}`,
        method: "GET",
    }
)