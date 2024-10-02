# HƯỚNG DẪN LẤY ZALO_APP_SECRET_KEY

1. Truy cập [Google](https://developers.zalo.me/)

2. Đăng ký và tạo miniapp Zalo

3. Vào nút bánh răng cài đặt lấy khoá bí mật ứng dụng bỏ vào trong file `.env` `ZALO_APP_SECRET_KEY`

3. Quay về trang chủ Zalo for developer -> Công cụ -> API Explorer -> Lấy AccessToken

4. Bỏ AccessToken vừa lấy được vào trong `.env` `ZALO_ACCOUNT_ACCESS_TOKEN=`

5. Mở terminal chạy lệnh sau để kiểm tra: 
```bash
npm run checkZaloToken
```

### Tài liệu liên quan:
- [Google](https://developers.zalo.me/docs/social-api/tai-lieu/tong-quan)
- [Google](https://mini.zalo.me/documents/intro/getting-started/)

