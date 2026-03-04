'use client'

/**
 * /demo — Trang demo thiệp cưới tĩnh, không cần đăng nhập / database.
 * Render trực tiếp các block với dữ liệu mẫu để khách trên landing page xem thử.
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Calendar, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import Link from 'next/link'
import type { InvitationTheme } from '@/types'

/* ── Demo theme: Mẫu "Hiện Đại Sang Trọng" (tím) ── */
const DEMO_THEME: InvitationTheme = {
    primaryColor: '#6c63ff',
    secondaryColor: '#e8e6ff',
    backgroundColor: '#ffffff',
    textColor: '#1a1a2e',
    fontTitle: 'Cormorant Garamond',
    fontBody: 'Raleway',
    style: 'modern',
}

/* ── Demo data ── */
const DEMO_GROOM = 'Minh Quân'
const DEMO_BRIDE = 'Phương Linh'
const DEMO_DATE = '2025-10-18T10:00:00'
const DEMO_VENUE = 'Grand Ballroom – Khách sạn Rex Sài Gòn'
const DEMO_ADDRESS = '141 Nguyễn Huệ, Quận 1, TP.HCM'
const DEMO_EVENTS = [
    { time: '09:30', title: 'Đón khách & Chụp hình' },
    { time: '10:30', title: 'Lễ Khai Tiệc' },
    { time: '12:00', title: 'Tiệc Buffet & Âm nhạc' },
]
const DEMO_STORY = `Chúng tôi gặp nhau trong một buổi chiều thu tại Hà Nội — một cái nhìn tình cờ, một nụ cười e thẹn, và từ đó hành trình của chúng tôi bắt đầu.

Sau 3 năm cùng nhau vượt qua mọi thăng trầm, chúng tôi quyết định gắn kết cuộc đời với nhau mãi mãi.

Chúng tôi trân trọng sự hiện diện của bạn trong ngày trọng đại này. ❤️`

