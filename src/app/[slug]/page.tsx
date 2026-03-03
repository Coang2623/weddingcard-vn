'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, MapPin, Calendar, Share2, QrCode, Users, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

// Mock invitation data for demo
const MOCK_INVITATION = {
    slug: 'minh-anh-quang-huy',
    title: 'Minh Anh & Quang Huy',
    groom: 'Quang Huy',
    bride: 'Minh Anh',
    date: '2025-12-12',
    venue: 'Nhà Hàng Tiệc Cưới The Grand Palace',
    address: '123 Đường Trần Hưng Đạo, Quận 1, TP.HCM',
    story: 'Chúng tôi gặp nhau trong một buổi chiều mùa thu năm 2020. Từ hai người xa lạ, chúng tôi dần trở thành những người bạn đồng hành không thể thiếu trong cuộc sống của nhau. Và hôm nay, chúng tôi xin trân trọng mời bạn chứng kiến khoảnh khắc đặc biệt nhất của đời mình...',
    events: [
        { time: '10:00', title: 'Đón khách & Chụp hình kỷ niệm' },
        { time: '11:00', title: 'Lễ Cưới chính thức' },
        { time: '12:00', title: 'Tiệc Buffet' },
        { time: '14:00', title: 'Cắt bánh cưới' },
    ],
    messages: [
        { author: 'Chị Thu', content: 'Chúc mừng hai bạn! Sống vui, sống khoẻ nhé! 🎉', time: '2 giờ trước' },
        { author: 'Anh Minh', content: 'Congratulations! Wishing you both a lifetime of happiness! ❤️', time: '3 giờ trước' },
        { author: 'Nhóm lớp 12A', content: 'Cả nhóm chúc mừng đám cưới! Hạnh phúc mãi mãi nha! 🌸', time: '5 giờ trước' },
    ],
}

function CountdownBlock({ date }: { date: string }) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const target = new Date(date).getTime()
        const calc = () => {
            const diff = Math.max(0, target - Date.now())
            setTimeLeft({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            })
        }
        calc()
        const interval = setInterval(calc, 1000)
        return () => clearInterval(interval)
    }, [date])

    return (
        <div className="py-12 px-6 bg-[#2c1810] text-white text-center">
            <p className="text-xs tracking-widest text-[#c9a96e]/70 uppercase mb-6">Đếm ngược đến ngày vui</p>
            <div className="flex justify-center gap-4 sm:gap-8">
                {[
                    { v: timeLeft.days, l: 'Ngày' },
                    { v: timeLeft.hours, l: 'Giờ' },
                    { v: timeLeft.minutes, l: 'Phút' },
                    { v: timeLeft.seconds, l: 'Giây' },
                ].map((item) => (
                    <motion.div
                        key={item.l}
                        className="text-center"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white/10 rounded-2xl mb-2">
                            <span className="text-2xl sm:text-3xl font-bold text-[#c9a96e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {String(item.v).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-xs text-white/40">{item.l}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

function RSVPBlock({ invitationId }: { invitationId: string }) {
    const [guestName, setGuestName] = useState('')
    const [attending, setAttending] = useState<boolean | null>(null)
    const [guestCount, setGuestCount] = useState('1')
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!guestName || attending === null) {
            toast.error('Vui lòng điền tên và xác nhận tham dự')
            return
        }
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        setLoading(false)
        setSubmitted(true)
        toast.success(attending ? '🎉 Cảm ơn bạn đã xác nhận tham dự!' : 'Cảm ơn bạn đã phản hồi!')
        void invitationId
    }

    if (submitted) {
        return (
            <div className="py-12 px-6 bg-[#fdfaf7] text-center">
                <div className="text-5xl mb-4">{attending ? '🎊' : '🌸'}</div>
                <h3 className="text-xl font-semibold text-[#2c1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {attending ? 'Hẹn gặp bạn tại lễ cưới!' : 'Cảm ơn bạn đã phản hồi!'}
                </h3>
                <p className="text-sm text-[#2c1810]/50">
                    {attending ? `Chúng tôi rất vui khi được đón bạn và ${guestCount} người thân.` : 'Chúng tôi hiểu và mong sẽ gặp lại bạn trong tương lai!'}
                </p>
            </div>
        )
    }

    return (
        <div className="py-10 px-6 bg-[#fdfaf7]">
            <div className="text-center mb-6">
                <Heart className="w-8 h-8 text-[#c9a96e] fill-[#c9a96e] mx-auto mb-3 animate-heartbeat" />
                <h3 className="text-xl font-semibold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Xác Nhận Tham Dự
                </h3>
                <p className="text-sm text-[#2c1810]/50 mt-1">Vui lòng xác nhận trước ngày 05/12/2025</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
                <Input
                    placeholder="Tên của bạn *"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="h-11 border-[#c9a96e]/20 focus:border-[#c9a96e] bg-white"
                />

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => setAttending(true)}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${attending === true
                            ? 'border-[#c9a96e] bg-[#c9a96e] text-white' : 'border-[#c9a96e]/20 text-[#2c1810]/60 hover:border-[#c9a96e]/50'}`}
                    >
                        ✓ Sẽ tham dự
                    </button>
                    <button
                        type="button"
                        onClick={() => setAttending(false)}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${attending === false
                            ? 'border-rose-400 bg-rose-50 text-rose-600' : 'border-[#c9a96e]/20 text-[#2c1810]/60 hover:border-rose-300'}`}
                    >
                        ✗ Không thể tham dự
                    </button>
                </div>

                {attending && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3"
                    >
                        <div>
                            <label className="text-xs text-[#2c1810]/50 mb-1.5 block">Số người tham dự (bao gồm bạn)</label>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={() => setGuestCount(String(Math.max(1, parseInt(guestCount) - 1)))} className="w-10 h-10 rounded-xl border border-[#c9a96e]/20 flex items-center justify-center text-lg text-[#c9a96e]">−</button>
                                <div className="flex-1 h-10 flex items-center justify-center border border-[#c9a96e]/20 rounded-xl font-semibold text-[#2c1810]">{guestCount}</div>
                                <button type="button" onClick={() => setGuestCount(String(Math.min(10, parseInt(guestCount) + 1)))} className="w-10 h-10 rounded-xl border border-[#c9a96e]/20 flex items-center justify-center text-lg text-[#c9a96e]">+</button>
                            </div>
                        </div>
                    </motion.div>
                )}

                <Textarea
                    placeholder="Lời chúc hoặc yêu cầu đặc biệt (tùy chọn)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="border-[#c9a96e]/20 focus:border-[#c9a96e] bg-white resize-none text-sm"
                />

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#c9a96e] hover:bg-[#b8925a] text-white font-medium shadow-lg shadow-[#c9a96e]/30"
                >
                    {loading ? 'Đang gửi...' : 'Gửi Xác Nhận'}
                </Button>
            </form>
        </div>
    )
}

