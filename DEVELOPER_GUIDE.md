# 💒 Tài Liệu Phát Triển & Bảo Trì Dự Án: WeddingCard.vn

Tài liệu này cung cấp toàn bộ thông tin kỹ thuật, kiến trúc, luồng hoạt động, cấu trúc cơ sở dữ liệu và hướng dẫn bảo trì cho dự án **WeddingCard.vn** (Nền tảng tạo thiệp cưới online). 

Nó được viết dành cho các lập trình viên tiếp quản, bảo trì hoặc phát triển thêm tính năng cho hệ thống sau này.

---

## 1. Tổng Quan Dự Án & Kiến Trúc (Architecture)

**WeddingCard.vn** là một ứng dụng web dạng SaaS cung cấp công cụ (builder) cho các cặp đôi tự tạo một website thiệp cưới online bằng cách kéo-thả các block (giống Notion/Linktree).

*   **Mô hình:** Tự phục vụ (Self-serve) - Người dùng đăng nhập, tạo thiệp, tuỳ chỉnh nội dung, và chia sẻ link (`/slug`) cho khách mời.
*   **Hosting Architecture:** Vercel (Front-end App) + Supabase (Backend/DatabaseaaS). Không dùng máy chủ NodeJS/Express riêng lẻ để tiết kiệm chi phí vận hành và tăng tốc độ phát triển (Serverless).

### 1.1 Tech Stack (Công nghệ sử dụng)
*   **Framework:** **Next.js 16+** (sử dụng App Router `src/app`). 
*   **Ngôn ngữ:** **TypeScript** (Strict mode) & **React 19**.
*   **Styling:** **Tailwind CSS 4** kết hợp với **Shadcn UI** và Framer-motion (để làm hiệu ứng mượt mà).
*   **Backend & DB:** **Supabase** (PostgreSQL, Supabase Auth, Supabase Storage cho ảnh). Trực tiếp query thông qua `@supabase/ssr` và `@supabase/supabase-js`.
*   **State Management:** Quản lý state cục bộ bằng React hooks (`useState`, `useContext`) và kéo/thả bằng `@hello-pangea/dnd`.

---

## 2. Cấu Trúc Thư Mục (Directory Structure)

Dự án nằm chính tại thư mục `web-app`.

```text
web-app/
├── public/                 # Ảnh tĩnh (assets, logo, texture nền)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (public)/       # Landing page (page.tsx)
│   │   ├── login/          # Trang đăng nhập
│   │   ├── register/       # Trang đăng ký
│   │   ├── dashboard/      # Cổng tính năng riêng của cặp đôi (Dashboard)
│   │   │   ├── builder/    # Trình tạo/cấu hình thiệp chính
│   │   │   ├── guests/     # Quản lý khách mời
│   │   │   └── new/        # Nơi tạo thiệp mới
│   │   ├── [slug]/         # Dynamic Route cho Public Card (Thiệp hiển thị public)
│   │   ├── auth/           # Route callback của Supabase Auth
│   │   └── layout.tsx      # Root layout, bọc ứng dụng (chứa font chữ, provider)
│   ├── components/         # React Components dùng chung
│   │   ├── ui/             # Shadcn UI (Nút, Input, Toast...)
│   │   ├── builder/        # Các phần tái sử dụng của editor (tương lai)
│   │   └── invitation-blocks.tsx # (KẾT NỐI TÍNH NĂNG) Nơi chứa các Component block giao diện thiệp public
│   ├── lib/
│   │   ├── supabase/       # File API/client kết nối tới Supabase
│   │   ├── templates.ts    # JSON schema các block mẫu (Cấu trúc default khi tạo thiệp)
│   │   └── utils.ts        # Hàm tiện ích dùng chung
│   ├── types/              # Typescript Interface định nghĩa models dùng xuyên suốt dự án
│   └── proxy.ts            # (Thay thế cho middleware.ts cũ) Xử lý route protection (chặn chưa log in thì về /login)
├── .env.local              # Khai báo key bảo mật Supabase
└── package.json            # Thư viện npm
```

---

## 3. Database Schema (Supabase PostgreSQL)

Phần Backend hoàn toàn nằm trên Supabase. Bạn cần luôn giữ DB logic map với Type trong code tại `src/types/index.ts`.

### Các bảng chính:
1.  **`users`** (Bảng gốc của Supabase Auth): Lưu thông tin tài khoản đăng nhập (Email/Mật khẩu). Không tuỳ biến bảng này trực tiếp.
2.  **`invitations`**: Thông tin định danh thiệp (Mỗi user tạo được nhiều thiệp).
    *   `id` (UUID), `user_id` (Nối với users), `title` (Tên thiệp), `slug` (URL độc bản - duy nhất), `wedding_date`, `is_published`, `created_at`.