/* ── Shared helpers ── */
function seededFloat(seed: number) {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

export default function DemoPage() {
    const theme = DEMO_THEME
    const isCinematic = false
    const isModern = true
    const isTraditional = false
    const isDark = true

    // Countdown — initialized to zeros to avoid SSR/client mismatch (Date.now() differs)
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const calc = () => {
            const diff = Math.max(0, new Date(DEMO_DATE).getTime() - Date.now())
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            })
        }
        calc()
        const id = setInterval(calc, 1000)
        return () => clearInterval(id)
    }, [])

    // RSVP state
    const [guestName, setGuestName] = useState('')
    const [attending, setAttending] = useState<boolean | null>(null)
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleRsvp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!guestName || attending === null) {
            toast.error('Vui lòng điền tên và xác nhận tham dự')
            return
        }
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        setLoading(false)
        setSubmitted(true)
        toast.success('🎉 Đây là trang demo — RSVP không được lưu!')
    }

    return (
        <div className="min-h-screen overflow-x-hidden" style={{ background: '#0f0c29' }}>
            {/* Demo Banner */}
            <div className="sticky top-0 z-50 bg-indigo-600 text-white text-center text-xs py-2 px-4 flex items-center justify-center gap-3">
                <span>🎴 Đây là thiệp cưới demo — không ảnh hưởng dữ liệu thật</span>
                <Link href="/register">
                    <Button size="sm" className="h-6 px-3 text-xs bg-white text-indigo-600 hover:bg-white/90">
                        Tạo thiệp của bạn →
                    </Button>
                </Link>
            </div>

            {/* ── HERO ── */}
            <div className="relative py-24 sm:py-32 px-6 text-center overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
                {/* Purple bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                {/* Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
                    style={{ background: theme.primaryColor }} />
                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full"
                            style={{ left: `${seededFloat(i * 17 + 1) * 100}%`, top: `${seededFloat(i * 29 + 2) * 100}%` }}
                            animate={{ y: [0, -60, 0], opacity: [0, 0.6, 0] }}
                            transition={{ duration: seededFloat(i * 37 + 3) * 10 + 5, repeat: Infinity, delay: seededFloat(i * 41 + 4) * 5 }}
                        />
                    ))}
                </div>

                <div className="relative z-10">
                    <motion.div className="text-5xl sm:text-6xl mb-6 flex justify-center items-center gap-4"
                        initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 15 }}>
                        <div className="w-12 h-px bg-white/20" />
                        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                            💎
                        </motion.div>
                        <div className="w-12 h-px bg-white/20" />
                    </motion.div>

                    <motion.p className="text-[10px] sm:text-xs tracking-[5px] uppercase mb-8 font-medium"
                        style={{ color: `${theme.primaryColor}cc` }}
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                        Trân trọng kính mời
                    </motion.p>

                    <div className="flex flex-col items-center gap-4">
                        <motion.h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight"
                            style={{ fontFamily: `${theme.fontTitle}, serif`, color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                            {DEMO_GROOM}
                        </motion.h1>

                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }}>
                            <Heart className="w-8 h-8" style={{ fill: theme.primaryColor, color: theme.primaryColor, filter: 'drop-shadow(0 0 10px #6c63ff)' }} />
                        </motion.div>

                        <motion.h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight"
                            style={{ fontFamily: `${theme.fontTitle}, serif`, color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }}>
                            {DEMO_BRIDE}
                        </motion.h1>
                    </div>

                    <motion.div className="mt-12 inline-block px-10 py-3 rounded-full border backdrop-blur-sm"
                        style={{ borderColor: `${theme.primaryColor}30`, background: 'rgba(255,255,255,0.05)', color: 'white' }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                        <p className="text-sm font-medium tracking-[3px] uppercase" style={{ fontFamily: theme.fontBody }}>
                            {new Date(DEMO_DATE).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* ── COUNTDOWN ── */}
            <div className="py-16 px-6 text-center relative overflow-hidden" style={{ background: '#14142b' }}>
                <motion.p className="text-xs tracking-[4px] uppercase mb-10 font-medium"
                    style={{ color: `${theme.primaryColor}cc` }}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                    Đếm ngược đến ngày vui
                </motion.p>
                <div className="flex justify-center gap-6 md:gap-10">
                    {[
                        { v: timeLeft.days, l: 'Ngày' },
                        { v: timeLeft.hours, l: 'Giờ' },
                        { v: timeLeft.minutes, l: 'Phút' },
                        { v: timeLeft.seconds, l: 'Giây' },
                    ].map((item, i) => (
                        <motion.div key={item.l} className="text-center"
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <div className="relative group">
                                <div className="absolute -inset-1 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: theme.primaryColor }} />
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                                    <span className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: `${theme.fontTitle}, serif`, color: theme.primaryColor }}>
                                        {String(item.v).padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs font-semibold tracking-widest mt-3 block uppercase opacity-40 text-white">{item.l}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ── STORY ── */}
            <motion.div className="py-20 px-8 sm:px-16 relative overflow-hidden" style={{ background: '#1a1a2e' }}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4"
                        style={{ fontFamily: `${theme.fontTitle}, serif`, color: theme.primaryColor }}>
                        Câu Chuyện Của Chúng Tôi
                    </h2>
                    <div className="w-16 h-1 mx-auto mb-8 rounded-full" style={{ background: theme.primaryColor }} />
                    <p className="text-sm sm:text-base leading-[1.9] italic font-light text-white/70" style={{ fontFamily: theme.fontBody }}>
                        {DEMO_STORY}
                    </p>
                </div>
            </motion.div>

            {/* ── SCHEDULE ── */}
            <motion.div className="py-12 px-6" style={{ background: '#1a1a1a' }}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <div className="flex items-center gap-2 justify-center mb-6">
                    <Calendar className="w-5 h-5" style={{ color: theme.primaryColor }} />
                    <h2 className="text-xl font-semibold" style={{ fontFamily: `${theme.fontTitle}, serif`, color: theme.primaryColor }}>
                        Lịch Trình
                    </h2>
                </div>
                <div className="flex items-center gap-2 justify-center mb-8 text-sm text-white/40">
                    <MapPin className="w-4 h-4" />
                    <span>{DEMO_VENUE}</span>
                </div>
                <div className="space-y-4 max-w-xs mx-auto">
                    {DEMO_EVENTS.map((evt, i) => (
                        <motion.div key={i} className="flex items-center gap-4"
                            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                            <span className="text-sm font-semibold w-12 text-right flex-shrink-0" style={{ color: theme.primaryColor }}>{evt.time}</span>
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: theme.primaryColor }} />
                                {i < DEMO_EVENTS.length - 1 && <div className="w-px h-8 mt-1" style={{ background: `${theme.primaryColor}30` }} />}
                            </div>
                            <span className="text-sm text-white/60">{evt.title}</span>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5"
                        style={{ borderColor: `${theme.primaryColor}30`, color: theme.primaryColor }}
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(DEMO_ADDRESS)}`)}>
                        <MapPin className="w-3.5 h-3.5" /> Xem bản đồ
                    </Button>
                </div>
            </motion.div>

            {/* ── RSVP ── */}
            <div className="py-16 px-6 sm:px-12 relative overflow-hidden" style={{ background: '#14142b' }}>
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-10">
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                            <Heart className="w-10 h-10 mx-auto mb-4" style={{ fill: theme.primaryColor, color: theme.primaryColor }} />
                        </motion.div>
                        <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: `${theme.fontTitle}, serif`, color: 'white' }}>
                            Xác Nhận Tham Dự
                        </h3>
                        <div className="inline-block px-3 py-1 rounded-full text-[10px] tracking-[2px] uppercase opacity-40 border text-white border-white">
                            Trước 01/10/2025
                        </div>
                    </div>

                    {submitted ? (
                        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-10">
                            <div className="text-6xl mb-4">{attending ? '🎊' : '💌'}</div>
                            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: `${theme.fontTitle}, serif` }}>
                                {attending ? 'Cảm ơn bạn! ❤️' : 'Hẹn gặp lại bạn lần sau!'}
                            </h3>
                            <p className="text-white/50 text-sm">(Demo — RSVP không được lưu thật)</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleRsvp} className="space-y-6 bg-white/[0.03] backdrop-blur-md p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-[2px] opacity-40 ml-1 text-white">Họ & Tên *</label>
                                <Input placeholder="Tên của bạn..." value={guestName} onChange={e => setGuestName(e.target.value)}
                                    className="h-12 bg-white/5 rounded-2xl text-sm text-white border-white/10 focus:border-purple-500/50 placeholder:text-white/20" />
                            </div>
                            <div className="flex gap-3">
                                <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setAttending(true)}
                                    className="flex-1 py-4 rounded-2xl border transition-all text-xs font-bold uppercase tracking-widest text-white/50"
                                    style={{ backgroundColor: attending === true ? theme.primaryColor : 'transparent', borderColor: attending === true ? theme.primaryColor : 'rgba(255,255,255,0.1)', color: attending === true ? 'white' : undefined }}>
                                    Sẽ tham dự
                                </motion.button>
                                <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setAttending(false)}
                                    className="flex-1 py-4 rounded-2xl border transition-all text-xs font-bold uppercase tracking-widest"
                                    style={{ backgroundColor: attending === false ? '#ef4444' : 'transparent', borderColor: attending === false ? '#ef4444' : 'rgba(255,255,255,0.1)', color: attending === false ? 'white' : 'rgba(255,255,255,0.4)' }}>
                                    Bận mất rồi
                                </motion.button>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase tracking-[2px] opacity-40 ml-1 text-white">Lời chúc (tùy chọn)</label>
                                <Textarea placeholder="Vài lời gửi gắm..." value={message} onChange={e => setMessage(e.target.value)}
                                    rows={3} className="bg-white/5 rounded-2xl text-sm text-white border-white/10 p-4 resize-none placeholder:text-white/20" />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl font-bold uppercase tracking-[4px] shadow-2xl transition-transform active:scale-95"
                                style={{ backgroundColor: theme.primaryColor, color: 'white', opacity: loading ? 0.7 : 1 }}>
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Gửi Phản Hồi'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="py-8 px-6 text-center" style={{ background: '#050505' }}>
                <Heart className="w-6 h-6 mx-auto mb-3" style={{ fill: theme.primaryColor, color: theme.primaryColor }} />
                <p className="text-white/30 text-xs">
                    Tạo thiệp cưới của bạn tại{' '}
                    <Link href="/" className="hover:underline" style={{ color: theme.primaryColor }}>WeddingCard.vn</Link>
                </p>
                <Link href="/register">
                    <Button className="mt-4 h-10 px-6 text-sm font-bold rounded-full" style={{ backgroundColor: theme.primaryColor }}>
                        Tạo Thiệp Của Bạn →
                    </Button>
                </Link>
            </div>
        </div>
    )
}
