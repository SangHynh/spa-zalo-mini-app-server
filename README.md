## Installation Instructions

Install dependencies: `npm install --force`
Run server: `npm run dev`

### ZALO_CHECKOUT_SECRET_KEY Environment Variable
- Truy cập [Zalo Developers](https://mini.zalo.me/developers)
- Chọn **ZaloApp**
- Chọn **MiniApp**
- Vào **Checkout SDK** -> **Cấu hình chung** -> **Private Key**

### Zalo Pay Sandbox Setup
- Vào trang cấu hình chung **Checkout SDK**
- **Thêm thanh toán mới** -> **Zalo Pay SandBox**
- Nhập các thông tin sau:
    - **Merchant App ID:** `554` (Test Merchant)
    - **Key 1:** `8NdU5pG5R2spGHGhyO99HN1OhD8IQJBn` (Test Merchant)
    - **Key 2:** `uUfsWgfLkRLzq6W2uNXTCxrfxs51auny` (Test Merchant)
    - **Redirect path:** `/payment-result`

### Zalopay Sandbox App
- Truy cập [Zalopay Doanh nghiệp](https://docs.zalopay.vn/v1/start/)
- Chọn **A. Trải nghiệm với ZaloPay** và làm theo hướng dẫn
- Xác thực tài khoản trong ứng dụng
- Đảm bảo **ZaloPay** thật trên **Zalo** cần tắt hoặc đăng xuất
