import axios from "../utils/axios";

// GET SLIDER
export const apiGetSlider = () =>
  axios({
    url: "/api/configs/slider",
    method: "GET",
  }
)

// PUT SLIDER
export const apiUpdateSlider = (formData) => axios(
  {
    url: "/api/configs/",
    method: "PUT",
    data: formData
  }
)