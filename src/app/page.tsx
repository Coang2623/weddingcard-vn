'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Users, QrCode, Globe2, Shield, ChevronRight, Star, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Sparkles,
    title: 'Kho Mẫu Thiệp Đẹp',
    desc: 'Hàng chục mẫu thiệp phong cách: Tối giản, Lãng mạn, Cinematic, Truyền thống — chỉ cần chọn và điền thông tin.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
  },
  {
    icon: Globe2,
    title: 'Kéo Thả Dễ Dàng',
    desc: 'Giao diện kéo thả theo Block như Notion. Thêm, xoá, sắp xếp các phần: Countdown, Ảnh, RSVP, Lời chúc... không cần code.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    icon: Users,
    title: 'Quản Lý Khách Mời',
    desc: 'Import danh sách CSV, phân nhóm Gia đình / Bạn bè. Dashboard thống kê % RSVP trực tiếp.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: QrCode,
    title: 'Chia Sẻ & QR Code',
    desc: 'Link thiệp cá nhân hoá (domain.com/ten-ban). QR code tự động để in thiệp giấy. Share nhanh Zalo / Facebook.',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: Heart,
    title: 'Sổ Lưu Bút Realtime',
    desc: 'Khách gửi lời chúc hiển thị ngay lập tức trên thiệp. Thu gom ảnh cưới từ tất cả khách về một album chung.',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
  },
  {
    icon: Shield,
    title: 'Bảo Mật Thiệp',
    desc: 'Đặt mật khẩu ngắn để chỉ khách được mời mới xem được. Ẩn/hiện số tài khoản theo từng nhóm khách.',
    color: 'text-slate-500',
    bg: 'bg-slate-50',
  },
]

const testimonials = [
  {
    name: 'Minh Phương & Tuấn Anh',
    date: 'Cưới ngày 15/10/2025',
    avatar: '💑',
    text: 'Thiết kế xong thiệp trong 30 phút, gửi link Zalo cho cả họ hàng. Khách RSVP rất tiện, không phải gọi điện từng người nữa!',
    stars: 5,
  },
  {
    name: 'Thu Hà & Quang Minh',
    date: 'Cưới ngày 02/12/2025',
    avatar: '💍',
    text: 'Mẫu Cinematic cực đẹp, in QR code lên thiệp giấy để khách quét vào xem chương trình chi tiết. Ai cũng khen!',
    stars: 5,
  },
  {
    name: 'Lan Anh & Đức Huy',
    date: 'Cưới ngày 08/02/2026',
    avatar: '🌸',
    text: 'Sổ lưu bút realtime là tính năng hay nhất — trong lúc tiệc cưới mọi người gửi lời chúc thấy hiển thị lên màn hình luôn, cảm động lắm.',
    stars: 5,
  },
]

