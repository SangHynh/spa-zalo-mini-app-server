# CÁCH DÙNG MIDDLEWARE KEEPALIVE 

Do khi deploy lên Render phiên bản free thì sau 1 khoảng thời gian server hosting sẽ bị đóng.

Middleware này sử dụng để duy trì keep-alive-server khi deploy hosting Render, không ảnh hưởng tới chức năng khác.

keep-alive-server
- [Google] (https://github.com/SangHynh/keep-alive-server)

Khi chạy keep-alive-server trên local thì không cần middleware này, vì nó chỉ đơn giản là spam request sau 5 phút để duy trì server.

Chú ý giá trị trong `.env`