import axios from "../utils/axios";

// GET ORDERS
export const apiGetOrders = () => axios(
    {
        url: "/api/payments/",
        method: "GET",
    }
)