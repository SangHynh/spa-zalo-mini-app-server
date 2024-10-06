import { getCookie, setCookie } from "./cookies";

export function signIn(accessToken, refreshToken) {
    // Decode the accessToken and refreshToken to extract `iat` and `exp`
    const decodedAccessToken = JSON.parse(atob(accessToken.split('.')[1]));
    const decodedRefreshToken = JSON.parse(atob(refreshToken.split('.')[1]));

    // Calculate expiration time in days for access token
    const accessTokenExpirationDays = (decodedAccessToken.exp - decodedAccessToken.iat) / (60 * 60 * 24);

    // Calculate expiration time in days for refresh token
    const refreshTokenExpirationDays = (decodedRefreshToken.exp - decodedRefreshToken.iat) / (60 * 60 * 24);

    setCookie("accessToken", accessToken, accessTokenExpirationDays);
    setCookie("refreshToken", refreshToken, refreshTokenExpirationDays);
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