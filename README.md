# Hướng Dẫn Sử Dụng Tool Tự Động Hoạt Hình 3D (HH3D Auto)

Tool tự động (Userscript) giúp bạn tự động thực hiện các hoạt động, nhiệm vụ hàng ngày trên trang web `hoathinh3d.*` mà không cần phải click tay tốn thời gian.

---

## 🌟 Các tính năng tự động hỗ trợ

Tool hỗ trợ tự động hóa hầu hết các tính năng trong game của web:

*   **Điểm Danh, Tế Lễ, Vấn Đáp:** Tự động điểm danh hàng ngày, tế lễ tông môn và tự động trả lời câu hỏi vấn đáp (không cần bạn phải tự tra cứu đáp án).
*   **Thí Luyện Tông Môn:** Tự động vào đánh quái thí luyện cho đến khi hết lượt.
*   **Phúc Lợi Đường:** Tự động nhận rương quà miễn phí mỗi khi đến giờ và nhận thêm quà Bonus (nút `🎁`).
*   **Hoang Vực:** Tự động đánh boss Hoang Vực hàng ngày. Hỗ trợ nút mua nhanh 5 rương Linh Bảo (`📦`) và nút bật/tắt tăng thêm 15% sát thương.
*   **Khoáng Mạch (Đào mỏ):** Tự động tìm mỏ, vào mỏ đào khoáng và nhận thưởng. Bạn có thể chọn loại mỏ muốn đào trực tiếp trên giao diện tool.
*   **Đổ Thạch (Tài/Xỉu):** Tự động cược Tài hoặc Xỉu theo lựa chọn của bạn trong các khung giờ: Sáng (`06:00 - 13:00`) và Chiều (`16:00 - 21:00`).
*   **Bí Cảnh:** Tự động săn boss Bí Cảnh. Bạn có thể chỉnh số lượt muốn giữ lại. Nút hình chuông (`🔔`/`🔕`) giúp bật/tắt nhận thông báo khi có boss xuất hiện.
*   **Tiên Duyên:** Tự động làm Tiên Duyên, cầu nguyện đạo lữ (`🙏`) và tự động tặng hoa đạo lữ (`🌺`) theo số lượng người chọn.
*   **Vòng Quay & Quà Năng Động:** Tự động quay Vòng Quay Phúc Vận miễn phí và tự mở rương quà hoạt động ngày khi đủ điểm.
*   **Luyện Đan:** Tự động bỏ nguyên liệu, canh nhiệt độ, điều lửa cho tới khi đan hoàn thành. Hiển thị tiến độ rõ ràng từng % và số đan đã luyện.

---

## 💾 Hướng dẫn cài đặt (Rất đơn giản)

Để chạy được tool, bạn chỉ cần làm theo 3 bước sau:

### Bước 1: Cài đặt tiện ích Tampermonkey vào trình duyệt
Click vào link bên dưới tương ứng với trình duyệt bạn đang dùng để cài đặt tiện ích quản lý script:
*   Dành cho **Chrome / Cốc Cốc / Edge / Brave / Opera**: [Tải Tampermonkey trên Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmfjgjjgbiipcnlhgmocsg)

*(Sau khi cài đặt xong, bạn sẽ thấy biểu tượng hình vuông màu đen có 2 chấm tròn ở góc trên bên phải trình duyệt).*

### Bước 2: Thêm Code của Tool vào Tampermonkey
1.  Click vào biểu tượng **Tampermonkey** ở góc trình duyệt -> Chọn **Cấu hình (Dashboard)** hoặc **Thêm script mới (Create a new script)**.
2.  Mở file cài đặt [hh3d.user.js](file:///c:/Users/phamq/Downloads/Tool/hh3d.user.js) trên máy tính của bạn.
3.  **Sao chép (Copy)** toàn bộ nội dung trong file [hh3d.user.js](file:///c:/Users/phamq/Downloads/Tool/hh3d.user.js).
4.  Quay lại trang tạo script của Tampermonkey, **xóa hết** những chữ đang có sẵn và **Dán (Paste)** toàn bộ nội dung vừa copy vào.
5.  Nhấn phím **Ctrl + S** (hoặc chọn menu `File` -> `Save`) để lưu lại.

---

## 🎮 Cách sử dụng tool

1.  Truy cập vào trang web phim hoạt hình 3D bạn hay xem (ví dụ: `https://hoathinh3d.co/` hoặc tên miền mới nếu web đổi đuôi).
2.  Tiến hành **Đăng nhập** tài khoản của bạn.
3.  Bảng điều khiển của **HH3D Auto Tool** sẽ tự động xuất hiện ngay trên giao diện trang cá nhân của bạn.
4.  **Cách dùng bảng điều khiển:**
    *   **Nút tròn Màu Xanh / Đỏ:** Là nút bật/tắt tự động (Autorun).
        *   **Màu Xanh:** Bật tự động chạy nhiệm vụ đó (Cứ đến giờ tool sẽ tự làm).
        *   **Màu Đỏ:** Tắt tự động chạy.
    *   **Nút bấm chữ (Thực hiện, Đào, Đánh, Luyện...):** Bấm vào để chạy nhiệm vụ đó ngay lập tức mà không cần đợi.
    *   **Ô nhập số / Danh sách chọn:**
        *   Nhập số lượt muốn giữ lại (ở phần Bí Cảnh).
        *   Chọn cửa muốn đặt cược (Tài/Xỉu ở phần Đổ Thạch).
    *   **Nút bánh răng `⚙️`:** Dùng để mở cài đặt chuyên sâu cho nhiệm vụ (như Luyện Đan).

---

## 💡 Lưu ý quan trọng khi dùng

*   **Không tắt tab web:** Bạn cần giữ mở tab website hoạt hình 3D thì tool mới có thể chạy tự động. Nếu tắt tab đi, tool sẽ tạm dừng hoạt động.
*   **Chạy an toàn:** Tool có cơ chế tự động giãn cách thời gian click (từ 1 đến 2 giây ngẫu nhiên) để mô phỏng giống người thật bấm, giúp tài khoản của bạn an toàn hơn, tránh bị lỗi mạng hoặc lỗi spam từ hệ thống.
*   **Bảo mật tuyệt đối:** Tool chạy hoàn toàn trên trình duyệt của bạn, không gửi thông tin tài khoản hay mật khẩu đi bất kỳ đâu.
*   **Luyện Đan mượt mà (Bản v2.4):** Bản cập nhật mới nhất đã sửa triệt để lỗi không tắt được nút luyện đan bằng tay, lỗi nhấp nháy chữ hiển thị tiến trình và không bị chạy lặp thông báo.
