# HH3D Auto Tool — Hướng Dẫn Cài Đặt & Sử Dụng

> **Userscript tự động hóa các hoạt động hàng ngày trên [hoathinh3d.co](https://hoathinh3d.co)**  
> Phiên bản hiện tại: **v2.18**

---

## 🌟 Tính năng tự động hỗ trợ

| Tính năng | Mô tả |
|---|---|
| **Điểm Danh & Tế Lễ** | Tự động điểm danh hàng ngày, tế lễ tông môn |
| **Vấn Đáp** | Tự động tra và trả lời câu hỏi vấn đáp |
| **Thí Luyện** | Tự động đánh quái thí luyện hết lượt |
| **Phúc Lợi Đường** | Tự động nhận rương quà miễn phí theo giờ |
| **Hoang Vực** | Tự động đánh Boss, mua rương Linh Bảo |
| **Khoáng Mạch** | Tự động tìm mỏ, vào đào và nhận thưởng |
| **Đổ Thạch** | Tự động cược Tài/Xỉu theo lịch sáng/chiều |
| **Bí Cảnh** | Tự động săn boss, nhận thông báo khi boss xuất hiện |
| **Tiên Duyên** | Tự động cầu nguyện đạo lữ, tặng hoa, nhận lì xì |
| **Vòng Quay** | Tự động quay Phúc Vận miễn phí hàng ngày |
| **Hoạt Động Ngày** | Tự động mở rương khi đủ điểm hoạt động |
| **🆕 Luyện Đan** | Tự động khai lò, điều hỏa, thu hoạch, phân giải/sử dụng đan |

---

## 💾 Hướng dẫn cài đặt

### Bước 1 — Cài Tampermonkey vào trình duyệt

Chọn link phù hợp với trình duyệt của bạn:

- **Chrome / Cốc Cốc / Edge / Brave:** [Tải trên Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmfjgjjgbiipcnlhgmocsg)
- **Firefox:** [Tải trên Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

> Sau khi cài xong, bạn sẽ thấy biểu tượng hình vuông đen có 2 chấm tròn ở góc phải trình duyệt.

---

### Bước 2 — Cài đặt Script

**Cách 1 — Cài tự động qua link (Khuyên dùng):**

1. Truy cập link file script trên GitHub:  
   👉 **[hh3d.user copy.js](https://github.com/Enormit/tool-automation/blob/main/hh3d.user%20copy.js)**
2. Nhấn nút **Raw** để xem nội dung thô.
3. Tampermonkey sẽ tự nhận diện và hỏi bạn có muốn cài không — nhấn **Install**.

**Cách 2 — Cài thủ công:**

1. Tải file [`hh3d.user copy.js`](https://raw.githubusercontent.com/Enormit/tool-automation/main/hh3d.user%20copy.js) về máy.
2. Click vào biểu tượng **Tampermonkey** → chọn **Dashboard** → tab **Utilities**.
3. Kéo thả file `.js` vào trang hoặc dùng nút **Import from file**.
4. Nhấn **Install**.

---

### Bước 3 — Sử dụng

1. Truy cập [hoathinh3d.co](https://hoathinh3d.co) và **đăng nhập** tài khoản.
2. Bảng điều khiển **HH3D Auto** sẽ tự động xuất hiện trên trang.
3. Giao diện điều khiển:

| Thành phần | Ý nghĩa |
|---|---|
| 🟢 Nút xanh | Autorun đang **BẬT** — tool sẽ tự chạy theo lịch |
| 🔴 Nút đỏ | Autorun đang **TẮT** |
| Nút chữ (Thực hiện / Luyện / Đào...) | Chạy ngay lập tức, không cần đợi |
| ⚙️ Bánh răng | Mở cài đặt nâng cao |

---

## 🧪 Hướng dẫn riêng — Luyện Đan

Đây là tính năng phức tạp nhất, hoạt động hoàn toàn tự động:

### Cách hoạt động tự động:

```
Lò trống (IDLE)
  → Kiểm tra nguyên liệu (kể cả thảo dược phụ như Linh Phong Thảo...)
  → Chọn cấp đan cao nhất có đủ nguyên liệu: CỰC → THƯỢNG → TRUNG → HẠ
  → Khai lò

Đang luyện (CRAFTING)
  → Theo dõi độ ổn định mỗi 10 giây
  → Nếu độ ổn định ≤ 68%: tự động Điều Hỏa (tối đa 3 lần)
  → Nếu có Đan Đồng hỗ trợ: nhường Đan Đồng điều hỏa

Hoàn thành (READY)
  → Tự động thu hoạch
  → Đan đủ sao (≥ minStars): Sử dụng ngay → nhận Tu Vi
  → Đan thiếu sao (< minStars): Tự động phân giải → lấy lại nguyên liệu
  → Quay lại khai lò mới
```

### Cài đặt nâng cao (⚙️):

| Tùy chọn | Mô tả | Mặc định |
|---|---|---|
| **Tự động Luyện Đan** | Bật/tắt toàn bộ chức năng | **BẬT** |
| **Tự động Khai lò** | Tự khai lò khi lò trống | BẬT |
| **Tự động Điều Hỏa** | Tự giữ lửa khi độ ổn định thấp | BẬT |
| **Tự động Sử dụng đan** | Dùng đan đủ sao để lấy Tu Vi | BẬT |
| **Tự động Phân giải** | Phân giải đan kém sao thành nguyên liệu | BẬT |
| **Số sao tối thiểu** | Đan đạt ngưỡng này trở lên sẽ được dùng, dưới sẽ bị phân giải | 4★ |
| **Tự động mời Đan Đồng** | Mời bạn bè vào lò hỗ trợ | TẮT |

---

## 💡 Lưu ý quan trọng

- **Không tắt tab trình duyệt:** Tool chỉ chạy khi tab đang mở.
- **Bảo mật:** Tool chạy hoàn toàn trên trình duyệt của bạn, không gửi thông tin tài khoản hay mật khẩu ra ngoài.
- **Chống bot:** Có cơ chế delay ngẫu nhiên (1–2 giây) giữa các thao tác để tránh bị phát hiện spam.

---

## 📋 Changelog

### v2.18
- Cập nhật script metadata và tính năng mới nhất.

### v2.17.1-local (Fix Luyện Đan)
- 🐛 **Fix:** Kiểm tra đầy đủ nguyên liệu công thức (bao gồm thảo dược phụ như `linh_phong_thao`, `huyen_van_thao`...) — trước đây chỉ kiểm tra 5 nguyên tố ngũ hành, gây lỗi 400 khi thiếu thảo dược.
- 🐛 **Fix:** Tự động giảm cấp đan (fallback) nếu thiếu nguyên liệu: CỰC → THƯỢNG → TRUNG → **HẠ**.
- 🐛 **Fix:** Phân giải và sử dụng đan sau thu hoạch dùng đúng `pill_id` thực tế từ API thay vì chuỗi giả `"ha:1"`.
- 🐛 **Fix:** Nhận diện đúng response thành công theo chuẩn `ok: true` của server.
- ✨ **Mới:** Mặc định **BẬT** tự động luyện đan cho người dùng mới.
- 🗑️ Xóa file `hh3d.user.js` cũ, dùng `hh3d.user copy.js` làm file chính.

### v2.17
- Thêm tính năng Luyện Đan tự động (Khai lò, Điều Hỏa, Thu hoạch).
- Thêm hỗ trợ Đan Đồng (mời, nhận lời mời, tự rời).

---

> 📌 Mọi thắc mắc vui lòng liên hệ qua kênh hỗ trợ của tông môn.
