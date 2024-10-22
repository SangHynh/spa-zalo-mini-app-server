import axios from "../utils/axios";

// GET SLIDER
export const apiGetSlider = () =>
  axios({
    url: "/api/configs/slider",
    method: "GET",
  });

// GET PERMISSIONS
export const apiGetPermission = () =>
  axios({
    url: "/api/configs/permission",
    method: "GET",
  });

// PUT SLIDER
export const apiUpdateSlider = (formData) =>
  axios({
    url: "/api/configs/slider",
    method: "PUT",
    data: formData,
  });

// GET ORDER-POINT
export const apiGetOrderPoints = () =>
  axios({
    url: "/api/configs/orderPoints",
    method: "GET",
  });

// CREATE ORDER-POINT
export const apiCreateOrderPoint = (orderPointData) =>
  axios({
    url: "/api/configs/orderPoints",
    method: "POST",
    data: orderPointData,
  });

// UPDATE ORDER-POINT
export const apiUpdateOrderPoint = (orderPointId, orderPointData) =>
  axios({
    url: `/api/configs/orderPoints/${orderPointId}`,
    method: "PUT",
    data: orderPointData,
  });

// DELETE ORDER-POINT
export const apiDeleteOrderPoint = (orderPointId) =>
  axios({
    url: `/api/configs/orderPoints/${orderPointId}`,
    method: "DELETE",
  });

// UPDATE COMMISSION
export const apiUpdateCommission = (data) =>
  axios({
    url: `/api/configs/commission`,
    method: "PUT",
    data: data,
  });

// GET COMMISSION
export const apiGetCommission = () =>
  axios({
    url: `/api/configs/commission`,
    method: "GET",
  });
