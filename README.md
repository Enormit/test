# HH3D Auto Userscript (v2.4)

Userscript chạy trên trình duyệt (qua Tampermonkey hoặc Violentmonkey) nhằm tự động hóa các hoạt động, nhiệm vụ hàng ngày trên website phim `hoathinh3d.*`.

> **Lưu ý:** Script được thiết kế chạy trực tiếp dưới dạng Userscript để tối ưu hóa hiệu năng, tương tác trực tiếp với UI của website và tự động thích ứng khi trang đổi domain.

---

## 🌟 Tính năng chính

### 1. Danh sách nhiệm vụ hỗ trợ tự động (Auto Tasks)

| Tác vụ | Tên Nhiệm Vụ | Mô tả tính năng | Hỗ trợ Auto | Cấu hình & Tùy chọn đi kèm |
| :--- | :--- | :--- | :---: | :--- |
| **Điểm Danh** | Điểm Danh, Tế Lễ, Vấn Đáp | Tự động điểm danh hàng ngày, tế lễ tông môn và trả lời câu hỏi vấn đáp tự động. | ✅ | Tự lấy nonce, tự dò đáp án đáp án nhanh chóng. |
| **Thí Luyện** | Thí Luyện Tông Môn | Tự động khiêu chiến quái Thí Luyện Tông Môn khi đến lượt. | ✅ | Tự động đánh cho đến khi hết lượt. |
| **Phúc Lợi** | Phúc Lợi Đường | Tự động nhận rương Phúc Lợi Đường theo thời gian và nhận thưởng Bonus. | ✅ | Nút `🎁` nhận nhanh Bonus. |
| **Hoang Vực** | Boss Hoang Vực | Tự động đánh boss Hoang Vực hàng ngày. | ✅ | Nút `📦` mua nhanh 5 rương Linh Bảo. Nút Toggle tăng sát thương (+15% dame). |
| **Mê Cung** | Mê Cung | Tự động chuyển hướng nhanh đến trang Mê Cung để thao tác. | ❌ | Bấm nút "Vào" để mở nhanh `/me-cung`. |
| **Khoáng Mạch** | Khoáng Mạch | Tự động chọn mỏ đào khoáng, vào mỏ và thu hoạch. | ✅ | Nút "Vào" để mở nhanh `/khoang-mach`. Tùy chỉnh chọn loại mỏ đào. |
| **Đổ Thạch** | Đổ Thạch | Tự động đặt cược Tài/Xỉu theo khung giờ quy định. | ✅ | Tự chọn cược **Tài** hoặc **Xỉu** qua giao diện. Tự chạy trong các khung giờ: `06:00 - 13:00` và `16:00 - 21:00`. |
| **Bí Cảnh** | Bí Cảnh | Tự động săn boss Bí Cảnh. | ✅ | Nhập số lượt khiêu chiến muốn giữ lại. Nút `🔔`/`🔕` bật/tắt theo dõi Boss qua WebSocket thời gian thực. |
| **Tiên Duyên** | Tiên Duyên | Tự động tương tác Tiên Duyên, cống hiến Đạo Lữ. | ✅ | Nút `🙏` Cầu nguyện Đạo Lữ nhanh. Nút `🌺` tặng hoa tự động với số lượng chọn (1 - 5 người). |
| **Hoạt Động Ngày**| Vòng Quay Phúc Vận | Tự động quay vòng quay và nhận rương năng động ngày khi đủ điểm. | ✅ | Nút "Vào" mở nhanh trang `/nhiem-vu-hang-ngay`. |
| **Luyện Đan** | Luyện Đan | Tự động luyện đan, kiểm tra lò, tự động điều hỏa khi nhiệt độ thay đổi. | ✅ | Tự động canh lò luyện đan, hiển thị tiến độ luyện thời gian thực, tự động dừng/chạy mượt mà. |

### 2. Các tính năng hệ thống

*   **Tự động nhận diện Domain:** Tự nhận biết domain hiện tại (ví dụ: `hoathinh3d.co`, `hoathinh3d.com`, v.v.), không cần thay đổi code thủ công khi trang web đổi tên miền phụ.
*   **Chống phát hiện Bot (Anti-Bot Fetch Wrapper):**
    *   Tự động duy trì khoảng cách tối thiểu giữa các yêu cầu (tối thiểu 1 giây).
    *   Thêm độ trễ ngẫu nhiên (random delay từ `500ms` đến `1500ms`) trước mỗi lượt gửi request để giả lập thao tác người dùng.
    *   Tự động thử lại (Retry với cơ chế Exponential Backoff) khi gặp sự cố mạng hoặc lỗi `HTTP 429` (Quá nhiều request), `HTTP 503`.