3.  **`invitation_designs`**: Dữ liệu cấu hình của thiệp, nối 1-1 với invitations qua `invitation_id`. Đây là bảng cốt lõi của Builder.
    *   `invitation_id` (Khóa ngoại), `theme` (JSONB chứa màu, font chữ), `blocks` (JSONB Array - chứa danh sách cấu trúc và nội dung các component kéo thả).
4.  **`rsvps`**: Lưu thông tin khách mời gửi phản hồi tham dự.
    *   `invitation_id`, `guest_name`, `attending` (boolean), `guest_count` (int), `message`, `created_at`.
5.  **`messages`**: Dành cho tính năng sổ lưu bút (Guestbook).
    *   `invitation_id`, `author_name`, `content`, `created_at`.

---

## 4. Các Luồng Hoạt Động Cốt Lõi (Main Flows)

### 4.1. Luồng Xác thực (Authentication)
*   User vào `/login` hoặc `/register`. App gọi hàm auth của Supabase client (`supabase.auth.signInWithPassword` hoặc `signUp`).
*   Session token được lưu lên Cookie của trình duyệt. 
*   **Bảo mật Route (Route Protection):** Next.js chạy qua file `src/proxy.ts` (Next 16 mới không dùng middleware.ts nữa). File proxy sẽ đọc Cookie, xác minh có User không. Nếu User vào `/dashboard` mà chưa có phiên, đẩy ngược ra `/login`.

### 4.2. Luồng Trình Tạo Thiệp (Builder Flow)
Nằm tại `src/app/dashboard/builder/[id]/page.tsx`.
1.  **Load:** Trình duyệt lấy `invitation_id` từ URL, gọi DB tải `invitation_designs`. State thiết kế (`blocks`, `theme`) được đưa vào state `useState`.
2.  **Render Preview:** Cột "Xem trước" sử dụng chung UI của trang Public, nhúng trực tiếp `<RenderBlock>` từ `src/components/invitation-blocks.tsx` để Preview đồng nhất 100% với hiển thị thật. Các cài đặt màu/font được bọc qua `<ThemeContext.Provider>`.
3.  **Edit / Drag-Drop:** Dùng thư viện `@hello-pangea/dnd`. Dữ liệu block là JSON array. Mỗi hành động kéo qua lại là thao tác cắt/chèn element trong mảng `blocks`. Cập nhật state nội dung thì cập nhật object bên trong mảng đó (`onChange`).
4.  **Save:** Bấm "Lưu", gọi API supabase đẩy mảng Json `blocks` đề đè lên database `invitation_designs`.

### 4.3. Luồng Trang Public Card (`/[slug]`)
1.  Khách mời vào `domain.com/thiep-cuoi-dung-nhung` (Slug).
2.  Next.js Server (hoặc Client) bóc tách chuỗi `/thiep-cuoi-dung-nhung` tìm record `slug`, nếu thấy, lấy được `invitation_id`.
3.  Tải tiếp bảng `invitation_designs` lấy mảng `blocks` từ JSON DB.
4.  Vòng lặp (map) qua mảng `blocks`: Nào là `hero`, nào là `gallery`, sinh ra Component tương ứng bằng hàm switch case `RenderBlock`. Component nào sẽ phụ thuộc Component đó (RSVP có thêm nút submit => Gắn action insert db `rsvps`).

---

## 5. Cài đặt Môi Trường (Setup Local Guide)

Đảm bảo bạn có **Node.js 20+** và tài khoản **Supabase**.

**Bước 1:** Clone code, vào thư mục `web-app`:
```bash
git clone https://github.com/Coang2623/weddingcard-vn.git
cd weddingcard-vn/web-app
npm install
```

**Bước 2:** Kết nối Database
1. Tạo 1 project Supabase mới.
2. Vào Settings > API, copy 2 biến bỏ vào `.env.local` ở cùng cấp thư mục:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
3. Chạy lệnh SQL tại Supabase SQL Editor để sinh tạo bảng (Dựa theo mô tả Schema mục 3 hoặc trong tài liệu setup Supabase lúc ban đầu của bạn). Lưu ý cần mở Storage tạo 1 bucket Public tên `wedding-images` cho phép tải ảnh Gallery.

**Bước 3:** Chạy Server Test
```bash
npm run dev
```

---

