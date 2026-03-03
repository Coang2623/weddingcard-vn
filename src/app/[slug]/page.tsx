'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { motion, LayoutGroup } from 'framer-motion'
import { Heart, MapPin, Calendar, Share2, QrCode, MessageSquare, Loader2, Gift, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { InvitationBlock } from '@/types'

// ---- Block Components ----

function HeroBlock({ block }: { block: InvitationBlock }) {
    const { groomName, brideName, weddingDate, subtitle } = block.props as {
        groomName?: string; brideName?: string; weddingDate?: string; subtitle?: string
    }
    return (
        <motion.div
            className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 text-center bg-gradient-to-b from-[#f5e6d3] via-[#fdfaf7] to-[#fdfaf7] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-[#c9a96e]/10 blur-2xl" />
            <motion.div
                className="text-4xl sm:text-5xl mb-4"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                💐
            </motion.div>
            <p className="text-[10px] sm:text-xs tracking-widest text-[#c9a96e]/60 uppercase mb-3 sm:mb-4">
                {subtitle || 'Trân trọng kính mời'}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2c1810] mb-1 break-words" style={{ fontFamily: 'Playfair Display, serif' }}>
                {groomName || 'Chú Rể'}
            </h1>
            <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
                <div className="w-8 sm:w-12 h-px bg-[#c9a96e]/30" />
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#c9a96e] fill-[#c9a96e] animate-heartbeat" />
                <div className="w-8 sm:w-12 h-px bg-[#c9a96e]/30" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2c1810] break-words" style={{ fontFamily: 'Playfair Display, serif' }}>
                {brideName || 'Cô Dâu'}
            </h1>
            {weddingDate && (
                <p className="mt-3 sm:mt-4 text-[#c9a96e] font-medium text-base sm:text-lg">
                    {new Date(weddingDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
            )}
        </motion.div>
    )
}

function CountdownBlock({ block }: { block: InvitationBlock }) {
    const targetDate = (block.props as { targetDate?: string }).targetDate || ''
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        if (!targetDate) return
        const target = new Date(targetDate).getTime()
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
    }, [targetDate])

    return (
        <div className="py-8 sm:py-12 px-4 sm:px-6 bg-[#2c1810] text-white text-center">
            <p className="text-[10px] sm:text-xs tracking-widest text-[#c9a96e]/70 uppercase mb-4 sm:mb-6">Đếm ngược đến ngày vui</p>
            <div className="flex justify-center gap-2 sm:gap-4 md:gap-8">
                {[
                    { v: timeLeft.days, l: 'Ngày' },
                    { v: timeLeft.hours, l: 'Giờ' },
                    { v: timeLeft.minutes, l: 'Phút' },
                    { v: timeLeft.seconds, l: 'Giây' },
                ].map((item) => (
                    <div key={item.l} className="text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center bg-white/10 rounded-xl sm:rounded-2xl mb-1 sm:mb-2">
                            <span className="text-lg sm:text-2xl md:text-3xl font-bold text-[#c9a96e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                                {String(item.v).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-white/40">{item.l}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function StoryBlock({ block }: { block: InvitationBlock }) {
    const { content } = block.props as { content?: string }
    return (
        <motion.div
            className="py-8 sm:py-10 px-4 sm:px-6 bg-[#fdfaf7]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <h2 className="text-center text-lg sm:text-xl font-semibold text-[#2c1810] mb-4 sm:mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
                Câu Chuyện Của Chúng Tôi
            </h2>
            <p className="text-xs sm:text-sm text-[#2c1810]/60 leading-relaxed text-center whitespace-pre-wrap">
                {content || 'Chưa có nội dung câu chuyện...'}
            </p>
        </motion.div>
    )
}

function ScheduleBlock({ block }: { block: InvitationBlock }) {
    const { venue, address, events } = block.props as {
        venue?: string; address?: string; events?: { time: string; title: string }[]
    }
    const eventList = events || []

    return (
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
            {venue && (
                <div className="flex items-center gap-2 justify-center mb-6 text-sm text-[#2c1810]/50">
                    <MapPin className="w-4 h-4" />
                    <span>{venue}</span>
                </div>
            )}
            <div className="space-y-4 max-w-xs mx-auto">
                {eventList.map((evt, i) => (
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
                            {i < eventList.length - 1 && <div className="w-px h-8 bg-[#c9a96e]/20 mt-1" />}
                        </div>
                        <span className="text-sm text-[#2c1810]/70">{evt.title}</span>
                    </motion.div>
                ))}
            </div>
            {address && (
                <div className="mt-6 p-3 bg-[#fdfaf7] rounded-xl text-center">
                    <Button variant="outline" size="sm" className="h-9 text-xs border-[#c9a96e]/20 text-[#c9a96e] gap-1.5"
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`)}
                    >
                        <MapPin className="w-3.5 h-3.5" />
                        Xem bản đồ
                    </Button>
                </div>
            )}
        </motion.div>
    )
}

function RSVPBlock({ block, invitationId }: { block: InvitationBlock; invitationId: string }) {
    const { rsvpDeadline } = block.props as { rsvpDeadline?: string }
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
        try {
            const supabase = createClient()
            await supabase.from('rsvps').insert({
                invitation_id: invitationId,
                guest_name: guestName,
                attending,
                guest_count: attending ? parseInt(guestCount) : 0,
                message: message || null,
            })
        } catch {
            // silently handle - still show success to guest
        }
        setLoading(false)
        setSubmitted(true)
        toast.success(attending ? '🎉 Cảm ơn bạn đã xác nhận tham dự!' : 'Cảm ơn bạn đã phản hồi!')
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
                {rsvpDeadline && (
                    <p className="text-sm text-[#2c1810]/50 mt-1">
                        Vui lòng xác nhận trước ngày {new Date(rsvpDeadline).toLocaleDateString('vi-VN')}
                    </p>
                )}
            </div>
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
                <Input placeholder="Tên của bạn *" value={guestName} onChange={(e) => setGuestName(e.target.value)} className="h-11 border-[#c9a96e]/20 focus:border-[#c9a96e] bg-white" />
                <div className="flex gap-3">
                    <button type="button" onClick={() => setAttending(true)} className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${attending === true ? 'border-[#c9a96e] bg-[#c9a96e] text-white' : 'border-[#c9a96e]/20 text-[#2c1810]/60 hover:border-[#c9a96e]/50'}`}>
                        ✓ Sẽ tham dự
                    </button>
                    <button type="button" onClick={() => setAttending(false)} className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${attending === false ? 'border-rose-400 bg-rose-50 text-rose-600' : 'border-[#c9a96e]/20 text-[#2c1810]/60 hover:border-rose-300'}`}>
                        ✗ Không thể tham dự
                    </button>
                </div>
                {attending && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
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
                <Textarea placeholder="Lời chúc hoặc yêu cầu đặc biệt (tùy chọn)" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="border-[#c9a96e]/20 focus:border-[#c9a96e] bg-white resize-none text-sm" />
                <Button type="submit" disabled={loading} className="w-full h-11 bg-[#c9a96e] hover:bg-[#b8925a] text-white font-medium shadow-lg shadow-[#c9a96e]/30">
                    {loading ? 'Đang gửi...' : 'Gửi Xác Nhận'}
                </Button>
            </form>
        </div>
    )
}

function GuestbookBlock({ invitationId }: { invitationId: string }) {
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [messages, setMessages] = useState<{ author_name: string; content: string; created_at: string }[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function loadMessages() {
            const supabase = createClient()
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('invitation_id', invitationId)
                .order('created_at', { ascending: false })
                .limit(20)
            if (data) setMessages(data)
        }
        loadMessages()
    }, [invitationId])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!author || !content) return
        setLoading(true)
        try {
            const supabase = createClient()
            await supabase.from('messages').insert({
                invitation_id: invitationId,
                author_name: author,
                content,
            })
            setMessages([{ author_name: author, content, created_at: new Date().toISOString() }, ...messages])
            setAuthor('')
            setContent('')
            toast.success('Lời chúc của bạn đã được gửi! ❤️')
        } catch {
            toast.error('Gửi lời chúc thất bại.')
        }
        setLoading(false)
    }

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'Vừa xong'
        if (mins < 60) return `${mins} phút trước`
        const hours = Math.floor(mins / 60)
        if (hours < 24) return `${hours} giờ trước`
        return `${Math.floor(hours / 24)} ngày trước`
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
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#fdfaf7] rounded-xl p-3 border border-[#c9a96e]/10">
                            <p className="text-sm text-[#2c1810]/70 leading-relaxed">&ldquo;{msg.content}&rdquo;</p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs font-medium text-[#c9a96e]">— {msg.author_name}</span>
                                <span className="text-xs text-[#2c1810]/30">{timeAgo(msg.created_at)}</span>
                            </div>
                        </motion.div>
                    ))}
                    {messages.length === 0 && (
                        <p className="text-center text-sm text-[#2c1810]/30 py-4">Chưa có lời chúc nào. Hãy là người đầu tiên! 💌</p>
                    )}
                </div>
                <form onSubmit={handleSend} className="space-y-3">
                    <Input placeholder="Tên của bạn" value={author} onChange={(e) => setAuthor(e.target.value)} className="h-10 border-[#c9a96e]/20 bg-[#fdfaf7] text-sm" />
                    <Textarea placeholder="Lời chúc từ trái tim bạn..." value={content} onChange={(e) => setContent(e.target.value)} rows={3} className="border-[#c9a96e]/20 bg-[#fdfaf7] resize-none text-sm" />
                    <Button type="submit" disabled={loading} size="sm" className="w-full bg-pink-400 hover:bg-pink-500 text-white text-sm h-10">
                        {loading ? 'Đang gửi...' : '💌 Gửi Lời Chúc'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

function GalleryBlock({ block }: { block: InvitationBlock }) {
    const { images } = block.props as { images?: string[] }
    const [activeIndex, setActiveIndex] = useState(0)
    const [lightbox, setLightbox] = useState<number | null>(null)
    const [shuffledOrder, setShuffledOrder] = useState<number[]>([])
    const touchStartX = useRef(0)
    const touchDeltaX = useRef(0)
    const [swiping, setSwiping] = useState(false)

    // Initialize shuffled order
    useEffect(() => {
        if (images && images.length > 0) {
            setShuffledOrder(images.map((_, i) => i))
        }
    }, [images])

    // Desktop: auto-shuffle every 5s
    useEffect(() => {
        if (!images || images.length <= 1) return
        const interval = setInterval(() => {
            setShuffledOrder(prev => {
                const arr = [...prev]
                // Swap the large image (index 0) with a random small image (index > 0)
                const swapIdx = Math.floor(Math.random() * (arr.length - 1)) + 1
                    ;[arr[0], arr[swapIdx]] = [arr[swapIdx], arr[0]]
                return arr
            })
        }, 5000)
        return () => clearInterval(interval)
    }, [images])

    // Mobile: touch handlers for swipe
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchDeltaX.current = 0
        setSwiping(true)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        touchDeltaX.current = e.touches[0].clientX - touchStartX.current
    }

    const handleTouchEnd = () => {
        setSwiping(false)
        if (!images) return
        const threshold = 50
        if (touchDeltaX.current < -threshold && activeIndex < images.length - 1) {
            setActiveIndex(prev => prev + 1)
        } else if (touchDeltaX.current > threshold && activeIndex > 0) {
            setActiveIndex(prev => prev - 1)
        }
        touchDeltaX.current = 0
    }

    if (!images || images.length === 0) {
        return (
            <div className="py-8 sm:py-10 px-4 sm:px-6 bg-[#fdfaf7]">
                <h2 className="text-center text-lg sm:text-xl font-semibold text-[#2c1810] mb-4 sm:mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Album Ảnh
                </h2>
                <p className="text-center text-sm text-[#2c1810]/30">Chưa có ảnh trong album.</p>
            </div>
        )
    }

    return (
        <div className="py-8 sm:py-10 bg-[#fdfaf7]">
            <h2 className="text-center text-lg sm:text-xl font-semibold text-[#2c1810] mb-4 sm:mb-5 px-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Album Ảnh
            </h2>

            {/* ===== Mobile: Single centered swipeable slide ===== */}
            <div className="sm:hidden">
                <div
                    className="relative overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className="flex transition-transform duration-300 ease-out"
                        style={{
                            transform: `translateX(calc(-${activeIndex * 100}% + ${swiping ? touchDeltaX.current : 0}px))`,
                            ...(swiping ? { transition: 'none' } : {})
                        }}
                    >
                        {images.map((url, i) => (
                            <div key={i} className="w-full flex-shrink-0 px-8">
                                <div
                                    className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg mx-auto cursor-pointer"
                                    onClick={() => setLightbox(i)}
                                >
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dot indicators */}
                {images.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex
                                    ? 'bg-[#c9a96e] w-6'
                                    : 'bg-[#c9a96e]/25 w-2'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Counter */}
                <p className="text-center text-xs text-[#2c1810]/30 mt-2">
                    {activeIndex + 1} / {images.length}
                </p>
            </div>

            {/* ===== Desktop: Grid with auto-shuffle ===== */}
            <div className="hidden sm:block max-w-lg mx-auto px-6">
                <LayoutGroup>
                    <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' :
                        images.length === 2 ? 'grid-cols-2' :
                            images.length === 4 ? 'grid-cols-2' :
                                'grid-cols-3'
                        }`}>
                        {shuffledOrder.map((imgIndex, i) => (
                            <motion.div
                                key={imgIndex}
                                layout
                                layoutId={`gallery-img-${imgIndex}`}
                                className={`rounded-xl overflow-hidden shadow-sm cursor-pointer ${images.length >= 3 && i === 0 ? 'col-span-2 row-span-2' : ''
                                    }`}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setLightbox(imgIndex)}
                            >
                                <div className="aspect-square bg-[#c9a96e]/10 h-full w-full">
                                    <img src={images[imgIndex]} alt="" className="w-full h-full object-cover" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </LayoutGroup>
            </div>

            {/* ===== Lightbox ===== */}
            {lightbox !== null && (
                <motion.div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white z-50"
                        onClick={() => setLightbox(null)}
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <motion.img
                        key={lightbox}
                        src={images[lightbox]}
                        alt=""
                        className="max-w-full max-h-[85vh] object-contain rounded-lg"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {images.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl"
                                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length) }}
                            >
                                ‹
                            </button>
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl"
                                onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length) }}
                            >
                                ›
                            </button>
                        </>
                    )}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
                        {lightbox + 1} / {images.length}
                    </div>
                </motion.div>
            )}
        </div>
    )
}

function MapBlock({ block }: { block: InvitationBlock }) {
    const { address, embedUrl } = block.props as { address?: string; embedUrl?: string }
    return (
        <div className="py-10 px-6 bg-white">
            <div className="flex items-center gap-2 justify-center mb-5">
                <MapPin className="w-5 h-5 text-[#c9a96e]" />
                <h2 className="text-xl font-semibold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Bản Đồ</h2>
            </div>
            {embedUrl ? (
                <div className="max-w-sm mx-auto aspect-video rounded-xl overflow-hidden">
                    <iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen loading="lazy" />
                </div>
            ) : address ? (
                <div className="text-center">
                    <p className="text-sm text-[#2c1810]/50 mb-3">{address}</p>
                    <Button variant="outline" size="sm" className="h-9 text-xs border-[#c9a96e]/20 text-[#c9a96e] gap-1.5"
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`)}
                    >
                        <MapPin className="w-3.5 h-3.5" /> Mở Google Maps
                    </Button>
                </div>
            ) : (
                <p className="text-center text-sm text-[#2c1810]/30">Chưa có thông tin bản đồ.</p>
            )}
        </div>
    )
}

function GiftBlock({ block }: { block: InvitationBlock }) {
    const { bankName, bankAccount, bankOwner, note } = block.props as {
        bankName?: string; bankAccount?: string; bankOwner?: string; note?: string
    }
    return (
        <div className="py-10 px-6 bg-[#fdfaf7]">
            <div className="flex items-center gap-2 justify-center mb-5">
                <Gift className="w-5 h-5 text-yellow-500" />
                <h2 className="text-xl font-semibold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>Mừng Cưới</h2>
            </div>
            <div className="max-w-sm mx-auto text-center">
                {note && <p className="text-sm text-[#2c1810]/60 mb-4">{note}</p>}
                {bankName && (
                    <div className="bg-white rounded-xl border border-[#c9a96e]/10 p-4 space-y-2">
                        <p className="text-sm font-medium text-[#2c1810]">{bankName}</p>
                        <p className="text-lg font-bold text-[#c9a96e]">{bankAccount}</p>
                        {bankOwner && <p className="text-sm text-[#2c1810]/50">{bankOwner}</p>}
                        <Button variant="outline" size="sm" className="text-xs border-[#c9a96e]/20 text-[#c9a96e]"
                            onClick={() => { navigator.clipboard.writeText(bankAccount || ''); toast.success('Đã sao chép số tài khoản!') }}
                        >
                            Sao chép STK
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

function TextBlock({ block }: { block: InvitationBlock }) {
    const { content, title } = block.props as { content?: string; title?: string }
    return (
        <div className="py-8 px-6 bg-[#fdfaf7]">
            <div className="max-w-sm mx-auto text-center">
                <Type className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                {title && <h3 className="text-lg font-semibold text-[#2c1810] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h3>}
                <p className="text-sm text-[#2c1810]/60 leading-relaxed whitespace-pre-wrap">{content || ''}</p>
            </div>
        </div>
    )
}

// ---- Dynamic Block Renderer ----
function RenderBlock({ block, invitationId }: { block: InvitationBlock; invitationId: string }) {
    switch (block.type) {
        case 'hero': return <HeroBlock block={block} />
        case 'countdown': return <CountdownBlock block={block} />
        case 'story': return <StoryBlock block={block} />
        case 'gallery': return <GalleryBlock block={block} />
        case 'schedule': return <ScheduleBlock block={block} />
        case 'rsvp': return <RSVPBlock block={block} invitationId={invitationId} />
        case 'map': return <MapBlock block={block} />
        case 'guestbook': return <GuestbookBlock invitationId={invitationId} />
        case 'gift': return <GiftBlock block={block} />
        case 'text': return <TextBlock block={block} />
        default: return null
    }
}

// ---- Main Page ----

export default function InvitationPublicPage() {
    const params = useParams()
    const slug = params.slug as string

    const [blocks, setBlocks] = useState<InvitationBlock[]>([])
    const [invitationId, setInvitationId] = useState<string>('')
    const [invTitle, setInvTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        async function loadInvitation() {
            try {
                const supabase = createClient()

                // First get the invitation
                const { data: invData, error: invError } = await supabase
                    .from('invitations')
                    .select('*')
                    .eq('slug', slug)
                    .single()

                if (invError || !invData) {
                    console.error('Invitation not found:', invError)
                    setNotFound(true)
                    return
                }

                setInvitationId(invData.id)
                setInvTitle(invData.title)

                // Then get the design separately
                const { data: designData, error: designError } = await supabase
                    .from('invitation_designs')
                    .select('*')
                    .eq('invitation_id', invData.id)
                    .single()

                if (designError) {
                    console.error('Design not found:', designError)
                }

                if (designData?.blocks) {
                    const blockArr = designData.blocks as InvitationBlock[]
                    const sorted = [...blockArr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    setBlocks(sorted)
                    console.log('Loaded blocks:', sorted.map(b => `${b.order}: ${b.type}`))
                }
            } catch (err) {
                console.error('Load invitation error:', err)
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }
        loadInvitation()
    }, [slug])

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({ title: invTitle, url: window.location.href })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success('Đã sao chép link thiệp!')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#c9a96e] mx-auto mb-4" />
                    <p className="text-sm text-[#2c1810]/50">Đang tải thiệp...</p>
                </div>
            </div>
        )
    }

    if (notFound) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfaf7]">
                <div className="text-center px-6">
                    <div className="text-5xl mb-4">💌</div>
                    <h1 className="text-2xl font-bold text-[#2c1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Không tìm thấy thiệp
                    </h1>
                    <p className="text-sm text-[#2c1810]/50 mb-6">Thiệp này không tồn tại hoặc đã bị xóa.</p>
                    <Button asChild className="bg-[#c9a96e] hover:bg-[#b8925a] text-white">
                        <a href="/">Về trang chủ</a>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f5e6d3]/30 via-[#fdfaf7] to-[#f5e6d3]/20">
            <div className="w-full max-w-2xl mx-auto min-h-screen bg-white sm:shadow-2xl sm:my-0">
                {/* Render all blocks in order */}
                {blocks.map((block) => (
                    <RenderBlock key={block.id} block={block} invitationId={invitationId} />
                ))}

                {/* Share buttons after the first Hero block */}
                {blocks.length > 0 && blocks[0].type === 'hero' && (
                    <div className="flex justify-center gap-3 -mt-4 mb-4 relative z-10">
                        <Button variant="outline" size="sm" className="h-9 gap-1.5 border-[#c9a96e]/20 text-[#c9a96e] hover:bg-[#c9a96e]/5 text-xs" onClick={handleShare}>
                            <Share2 className="w-3.5 h-3.5" /> Chia sẻ
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 gap-1.5 border-[#c9a96e]/20 text-[#c9a96e] hover:bg-[#c9a96e]/5 text-xs">
                            <QrCode className="w-3.5 h-3.5" /> QR Code
                        </Button>
                    </div>
                )}

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
        </div>
    )
}
