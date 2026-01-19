# Hướng dẫn chạy Ứng dụng Giới thiệu Cầu thủ (Player Showcase)

Ứng dụng này được xây dựng bằng công nghệ web thuần (HTML, CSS, JavaScript) nên không cần cài đặt phần mềm phức tạp.

## Cách 1: Chạy trực tiếp (Đơn giản nhất)
1. Mở thư mục chứa dự án: `e:\cauthu\app`
2. Tìm file **`index.html`**.
3. Nhấn đúp chuột (muốn chuột trái 2 lần) vào file này.
4. Ứng dụng sẽ mở ra trên trình duyệt web mặc định của bạn (Chrome, Edge, Cốc Cốc,...).

## Cách 2: Sử dụng VS Code Live Server (Khuyên dùng)
Nếu bạn đang dùng Visual Studio Code:
1. Cài đặt Extension "Live Server".
2. Chuột phải vào file `index.html`.
3. Chọn **"Open with Live Server"**.

## Lưu ý quan trọng
- **Dữ liệu**: Thông tin cầu thủ, ảnh, và video được lưu tạm vào bộ nhớ trình duyệt (Local Storage). Nếu bạn xóa cache trình duyệt, dữ liệu có thể bị mất.
- **File video/âm thanh lớn**: Do chạy trên trình duyệt web, việc lưu trữ video quá lớn (trên 5MB) có thể làm đầy bộ nhớ. Hãy dùng các file dung lượng vừa phải hoặc link online nếu cần.
