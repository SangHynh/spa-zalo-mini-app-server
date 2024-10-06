# Hướng Dẫn Cấu Hình Ngrok

Ngrok là một công cụ cho phép bạn tạo một đường hầm (tunnel) tới ứng dụng của mình đang chạy trên localhost, giúp bạn dễ dàng chia sẻ ứng dụng với người khác hoặc thử nghiệm với các dịch vụ bên ngoài.

Trang chủ: [ngrok](https://ngrok.com/)

## Bước 1: Cài Đặt Ngrok

- Tải Ngrok: Truy cập trang chính thức của Ngrok: `ngrok.com`. Đăng ký tài khoản miễn phí để nhận mã xác thực.

- Giải Nén: Tải phiên bản tương thích với hệ điều hành (Windows, macOS, Linux) và giải nén nó vào thư mục bạn muốn.

- Thêm Ngrok vào PATH.

## Bước 2: Xác Thực Tài Khoản Ngrok

- Lấy mã xác thực: Sau khi đăng ký tài khoản sẽ nhận được mã xác thực trên trang quản lý tài khoản của mình.

- Chạy lệnh xác thực: Sử dụng terminal để chạy lệnh xác thực (thay <YOUR_AUTH_TOKEN> bằng mã xác thực)

```bash
ngrok authtoken <YOUR_AUTH_TOKEN>
```
## Bước 3: Chạy server

Chạy server trên cổng 8080

```bash
npm run dev
```

## Bước 4: Chạy ngrok

```bash
ngrok http 3000
```
Sau khi chạy lệnh này, Ngrok sẽ cung cấp một URL công khai (ví dụ: `http://abcd1234.ngrok.io`), có thể chia sẻ với người khác để họ có thể truy cập vào ứng dụng của bạn.
