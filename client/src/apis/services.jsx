import axios from "../utils/axios";

// GET SERVICES
export const apiGetServices = () =>
  axios({
    url: "/api/services/",
    method: "GET",
  });

// CREATE SERVICE
export const apiCreateServices = (formData) =>
  axios({
    url: "/api/services/",
    method: "POST",
    data: formData,
  });

// GET SERVICE
export const apiGetService = (id) =>
  axios({
    url: "/api/services/" + id,
    method: "GET",
  });

// UPDATE SERVICE
export const apiUpdateService = (id, formData) =>
  axios({
    url: "/api/services/" + id,
    method: "PUT",
    data: formData,
  });
