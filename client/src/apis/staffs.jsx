import axios from "../utils/axios";

// STAFFS
export const apiGetStaffs = (page, limit, keyword) =>
    axios({
        url: `/api/staffs?page=${page}&limit=${limit}&keyword=${keyword}`,
        method: "GET",
    });

export const apiCreateStaff = (formData) =>
    axios({
        url: "/api/staffs/",
        method: "POST",
        data: formData,
    });
