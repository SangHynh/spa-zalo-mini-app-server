import axios from "../utils/axios";

// GET VOUCHERS
export const apiGetVouchers = (page, limit, keyword = "", validFrom = "", validTo = "") =>
  axios({
    url: `/api/vouchers?page=${page}&limit=${limit}&keyword=${keyword}&validFrom=${validFrom}&validTo=${validTo}`,
    method: "GET",
  }
)

// GET VOUCHER
export const apiGetVoucher = (id) => axios(
  {
    url: "/api/vouchers/" + id,
    method: "GET",
  }
)

// POST VOUCHER
export const apiCreateVouchers = (formData) =>
  axios({
    url: "/api/vouchers/",
    method: "POST",
    data: formData
  }
)

// POST VOUCHER
export const apiGiveAwayVouchersToUsers = (formData) =>
  axios({
    url: "/api/vouchers/giveAway",
    method: "POST",
    data: formData
  }
)

// PUT VOUCHER
export const apiUpdateVoucher = (id, formData) => axios(
  {
    url: "/api/vouchers/" + id,
    method: "PUT",
    data: formData
  }
)

// DELETE VOUCHER
export const apiDeleteVoucher = (id) => axios(
  {
      url: "/api/vouchers/" + id,
      method: "DELETE",
  }
)