import axios from "../utils/axios";

// GET OVERVIEW
export const apiGetOverview = () => axios(
    {
        url: "/api/statistics/overview",
        method: "GET",
    }
)

// GET REVENUE
export const apiGetRevenue = (year) => axios(
    {
        url: "/api/statistics/revenue?year=" + year,
        method: "GET",
    }
)

// GET TOP PRODUCTS & SERVICE
export const apiGetTopProductsAndServices = (productLimit, serviceLimit) => axios(
    {
        url: `/api/statistics/top-products-services?productLimit=${productLimit}&serviceLimit=${serviceLimit}`,
        method: "GET",
    }
)