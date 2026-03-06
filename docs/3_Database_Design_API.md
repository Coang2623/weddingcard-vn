# Tài Liệu Thiết Kế Dữ Liệu & API (Database & API Specs)
**Dự án:** WeddingCard.vn
**Hệ quản trị:** PostgreSQL (via Supabase)

## 1. Mô Hình Lược Đồ Quan Hệ (Database Schema)

Hệ thống được thiết kế với 5 bảng (Table) cơ bản tương tác với bảng trung tâm `invitations`. 

### 1.1 `users`
Bảng quản lý tài khoản xác thực do Supabase tự động quản lý (Auth schema `auth.users`).
*   **id:** `uuid` (Primary Key)
*   **email:** `text` (Unique)
*   **created_at:** `timestamp`

### 1.2 `invitations` (Danh sách Thiệp)
Kho chứa thông tin định danh và quản lý các thiệp của khách (Cặp đôi).
*   **id:** `uuid` (Primary Key, default: `uuid_generate_v4()`)
*   **user_id:** `uuid` (Foreign Key referencing `auth.users.id` - Liên kết chủ sở hữu file UUID)
*   **slug:** `text` (Unique - Tên miền phụ URL `/[slug]`)
*   **title:** `text` (Tên/Tiêu đề của thiệp, vd: "Đám cưới của Phong & Lan")
*   **wedding_date:** `timestamp` (Ngày diễn ra lễ cưới)
*   **is_published:** `boolean` (Trạng thái công khai của thiệp, default `false`)
*   **created_at:** `timestamp` (Thời gian tạo)
*   **updated_at:** `timestamp`

### 1.3 `invitation_designs` (Nội dung thiết kế)
Đây là Core Entity lưu trữ dạng Hybrid giữa Schema cố định và NoSQL (JSON) phục vụ cho Builder linh hoạt.
*   **id:** `uuid` (Primary Key)
*   **invitation_id:** `uuid` (Foreign Key referencing `invitations.id` - Ràng buộc 1-1 với Thiệp)
*   **theme:** `jsonb` (Cấu trúc theme chứa đối tượng chứa font_family, text_color, primary_color, kiểu layout)
*   **blocks:** `jsonb` (Mảng Array các phần tử block. Mỗi block gồm id, order, type [hero|story|gallery|map|rsvp|schedule|guestbook|gift|text|music], properties(props: Dữ liệu chuỗi phụ riêng rẽ). Thường xuyên Serialize/Deserialize để tải trên UI)
*   **updated_at:** `timestamp`

### 1.4 `rsvps` (Xác nhận lịch trình)
Dữ liệu khách gửi lại cho chủ thiệp để ước lượng bàn tiệc.
*   **id:** `uuid` (Primary Key)
*   **invitation_id:** `uuid` (Foreign Key referencing `invitations.id`)
*   **guest_name:** `text` (Họ tên khách mời thực tế)
*   **attending:** `boolean` (Sẽ đi / Không đi)
*   **guest_count:** `int` (Số lượng đi cùng, Max 10)
*   **message:** `text` (Ghi chú kèm theo RSVP)
*   **created_at:** `timestamp` (Thời gian phản hồi)

### 1.5 `messages` (Sổ lưu bút ảo)
Toàn bộ lời chúc của mọi người gửi lên.
*   **id:** `uuid` (Primary Key)
*   **invitation_id:** `uuid` (Foreign Key referencing `invitations.id`)
*   **author_name:** `text`
*   **content:** `text` (Lời chúc của Khách mời)
*   **created_at:** `timestamp` (Thời điểm viết)

---

## 2. Đặc tả Giao tiếp Dữ liệu SDK Core (API Mapping)

Supabase cung cấp SDK Client Side Fetcher. Toàn bộ logic tương tác Database (CRUD) nằm gọn tại thư mục `/src/lib/supabase/api.ts`. Giao Thức (Protocol) đi ngầm qua Supabase REST Headers API.

### 2.1 Invitation (Thiệp chung)
- **Hàm `getMyInvitations()`** -> Lấy dữ liệu liệt kê tất cả thiệp từ Auth ID (`auth.uid()`).
- **Hàm `getInvitationById(id)` / `getInvitationBySlug(slug)`** -> Lấy bản ghi tĩnh và join thêm (Foreign key `invitation_designs` trả mảng json design) bằng query chèn: `.select('*, invitation_designs(*)').eq('slug', slug)`.
- **Hàm `createInvitation(data)`** -> Tạo bản ghi mới ở `invitations`. Đồng thời kích hoạt Hook chèn 1 Object Default trắng (`id`, `theme rỗng`, `blocks rỗng`) vào bảng định hướng `invitation_designs` (Khuôn đúc rỗng để Builder không lỗi).
- **Hàm `updateInvitation(id, data)`** -> Cập nhật Cột dữ liệu (Title, Lịch báo giá, Status).

### 2.2 Builder Thiết Kế (Design Engine JSON DB)
- **Hàm `loadDesignBlocks(invitationId)`** -> Tải cấu trúc Theme & Array Blocks JSON từ thiết kế cũ của người dùng. Áp dụng trả `DEFAULT_THEME` nếu không thấy.
- **Hàm `saveDesignBlocks(invitationId, blocks, theme)`** -> Xóa đè một list (Mảng) JS Arrays vào JSONB Record trên API. Nó tiếp nhận State Data của `dnd` kéo thả (Dữ liệu Live) và Update lên Server.

### 2.3 Người nhận tương tác (Guest interaction)
- **Hàm `submitRSVP(data)`** -> Khách vãng lai gọi hàm để POST (Insert) payload json (Gồm tên khách, đi/ko đi, message) vào Database thiệp ID đó. (*RLS Policy: Cho phép Anon Guest Insert. Không cho đọc trộm mảng dữ liệu thiệp khác*).
- **Hàm `getRSVPs(invitationId)`** -> Owner thiệp (Đăng nhập) tải mảng người tham gia tiệc về giao diện Dashboard để in CSV.
- **Hàm `postMessage(data)`** / **`getMessages(invitationId)`** -> API Postgress lấy Text lời chúc, thứ tự mới nhất (Lấy Timestamp tạo bảng ngầm định sắp xếp). (*RLS Policy: Cho phép Anon Guest thêm và xem lời chúc, không cho phép xoá nếu không là chủ sở hữu*).

## 3. Storage Bucket Configuration (Cấu hình Buckets chứa File)

Thư viện ảnh cần cấp phát một Storage riêng biệt trong dự án.
*   **Bucket Name:** `wedding-images`
*   **Dung lượng hạn mức File Upload:** 5 Megabytes (MB).
*   **Định dạng được truy cập (MIME Type Configured):** `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic` (IOS).
*   **Khai báo phân quyền bảo vệ RLS:**
    *   `Select`: Ai cũng được đọc (Public Download, nếu cung cấp link URL đúng tới folder chứa thiệp `invitation_id`).
    *   `Insert/Update/Delete`: Chỉ Owner Auth ID phù hợp của file mới thao tác lên ảnh mới up. Tránh lợi dụng Up ảnh SPAM qua App người khác.

---
*Ghi Chú Đặc Thù: Thiết kế lưu Design Blocks dưới dạng chuỗi dữ liệu JSONB giúp loại bỏ nhu cầu phải có 5-10 DB Tables riêng cho Từng Loại Block (Vd: Bảng HeroBlock, Bảng RSVPBlock sẽ làm quá tải Backend Query). Điều này là lợi thế mạnh nhất của Postgres JSONB Schema dành cho các App SaaS Editor hiện đại.*
