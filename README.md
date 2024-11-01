# Installation Instructions

## Cài đặt và chạy
Install dependencies: `npm install --force`
Run server: `npm run dev`

## ZALO_CHECKOUT_SECRET_KEY Environment Variable
- Truy cập [Zalo Developers](https://mini.zalo.me/developers)
- Chọn **ZaloApp**
- Chọn **MiniApp**
- Vào **Checkout SDK** -> **Cấu hình chung** -> **Private Key**

## Cấu hình phương thức VNPAY_SANDBOX
### Đăng kí Merchant thử nghiệm
- Truy cập website [Đăng ký](https://sandbox.vnpayment.vn/devreg)
- Nhập vào thông tin đăng ký:
    - **Địa chỉ URL:** Nhập vào địa chỉ **(https://payment-mini.zalo.me/api/transaction/{Mini-App-ID}/vnp-ipn)** (với Mini-App-ID là ID Mini App của bạn) - Đây là **IPN Url** phía VNPay
    - **Email và Mật khẩu:** Ghi nhớ dùng để nhận email thông tin test và đăng nhập vào trang Admin VNPAY
- Nhấn **Đăng ký** -> Kiểm tra email xác nhận đăng ký -> Truy cập link được gửi để kích hoạt
- Sau khi kích hoạt, kiểm tra email thông tin test -> Lấy các thông tin sau:
    - **Terminal ID:** Mã Website (vnp_TmnCode)
    - **Secret Key** Chuỗi bí mật tạo checksum (vnp_HashSecret)
- Vào trang cấu hình chung **Checkout SDK**
- **Thêm thanh toán mới** -> **Zalo Pay SandBox**
- Nhập các thông tin sau:
    - **Terminal ID:** (vnp_TmnCode) đã có
    - **Version:** `2.1.0`
    - **Secret Key:** (vnp_HashSecret) đã có
    - **Redirect path:** `/payment-result`

### Kiểm tra đã cấu hình IPN Url chưa (Nếu thanh toán bị lỗi không chuyển đến trang thanh toán thành công)
- Truy cập website để làm theo chỉ dẫn [Hướng dẫn](https://vnpay.js.org/ipn/config-ipn)

## Cấu hình phương thức ZALOPAY_SANDBOX
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
