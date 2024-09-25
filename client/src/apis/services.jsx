import axios from "../utils/axios";

export const apiGetServices = () =>
  axios({
    url: "/api/services/",
    method: "GET",
  });

export const apiCreateServices = (formData) =>
  axios({
    url: "/api/services/",
    method: "POST",
    data: formData,
  });