*   **Bộ nhớ lưu trữ an toàn:** Lưu trạng thái nhiệm vụ, cấu hình bật/tắt của từng nhiệm vụ cục bộ thông qua `localStorage`.

---

## 💾 Hướng dẫn cài đặt

Để sử dụng tool, bạn cần cài đặt một tiện ích quản lý Userscript trên trình duyệt của mình:

### Bước 1: Cài đặt Extension quản lý Userscript
Chọn một trong hai tiện ích phổ biến bên dưới và cài đặt vào trình duyệt (Chrome, Edge, Firefox, Brave, Opera, ...):
*   **Tampermonkey:** [Tải cho Chrome/Edge](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmfjgjjgbiipcnlhgmocsg)
*   **Violentmonkey:** [Tải cho Chrome/Edge](https://chromewebstore.google.com/detail/violentmonkey/jinjacapnfaceleondegeciifeegkcgo)

### Bước 2: Thêm Script vào tiện ích quản lý
1.  Click vào icon Tampermonkey/Violentmonkey trên thanh công cụ trình duyệt -> Chọn **Create a new script** (Tạo script mới).
2.  Xóa toàn bộ nội dung mặc định trong khung soạn thảo.
3.  Mở file [hh3d.user.js](file:///c:/Users/phamq/Downloads/Tool/hh3d.user.js), sao chép (Copy) toàn bộ nội dung của file này.
4.  Dán (Paste) nội dung vừa copy vào khung soạn thảo của tiện ích quản lý.
5.  Nhấn tổ hợp phím **Ctrl + S** (hoặc chọn `File` -> `Save`) để lưu lại.

---

## 🎮 Hướng dẫn sử dụng

1.  Truy cập vào website `hoathinh3d` đang hoạt động (ví dụ: `https://hoathinh3d.co/`).
2.  Tiến hành **Đăng nhập** tài khoản cá nhân của bạn trên website.
3.  Vào trang cá nhân hoặc các trang nhiệm vụ, giao diện điều khiển của **HH3D Auto Tool** sẽ được tích hợp trực tiếp trên giao diện của website.
4.  **Cách điều khiển:**
    *   **Dấu chấm tròn chỉ thị (Indicator):** Màu xanh lá biểu thị nhiệm vụ đang bật tự động chạy (Autorun), màu đỏ biểu thị nhiệm vụ đang tắt. Bạn có thể bấm vào chấm tròn này để bật/tắt chế độ tự động cho từng nhiệm vụ riêng biệt.
    *   **Nút bấm thủ công:** Bấm vào nút như "Thực hiện", "Đào", "Đánh", "Luyện" để bắt đầu xử lý nhiệm vụ đó ngay lập tức mà không cần đợi lịch tự động.
    *   **Nhập số liệu:** Đối với các tác vụ như Bí Cảnh, nhập số lượt muốn giữ lại vào ô input.
    *   **Chọn cài đặt:** Với tác vụ Đổ Thạch, lựa chọn cửa cược (Tài/Xỉu) từ danh sách thả xuống.
    *   **Cài đặt riêng:** Bấm nút bánh răng `⚙️` (như ở Luyện Đan) để cấu hình sâu hơn.

---

## 🛠️ Nhật ký cập nhật gần đây (Changelog)

### Phiên bản v2.4 (Mới nhất)
*   **Sửa lỗi dừng/tắt Luyện Đan bằng tay:** Khắc phục triệt để vấn đề không thể dừng tác vụ Luyện Đan. Loại bỏ các ngoại lệ hardcode, cho phép hệ thống giải phóng bộ đếm thời gian, xóa trạng thái hiển thị UI và dừng lập lịch chạy khi người dùng tắt nút.
*   **Khắc phục lỗi kẹt trạng thái "Khai lò phẩm HA":** Tự động tối ưu hóa việc đặt lịch kiểm tra lại ngay sau khi khai lò thành công thay vì bị hoãn tới lịch định kỳ mặc định tiếp theo.
*   **Ngăn chặn chạy trùng lặp (Mutex Guard):** Bổ sung cờ bảo vệ `this.isProcessing` ngay đầu luồng xử lý `doLuyenDan()` để tránh việc tác vụ chạy song song hai lần cùng lúc khi người dùng click thủ công trùng thời điểm với tác vụ tự động chạy đến hạn.
*   **Sửa lỗi UI nhấp nháy:** Loại bỏ xung đột làm mới DOM của khung tiến trình Luyện Đan, bảo vệ dòng chữ hiển thị trạng thái không bị xóa trắng sau 2 giây.
