# HƯỚNG DẪN LẤY ZALO_APP_SECRET_KEY

1. Truy cập [Zalo for developer](https://developers.zalo.me/)

2. Đăng ký và tạo miniapp Zalo góc bên phải phía trên chỗ avatar -> thêm ứng dụng mới

3. Chọn ứng dụng vừa tạo, vào nút bánh răng cài đặt lấy khoá bí mật ứng dụng bỏ vào trong file `.env` `ZALO_APP_SECRET_KEY`

3. Quay về trang chủ Zalo for developer -> Công cụ -> API Explorer -> Lấy AccessToken

4. Bỏ AccessToken vừa lấy được vào trong `.env` `ZALO_ACCOUNT_ACCESS_TOKEN=`

5. Mở terminal chạy lệnh sau để kiểm tra thông tin đúng không hoặc dùng trực tiếp với file `test/user.test.http` : 
```bash
npm run checkZaloToken
```

### Tài liệu liên quan:
- [Zalo Social API Documentation](https://developers.zalo.me/docs/social-api/tai-lieu/tong-quan)
- [Getting Started with Zalo Mini App](https://mini.zalo.me/documents/intro/getting-started/)

