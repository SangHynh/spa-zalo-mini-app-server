import axios from "../utils/axios";

// CUSTOMERS
export const apiGetCustomers = (page, limit, keyword) =>
  axios({
    url: `/api/users?page=${page}&limit=${limit}&keyword=${keyword}`,
    method: "GET",
  });

export const apiGetCustomer = (userId) =>
  axios({
    url: `/api/users/${userId}`,
    method: "GET",
  });

export const apiCreateCustomers = (formData) =>
  axios({
    url: "/api/customers/",
    method: "POST",
    data: formData,
  });

//STAFFS
export const apiGetStaffs = () =>
  axios({
    url: "/api/staffs/",
    method: "GET",
  });

export const apiCreateStafffs = (formData) =>
  axios({
    url: "/api/staffs/",
    method: "POST",
    data: formData,
  });

export const apiSearchAffiate = (referralCode) =>
  axios({
    url: `/api/users/referral-info/${referralCode}`,
    method: "GET",
  });
