import axios from "../utils/axios";

// GET CATEGORIES
export const apiGetBookings = (page, limit, keyword = "", status = "", sortDate = "") => axios(
    {
        url: `/api/bookings?page=${page}&limit=${limit}&keyword=${keyword}&status=${status}&sortBy=date&sortOrder=${sortDate}`,
        method: "GET",
    }
)

// GET CATEGORY
export const apiGetBooking = (id) => axios(
    {
        url: "/api/bookings/single/" + id,
        method: "GET",
    }
)

// UPDATE CATEGORY
export const apiUpdateBookingStatus = (id, data) => axios(
    {
        url: "/api/bookings/status/" + id,
        method: "PUT",
        data
    }
)