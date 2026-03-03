<div align="center">
  <h1>WeddingCard.vn</h1>
  <p><b>SaaS tạo thiệp cưới online dạng website</b> cho các cặp đôi Việt Nam — chọn template, kéo-thả block, xem trước realtime, chia sẻ link public <code>/<span>slug</span></code>, thu RSVP và sổ lưu bút.</p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black" />
    <img alt="React" src="https://img.shields.io/badge/React-19-61dafb" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38bdf8" />
    <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Auth%20%2B%20Postgres%20%2B%20Storage-3ecf8e" />
  </p>

  <p>
    <a href="../README.md">Tài liệu đầy đủ (Supabase/schema/deploy)</a>
    ·
    <a href="#chạy-local">Chạy local</a>
    ·
    <a href="#scripts">Scripts</a>
    ·
    <a href="#routes-chính">Routes</a>
  </p>
</div>

## Tổng quan nhanh

- **Landing**: giới thiệu sản phẩm + CTA `/login` / `/register`
- **Auth (Supabase)**: email/password + Google OAuth, callback `/auth/callback`
- **Dashboard**: tạo thiệp mới `/dashboard/new`, quản lý thiệp `/dashboard`
- **Builder**: kéo-thả block, live preview, lưu design, upload ảnh lên Storage bucket `wedding-images`
- **Public card**: render thiệp theo `theme + blocks` tại `/<slug>`, cho phép RSVP + guestbook

## Trạng thái hiện tại (để đúng với code)

- **Quản lý khách mời** `(/dashboard/guests/[id])` đang dùng **MOCK data** (chưa nối Supabase).
- Có các field/type cho **publish**, **passcode**, **visibility**… nhưng bạn nên dùng **RLS/Policies** để bảo vệ dữ liệu cho production (chi tiết ở README root).

## Tech stack

- **Next.js App Router** + **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui** (Radix) + **framer-motion**
- **Supabase**: Auth + Postgres + Storage (dùng `@supabase/ssr` + `@supabase/supabase-js`)

## Chạy local

> Chạy trong thư mục `web-app/`.

```bash
npm install

# macOS/Linux
cp .env.example .env.local

# Windows PowerShell
Copy-Item .env.example .env.local

npm run dev
```

Mở `http://localhost:3000`.

### Environment variables

File `.env.local` (không commit) tối thiểu cần:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Scripts

- **dev**: `npm run dev`
- **build**: `npm run build`
- **start**: `npm run start`
- **lint**: `npm run lint`

## Routes chính

- `/` landing
- `/login` đăng nhập
- `/register` đăng ký
- `/auth/callback` auth callback (OAuth/email confirm)
- `/dashboard` dashboard (protected)
- `/dashboard/new` tạo thiệp từ template
- `/dashboard/builder/[id]` builder
- `/<slug>` trang thiệp public

## Deploy

Khuyến nghị **Vercel** (Root Directory: `web-app/`). Chi tiết env + Supabase redirect URLs nằm ở `../README.md`.

## Troubleshooting (ngắn)

- **Màn hình trắng / crash**: thiếu `NEXT_PUBLIC_SUPABASE_URL` hoặc `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **OAuth callback fail**: cấu hình redirect URL `.../auth/callback` trong Supabase Auth settings
- **403/permission denied**: kiểm tra RLS/Policies hoặc Storage bucket policies (README root có hướng dẫn)
