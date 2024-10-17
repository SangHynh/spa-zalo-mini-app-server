import axios from "../utils/axios";

// GET REVENUE
export const apiGetRevenue = (period) => axios(
    {
        url: "/api/statistics/revenue?period=" + period,
        method: "GET",
    }
)

// GET TOP PRODUCTS & SERVICE
export const apiGetTopProductsAndServices = (limit) => axios(
    {
        url: "/api/statistics/top-products-services?limit=" + limit,
        method: "GET",
    }
)