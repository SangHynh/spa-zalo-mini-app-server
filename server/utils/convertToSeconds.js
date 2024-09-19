// Hàm chuyển các định dạng expireIn của JWT thành 
// Thời gian lưu key tối đa của Redis là 30 ngày
const convertToSeconds = (value) => {
    const unit = value.slice(-1); // Lấy đơn vị cuối cùng (s, m, h, d, y)
    const number = parseInt(value.slice(0, -1)); // Lấy giá trị số

    switch (unit) {
        case 's': // giây
            return number;
        case 'm': // phút
            return number * 60;
        case 'h': // giờ
            return number * 60 * 60;
        case 'd': // ngày
            return number * 24 * 60 * 60;
        default:
            throw new Error('Invalid time format');
    }
}

module.exports = { convertToSeconds };
