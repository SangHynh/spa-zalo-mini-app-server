import axios from "../utils/axios";

// LOGIN
export const apiLogin = (data) =>
  axios({
    url: "/auth/login",
    method: "POST",
    data,
  });

// REGISTER
export const apiRegister = (data) =>
  axios({
    url: "/auth/register",
    method: "POST",
    data,
  });

// REFRESH TOKEN
export const apiRefreshToken = (data) =>
  axios({
    url: "/auth/refresh-token",
    method: "POST",
    data,
  });
