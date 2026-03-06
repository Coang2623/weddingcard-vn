# Tài Liệu Đặc Tả Yêu Cầu Phần Mềm (SRS)
**Dự án:** WeddingCard.vn - Nền Tảng Tạo Thiệp Cưới Online
**Phiên bản:** 1.0

## 1. Mở Đầu
### 1.1 Mục đích
Tài liệu Đặc tả Yêu cầu Phần mềm (Software Requirements Specification - SRS) này cung cấp định nghĩa toàn diện về các tính năng, yêu cầu phi chức năng và hành vi của hệ thống WeddingCard.vn. Tài liệu phục vụ làm cơ sở cho việc thiết kế, phát triển và kiểm thử dự án.

### 1.2 Phạm vi sản phẩm
WeddingCard.vn là một ứng dụng Web SaaS (Software as a Service) cho phép các cặp đôi (người dùng cuối) tự tay thiết kế, quản lý và chia sẻ website thiệp cưới trực tuyến của riêng họ mà không cần kiến thức lập trình. 
Sản phẩm tập trung vào tính tương tác cao (RSVP, Sổ lưu bút), tối ưu hóa trải nghiệm trên thiết bị di động (Mobile-first) và cung cấp giao diện quản lý (Dashboard) trực quan thông qua cơ chế kéo-thả (Drag & Drop Builder).

### 1.3 Đối tượng người dùng
*   **Người dùng chưa đăng ký (Khách truy cập):** Xem thông tin giới thiệu sản phẩm (Landing Page), xem thiệp cưới public do người khác gửi.
*   **Người dùng đã đăng ký (Cặp đôi/Chủ tiệc):** Tạo thiệp, cấu hình thiệp, quản lý danh sách khách mời, xem phản hồi RSVP và tin nhắn lưu bút.
*   **Khách mời (Người nhận thiệp):** Truy cập link thiệp cưới, xem thông tin lễ cưới, gửi form xác nhận tham dự (RSVP), xem thông tin mừng cưới (Gift) và để lại lời chúc (Guestbook).

## 2. Yêu Cầu Chức Năng (Functional Requirements)

### 2.1 Epic 1: Quản lý Định danh & Tài khoản (Authentication)
*   **FR_1.1:** Hệ thống cho phép người dùng đăng ký tài khoản mới bằng Email/Password.
*   **FR_1.2:** Hệ thống cho phép đăng nhập bằng OAuth (Google).
*   **FR_1.3:** Hệ thống cho phép đăng xuất và quản lý phiên đăng nhập an toàn (Secured Session).
*   **FR_1.4:** Middleware bảo vệ các Route `/dashboard`, yêu cầu người dùng phải đăng nhập mới được truy cập.

### 2.2 Epic 2: Quản lý Dự án Thiệp (Invitation Management)
*   **FR_2.1:** Người dùng có thể tạo một dự án thiệp mới, cung cấp Tiêu đề (Title), Ngày cưới (Wedding Date) và tạo URL cá nhân hóa (Slug).
*   **FR_2.2:** Hệ thống kiểm tra và đảm bảo tính duy nhất của URL (Slug) khi tạo hoặc cập nhật thiệp.
*   **FR_2.3:** Người dùng có thể xem danh sách các thiệp đã tạo.
*   **FR_2.4:** Người dùng có thể xóa thiệp khỏi hệ thống.

### 2.3 Epic 3: Trình tạo thiệp (Drag & Drop Builder)
*   **FR_3.1:** Giao diện Builder chia làm 3 phần: Thanh công cụ block (Left), Khung thao tác Layout (Center) và Màn hình Preview (Right).
*   **FR_3.2:** Hỗ trợ các Block chức năng cơ bản: 
    *   Tiêu đề (Hero)
    *   Đếm ngược (Countdown)
    *   Câu chuyện (Love Story)
    *   Album Ảnh (Gallery)
    *   Lịch trình (Schedule)
    *   Xác nhận tham dự (RSVP Form)
    *   Sổ lưu bút (Guestbook)
    *   Mừng cưới (Gift / Bank Info / QR Code)
    *   Bản đồ (Map)
    *   Văn bản tự do (Text)
    *   Âm nhạc nền (Music - Hỗ trợ link mp3/wav và YouTube iframe viền ẩn)
