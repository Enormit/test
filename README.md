# 🐉 HH3D Auto Tool — Hướng Dẫn Cài Đặt & Sử Dụng

> **Công cụ tự động hóa các hoạt động hàng ngày trên [hoathinh3d.co](https://hoathinh3d.co)**  
> Phiên bản hiện tại: **v1.1.0** (Chrome Extension) | **v2.19** (Userscript - Main.js)

---

## 📌 Mục lục

1. [Tính năng tự động hỗ trợ](#-tính-năng-tự-động-hỗ-trợ)
2. [Hướng dẫn cài đặt Chrome Extension](#-hướng-dẫn-cài-đặt-chrome-extension)
3. [Hướng dẫn cài đặt & Cấp quyền Extension Tampermonkey](#-hướng-dẫn-cài-đặt--cấp-quyền-extension-tampermonkey)
4. [Cách cài đặt & Cập nhật Userscript (Main.js)](#-cách-cài-đặt--cập-nhật-userscript-mainjs)
5. [Hướng dẫn sử dụng chi tiết Main.js](#-hướng-dẫn-sử-dụng-chi-tiết-mainjs)
6. [Cấu hình chi tiết (Settings) cho từng tính năng](#-cấu-hướng-dẫn-cấu-hình-settings-cho-từng-tính-năng)
   - [Cấu hình Khoáng Mạch](#-cấu-hình-khoáng-mạch)
   - [Cấu hình Luyện Đan](#-cấu-hình-luyện-đan)
   - [Cấu hình Mê Cung](#-cấu-hình-mê-cung)
7. [Lưu ý quan trọng & Khắc phục lỗi (Debug)](#-lưu-ý-quan-trọng--khắc-phục-lỗi-debug)
8. [Changelog](#-changelog)

---

## 🌟 Tính năng tự động hỗ trợ

| Tính năng / Worker | Mô tả | Trạng thái mặc định |
|---|---|---|
| **Điểm Danh & Tế Lễ** | Tự động điểm danh hàng ngày, tế lễ tông môn | BẬT |
| **Vấn Đáp** | Tự động trả lời câu hỏi vấn đáp dựa trên đáp án có sẵn | BẬT |
| **Thí Luyện** | Tự động mở rương thí luyện tông môn hết lượt | BẬT |
| **Phúc Lợi Đường** | Tự động nhận rương quà miễn phí theo giờ (mỗi 4 tiếng) | BẬT |
| **Hoang Vực** | Tự động đánh Boss theo cooldown, tự đổi hệ khắc chế, mua rương Linh Bảo | BẬT |
| **Vòng Quay** | Tự động quay Vòng Quay Phúc Vận miễn phí hàng ngày | BẬT |
| **Hoạt Động Ngày** | Tự động nhận rương khi đủ điểm hoạt động ngày | BẬT |
| **Khoáng Mạch** | Tự động tìm mỏ, vào đào và nhận thưởng theo chu kỳ | TẮT (Cần cấu hình) |
| **Luyện Đan** | Tự động khai lò, điều hỏa, thu hoạch, phân giải đan rác, dùng đan tốt | TẮT (Cần cấu hình) |
| **Mê Cung** | Tự động lập/vào phòng mê cung, chiến đấu và nhận rương | TẮT (Cần cấu hình) |

---

## 💾 Hướng dẫn cài đặt Chrome Extension

Cách này chạy độc lập dưới dạng một Chrome Extension, có giao diện popup tiện lợi để bật/tắt và xem log.

1. **Tải mã nguồn:** Nhấn nút **Code** -> chọn **Download ZIP** trên Github và giải nén (Ví dụ: `C:\HH3D-Auto-Extension`).
2. **Trang tiện ích:** Mở trình duyệt Chrome (hoặc Edge, Cốc Cốc, Brave...) và truy cập `chrome://extensions/`.
3. **Bật Developer mode:** Bật công tắc **Developer mode** ở góc trên bên phải.
4. **Tải tiện ích:** Click **Load unpacked** -> chọn đúng thư mục **`auto-hh3d/extention`** (nơi chứa file `manifest.json`).
5. **Ghim tiện ích:** Bấm biểu tượng 🧩 trên trình duyệt và ghim **HH3D Auto Tool** lên thanh công cụ.

---

## 🔌 Hướng dẫn cài đặt & Cấp quyền Extension Tampermonkey

Để chạy Userscript `Main.js`, trước tiên bạn phải cài đặt tiện ích mở rộng Tampermonkey vào trình duyệt và cấu hình các quyền cần thiết để tránh bị Chrome chặn script.

### Bước 1: Cài đặt Extension Tampermonkey
Hãy cài đặt phiên bản Tampermonkey phù hợp với trình duyệt của bạn:
- **Chrome / Edge / Cốc Cốc / Brave:** [Tampermonkey trên Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmfjgjjgbiipcnlhgmocsg)
- **Firefox:** [Tampermonkey trên Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

### Bước 2: Bật Chế độ nhà phát triển (Developer Mode) trên Chrome
> ⚠️ **BẮT BUỘC:** Trên các phiên bản Chrome mới, nếu bạn không bật Developer Mode, Chrome sẽ chặn hoàn toàn các userscript của Tampermonkey.

1. Nhập `chrome://extensions/` vào thanh địa chỉ trình duyệt và nhấn Enter.
2. Bật công tắc **Developer mode** (Chế độ dành cho nhà phát triển) ở góc trên bên phải màn hình.
3. Khởi động lại trình duyệt Chrome của bạn.

### Bước 3: Cấp quyền truy cập File local (Nếu cần chạy file từ máy tính)
> 💡 *Bước này chỉ cần thiết nếu bạn muốn Tampermonkey tự động load trực tiếp file `Main.js` từ ổ đĩa cứng của bạn thay vì tải từ internet.*

1. Trong trang `chrome://extensions/`, tìm thẻ tiện ích **Tampermonkey**.
2. Click vào nút **Details** (Chi tiết).
3. Cuộn xuống dưới và tìm tùy chọn **Allow access to file URLs** (Cho phép truy cập vào các URL của tệp) -> **BẬT** nó lên.

---

## 🚀 Cách cài đặt & Cập nhật Userscript (Main.js)

Sau khi Tampermonkey đã được cài đặt và cấp quyền, bạn tiến hành cài đặt file script điều khiển chính.

### Cách 1: Cài đặt trực tuyến (Khuyên dùng và dễ cập nhật nhất)
1. Click vào đường dẫn sau: 👉 [Cài đặt Main.js (Raw Link)](https://raw.githubusercontent.com/Enormit/tool-automation/main/Main.js)
2. Tab cài đặt của Tampermonkey sẽ hiện ra -> Click nút **Install** (Cài đặt) hoặc **Update** (Cập nhật) để hoàn thành.

### Cách 2: Cài đặt thủ công (Dán Code)
1. Mở file [Main.js](file:///c:/Users/phamq/Downloads/New%20folder/Main.js) trên máy của bạn và copy toàn bộ code (`Ctrl + A` -> `Ctrl + C`).
2. Click biểu tượng **Tampermonkey** trên trình duyệt -> Chọn **Create a new script...** (Tạo script mới).
3. Xóa toàn bộ nội dung code mặc định hiển thị trong ô nhập liệu.
4. Dán code của `Main.js` vào (`Ctrl + V`).
5. Chọn **File** -> **Save** (hoặc nhấn `Ctrl + S`).

---

## 🎮 Hướng dẫn sử dụng chi tiết Main.js

Khi cài đặt thành công và truy cập trang web game [hoathinh3d.co](https://hoathinh3d.co), bạn sẽ thấy một **Bảng điều khiển nhỏ màu xám (floating panel)** nổi ở góc bên cạnh trang web. 

Đây là cách bạn vận hành và tương tác với Userscript `Main.js`:

### 1. Bật/Tắt chế độ Tự động chạy (Autorun)
- **🟢 Nút xanh lá (Autorun: ON):** Script đang ở chế độ hoạt động tự động. Cứ sau mỗi chu kỳ định sẵn (khoảng vài phút), script sẽ quét toàn bộ nhiệm vụ và tự thực hiện.
- **🔴 Nút đỏ (Autorun: OFF):** Dừng toàn bộ hoạt động tự động của script. Tool sẽ không tự chạy ngầm nữa cho đến khi bạn bật lại.

### 2. Thực hiện nhanh tác vụ (Manual Trigger)
Bên cạnh trạng thái Autorun, bảng điều khiển cung cấp các nút chữ giúp bạn kích hoạt nhanh một tác vụ ngay lập tức mà không cần chờ đến lượt quét tự động:
- **Thực hiện:** Quét nhanh các tác vụ điểm danh, vấn đáp, rương phúc lợi.
- **Luyện:** Kích hoạt lập tức lượt kiểm tra lò đan và khai lò/điều hỏa/thu hoạch đan dược.
- **Đào:** Thực hiện lệnh kiểm tra và đi đào khoáng mạch.
- **Mê cung:** Bắt đầu quét hoặc lập phòng mê cung ngay.

### 3. Thiết lập tùy chọn (Settings) qua nút Bánh răng (⚙️)
Khi click vào nút **Bánh răng (⚙️)** trên bảng điều khiển nổi của `Main.js`, một bảng cài đặt chi tiết (Settings Panel) sẽ hiện ra giữa màn hình game:
- **Bật/Tắt từng tính năng độc lập:** Bạn có thể tích hoặc bỏ tích từng tính năng (Ví dụ: Chỉ muốn tự động Vấn Đáp và Luyện Đan, còn tự động Đào Khoáng thì tắt).
- **Cài đặt nâng cao cho Luyện đan & Khoáng mạch:** Điều chỉnh trực tiếp các thông số kỹ thuật (Loại mỏ muốn đào, số sao đan tối thiểu...).
- **Nút Lưu cấu hình:** Sau khi thiết lập xong, nhấn **Lưu cấu hình** để lưu lại thiết lập vào LocalStorage. Các thiết lập này sẽ được giữ nguyên kể cả khi bạn reload (F5) trang web.

---

## ⚙️ Hướng dẫn cấu hình Settings cho từng tính năng

### ⛏️ Cấu hình Khoáng Mạch
1. **Thiết lập trên Extension:** Tích chọn **Khoáng Mạch**, chọn loại mỏ (Vàng, Bạc, Đồng) -> nhấn **🔍 Check** để tải mỏ -> chọn mỏ cụ thể tại dropdown -> nhấn **Bắt đầu**.
2. **Thiết lập trên Userscript (Main.js):** Nhấp nút **Bánh răng (⚙️)** -> Chọn loại mỏ muốn đào (Thượng/Trung/Hạ) -> Nhấp **Lưu cấu hình**. Tool sẽ tự động quét, chiếm hoặc tham gia mỏ trống thích hợp.

---

### 🧪 Cấu hình Luyện Đan
Hệ thống tự động thực hiện hoàn hảo chu kỳ: Khai lò (Cực -> Thượng -> Trung -> Hạ) -> Canh lò giữ nhiệt (Điều hỏa) -> Thu hoạch -> Sử dụng đan tốt/Phân giải đan rác.

Các tùy chọn cấu hình Luyện Đan trong phần **Settings (⚙️)** của `Main.js` và Extension:

| Tùy chọn Setting | Chi tiết hoạt động | Trạng thái khuyến nghị |
|---|---|---|
| **Tự động Luyện Đan** | Bật hoặc tắt hoàn toàn tính năng tự động luyện đan. | BẬT |
| **Tự động Khai lò** | Tự động nạp nguyên liệu và bắt đầu mẻ đan mới khi lò trống. | BẬT |
| **Tự động Điều Hỏa** | Theo dõi độ ổn định lò đan mỗi 10 giây. Tự động điều hỏa giữ lửa nếu độ ổn định giảm xuống `≤ 68%` (tối đa 3 lần/mẻ). Sẽ ưu tiên nhường Đan Đồng làm trước để tiết kiệm. | BẬT |
| **Tự động Sử dụng đan** | Tự động sử dụng đan dược sau khi thu hoạch nếu đan đạt số sao yêu cầu để nhận điểm Tu Vi. | BẬT |
| **Tự động Phân giải** | Tự động phân giải đan dược kém chất lượng để thu hồi lại nguyên liệu luyện đan. | BẬT |
| **Số sao tối thiểu** | Ngưỡng phân loại đan. Đan dược sau khi thu hoạch có số sao **lớn hơn hoặc bằng** mốc này sẽ được dùng, nếu **nhỏ hơn** sẽ bị phân giải. (Mặc định: **4★**) | **4★** hoặc **5★** |
| **Tự động mời Đan Đồng**| Tự động gửi lời mời cho bạn bè trong danh sách làm Đan Đồng để hỗ trợ canh lò. | TẮT |

---

### ⚔️ Cấu hình Mê Cung
- **Số người tối thiểu:** Cấu hình số thành viên trong phòng (từ 1 đến 5 người). Khi phòng đủ người thiết lập, trận đấu sẽ tự động bắt đầu.
- **Vai trò:**
  - *Chủ phòng (Host):* Tool tự động tạo phòng mới và chờ người chơi khác vào.
  - *Thành viên (Member):* Tool liên tục quét tìm các phòng đang mở và tham gia vào.

---

## 💡 Lưu ý quan trọng & Khắc phục lỗi (Debug)

- **Không tắt tab trình duyệt:** Cả Extension lẫn Userscript chỉ chạy khi tab game [hoathinh3d.co](https://hoathinh3d.co) của bạn đang được mở.
- **Tự động bỏ qua:** Tool lưu trạng thái hoàn thành các nhiệm vụ ngày theo ngày (lưu vào bộ nhớ trình duyệt). Những nhiệm vụ nào đã làm rồi sẽ tự động bị bỏ qua trong lần quét sau để tránh tốn tài nguyên.
- **Anti-Bot Delay:** Mọi request được cấu hình delay ngẫu nhiên từ 1 đến 2 giây (đối với script) và tối thiểu 6 giây giữa các request lớn (đối với extension) nhằm tránh hệ thống quét bot.

### Hướng dẫn sửa lỗi nhanh:
1. **Lỗi không chạy script / Tampermonkey không nhận:** Kiểm tra lại xem bạn đã bật **Developer mode** trong cài đặt của Chrome chưa (Bước 2 phần Tampermonkey).
2. **Lỗi hết hạn phiên đăng nhập:** Nếu log báo lỗi, hãy đăng xuất tài khoản trên trang web và đăng nhập lại.
3. **Xem log debug lỗi:** Nhấn phím `F12` trên bàn phím -> Chọn tab **Console** để theo dõi lỗi chi tiết của script.

---

## 📋 Changelog

### Extension v1.1.0
- Hỗ trợ tự động nhận diện domain khi website thay đổi tên miền gốc.
- Quản lý hàng đợi request tối ưu, ngăn chặn spam request gây lỗi 429.
- Thêm cơ chế tự động thử lại khi gặp sự cố mạng hoặc lỗi 503 từ máy chủ.
- Hỗ trợ lưu trữ trạng thái nhiệm vụ hàng ngày và tự động phục hồi (resume) sau khi reload trang.
- Bổ sung toàn diện 3 tính năng mới: Khoáng Mạch, Mê Cung, Luyện Đan.

### Userscript v2.19 (Main.js)
- Cải tiến thuật toán Luyện Đan: Tự động điều chỉnh cấp độ luyện đan từ cao xuống thấp (Cực -> Thượng -> Trung -> Hạ) tùy thuộc vào số lượng nguyên liệu thực tế đang sở hữu.
- Sửa lỗi kiểm tra thiếu thảo dược phụ gây lỗi 400 từ máy chủ.
- Sửa lỗi lấy mã ID đan dược chính xác thay vì chuỗi ID giả định.
- Tự động bật tính năng Luyện Đan mặc định cho người dùng mới.

---
> 📌 Mọi thắc mắc và đóng góp ý kiến vui lòng thảo luận tại kênh hỗ trợ tông môn!  
> ⚠️ Sử dụng công cụ có trách nhiệm. Chúc các đạo hữu tu luyện thành công!
