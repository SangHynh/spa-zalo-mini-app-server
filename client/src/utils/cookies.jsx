import { apiRefreshToken } from "../apis/auth";

// Hàm lưu giá trị vào cookie
export function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();

    document.cookie =
        name +
        "=" +
        encodeURIComponent(value) +
        "; expires=" +
        expires +
        "; path=/";
}

// Hàm lấy giá trị từ cookie
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

// Hàm gọi API refresh token để lấy access token mới nếu hết hạn
async function refreshAccessToken() {
    const refreshToken = getCookie("refreshToken"); // Lấy refresh token từ cookie

    try {
        const response = await apiRefreshToken({ refreshToken })

        if (!response.ok) {
            throw new Error("Failed to refresh access token");
        }

        const data = await response.json();
        setCookie("accessToken", data.accessToken, 1 / 24); // Lưu access token mới
        setCookie("refreshToken", data.refreshToken, 7); // Lưu refresh token mới
        console.log("New Access Token:", data.accessToken);
        return data.accessToken; // Trả về access token mới
    } catch (error) {
        errorMessage.textContent = "Failed to refresh token: " + error.message;
        console.error("Error:", error);
        return null; // Trả về null khi có lỗi
    }
}