*   **FR_3.3:** Cho phép thêm mới, xóa, sửa nội dung (Text, Ngày tháng, Hình ảnh) của từng block.
*   **FR_3.4:** Kéo thả để thay đổi thứ tự (Order) hiển thị của các Block.
*   **FR_3.5:** Tùy biến Theme (Chủ đề): Cho phép chọn Style (Modern, Cinematic, Traditional), màu chủ đạo, phông chữ.
*   **FR_3.6:** "Live Preview": Cột bên phải phản hồi tức thời mọi thay đổi nội dung, màu sắc ngay khi thao tác.
*   **FR_3.7:** Cho phép upload ảnh từ máy tính (lưu trữ trên Cloud Storage) cho block Album.

### 2.4 Epic 4: Giao diện Khách mời (Public Card)
*   **FR_4.1:** Render layout thiệp cưới dựa trên dữ liệu JSON (Blocks) và theme lưu trong database dựa vào `slug` URL.
*   **FR_4.2:** Khách mời điền Form RSVP: Nhập Họ tên, Số lượng người đi cùng, Trạng thái (Đi/Không đi), Lời nhắn.
*   **FR_4.3:** Khách mời Gửi Lời chúc: Đăng thông điệp lên Guestbook và hiển thị theo thời gian thực (hoặc fetch newest).

### 2.5 Epic 5: Báo cáo Thống kê (Dashboard RSVP)
*   **FR_5.1:** Chủ tiệc xem danh sách các phản hồi RSVP thực tế từ Form gửi lên.
*   **FR_5.2:** Thống kê tổng quan: Tổng số khách sẽ đi, số người bận.
*   **FR_5.3:** Cung cấp tính năng tải xuống danh sách khách (Export CSV) (Định hướng tương lai).

## 3. Yêu Cầu Phi Chức Năng (Non-Functional Requirements)

### 3.1 Giao diện và Trải nghiệm người dùng (UX/UI)
*   **Mobile-First Design:** Giao diện thiệp Public phải hiển thị hoàn hảo và tối ưu băng thông trên thiết bị di động.
*   **Responsive:** Trang Builder (Dashboard) phải hỗ trợ linh hoạt các kích thước màn hình PC/Tablet.
*   **Thẩm mỹ (Premium Feel):** Các mẫu theme cần đáp ứng tiêu chuẩn hình ảnh sắc nét, phông chữ hỗ trợ tiếng Việt (Google Fonts), tích hợp các vi mô hoạt ảnh (Micro-animations bằng Framer Motion).

### 3.2 Hiệu suất (Performance)
*   Thời gian tải trang Public Card (LCP) dưới 1.5 giây trong điều kiện mạng 4G tiêu chuẩn. 
*   Quá trình Upload ảnh lớn (1MB - 5MB) phải diễn ra dưới nền và không chặn UI (Non-blocking), hoặc áp dụng cơ chế tự động nén trước (Image compression).

### 3.3 Khả năng mở rộng & Bảo mật (Scalability & Security)
*   **Khả năng chịu tải (Traffic spikes):** Do bản chất sự kiện, một thiệp có thể nhận nhiều lượt truy cập cùng lúc khi chia sẻ link qua mạng xã hội. Serverless architecture (Vercel) giúp tự động auto-scale.
*   Hạn chế DDoS vào Form RSVP bằng tỷ lệ giới hạn (Rate limiting - nếu cần ở version sau).
*   **Bảo vệ Dữ liệu:** Áp dụng chặt chẽ Row Level Security (RLS) của Supabase để chắc chắn người dùng A không thể sửa hay đọc JSON thiết kế của người dùng B.

## 4. Ràng buộc Công nghệ (Technological Constraints)
*   Phải sử dụng Next.js Framework với tính năng App Router.
*   React Server Components cho việc bóc xuất dữ liệu Public Card để tối ưu SEO & Caching.
*   Tuân thủ nghiêm ngặt TypeScript Interfaces (Tránh lỗi Undefined cho cấu trúc JSON phức tạp của builder).

---
*Tài liệu này được cập nhật vào Giai đoạn MVP. Các yêu cầu mới sẽ được xét duyệt qua hệ thống kiểm soát phiên bản (Version Control).*