## 6. Hướng Dẫn Phát Triển (Ví Dụ Thêm 1 Block Mới)

Giả sử Product Manager yêu cầu thêm 1 chức năng thiệp cưới là: **"Giao diện Đăng Ký Quà Tặng riêng"**. (Tên kỹ thuật: `gift_registry` block)

**Mở file `src/types/index.ts`:**
Thêm Type định nghĩa `gift_registry` vào BlockType type.
Thêm interface mẫu.

**Mở file `src/lib/templates.ts`:**
Thêm một block rỗng tạo mặc định cho Builder:
```js
{ type: 'gift_registry', id: uuid(), props: { title: 'Quà tặng' } }
```

**Mở thư mục Builder `src/app/dashboard/builder/[id]/page.tsx`:**
1. Thêm meta config hiển thị nó ra Menu panel bên vế trán.
2. Tại khu vực `BlockEditor(props)`, thiết kế giao diện Form (có input lấy tiêu đề...).

**Mở file `src/components/invitation-blocks.tsx`:**
Tạo giao diện Public `function GiftRegistryBlock({block}) { return ... }` hiển thị UI cho user xem khi dùng biến đó. Tiếp theo gọi nó bên trong hàm switch `RenderBlock`.

Lưu ý: Mọi giao diện phải có style bọc bởi Tailwind kết hợp config màu lấy qua `const theme = useTheme()`.

---

## 7. Quy Trình Debug & Khắc Phục Lỗi (Troubleshoot)

*   **Lỗi "Hydration Mismatch":** Rất hay xảy ra trên Chrome do Extension (ví dụ Grammarly, chặn quảng cáo) tự động render lại Tag. Rủi ro này đã được fix cho thẻ `<html>` qua thuộc tính `suppressHydrationWarning`. Nếu xuất hiện ở component cụ thể khác, bạn xem lại `useEffect()` (chờ Component mount xong mới render logic phía Client) hoặc việc render thuộc tính tùy thuộc trạng thái network.
*   **Thiếu block hoặc render lỗi:** Khi thiết kế thêm block (vd `text`, `music`), cần khai báo Type đầy đủ tại `src/types/index.ts` và tạo object default tại `src/lib/templates.ts`. 
*   **Nhạc YouTube/MP3 bị chặn Autoplay:** Trình duyệt hiện đại (Chrome 66+) chặn Autoplay nếu Element bị `display: none`, `opacity: 0` hoặc kích thước `0x0`. Để fix, component Music đã dùng trick: đẩy iframe/audio ra `left: -9999px` kết hợp `width/height` thật để "đánh lừa" việc play, và chỉ phát sau cái click/tương tác đầu tiên của khách.
*   **Proxy / Middleware:** Proxy `src/proxy.ts` đang ép cứng các route `/dashboard/:path`. Nếu bạn làm thêm trang Admin Dashboard `/admin`, nhớ vào file proxy cấu hình thêm đoạn logic để không chệch luồng.
*   **Thêm ảnh lỗi, tải không lên Gallery:** Kiểm tra Storage trên Supabase đã được Cấu hình RLS gỡ giới hạn quyền GHI file hay chưa.

## 8. Hướng Tới Tương Lai (Next Roadmap)

Ứng dụng hiện mới ở mức MVP chạy mượt mà cốt lõi. Trong quá trình phát triển tiếp, cân nhắc:
1.  **Tính năng Phân quyền (Roles):** Thêm tính năng Collaborators để cho cặp đôi share cho Planner/Photographer cùng vào trang Dashboard chỉnh thiệp.
2.  **Quản Lý Khách Mời (Guests CRM):** Mục Route `dashboard/guests` hiện vẫn dùng mock data tĩnh. Code tiếp API vào file `supabase/api.ts` để đọc/ghi Data vào bảng `guests`. Hỗ trợ Import Excel.
3.  **Tối ưu Storage Tiết Kiệm Băng Thông:** App hiện up ảnh nguyên gốc vào Bucket của Supabase. Cần code xử lý JS nén hình ảnh (qua thư viện `browser-image-compression`) lúc user đang ở bên trang Builder trước khi call `supabase.storage.upload()`.
4.  **Tối ưu Performance thiệp Public:** Load từ JSON trên database khá nhanh nhưng nếu traffic cao, nên cân nhắc chiến lược Incremental Static Regeneration (ISR) hoặc Redis Caching (của Vercel/KV) dựa trên khóa Slug URL.

---
*(Tài liệu này nên được cập nhật liên tục bám sát quá trình bổ sung tính năng)*
