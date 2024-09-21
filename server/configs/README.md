# Hướng Dẫn Cài Đặt Redis và Redis Insight

Tài liệu này cung cấp hướng dẫn chi tiết về việc cài đặt Redis trên hệ điều hành Windows và Redis Insight để quản lý và giám sát cơ sở dữ liệu Redis.

## 1. Cài Đặt Redis Trên Windows

### Bước 1: Tải Redis

Tải Redis từ GitHub thông qua liên kết dưới đây:

```bash
https://github.com/tporadowski/redis/releases
```

Chọn tệp `.msi` của phiên bản Redis mới nhất để tải về.

### Bước 2: Cài Đặt Redis

1. Chạy tệp `.msi` vừa tải về.
2. Làm theo các bước hướng dẫn trên trình cài đặt.
3. Redis sẽ được cài đặt như một dịch vụ trên Windows và tự động khởi động sau khi cài đặt.

### Bước 3: Kiểm Tra Cài Đặt Redis

Mở Command Prompt (CMD) và thực hiện lệnh sau để kiểm tra phiên bản Redis đã cài:

```bash
redis-server --version
```

Để khởi động Redis Server thủ công, bạn chạy lệnh:

```bash
redis-server
```
Kết nối đến Redis CLI (giao diện dòng lệnh của Redis) bằng lệnh:

```bash
redis-cli
```
Ta có thể kiểm tra các lệnh Redis thông qua CLI

```bash
ping
```

## 2. Cài Đặt Redis Insight
Redis Insight là công cụ giúp quản lý và giám sát Redis thông qua giao diện trực quan.

### Bước 1: Tải Redis Insight
Tải Redis Insight từ trang chủ chính thức của Redis:

```bash
https://redis.io/insight/
```

### Bước 2: Cài Đặt Redis Insight

Chạy tệp cài đặt Redis Insight vừa tải về.
Làm theo các bước hướng dẫn trên trình cài đặt để hoàn tất quá trình cài đặt.

### Bước 3: Kết Nối Redis Insight với Redis

Mở Redis Insight.
Tạo một kết nối mới

    Host: localhost (hoặc địa chỉ của Redis Server)
    Port: 6379 (hoặc port mà Redis Server đang chạy)

Sau khi kết nối thành công, bạn có thể sử dụng giao diện để giám sát, phân tích và quản lý cơ sở dữ liệu Redis của mình.
