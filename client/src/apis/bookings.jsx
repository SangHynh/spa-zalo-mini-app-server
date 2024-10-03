import axios from "../utils/axios";

// GET CATEGORIES
export const apiGetBookings = () => axios(
    {
        url: "/api/bookings/",
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