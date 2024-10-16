import axios from "../utils/axios";

// GET REVENUE
export const apiGetRevenue = (period) => axios(
    {
        url: "/api/statistics/revenue?period=" + period,
        method: "GET",
    }
)