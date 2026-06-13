# Kế Hoạch Tích Hợp Chức Năng Đan Sư & Đan Đồng Vào hh3d.user.js

Kế hoạch này tích hợp chức năng hiển thị cấp bậc Đan Sư và tự động hóa các tương tác Đan Đồng (mời đan đồng, nhận lời mời, tự động rời đi khi hết Điều Hỏa) vào tệp `hh3d.user.js` dựa trên mã nguồn game phân tích từ `auto-hh3d`.

---

## 🧐 Phân tích các tính năng Đan Đồng (Joint Brewing)

Hệ thống Đan Đồng cho phép người chơi hỗ trợ nhau giảm thời gian luyện đan:
1. **Lời mời Đan Đồng đến (Incoming Invites):**
   * Được gửi trong mảng `dong_invites_in` của phản hồi `/state`. Mỗi lời mời có `owner_id` (ID của Đan Chủ).
   * Chấp nhận lời mời qua API POST: `/luyen-dan/dong/respond` với body `{ owner_id: ID, accept: true }`.
2. **Vai trò Đan Đồng (Serving):**
   * Khi đang làm Đan Đồng cho ai đó, thuộc tính `dong_serving` sẽ có giá trị chứa `owner_id`.
   * Người chơi được phép rời vị trí Đan Đồng (`can_leave = true`) sau khi kết thúc giai đoạn Điều Hỏa (5 phút đầu) hoặc khi lò đan của Đan Chủ bị nổ.
   * Rời vị trí Đan Đồng qua API POST: `/luyen-dan/dong/leave` với body `{ owner_id: ID }`.
3. **Mời Đan Đồng (Inviting):**
   * Gửi lời mời tới bạn bè qua API POST: `/luyen-dan/dong/invite` với body `{ buddy_id: ID }`.
   * Mảng `dong_slots` chứa trạng thái của 2 vị trí Đan Đồng. Khi có người tham gia, vị trí đó sẽ khác `null`.

---

## 🛠️ Đề xuất thay đổi cho `hh3d.user.js`

### 1. Cấu hình UI Settings mới cho Đan Đồng
Thêm các tùy chọn sau vào giao diện cài đặt Luyện Đan (`⚙️`):
* **Tự động nhận lời mời làm Đan Đồng:** `luyenDanAutoAcceptInvite` (Checkbox)
* **ID Đan Chủ ưu tiên nhận lời mời (để trống nếu nhận tất cả):** `luyenDanAcceptInviteIds` (Text Input)
* **Tự động rời Đan Đồng sau 5 phút (khi hết Điều Hỏa):** `luyenDanAutoLeave` (Checkbox)
* **Tự động mời Đan Đồng khi rảnh:** `luyenDanAutoInvite` (Checkbox)
* **ID Đan Đồng muốn mời (cách nhau bằng dấu phẩy):** `luyenDanInviteIds` (Text Input)
* **Thời gian tối đa chờ Đan Đồng tham gia (giây):** `luyenDanWaitInviteSeconds` (Number Input, mặc định 60 giây)

### 2. Logic Tự động Nhận lời mời và Tự động Rời đi
Trong mỗi chu kỳ quét trạng thái của lò đan (`doLuyenDan()`):

#### A. Tự động nhận làm Đan Đồng (Auto-Accept):
Nếu `luyenDanAutoAcceptInvite` được bật:
1. Duyệt qua danh sách `data.dong_invites_in`.
2. Nếu trùng khớp với danh sách ID ưu tiên (hoặc nếu danh sách trống):
   * Gửi yêu cầu POST tới `/luyen-dan/dong/respond` với `{ owner_id: inv.owner_id, accept: true }`.
   * Hiển thị thông báo: `"🧪 ✅ Đã nhận làm Đan Đồng cho Đan Chủ..."`.

#### B. Tự động rời đi sau 5 phút (Auto-Leave):
Nếu `luyenDanAutoLeave` được bật và đang làm Đan Đồng (`data.dong_serving` khác null):
1. Kiểm tra điều kiện có thể rời đi:
   * Nếu `furnace === 'exploded'` hoặc giai đoạn nhạy cảm đã qua (`unstable_left_sec <= 0`) và server trả về `can_leave === true`.
2. Thực hiện gửi yêu cầu POST tới `/luyen-dan/dong/leave` với `{ owner_id: data.dong_serving.owner_id }`.
3. Hiển thị thông báo: `"🧪 🚪 Đã tự động rời vai Đan Đồng của..."`.

### 3. Logic Tự động Mời Đan Đồng & Chờ tham gia trước khi luyện
Khi lò đan ở trạng thái trống (`furnace === "idle"`) và `luyenDanAutoInvite` được bật:
1. Đọc danh sách ID muốn mời từ `luyenDanInviteIds`.
2. Thực hiện gửi lời mời hàng loạt tới các ID này qua `/luyen-dan/dong/invite`.
3. **Cơ chế chờ (Wait Cycle):**
   * Thay vì bấm Khai lò `/start` ngay lập tức, tool sẽ chuyển sang trạng thái **"Chờ Đan Đồng..."** và lưu mốc thời gian bắt đầu chờ.
   * Định kỳ 10 giây quét lại trạng thái `/state` một lần.
   * Tool sẽ tiến hành Khai lò `/start` khi:
     * Cả hai vị trí Đan Đồng trong `data.dong_slots` đã có người tham gia.
     * Hoặc thời gian chờ vượt quá giới hạn cấu hình (ví dụ qua 60 giây mà họ chưa vào, để tránh bị kẹt vô hạn).

---

## 🧪 Kế hoạch xác minh (Verification Plan)

### Kiểm thử tự động / Mock dữ liệu
* Kiểm tra việc lọc danh sách lời mời và điều kiện cho phép rời Đan Đồng.

### Kiểm thử thủ công
1. Dùng tài khoản phụ gửi lời mời Đan Đồng để kiểm tra xem tài khoản chính có tự động nhận lời mời hay không.
2. Kiểm tra xem sau khi hết 5 phút Điều Hỏa, tài khoản chính làm Đan Đồng có tự động rời phòng và thông báo thành công không.
3. Cho tài khoản chính khai lò đan khi bật auto-invite để kiểm tra xem tool có gửi lời mời và đợi đủ số giây cấu hình trước khi tự động bấm Khai lò hay không.
