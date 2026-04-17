# Kế hoạch Triển khai: Thiết kế Hoa AI bằng 100% Google Gemini (Vision + Imagen 3)

Bạn hoàn toàn đúng! Với hệ sinh thái Google AI Studio và Key API cung cấp (`AIzaSyCo...`), chúng ta **HOÀN TOÀN CÓ THỂ dùng 100% sức mạnh của Google Gemini** để sinh ảnh nhờ vào Model mới nhất `imagen-3.0-generate-001`.

Dưới đây là kế hoạch sử dụng chính quy API Gemini của bạn để triển khai quy trình tạo ảnh y hệt như web "AI Floral Booth" mà bạn gửi.

## Quy Trình (Logic Hoạt Động Kép)

**Mô hình hoạt động nội bộ Gemini:**
1. Khách hàng nhặt Hoa, Lá, Túi trên giao diện web. Web tự gộp 3 tấm hình chụp vật liệu này thành dạng Base64.
2. Web gửi lệnh xuống Backend. Backend gọi API **Gemini 1.5 Flash (Vision)**, nạp 3 tấm hình vào prompt và ra lệnh: *"Phân tích thiết kế của hoa, lá và túi này. Viết cho tôi một câu Prompt tiếng Anh thật hoàn hảo để render ra cảnh cắm tĩnh vật chân thực nhất."*
3. Lập tức Gemini Flash trả về một câu Prompt Tiếng Anh chuyên nghiệp. Backend lấy y nguyên câu Prompt đó truyền thẳng vào cổng sinh ảnh **Google Imagen 3 (`imagen-3.0-generate-001`)**.
4. Imagen 3 xuất file ảnh `base64` siêu thực tế. Backend trả luồng Base64 về cho Front-End.
5. Front-End tự động hiển thị tấm ảnh thành quả xịn xò cho khách hàng xem thử.

---

## Chi tiết Mã nguồn cần cập nhật

### 1. Phía Server (Backend Node.js)

*Tính năng: Giao tiếp với bộ ba sức mạnh Gemini.*

**Cài đặt:**
- Cài thêm `npm install @google/generative-ai axios` vào backend.
- Lưu trữ file KEY vào `.env` với tên `GEMINI_API_KEY`.

**File `aiController.js` (Mới):**
- Xây dựng API `POST /api/ai/preview`.
- Nhận biến `products` (gồm urls ảnh hoa, lá, túi) chuyển từ hệ thống giỏ hàng lên.
- Tự động download các ảnh và chuyển đổi định dạng Buffer -> Base64.
- `BƯỚC VISON`: Khởi chạy model `gemini-1.5-flash` tạo prompt.
- `BƯỚC RENDER`: Khởi chạy luồng `fetch` riêng lẻ nhắm tới cổng API `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict` gửi kèm prompt vừa có để lấy json base64 của bức ảnh.

**File `aiRoutes.js` (Mới) & `app.js` (Sửa):**
- Tạo Route `/api/ai/preview` kết nối với AI Controller.
- Mount vào hệ thống `app.use('/api/ai', aiRoutes)`.

---

### 2. Phía Client (Giao diện React)

*Tính năng: Chỗ hiển thị chốt đơn trước khi người dùng thực sự trả tiền.*

**File `cart.jsx` (Trang Giỏ hàng / Tạm tính):**
- Khu vực hiển thị: Cột bên phải (Phần Order Summary).
- Sẽ tích hợp thêm một thẻ Panel lấp lánh mang tên **"✨ XEM TRƯỚC BÓ HOA (AI Render)"**.
- Có Nút "Dựng ảnh bằng AI": Khi khách bấm vào, khung hình sẽ hiện hiệu ứng loading "AI đang thiết kế... khoảng 5-10s".
- Sau khi AI gửi base64 về, một khung hình mô phỏng bó hoa 3D chân thật sẽ hiện ra thay thế khung loading.
- Từ đây người dùng có thể thoả mãn bấm nút "THANH TOÁN" để chốt đơn hàng hiện tại của họ thông qua Cổng thanh toán.

---
**Quyết định Cần duyệt (Approve):**
- Bạn có đồng ý với logic kẹp đôi của Google này không?
- Đặt nút AI Render ở chỗ **Trang Giỏ hàng** giống như Kế hoạch này là phù hợp nhất đúng không?

*(Kế hoạch đã được trích xuất từ AI System để bạn dễ dàng lưu trữ)*
