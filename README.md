# 🐉 HH3D Auto Tool — Hướng Dẫn Cài Đặt & Sử Dụng

> **Công cụ tự động hóa các hoạt động hàng ngày trên [hoathinh3d.co](https://hoathinh3d.co)**  
> Phiên bản hiện tại: **v1.1.0** (Chrome Extension) | **v2.19** (Userscript - Main.js)

---

## 📌 Mục lục

1. [Tính năng tự động hỗ trợ](#-tính-năng-tự-động-hỗ-trợ)
2. [Hướng dẫn cài đặt Chrome Extension (Khuyên dùng)](#-hướng-dẫn-cài-đặt-chrome-extension-khuyên-dùng)
3. [Hướng dẫn cài đặt Userscript (Main.js qua Tampermonkey)](#-hướng-dẫn-cài-đặt-userscript-mainjs-qua-tampermonkey)
4. [Hướng dẫn sử dụng & Cấu hình (Setting)](#-hướng-dẫn-sử-dụng--cấu-hình-setting)
   - [Giao diện điều khiển Extension](#giao-diện-điều-khiển-extension)
   - [Giao diện điều khiển Userscript (Main.js)](#giao-diện-điều-khiển-userscript-mainjs)
   - [Cấu hình chi tiết Khoáng Mạch](#-cấu-hình-khoáng-mạch)
   - [Cấu hình chi tiết Luyện Đan](#-cấu-hình-luyện-đan)
   - [Cấu hình chi tiết Mê Cung](#-cấu-hình-mê-cung)
5. [Lưu ý quan trọng & Debug](#-lưu-ý-quan-trọng--debug)
6. [Changelog](#-changelog)

---

## 🌟 Tính năng tự động hỗ trợ

| Tính năng / Worker | Mô tả | Trạng thái mặc định |
|---|---|---|
| **Điểm Danh & Tế Lễ** | Tự động điểm danh hàng ngày, tế lễ tông môn | BẬT |
| **Vấn Đáp** | Tự động tra và trả lời câu hỏi vấn đáp dựa trên đáp án có sẵn | BẬT |
| **Thí Luyện** | Tự động mở rương thí luyện tông môn hết lượt | BẬT |
| **Phúc Lợi Đường** | Tự động nhận rương quà miễn phí theo giờ (mỗi 4 tiếng) | BẬT |
| **Hoang Vực** | Tự động đánh Boss theo cooldown, tự đổi hệ khắc chế, mua rương Linh Bảo | BẬT |
| **Vòng Quay** | Tự động quay Vòng Quay Phúc Vận miễn phí hàng ngày | BẬT |
| **Hoạt Động Ngày** | Tự động nhận rương khi đủ điểm hoạt động ngày | BẬT |
| **Khoáng Mạch** | Tự động tìm mỏ, vào đào và nhận thưởng theo chu kỳ | TẮT (Cần cấu hình) |
| **Luyện Đan** | Tự động khai lò, điều hỏa, thu hoạch, phân giải đan rác, dùng đan tốt | TẮT (Cần cấu hình) |
| **Mê Cung** | Tự động lập/vào phòng mê cung, chiến đấu và nhận rương | TẮT (Cần cấu hình) |

---

## 💾 Hướng dẫn cài đặt Chrome Extension (Khuyên dùng)

Cách này chạy độc lập dưới dạng một Chrome Extension, có giao diện popup tiện lợi để bật/tắt và xem log.

### Bước 1: Tải mã nguồn về máy
1. Truy cập link repository trên Github.
2. Nhấn nút **Code** -> chọn **Download ZIP** để tải về máy của bạn.
3. Giải nén file ZIP vừa tải ra một thư mục (Ví dụ: `C:\HH3D-Auto-Extension`).

### Bước 2: Truy cập trang quản lý tiện ích của Chrome
1. Mở trình duyệt Google Chrome (hoặc Cốc Cốc, Edge, Brave, Opera).
2. Nhập đường dẫn sau vào thanh địa chỉ và nhấn Enter:
   ```text
   chrome://extensions/
   ```

### Bước 3: Bật Chế độ dành cho nhà phát triển (Developer Mode)
1. Ở góc trên bên phải của trang quản lý tiện ích, tìm công tắc **Developer mode** (Chế độ dành cho nhà phát triển) và bật nó lên.

### Bước 4: Tải tiện ích đã giải nén (Load Unpacked)
1. Click vào nút **Load unpacked** (Tải tiện ích đã giải nén) ở góc trên bên trái.
2. Một hộp thoại chọn thư mục hiện ra. Bạn hãy tìm và chọn đúng thư mục **`auto-hh3d/extention`** (thư mục con chứa file `manifest.json` trong thư mục vừa giải nén ở Bước 1).
3. Nhấn **Select Folder** (Chọn thư mục).

> **Thành công:** Biểu tượng extension **HH3D Auto Tool** hình con rồng 🐉 sẽ xuất hiện trên trình duyệt của bạn. Bạn hãy ghim (pin) nó lên thanh công cụ trình duyệt để tiện sử dụng.

---

## 🔌 Hướng dẫn cài đặt Userscript (Main.js qua Tampermonkey)

Nếu bạn không muốn cài Extension hoặc muốn chạy tool trực tiếp thông qua Tampermonkey trên trình duyệt.

### Bước 1: Cài đặt tiện ích Tampermonkey
Tải và cài đặt Tampermonkey từ cửa hàng tiện ích phù hợp với trình duyệt của bạn:
- **Chrome / Brave / Edge / Cốc Cốc:** [Tampermonkey trên Chrome Web Store](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmfjgjjgbiipcnlhgmocsg)
- **Firefox:** [Tampermonkey trên Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)

### Bước 2: Cài đặt Script `Main.js`
**Cách 1: Cài đặt tự động qua link raw (Khuyên dùng):**
1. Click vào đường dẫn sau: 👉 [Main.js (Raw Link)](https://raw.githubusercontent.com/Enormit/tool-automation/main/Main.js)
2. Giao diện của Tampermonkey sẽ tự động xuất hiện và hiển thị mã nguồn của script.
3. Click vào nút **Install** (Cài đặt) để xác nhận.

**Cách 2: Cài đặt thủ công bằng tay:**
1. Mở file [Main.js](file:///c:/Users/phamq/Downloads/New%20folder/Main.js) và copy toàn bộ nội dung code bên trong.
2. Click vào biểu tượng **Tampermonkey** trên trình duyệt -> Chọn **Create a new script...** (Tạo script mới).
3. Xóa sạch mọi dòng code mặc định có sẵn trong khung soạn thảo.
4. Paste toàn bộ code của `Main.js` đã copy ở trên vào.
5. Nhấn **File** -> **Save** (hoặc tổ hợp phím `Ctrl + S`).

---

## 🎮 Hướng dẫn sử dụng & Cấu hình (Setting)

### Giao diện điều khiển Extension
1. Truy cập [hoathinh3d.co](https://hoathinh3d.co) và **đăng nhập** vào tài khoản game của bạn.
2. Click vào biểu tượng Extension 🐉 trên thanh công cụ trình duyệt.
3. Tại giao diện popup hiện ra:
   - **Mục Workers:** Tick chọn các tác vụ bạn muốn tự động hóa.
   - **Nút Bắt đầu:** Nhấp để kích hoạt chạy công cụ.
   - **Nút Dừng lại:** Tắt toàn bộ tác vụ.
   - **Khung Logs:** Nơi hiển thị trạng thái hoạt động trực quan và chi tiết của tool.

---

### Giao diện điều khiển Userscript (Main.js)
Khi bạn sử dụng script `Main.js` qua Tampermonkey, giao diện điều khiển sẽ được hiển thị trực tiếp trên góc màn hình của trang web game [hoathinh3d.co](https://hoathinh3d.co):
- **Giao diện bảng điều khiển:** Có một bảng nhỏ nổi trên trang web.
- **Nút Xanh Lá (🟢 Autorun):** Đang bật chế độ tự động chạy định kỳ theo lịch trình.
- **Nút Đỏ (🔴 Autorun):** Đang tắt chế độ tự động chạy.
- **Nút Bánh răng (⚙️):** Click vào đây để mở bảng tùy chọn cài đặt nâng cao trực tiếp trên giao diện game (Ví dụ cài đặt Luyện Đan, Số sao tối thiểu...).
- **Nút thao tác nhanh (Thực hiện, Luyện, Đào...):** Nhấn để kích hoạt ngay tác vụ tương ứng lập tức mà không cần đợi vòng lặp tự động.

---

### ⛏️ Cấu hình Khoáng Mạch
Tính năng này tự động tìm mỏ khoáng, tham gia đào và tự động nhận thưởng cống hiến.

#### Thiết lập trên Extension:
1. Tại popup, tích chọn **Khoáng Mạch**. Bảng cấu hình mỏ sẽ hiển thị ngay bên dưới.
2. **Loại mỏ:** Chọn loại mỏ mong muốn:
   - *Thượng (Vàng):* Nhiều tu vi nhất nhưng dễ bị người khác chiếm/đánh bay.
   - *Trung (Bạc):* Lượng tu vi khá, độ cạnh tranh vừa phải (Khuyên dùng).
   - *Hạ (Đồng):* Tu vi ít nhất nhưng an toàn, ít bị tranh chấp.
3. Click nút **🔍 Check** để tải danh sách các mỏ hiện có trên hệ thống game.
4. Chọn một mỏ cụ thể tại dropdown **Chọn mỏ**.
5. Nhấn **Bắt đầu** để tool đưa bạn vào mỏ đào.

#### Thiết lập trên Userscript (Main.js):
- Nhấn nút **Bánh răng (⚙️)** để mở cài đặt.
- Chọn loại mỏ mong muốn (Vàng, Bạc, Đồng) và bấm **Lưu cấu hình**. Tool sẽ tự động tìm mỏ trống và chiếm đoạt/tham gia khai thác.

---

### 🧪 Cấu hình Luyện Đan
Hệ thống tự động thực hiện từ đầu đến cuối quy trình luyện đan: Khai lò, điều hỏa, thu hoạch, phân giải hoặc sử dụng.

#### Sơ đồ hoạt động tự động của tool:
```text
[Lò trống] ──> Tự kiểm tra NL (5 nguyên tố & thảo dược phụ) ──> Chọn cấp đan tốt nhất đủ NL ──> [Khai lò]
                                                                                               │
[Thu hoạch] <── Đạt sao tối thiểu? ── [Đợi chín] <── Tự động điều hỏa (ổn định <= 68%) <──────┘
   │
   ├─> Đúng sao tối thiểu (Ví dụ >= 4★) ──> [Sử dụng đan nhận Tu Vi]
   └─> Sai sao tối thiểu (Ví dụ < 4★)  ──> [Phân giải lấy lại nguyên liệu] ──> Lặp lại quy trình
```

#### Các tùy chọn cài đặt (Setting):
Bạn có thể thiết lập các tùy chọn này qua nút **Bánh răng (⚙️)** trên giao diện `Main.js` hoặc cấu hình ngay tại phần **Luyện Đan** trong popup của Extension:

| Tùy chọn Setting | Chi tiết hoạt động | Trạng thái khuyến nghị |
|---|---|---|
| **Tự động Luyện Đan** | Bật hoặc tắt hoàn toàn tính năng luyện đan này. | BẬT |
| **Tự động Khai lò** | Tự động nạp nguyên liệu và bắt đầu mẻ đan mới khi lò trống. | BẬT |
| **Tự động Điều Hỏa** | Theo dõi độ ổn định lò đan mỗi 10 giây. Tự động gia nhiệt giữ lửa nếu độ ổn định giảm xuống `≤ 68%` (tối đa 3 lần/mẻ). Nếu có Đan Đồng hỗ trợ, sẽ nhường Đan Đồng điều hỏa trước để tiết kiệm. | BẬT |
| **Tự động Sử dụng đan** | Tự động nuốt đan dược sau khi thu hoạch nếu đan đạt số sao yêu cầu để nhận điểm Tu Vi. | BẬT |
| **Tự động Phân giải** | Tự động phân giải đan dược kém chất lượng để thu hồi lại nguyên liệu. | BẬT |
| **Số sao tối thiểu** | Mốc để phân loại đan dược. Đan dược sau khi thu hoạch có số sao **lớn hơn hoặc bằng** mốc này sẽ được dùng, nếu **nhỏ hơn** mốc này sẽ bị phân giải. (Mặc định: **4★**) | **4★** hoặc **5★** |
| **Tự động mời Đan Đồng**| Tự động gửi lời mời cho bạn bè trong danh sách làm Đan Đồng để hỗ trợ canh lò. | TẮT |

---

### ⚔️ Cấu hình Mê Cung
Tự động thiết lập đội ngũ và chiến đấu mê cung để nhận rương thưởng.

- **Số người tối thiểu:** Cấu hình số thành viên trong phòng (từ 1 đến 5 người). Khi phòng đủ số lượng người thiết lập, trận đấu sẽ tự động bắt đầu.
- **Vai trò:**
  - **Chủ phòng (Host):** Tool sẽ tự động tạo phòng mới và chờ người khác tham gia.
  - **Thành viên (Member):** Tool sẽ liên tục quét tìm các phòng mê cung đang mở và tham gia vào.

---

## 💡 Lưu ý quan trọng & Debug

- **Luôn giữ tab game mở:** Cả Extension lẫn Userscript chỉ có thể chạy khi bạn mở tab game [hoathinh3d.co](https://hoathinh3d.co) trên trình duyệt.
- **Đóng popup Extension:** Khi đã nhấn **Bắt đầu**, bạn có thể tắt popup đi, tool vẫn tiếp tục chạy ngầm trên tab game.
- **Tự động bỏ qua:** Tool lưu trạng thái hoàn thành các nhiệm vụ ngày theo ngày (lưu vào bộ nhớ trình duyệt). Những nhiệm vụ nào đã làm rồi sẽ tự động bị bỏ qua trong lần quét sau để tránh tốn thời gian và tài nguyên mạng.
- **Anti-Bot Delay:** Mọi request được cấu hình delay từ 1 đến 2 giây (đối với script) và tối thiểu 6 giây giữa các request lớn (đối với extension) để tránh hệ thống quét bot khóa tài khoản.

### Hướng dẫn khắc phục lỗi (Debug):
1. **Lỗi không nhận diện domain:** Hãy làm mới (F5) trang web game và mở lại popup Extension.
2. **Lỗi hết hạn phiên đăng nhập:** Nếu log báo lỗi, hãy đăng xuất tài khoản trên trang web và đăng nhập lại.
3. **Xem chi tiết log lỗi:** 
   - Với Extension: Bấm `F12` trên trang web game -> chọn tab **Console** để theo dõi lỗi chi tiết. Hoặc vào trang quản lý Extension click chọn nút **Service Worker** để kiểm tra log nền.
   - Với Userscript: Nhấn `F12` trên trang web game -> Chọn tab **Console**.

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
