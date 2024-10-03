import { getCookie, setCookie } from "./cookies";

export function signIn(accessToken, refreshToken) {
    setCookie("accessToken", accessToken, 1 / 24);
    setCookie("refreshToken", refreshToken, 7);
}

export function isLoggedIn() {
    const accessToken = getCookie('accessToken');
    console.log(accessToken)
    return !!accessToken;
}

export function logout() {
    setCookie('accessToken', '', -1);
    setCookie('refreshToken', '', -1); 
    console.log("Logged out successfully, cookies cleared.");
}