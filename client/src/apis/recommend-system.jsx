import axios from "../utils/axios";

// UPDATE PRODUCT
export const apiUpdateProductRS = (data) =>
  axios({
    url: "/api/updateProductRS",
    method: "POST",
    data,
  });
