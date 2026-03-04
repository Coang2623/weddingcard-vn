# Tài Liệu Thiết Kế Kiến Trúc Hệ Thống (SAD)
**Dự án:** WeddingCard.vn
**Loại hình hệ thống:** Software as a Service (SaaS), Single Page Application lai tĩnh (Next.js Hybrid SSR/CSR).

## 1. Giới thiệu Kiến trúc Tổng quát

WeddingCard.vn được xây dựng trên nền tảng **JAMstack** hiện đại, kết hợp chặt chẽ với phương pháp tiếp cận **Backend as a Service (BaaS)**. Điều này loại bỏ hoàn toàn việc phải vận hành và bảo trì một cụm Nodejs/Express backend cồng kềnh, mà chuyên biệt hóa sang kiến trúc Cloud-native.

*   **Frontend / UI Shell:** React.js Framework (Next.js phiên bản 15+).
*   **Hosting Dịch vụ:** Vercel Edge Network.
*   **Data & Auth Provider:** Supabase (Cung cấp Authentication bảo mật, Database PostgreSQL và Object Storage cho ảnh, cùng giao thức giao tiếp bằng Data Proxy/SDK thông qua REST/GraphQL ngầm).

## 2. Mô hình Luồng Dữ liệu (Data Flow Diagram)

### 2.1 Mối liên kết Các tầng hệ thống
1.  **Client-side (Trình duyệt):** Chứa các Client component React, thực thi State cục bộ (React Hook), thư viện Kéo/Thả (`dnd-kit` / `hello-pangea`), Form submit trạng thái RSVP.
2.  **Edge / Proxy Network (Next.js Edge Runtime):** middleware/proxy (`proxy.ts` / `middleware.ts`) chạy trên toàn cầu. Đánh dấu chặn mọi đường rẽ vào `/dashboard` dựa trên JWT Token của Cookies (được sinh ra bởi Supabase).
3.  **Server-side (Next.js Node/Server Components):** Nơi tiến hành "fetch" (lấy dữ liệu) trước (SSR). Ví dụ: khi User/Khách vào link `/[slug]`, Next.js sẽ tự động lấy `slug`, giao tiếp (Postgrest RPC) vào Database Supabase lấy mảng JSON nội dung thiệp -> Sinh thành HTML đẩy ngược cho Client, giúp đạt chỉ số chuẩn SEO nhanh nhất (Fast TTI - Time To Interactive).
4.  **Supabase BaaS (Database/Auth/Storage):** 
    *   Auth: Giao tiếp qua `createClient()` (Supabase SSR Helper) để cấp phát `anon_key` / Session. 
    *   Database: Chứa Data Relation (mô hình quan hệ), xử lý lệnh Create, Read, Update, Delete tùy thuộc vào Policy (RLS). 
    *   Storage: Chứa tĩnh File Asset do user tải lên (Album).

## 3. Kiến Trúc Chi Tiết Components

### 3.1 Vùng Dashboard (Khu Giao Tiếp Quản Trị)
Tại đây, mô hình Client-Side-Rendering (CSR) được tận dụng cực mạnh vì có tương tác rất nặng nề (Kéo thả, Thêm/sửa văn bản Live):
*   **Trạng thái Layout Tổng thể (Layout Root):** `app/layout.tsx` - Khai báo chuẩn font Google (`Geist`, `Geist_Mono`, `Playfair Display`...) và cài đặt các Provider (Theme, Modal Toaster `sonner`).
*   **Cửa sổ làm việc `Dashboard Builder`:**
    *   **Thanh Menu Công Cụ (Left Panel):** Ánh xạ cấu trúc JSON được định sẵn tại `lib/templates.ts` (ví dụ: Icon Trái tim ứng với block `Hero`). Khi click, nó Push thẳng 1 Object mới vào state React `blocks`.
    *   **Khu Cấu hình Block (Center Panel):** Một mảng (Array) các thẻ `<Draggable>` (của Pangea-DnD). Bên trong nó sẽ bung (Expand/Collapse) ra Form cấu hình của mỗi thành phần khi User Click. Sự kiện `onChange` điền Form kích hoạt một callback hàm, thay thế properties của Object tại vị trí Index đó.
    *   **Mô Phỏng Trực Tiếp (Preview Right Panel - The "Iframe"):** Không sử dụng Iframe thực tế để tải mượt mà. Nó sử dụng Component lõi (`RenderBlock`) từ thư mục public (`app/[slug]/page.tsx`), truyền prop JSON `blocks` qua lại (State Sharing), gắn một scale Wrapper giả lập kích cỡ 320px (Mobile phone) làm vỏ ngoài.

### 3.2 Vùng Public Route (Khu Khách Xem Thiệp)
Tại đây mô hình Server-side áp dụng cho lần khởi động đầu:
*   Trang gốc `app/[slug]/page.tsx` sẽ nhận chuỗi URL (Params slug). 
*   **Động cơ Render (Engine `RenderBlock`):** Đóng vai trò Translator (Người phiên dịch). Nó dựa trên thuộc tính `.type` của mỗi block cấu trúc mảng JSON (`hero`, `countdown`, `story`, `gallery`), sinh ra đúng thẻ `<HeroBlock/>` hay `<StoryBlock/>`, bọc trong nền Wrapper có tuỳ chỉnh màu sắc chủ đạo qua Context `ThemeContext`.

## 4. Xử lý Trạng thái State (State Management)
*   State "Vui lòng đợi/Loading": `useState` (Sử dụng Loader2 của Lucide icon).
*   State "Drag Drop Builder Reorder": Sử dụng công cụ `onDragEnd` -> cắt `splice` và tạo mảng vị trí order mới. Lời nhắc nhỏ: Luôn Update thuộc tính `order: index` cho mảng JSON trước khi setReactState() để chuẩn hóa lúc Push lên Server API.
*   State Data Fetch / Fetching: Sử dụng bất đồng bộ `useEffect()` kết nối `Supabase SDK API` tại `lib/supabase/api.ts`. Gỉảm thiểu query thừa qua Single Fetch Pattern.

## 5. Security & Deployment Architecture
*   **Bảo mật Truyền dẫn:** SSL cấp độ Edge cho toàn bộ route mạng của Next.js, HTTPs Request kết nối Port 443 tới Restful SQL Api. Tự động từ chối kết nối chèn mã độc.
*   **CI/CD Pipeline:** Github Tích hợp Vercel Webhook. Bất cứ hành vi đẩy (Push Commit) nào vào nhánh `main` (Production Branch), sẽ tự động kích hoạt tiến trình Build hệ thống `next build` -> Xác minh Linting -> Đưa lên CDN Vercel cấp phát toàn bộ (Global Deploy) mà không cần can thiệp tay.