function GuestbookBlock() {
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [messages, setMessages] = useState(MOCK_INVITATION.messages)
    const [loading, setLoading] = useState(false)

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!author || !content) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 600))
        setMessages([{ author, content, time: 'Vừa xong' }, ...messages])
        setAuthor('')
        setContent('')
        setLoading(false)
        toast.success('Lời chúc của bạn đã được gửi! ❤️')
    }

    return (
        <div className="py-10 px-6 bg-white">
            <div className="text-center mb-6">
                <MessageSquare className="w-7 h-7 text-pink-400 mx-auto mb-2" />
                <h3 className="text-xl font-semibold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Sổ Lưu Bút ❤️
                </h3>
            </div>
            <div className="max-w-sm mx-auto">
                {/* Messages list */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#fdfaf7] rounded-xl p-3 border border-[#c9a96e]/10"
                        >
                            <p className="text-sm text-[#2c1810]/70 leading-relaxed">&ldquo;{msg.content}&rdquo;</p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs font-medium text-[#c9a96e]">— {msg.author}</span>
                                <span className="text-xs text-[#2c1810]/30">{msg.time}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
                {/* Send form */}
                <form onSubmit={handleSend} className="space-y-3">
                    <Input
                        placeholder="Tên của bạn"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="h-10 border-[#c9a96e]/20 bg-[#fdfaf7] text-sm"
                    />
                    <Textarea
                        placeholder="Lời chúc từ trái tim bạn..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={3}
                        className="border-[#c9a96e]/20 bg-[#fdfaf7] resize-none text-sm"
                    />
                    <Button type="submit" disabled={loading} size="sm" className="w-full bg-pink-400 hover:bg-pink-500 text-white text-sm h-10">
                        {loading ? 'Đang gửi...' : '💌 Gửi Lời Chúc'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default function InvitationPublicPage() {
    const params = useParams()
    const slug = params.slug as string
    const inv = MOCK_INVITATION

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({ title: inv.title, url: window.location.href })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Đã sao chép link thiệp!')
        }
    }

    return (
        <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl">
            {/* Hero */}
            <motion.div
                className="relative py-16 px-6 text-center bg-gradient-to-b from-[#f5e6d3] via-[#fdfaf7] to-[#fdfaf7] overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-[#c9a96e]/10 blur-2xl" />
                <motion.div
                    className="text-5xl mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                >
                    💐
                </motion.div>
                <p className="text-xs tracking-widest text-[#c9a96e]/60 uppercase mb-4">Trân trọng kính mời</p>
                <h1 className="text-3xl font-bold text-[#2c1810] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {inv.groom}
                </h1>
                <div className="flex items-center justify-center gap-3 my-2">
                    <div className="w-12 h-px bg-[#c9a96e]/30" />
                    <Heart className="w-5 h-5 text-[#c9a96e] fill-[#c9a96e] animate-heartbeat" />
                    <div className="w-12 h-px bg-[#c9a96e]/30" />
                </div>
                <h1 className="text-3xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {inv.bride}
                </h1>
                <p className="mt-4 text-[#c9a96e] font-medium text-lg">
                    {new Date(inv.date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>

                {/* Share & QR buttons */}
                <div className="flex justify-center gap-3 mt-6">
                    <Button variant="outline" size="sm" className="h-9 gap-1.5 border-[#c9a96e]/20 text-[#c9a96e] hover:bg-[#c9a96e]/5 text-xs" onClick={handleShare}>
                        <Share2 className="w-3.5 h-3.5" />
                        Chia sẻ
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 gap-1.5 border-[#c9a96e]/20 text-[#c9a96e] hover:bg-[#c9a96e]/5 text-xs">
                        <QrCode className="w-3.5 h-3.5" />
                        QR Code
                    </Button>
                </div>
            </motion.div>

            {/* Countdown */}
            <CountdownBlock date={inv.date} />

            {/* Story */}
            <motion.div
                className="py-10 px-6 bg-[#fdfaf7]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <h2 className="text-center text-xl font-semibold text-[#2c1810] mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Câu Chuyện Của Chúng Tôi
                </h2>
                <p className="text-sm text-[#2c1810]/60 leading-relaxed text-center whitespace-pre-wrap">{inv.story}</p>
            </motion.div>

            {/* Schedule */}
            <motion.div
                className="py-10 px-6 bg-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-2 justify-center mb-5">
                    <Calendar className="w-5 h-5 text-[#c9a96e]" />
                    <h2 className="text-xl font-semibold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Lịch Trình</h2>
                </div>
                <div className="flex items-center gap-2 justify-center mb-6 text-sm text-[#2c1810]/50">
                    <MapPin className="w-4 h-4" />
                    <span>{inv.venue}</span>
                </div>
                <div className="space-y-4 max-w-xs mx-auto">
                    {inv.events.map((evt, i) => (
                        <motion.div
                            key={i}
                            className="flex items-center gap-4"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <span className="text-sm font-semibold text-[#c9a96e] w-12 text-right flex-shrink-0">{evt.time}</span>
                            <div className="flex flex-col items-center flex-shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#c9a96e]" />
                                {i < inv.events.length - 1 && <div className="w-px h-8 bg-[#c9a96e]/20 mt-1" />}
                            </div>
                            <span className="text-sm text-[#2c1810]/70">{evt.title}</span>
                        </motion.div>
                    ))}
                </div>
                <div className="mt-6 p-3 bg-[#fdfaf7] rounded-xl text-center">
                    <Button variant="outline" size="sm" className="h-9 text-xs border-[#c9a96e]/20 text-[#c9a96e] gap-1.5" onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(inv.address)}`)}>
                        <MapPin className="w-3.5 h-3.5" />
                        Xem bản đồ
                    </Button>
                </div>
            </motion.div>

            {/* RSVP */}
            <RSVPBlock invitationId={slug} />

            {/* Guestbook */}
            <GuestbookBlock />

            {/* Footer */}
            <div className="py-8 px-6 bg-[#2c1810] text-center">
                <Heart className="w-6 h-6 fill-[#c9a96e] text-[#c9a96e] mx-auto mb-3 animate-heartbeat" />
                <p className="text-white/50 text-xs">
                    Made with ❤️ by{' '}
                    <a href="/" className="text-[#c9a96e] hover:underline">WeddingCard.vn</a>
                </p>
                <p className="text-white/30 text-xs mt-1">
                    <a href="/" className="hover:text-[#c9a96e] transition-colors">Tạo thiệp cưới của bạn →</a>
                </p>
            </div>
        </div>
    )
}