const plans = [
  {
    name: 'Miễn Phí',
    price: '0đ',
    period: '/mãi mãi',
    desc: 'Hoàn hảo để bắt đầu',
    features: ['1 website thiệp cưới', '3 mẫu template cơ bản', 'Quản lý đến 50 khách mời', 'Form RSVP online', 'Link thiệp cá nhân hoá', 'QR Code'],
    cta: 'Bắt Đầu Miễn Phí',
    variant: 'outline' as const,
    highlight: false,
  },
  {
    name: 'Cặp Đôi',
    price: '199.000đ',
    period: '/lần',
    desc: 'Phổ biến nhất ❤️',
    features: ['Tất cả tính năng Free', 'Tất cả 20+ template premium', 'Không giới hạn khách mời', 'Upload ảnh / video nền', 'Bảo mật thiệp (passcode)', 'Sổ lưu bút Realtime', 'Album ảnh cộng đồng', 'Hỗ trợ ưu tiên'],
    cta: 'Chọn Gói Này',
    variant: 'default' as const,
    highlight: true,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fdfaf7] overflow-x-hidden">
      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[#c9a96e]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#c9a96e] fill-[#c9a96e] animate-heartbeat" />
            <span className="font-bold text-lg text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
              WeddingCard<span className="text-[#c9a96e]">.vn</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#2c1810]/70">
            <Link href="#features" className="hover:text-[#c9a96e] transition-colors">Tính năng</Link>
            <Link href="#templates" className="hover:text-[#c9a96e] transition-colors">Mẫu thiệp</Link>
            <Link href="#pricing" className="hover:text-[#c9a96e] transition-colors">Bảng giá</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-[#2c1810]">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-[#c9a96e] hover:bg-[#b8925a] text-white">
                Tạo thiệp ngay
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 wedding-gradient opacity-60" />
        <div className="absolute top-20 left-10 w-48 h-48 rounded-full bg-[#c9a96e]/10 blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-rose-300/10 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-40 right-1/4 w-3 h-3 rounded-full bg-[#c9a96e]/60 animate-heartbeat" />
        <div className="absolute top-60 left-1/4 w-2 h-2 rounded-full bg-rose-400/60 animate-heartbeat" style={{ animationDelay: '0.7s' }} />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-[#c9a96e]/10 text-[#c9a96e] border-[#c9a96e]/30 px-4 py-1 text-sm">
              ✨ Nền tảng thiệp cưới #1 Việt Nam
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', color: '#2c1810' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Tạo Thiệp Cưới Online{' '}
            <span className="relative">
              <span className="text-[#c9a96e]">Đẹp & Dễ Dàng</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M0 6 Q100 0 200 6" stroke="#c9a96e" strokeWidth="2" fill="none" strokeDasharray="4 2" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[#2c1810]/60 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Thiết kế website thiệp cưới cá nhân hoá trong vài phút. Gửi link cho khách mời, thu thập RSVP, quản lý danh sách — tất cả trong một nơi.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/register">
              <Button size="lg" className="bg-[#c9a96e] hover:bg-[#b8925a] text-white gap-2 px-8 h-12 text-base shadow-lg shadow-[#c9a96e]/30 hover:shadow-xl hover:shadow-[#c9a96e]/40 transition-all">
                <Heart className="w-4 h-4 fill-white" />
                Tạo Thiệp Miễn Phí
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="lg" variant="outline" className="border-[#c9a96e]/40 text-[#c9a96e] hover:bg-[#c9a96e]/5 h-12 text-base gap-2">
                Xem Demo Thiệp
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-14 grid grid-cols-3 gap-6 max-w-sm mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { num: '5,000+', label: 'Cặp đôi' },
              { num: '200K+', label: 'Khách mời' },
              { num: '4.9★', label: 'Đánh giá' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-[#c9a96e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stat.num}
                </div>
                <div className="text-xs text-[#2c1810]/50 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Demo card preview */}
        <motion.div
          className="relative max-w-xs mx-auto mt-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <div className="glass-card rounded-3xl p-6 shadow-2xl shadow-[#c9a96e]/20 text-center">
            <div className="text-4xl mb-3 animate-float">💐</div>
            <p className="text-xs text-[#2c1810]/40 tracking-widest uppercase mb-2">Trân trọng kính mời</p>
            <h3 className="text-2xl font-semibold text-[#2c1810] mb-0.5" style={{ fontFamily: 'Playfair Display, serif' }}>
              Minh Anh & Quang Huy
            </h3>
            <p className="text-[#c9a96e] text-sm font-medium mb-4">12 – 12 – 2025</p>
            <div className="text-xs bg-[#c9a96e]/10 rounded-full px-4 py-1.5 text-[#c9a96e] inline-block">
              ✓ Xác nhận tham dự tại đây
            </div>
          </div>
          {/* Phone frame hint */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-[#2c1810]/30">
            📱 Xem đẹp trên mọi thiết bị
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 bg-white/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2c1810] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Chỉ 3 bước đơn giản
            </h2>
            <p className="text-[#2c1810]/50">Từ lúc đăng ký đến khi gửi link cho khách mời — dưới 30 phút</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🎨', title: 'Chọn Mẫu Thiệp', desc: 'Duyệt kho mẫu đẹp theo phong cách yêu thích. Chọn 1 bấm "Dùng mẫu này".' },
              { step: '02', icon: '✏️', title: 'Tùy Chỉnh Nội Dung', desc: 'Kéo thả, điền tên, ngày cưới, địa điểm, ảnh. Preview trực tiếp ngay bên cạnh.' },
              { step: '03', icon: '💌', title: 'Chia Sẻ & Thu RSVP', desc: 'Nhận link riêng + QR Code. Gửi qua Zalo/FB. Xem ai đã xác nhận tham dự.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="relative text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#c9a96e] text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {item.step}
                </div>
                <div className="text-5xl mb-4 mt-4">{item.icon}</div>
                <h3 className="text-lg font-semibold text-[#2c1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>{item.title}</h3>
                <p className="text-[#2c1810]/55 text-sm leading-relaxed">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-[#c9a96e] text-2xl">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2c1810] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Mọi thứ cặp đôi cần
            </h2>
            <p className="text-[#2c1810]/50">8 tính năng hoàn chỉnh cho một đám cưới hiện đại</p>
          </div>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={itemVariants}
                className="group p-6 rounded-2xl border border-transparent hover:border-[#c9a96e]/20 hover:shadow-lg hover:shadow-[#c9a96e]/10 transition-all duration-300 bg-white/70 hover:bg-white"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-[#2c1810] mb-2">{f.title}</h3>
                <p className="text-sm text-[#2c1810]/55 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4 bg-[#f5e6d3]/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2c1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Cặp đôi nói gì?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#c9a96e] text-[#c9a96e]" />
                  ))}
                </div>
                <p className="text-sm text-[#2c1810]/70 mb-5 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{t.avatar}</div>
                  <div>
                    <p className="font-medium text-sm text-[#2c1810]">{t.name}</p>
                    <p className="text-xs text-[#2c1810]/40">{t.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#2c1810] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Đơn giản & Minh bạch
            </h2>
            <p className="text-[#2c1810]/50">Trả một lần, dùng mãi mãi — không subscription, không ẩn phí</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                className={`rounded-3xl p-8 ${plan.highlight
                  ? 'bg-[#2c1810] text-white shadow-2xl shadow-[#2c1810]/30 scale-105'
                  : 'bg-white border border-[#c9a96e]/20'
                  }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {plan.highlight && (
                  <Badge className="mb-3 bg-[#c9a96e] text-white border-0 text-xs">PHỔ BIẾN NHẤT</Badge>
                )}
                <h3 className={`text-lg font-semibold mb-1 ${plan.highlight ? 'text-[#c9a96e]' : 'text-[#2c1810]'}`}>
                  {plan.name}
                </h3>
                <div className="mb-1">
                  <span className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ml-1 ${plan.highlight ? 'text-white/50' : 'text-[#2c1810]/40'}`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-white/60' : 'text-[#2c1810]/50'}`}>
                  {plan.desc}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-[#c9a96e]' : 'text-green-500'}`} />
                      <span className={plan.highlight ? 'text-white/80' : 'text-[#2c1810]/70'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button
                    className={`w-full h-11 ${plan.highlight
                      ? 'bg-[#c9a96e] hover:bg-[#b8925a] text-white'
                      : 'border-[#c9a96e] text-[#c9a96e] hover:bg-[#c9a96e]/5'
                      }`}
                    variant={plan.variant}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 px-4 bg-[#2c1810] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#c9a96e] blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-rose-400 blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-6 animate-heartbeat">💒</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Bắt đầu ngay hôm nay
          </h2>
          <p className="text-white/60 mb-8 text-lg">
            Miễn phí. Không cần thẻ tín dụng. Tạo thiệp trong 5 phút.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-[#c9a96e] hover:bg-[#b8925a] text-white gap-2 px-10 h-12 text-base shadow-lg shadow-[#c9a96e]/30">
              <Heart className="w-4 h-4 fill-white" />
              Tạo Thiệp Cưới Miễn Phí
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-4 border-t border-[#c9a96e]/10 bg-[#fdfaf7]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#c9a96e] fill-[#c9a96e]" />
              <span className="font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                WeddingCard.vn
              </span>
            </div>
            <p className="text-sm text-[#2c1810]/40">
              © 2026 WeddingCard.vn — Tạo bởi ❤️ tại Việt Nam
            </p>
            <div className="flex gap-6 text-sm text-[#2c1810]/50">
              <Link href="/privacy" className="hover:text-[#c9a96e] transition-colors">Chính sách</Link>
              <Link href="/terms" className="hover:text-[#c9a96e] transition-colors">Điều khoản</Link>
              <Link href="/contact" className="hover:text-[#c9a96e] transition-colors">Liên hệ</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
