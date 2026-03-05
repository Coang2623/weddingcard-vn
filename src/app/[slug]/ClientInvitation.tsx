'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { motion, LayoutGroup } from 'framer-motion'
import { Heart, MapPin, Calendar, Share2, QrCode, MessageSquare, Loader2, Gift, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/lib/toast'
import { createClient } from '@/lib/supabase/client'
import type { InvitationBlock, InvitationTheme } from '@/types'
import { DEFAULT_THEME } from '@/lib/templates'

// ── Premium UI Helpers ──

function seededFloat(seed: number) {
    // Deterministic pseudo-random in [0, 1) — avoids Math.random() during render.
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

const FloatingParticles = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => {
            const x = `${seededFloat(i * 17 + 1) * 100}%`
            const y = `${seededFloat(i * 29 + 2) * 100}%`
            const duration = seededFloat(i * 37 + 3) * 10 + 5
            const delay = seededFloat(i * 41 + 4) * 5
            return (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/40 rounded-full"
                    initial={{ x, y, opacity: 0 }}
                    animate={{ y: ['0%', '100%'], opacity: [0, 1, 0] }}
                    transition={{ duration, repeat: Infinity, ease: 'linear', delay }}
                />
            )
        })}
    </div>
)

const OrnamentDecoration = ({ style }: { style: string }) => {
    if (style === 'minimal') return null;
    return (
        <div className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-multiply">
            {/* Standard floral ornament corners */}
            <img src="/assets/ornament.png" alt="" className="absolute top-4 left-4 w-24 h-24 rotate-[-90deg]" />
            <img src="/assets/ornament.png" alt="" className="absolute top-4 right-4 w-24 h-24" />
            <img src="/assets/ornament.png" alt="" className="absolute bottom-4 left-4 w-24 h-24 rotate-[180deg]" />
            <img src="/assets/ornament.png" alt="" className="absolute bottom-4 right-4 w-24 h-24 rotate-[90deg]" />
        </div>
    )
}

// ── Theme Context ──
export const ThemeContext = createContext<InvitationTheme>(DEFAULT_THEME)
export const useTheme = () => useContext(ThemeContext)

// Style-specific layout wrappers
function themeVars(t: InvitationTheme) {
    return {
        '--p': t.primaryColor,
        '--bg': t.backgroundColor,
        '--text': t.textColor,
        '--sec': t.secondaryColor,
    } as React.CSSProperties
}

// ---- Block Components ----

function HeroBlock({ block }: { block: InvitationBlock }) {
    const { groomName, brideName, weddingDate, subtitle } = block.props as {
        groomName?: string; brideName?: string; weddingDate?: string; subtitle?: string
    }
    const theme = useTheme()
    const isCinematic = theme.style === 'cinematic'
    const isModern = theme.style === 'modern'
    const isTraditional = theme.style === 'traditional'

    return (
        <motion.div
            className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 text-center overflow-hidden"
            style={{
                background: isCinematic
                    ? `linear-gradient(to bottom, #050505, #1a1a1a)`
                    : isModern
                        ? `linear-gradient(135deg, #0f0c29, #302b63, #24243e)`
                        : isTraditional
                            ? `linear-gradient(to bottom, #fdf5e6, #fde8c8)`
                            : `linear-gradient(to bottom, ${theme.secondaryColor}, ${theme.backgroundColor})`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
        >
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'url(/assets/texture.png)', backgroundSize: 'cover' }} />

            {/* Premium Decorations */}
            <OrnamentDecoration style={theme.style} />
            {(isCinematic || isModern) && <FloatingParticles />}

            {/* Style-specific decorations */}
            {isCinematic && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                    <div className="absolute top-2 left-0 right-0 flex justify-center gap-1.5 opacity-20">
                        {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className="w-4 h-3 border border-yellow-400/40 rounded-sm" />
                        ))}
                    </div>
                </>
            )}
            {isModern && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            )}
            {isTraditional && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs tracking-[8px] text-red-700/50 font-bold">
                    ❧ THIỆP CƯỚI ❧
                </div>
            )}

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10"
                style={{ background: theme.primaryColor }} />

            <div className="relative z-10">
                <motion.div
                    className="text-5xl sm:text-6xl mb-6 flex justify-center items-center gap-4"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                >
                    <div className="w-12 h-px bg-current opacity-20" />
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        {isCinematic ? '�️' : isTraditional ? '🏮' : isModern ? '�' : '�️'}
                    </motion.div>
                    <div className="w-12 h-px bg-current opacity-20" />
                </motion.div>

                <motion.p
                    className={`text-[10px] sm:text-xs tracking-[5px] uppercase mb-6 sm:mb-8 font-medium`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ color: isTraditional ? '#c0392b' : `${theme.primaryColor}cc` }}
                >
                    {subtitle || (isCinematic ? 'A Cinematic Wedding Story' : 'Trân trọng kính mời')}
                </motion.p>

                <div className="flex flex-col items-center gap-2 sm:gap-4">
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-7xl font-bold break-words leading-tight"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            fontFamily: `${theme.fontTitle}, serif`,
                            color: (isCinematic || isModern) ? 'white' : theme.textColor,
                            textShadow: (isCinematic || isModern) ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
                        }}
                    >
                        {groomName}
                    </motion.h1>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7, type: 'spring' }}
                        className="my-2"
                    >
                        <Heart
                            className={`w-8 h-8 ${isTraditional ? 'animate-heartbeat text-[#c0392b]' : ''}`}
                            style={{
                                fill: isTraditional ? '#c0392b' : theme.primaryColor,
                                color: isTraditional ? '#c0392b' : theme.primaryColor,
                                filter: (isCinematic || isModern) ? 'drop-shadow(0 0 10px var(--p))' : 'none'
                            }}
                        />
                    </motion.div>

                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-7xl font-bold break-words leading-tight"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                        style={{
                            fontFamily: `${theme.fontTitle}, serif`,
                            color: (isCinematic || isModern) ? 'white' : theme.textColor,
                            textShadow: (isCinematic || isModern) ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
                        }}
                    >
                        {brideName}
                    </motion.h1>
                </div>

                {weddingDate && (
                    <motion.div
                        className="mt-10 sm:mt-12 inline-block px-8 py-3 rounded-full border backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        style={{
                            borderColor: `${theme.primaryColor}30`,
                            background: isCinematic || isModern ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                            color: (isCinematic || isModern) ? 'white' : theme.textColor
                        }}
                    >
                        <p className="text-sm sm:text-base font-medium tracking-[3px] uppercase" style={{ fontFamily: theme.fontBody }}>
                            {new Date(weddingDate).toLocaleDateString('vi-VN', {
                                day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
            >
                <div className="w-6 h-10 border-2 rounded-full flex justify-center p-1.5" style={{ borderColor: `${theme.primaryColor}30` }}>
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: theme.primaryColor }}
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </motion.div>
    )
}

function CountdownBlock({ block }: { block: InvitationBlock }) {
    const targetDate = (block.props as { targetDate?: string }).targetDate || ''
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const theme = useTheme()
    const isDark = theme.style === 'cinematic' || theme.style === 'modern'

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
        <div className="py-12 sm:py-16 px-4 sm:px-6 text-center relative overflow-hidden"
            style={{ background: isDark ? (theme.style === 'cinematic' ? '#0d0d0d' : '#14142b') : theme.backgroundColor }}>

            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'url(/assets/texture.png)', backgroundSize: '200px' }} />

            <motion.p
                className="text-[10px] sm:text-xs tracking-[4px] uppercase mb-8 sm:mb-10 font-medium"
                style={{ color: `${theme.primaryColor}cc` }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
            >
                Đếm ngược đến ngày vui
            </motion.p>

            <div className="flex justify-center gap-3 sm:gap-6 md:gap-10 perspective-1000">
                {[
                    { v: timeLeft.days, l: 'Ngày' },
                    { v: timeLeft.hours, l: 'Giờ' },
                    { v: timeLeft.minutes, l: 'Phút' },
                    { v: timeLeft.seconds, l: 'Giây' },
                ].map((item, i) => (
                    <motion.div
                        key={item.l}
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"
                                style={{ backgroundColor: theme.primaryColor }} />
                            <div className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                                <span className="text-xl sm:text-3xl md:text-4xl font-bold"
                                    style={{ fontFamily: `${theme.fontTitle}, serif`, color: theme.primaryColor }}>
                                    {String(item.v).padStart(2, '0')}
                                </span>
                            </div>
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold tracking-widest mt-3 block uppercase opacity-40"
                            style={{ color: isDark ? 'white' : theme.textColor }}>
                            {item.l}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

function StoryBlock({ block }: { block: InvitationBlock }) {
    const { content } = block.props as { content?: string }
    const theme = useTheme()
    const isDark = theme.style === 'cinematic' || theme.style === 'modern'
    const isTraditional = theme.style === 'traditional'

    return (
        <motion.div
            className="py-16 sm:py-20 px-6 sm:px-12 relative overflow-hidden"
            style={{
                background: isDark
                    ? (theme.style === 'cinematic' ? '#111' : '#1a1a2e')
                    : theme.backgroundColor
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
        >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'url(/assets/texture.png)' }} />

            <div className="max-w-2xl mx-auto relative group">
                <div className="absolute -top-10 -left-10 w-32 h-32 opacity-10 blur-2xl rounded-full" style={{ background: theme.primaryColor }} />

                <div className="text-center mb-8 relative">
                    <OrnamentDecoration style={theme.style} />
                    <h2 className="text-2xl sm:text-3xl font-bold"
                        style={{ fontFamily: `${theme.fontTitle}, serif`, color: isDark ? theme.primaryColor : theme.textColor }}>
                        {theme.style === 'cinematic' ? 'Our Story' : 'Câu Chuyện Tình Yêu'}
                    </h2>
                    <div className="w-16 h-1 mx-auto mt-4 rounded-full" style={{ background: theme.primaryColor }} />
                </div>

                <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-current to-transparent opacity-10"
                        style={{ color: theme.primaryColor }} />
                    <p className="text-sm sm:text-base leading-[1.8] text-center italic font-light px-4"
                        style={{
                            fontFamily: theme.fontBody,
                            color: isDark ? 'rgba(255,255,255,0.7)' : `${theme.textColor}cc`
                        }}>
                        {content || 'Câu chuyện tình yêu của chúng tôi là một hành trình kỳ diệu của định mệnh, nơi sự tình cờ đã biến thành khoảnh khắc mãi mãi.'}
                    </p>
                    <div className="absolute -right-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-current to-transparent opacity-10"
                        style={{ color: theme.primaryColor }} />
                </div>

                <div className="mt-8 flex justify-center text-3xl opacity-20">
                    {isTraditional ? '✿' : '🕊️'}
                </div>
            </div>
        </motion.div>
    )
}

function ScheduleBlock({ block }: { block: InvitationBlock }) {
    const { venue, address, events } = block.props as {
        venue?: string; address?: string; events?: { time: string; title: string }[]
    }
    const eventList = events || []
    const theme = useTheme()
    const isDark = theme.style === 'cinematic' || theme.style === 'modern'
    const bg = isDark ? (theme.style === 'cinematic' ? '#1a1a1a' : '#1a1a2e') : 'white'

    return (
        <motion.div
            className="py-10 px-6"
            style={{ background: bg }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <div className="flex items-center gap-2 justify-center mb-5">
                <Calendar className="w-5 h-5" style={{ color: theme.primaryColor }} />
                <h2 className="text-xl font-semibold" style={{ fontFamily: `${theme.fontTitle}, serif`, color: isDark ? theme.primaryColor : theme.textColor }}>Lịch Trình</h2>
            </div>
            {venue && (
                <div className="flex items-center gap-2 justify-center mb-6 text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : `${theme.textColor}60` }}>
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
                        <span className="text-sm font-semibold w-12 text-right flex-shrink-0" style={{ color: theme.primaryColor }}>{evt.time}</span>
                        <div className="flex flex-col items-center flex-shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: theme.primaryColor }} />
                            {i < eventList.length - 1 && <div className="w-px h-8 mt-1" style={{ background: `${theme.primaryColor}30` }} />}
                        </div>
                        <span className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.6)' : `${theme.textColor}80` }}>{evt.title}</span>
                    </motion.div>
                ))}
            </div>
            {address && (
                <div className="mt-6 p-3 rounded-xl text-center" style={{ background: `${theme.primaryColor}10` }}>
                    <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5"
                        style={{ borderColor: `${theme.primaryColor}30`, color: theme.primaryColor }}
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`)}
                    >
                        <MapPin className="w-3.5 h-3.5" /> Xem bản đồ
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
    const theme = useTheme()
    const isCinematic = theme.style === 'cinematic'
    const isModern = theme.style === 'modern'
    const isDark = isCinematic || isModern

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
        } catch { }
        setLoading(false)
        setSubmitted(true)
        toast.success(attending ? '🎉 Cảm ơn bạn đã xác nhận tham dự!' : 'Cảm ơn bạn đã phản hồi!')
    }

    const cardBg = isDark ? 'rgba(255,255,255,0.05)' : 'white'
    const inputBg = isDark ? 'rgba(255,255,255,0.02)' : '#FDF5F0'

    if (submitted) {
        return (
            <div className="py-16 px-6 text-center" style={{ background: isDark ? '#0a0a0a' : '#FDF5F0' }}>
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-6xl mb-6">
                    {attending ? '🎊' : '💌'}
                </motion.div>
                <h3 className="text-2xl font-bold mb-4"
                    style={{ fontFamily: `${theme.fontTitle}, serif`, color: isDark ? 'white' : theme.textColor }}>
                    {attending ? 'Rất vui được đón tiếp bạn!' : 'Cảm ơn phẩn hồi của bạn!'}
                </h3>
                <p className="text-sm opacity-60" style={{ color: isDark ? 'white' : theme.textColor }}>
                    {attending ? `Hẹn gặp bạn và ${guestCount} người thân tại lễ cưới.` : 'Mọi sự hiện diện tinh thần của bạn đều là món quà quý giá.'}
                </p>
            </div>
        )
    }

    return (
        <div className="py-16 px-6 sm:px-12 relative overflow-hidden"
            style={{ background: isDark ? (theme.style === 'cinematic' ? '#0d0d0d' : '#14142b') : '#fdfbf7' }}>

            <div className="max-w-md mx-auto relative">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 opacity-5 blur-[80px] rounded-full" style={{ background: theme.primaryColor }} />

                <div className="text-center mb-10">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                        <Heart className="w-10 h-10 mx-auto mb-4" style={{ fill: theme.primaryColor, color: theme.primaryColor }} />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 tracking-wide" style={{ fontFamily: `${theme.fontTitle}, serif`, color: isDark ? 'white' : theme.textColor }}>
                        Xác Nhận Tham Dự
                    </h3>
                    {rsvpDeadline && (
                        <div className="inline-block px-3 py-1 rounded-full text-[10px] tracking-[2px] uppercase opacity-40 border"
                            style={{ color: isDark ? 'white' : theme.textColor, borderColor: 'currentColor' }}>
                            Trước {new Date(rsvpDeadline).toLocaleDateString('vi-VN')}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white/[0.03] backdrop-blur-md p-6 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-[2px] opacity-40 ml-1" style={{ color: isDark ? 'white' : theme.textColor }}>Họ & Tên *</label>
                        <Input placeholder="Tên của bạn..." value={guestName} onChange={(e) => setGuestName(e.target.value)}
                            className="h-12 border-white/10 focus:border-primary/50 bg-white/5 rounded-2xl text-sm"
                            style={{ backgroundColor: inputBg, color: isDark ? 'white' : theme.textColor }} />
                    </div>

                    <div className="flex gap-3">
                        <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setAttending(true)}
                            className={`flex-1 py-4 rounded-2xl border transition-all text-xs font-bold uppercase tracking-widest ${attending === true ? 'shadow-lg' : 'opacity-50 hover:opacity-100'}`}
                            style={{
                                backgroundColor: attending === true ? theme.primaryColor : 'transparent',
                                borderColor: attending === true ? theme.primaryColor : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'),
                                color: attending === true ? (isDark ? 'black' : 'white') : (isDark ? 'white' : theme.textColor)
                            }}>
                            Sẽ tham dự
                        </motion.button>
                        <motion.button type="button" whileTap={{ scale: 0.95 }} onClick={() => setAttending(false)}
                            className={`flex-1 py-4 rounded-2xl border transition-all text-xs font-bold uppercase tracking-widest ${attending === false ? 'shadow-lg' : 'opacity-50 hover:opacity-100'}`}
                            style={{
                                backgroundColor: attending === false ? '#f43f5e' : 'transparent',
                                borderColor: attending === false ? '#f43f5e' : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'),
                                color: attending === false ? 'white' : (isDark ? 'white' : theme.textColor)
                            }}>
                            Bận mất rồi
                        </motion.button>
                    </div>

                    {attending && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pt-2">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[2px] opacity-40 ml-1" style={{ color: isDark ? 'white' : theme.textColor }}>Số người tham dự</label>
                                <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-1 border border-white/5" style={{ backgroundColor: inputBg }}>
                                    <button type="button" onClick={() => setGuestCount(String(Math.max(1, parseInt(guestCount) - 1)))} className="w-10 h-10 rounded-xl flex items-center justify-center text-xl opacity-40 hover:opacity-100 transition-opacity" style={{ color: isDark ? 'white' : theme.textColor }}>−</button>
                                    <div className="flex-1 text-center font-bold text-lg" style={{ color: isDark ? 'white' : theme.textColor }}>{guestCount}</div>
                                    <button type="button" onClick={() => setGuestCount(String(Math.min(10, parseInt(guestCount) + 1)))} className="w-10 h-10 rounded-xl flex items-center justify-center text-xl opacity-40 hover:opacity-100 transition-opacity" style={{ color: isDark ? 'white' : theme.textColor }}>+</button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-[2px] opacity-40 ml-1" style={{ color: isDark ? 'white' : theme.textColor }}>Lời chúc (tùy chọn)</label>
                        <Textarea placeholder="Vài lời gửi gắm..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3}
                            className="border-white/10 focus:border-primary/50 bg-white/5 rounded-2xl text-sm p-4 resize-none"
                            style={{ backgroundColor: inputBg, color: isDark ? 'white' : theme.textColor }} />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl font-bold uppercase tracking-[4px] mt-4 shadow-2xl transition-transform active:scale-95"
                        style={{ backgroundColor: theme.primaryColor, color: (isCinematic || isModern) ? 'black' : 'white', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Đang gửi...' : 'Gửi Phản Hồi'}
                    </Button>
                </form>
            </div>
        </div>
    )
}

function GuestbookBlock({ invitationId }: { invitationId: string }) {
    const [author, setAuthor] = useState('')
    const [content, setContent] = useState('')
    const [messages, setMessages] = useState<{ author_name: string; content: string; created_at: string }[]>([])
    const [loading, setLoading] = useState(false)
    const [nowMs, setNowMs] = useState(0)

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

    useEffect(() => {
        const t = setTimeout(() => setNowMs(Date.now()), 0)
        const id = setInterval(() => setNowMs(Date.now()), 60_000)
        return () => {
            clearTimeout(t)
            clearInterval(id)
        }
    }, [])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!author || !content) return

        // Anti-spam checks
        const lastSent = localStorage.getItem('lastMessageTime')
        if (lastSent && Date.now() - parseInt(lastSent) < 30000) {
            toast.error('Vui lòng đợi 30 giây trước khi gửi thêm lời chúc mới.')
            return
        }

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
            localStorage.setItem('lastMessageTime', Date.now().toString())
            toast.success('Lời chúc của bạn đã được gửi! ❤️')
        } catch {
            toast.error('Gửi lời chúc thất bại.')
        }
        setLoading(false)
    }

    const timeAgo = (dateStr: string) => {
        if (!nowMs) return ''
        const diff = nowMs - new Date(dateStr).getTime()
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
                <h3 className="text-xl font-semibold text-[#4A0E0E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Sổ Lưu Bút ❤️
                </h3>
            </div>
            <div className="max-w-sm mx-auto">
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    {messages.map((msg, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#FDF5F0] rounded-xl p-3 border border-[#8B0000]/10">
                            <p className="text-sm text-[#4A0E0E]/70 leading-relaxed">&ldquo;{msg.content}&rdquo;</p>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs font-medium text-[#8B0000]">— {msg.author_name}</span>
                                <span className="text-xs text-[#4A0E0E]/30">{timeAgo(msg.created_at)}</span>
                            </div>
                        </motion.div>
                    ))}
                    {messages.length === 0 && (
                        <p className="text-center text-sm text-[#4A0E0E]/30 py-4">Chưa có lời chúc nào. Hãy là người đầu tiên! 💌</p>
                    )}
                </div>
                <form onSubmit={handleSend} className="space-y-3">
                    <Input placeholder="Tên của bạn" value={author} onChange={(e) => setAuthor(e.target.value)} className="h-10 border-[#8B0000]/20 bg-[#FDF5F0] text-sm" />
                    <Textarea placeholder="Lời chúc từ trái tim bạn..." value={content} onChange={(e) => setContent(e.target.value)} rows={3} className="border-[#8B0000]/20 bg-[#FDF5F0] resize-none text-sm" />
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
    const [touchDeltaX, setTouchDeltaX] = useState(0)
    const [swiping, setSwiping] = useState(false)

    // Initialize shuffled order
    useEffect(() => {
        const t = setTimeout(() => {
            if (images && images.length > 0) {
                setShuffledOrder(images.map((_, i) => i))
            } else {
                setShuffledOrder([])
            }
        }, 0)
        return () => clearTimeout(t)
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
        setTouchDeltaX(0)
        setSwiping(true)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchDeltaX(e.touches[0].clientX - touchStartX.current)
    }

    const handleTouchEnd = () => {
        setSwiping(false)
        if (!images) return
        const threshold = 50
        if (touchDeltaX < -threshold && activeIndex < images.length - 1) {
            setActiveIndex(prev => prev + 1)
        } else if (touchDeltaX > threshold && activeIndex > 0) {
            setActiveIndex(prev => prev - 1)
        }
        setTouchDeltaX(0)
    }

    if (!images || images.length === 0) {
        return (
            <div className="py-8 sm:py-10 px-4 sm:px-6 bg-[#FDF5F0]">
                <h2 className="text-center text-lg sm:text-xl font-semibold text-[#4A0E0E] mb-4 sm:mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Album Ảnh
                </h2>
                <p className="text-center text-sm text-[#4A0E0E]/30">Chưa có ảnh trong album.</p>
            </div>
        )
    }

    return (
        <div className="py-8 sm:py-10 bg-[#FDF5F0]">
            <h2 className="text-center text-lg sm:text-xl font-semibold text-[#4A0E0E] mb-4 sm:mb-5 px-4" style={{ fontFamily: 'Playfair Display, serif' }}>
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
                            transform: `translateX(calc(-${activeIndex * 100}% + ${swiping ? touchDeltaX : 0}px))`,
                            ...(swiping ? { transition: 'none' } : {})
                        }}
                    >
                        {images.map((url, i) => (
                            <div key={i} className="w-full flex-shrink-0 px-8">
                                <div
                                    className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg mx-auto cursor-pointer"
                                    onClick={() => setLightbox(i)}
                                >
                                    <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x800/fdfaf7/c9a96e?text=Opps' }} />
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
                                    ? 'bg-[#8B0000] w-6'
                                    : 'bg-[#8B0000]/25 w-2'
                                    }`}
                            />
                        ))}
                    </div>
                )}

                {/* Counter */}
                <p className="text-center text-xs text-[#4A0E0E]/30 mt-2">
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
                                <div className="aspect-square bg-[#8B0000]/10 h-full w-full">
                                    <img src={images[imgIndex]} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x800/fdfaf7/c9a96e?text=Opps' }} />
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
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x800/fdfaf7/c9a96e?text=Opps' }}
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
                <MapPin className="w-5 h-5 text-[#8B0000]" />
                <h2 className="text-xl font-semibold text-[#4A0E0E]" style={{ fontFamily: 'Playfair Display, serif' }}>Bản Đồ</h2>
            </div>
            {embedUrl ? (
                <div className="max-w-sm mx-auto aspect-video rounded-xl overflow-hidden">
                    <iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen loading="lazy" />
                </div>
            ) : address ? (
                <div className="text-center">
                    <p className="text-sm text-[#4A0E0E]/50 mb-3">{address}</p>
                    <Button variant="outline" size="sm" className="h-9 text-xs border-[#8B0000]/20 text-[#8B0000] gap-1.5"
                        onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`)}
                    >
                        <MapPin className="w-3.5 h-3.5" /> Mở Google Maps
                    </Button>
                </div>
            ) : (
                <p className="text-center text-sm text-[#4A0E0E]/30">Chưa có thông tin bản đồ.</p>
            )}
        </div>
    )
}

function GiftBlock({ block }: { block: InvitationBlock }) {
    const { bankName, bankAccount, bankOwner, note } = block.props as {
        bankName?: string; bankAccount?: string; bankOwner?: string; note?: string
    }
    const theme = useContext(ThemeContext)

    const qrUrl = bankName && bankAccount ? `https://img.vietqr.io/image/${bankName.trim()}-${bankAccount.trim()}-print.png?accountName=${encodeURIComponent(bankOwner || '')}` : null

    return (
        <div className="py-12 px-6" style={{ backgroundColor: theme.backgroundColor }}>
            <div className="flex flex-col items-center justify-center mb-8">
                <Gift className="w-8 h-8 mb-3" style={{ color: theme.primaryColor }} />
                <h2 className="text-2xl font-bold" style={{ fontFamily: `${theme.fontTitle}, serif`, color: theme.textColor }}>Hộp Mừng Cưới</h2>
                <div className="w-12 h-px mt-4" style={{ backgroundColor: theme.primaryColor, opacity: 0.3 }} />
            </div>
            <div className="max-w-md mx-auto text-center">
                {note && <p className="text-sm italic mb-6 leading-relaxed" style={{ color: `${theme.textColor}99`, fontFamily: theme.fontBody }}>&quot;{note}&quot;</p>}

                {bankName && bankAccount ? (
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl border p-6 space-y-4 shadow-sm" style={{ borderColor: `${theme.primaryColor}20` }}>
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: `${theme.textColor}60` }}>{bankName}</p>
                            <p className="text-xl font-bold tracking-wider" style={{ color: theme.primaryColor }}>{bankAccount}</p>
                            {bankOwner && <p className="text-sm font-medium" style={{ color: theme.textColor }}>{bankOwner.toUpperCase()}</p>}
                        </div>

                        {qrUrl && (
                            <div className="mt-6 flex justify-center">
                                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 inline-block">
                                    <img src={qrUrl} alt="QR Code Mừng Cưới" className="w-48 h-48 object-contain" />
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t mt-4" style={{ borderColor: `${theme.primaryColor}10` }}>
                            <Button variant="outline" size="sm" className="h-10 text-xs px-6 rounded-full transition-all hover:scale-105"
                                style={{ borderColor: `${theme.primaryColor}30`, color: theme.primaryColor, backgroundColor: 'transparent' }}
                                onClick={() => { navigator.clipboard.writeText(bankAccount || ''); toast.success('Đã sao chép số tài khoản!') }}
                            >
                                Sao chép STK
                            </Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm" style={{ color: `${theme.textColor}50` }}>Thông tin tài khoản chưa được thiết lập.</p>
                )}
            </div>
        </div>
    )
}

function TextBlock({ block }: { block: InvitationBlock }) {
    const { content, title } = block.props as { content?: string; title?: string }
    return (
        <div className="py-8 px-6 bg-[#FDF5F0]">
            <div className="max-w-sm mx-auto text-center">
                <Type className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                {title && <h3 className="text-lg font-semibold text-[#4A0E0E] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h3>}
                <p className="text-sm text-[#4A0E0E]/60 leading-relaxed whitespace-pre-wrap">{content || ''}</p>
            </div>
        </div>
    )
}

// ---- Dynamic Block Renderer ----
export function RenderBlock({ block, invitationId }: { block: InvitationBlock; invitationId: string }) {
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

export default function ClientInvitation({ slug }: { slug: string }) {

    const [blocks, setBlocks] = useState<InvitationBlock[]>([])
    const [theme, setTheme] = useState<import('@/types').InvitationTheme>(DEFAULT_THEME)
    const [invitationId, setInvitationId] = useState<string>('')
    const [invTitle, setInvTitle] = useState('')
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        async function loadInvitation() {
            try {
                const supabase = createClient()

                const { data: invData, error: invError } = await supabase
                    .from('invitations')
                    .select('*')
                    .eq('slug', slug)
                    .single()

                if (invError || !invData) {
                    setNotFound(true)
                    return
                }

                setInvitationId(invData.id)
                setInvTitle(invData.title)

                const { data: designData } = await supabase
                    .from('invitation_designs')
                    .select('*')
                    .eq('invitation_id', invData.id)
                    .single()

                if (designData?.theme) {
                    setTheme(designData.theme as import('@/types').InvitationTheme)
                }

                if (designData?.blocks) {
                    const blockArr = designData.blocks as InvitationBlock[]
                    const sorted = [...blockArr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    setBlocks(sorted)
                }
            } catch (err) {
                console.error('Load invitation error:', err)
                setNotFound(true)
            } finally {
                setLoading(false)
            }
        }
        loadInvitation()

        // Increment view count
        const incrementView = async () => {
            const supabase = createClient()
            await supabase.rpc('increment_view_count', { invitation_slug: slug })
        }
        incrementView()
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
            <div className="min-h-screen flex items-center justify-center" style={{ background: DEFAULT_THEME.backgroundColor }}>
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: DEFAULT_THEME.primaryColor }} />
                    <p className="text-sm" style={{ color: `${DEFAULT_THEME.textColor}60` }}>Đang tải thiệp...</p>
                </div>
            </div>
        )
    }

    if (notFound) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDF5F0]">
                <div className="text-center px-6">
                    <div className="text-5xl mb-4">💌</div>
                    <h1 className="text-2xl font-bold text-[#4A0E0E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Không tìm thấy thiệp
                    </h1>
                    <p className="text-sm text-[#4A0E0E]/50 mb-6">Thiệp này không tồn tại hoặc đã bị xóa.</p>
                    <Button asChild className="bg-[#8B0000] hover:bg-[#A61C00] text-white">
                        <Link href="/">Về trang chủ</Link>
                    </Button>
                </div>
            </div>
        )
    }

    const isDarkTheme = theme.style === 'cinematic' || theme.style === 'modern'
    const outerBg = isDarkTheme ? '#0a0a0a' : `${theme.secondaryColor}30`

    return (
        <ThemeContext.Provider value={theme}>
            <div className="min-h-screen" style={{ background: outerBg }}>
                <div className="w-full max-w-2xl mx-auto min-h-screen sm:shadow-2xl sm:my-0"
                    style={{ background: isDarkTheme ? '#111' : 'white' }}>
                    {blocks.map((block) => (
                        <RenderBlock key={block.id} block={block} invitationId={invitationId} />
                    ))}

                    {blocks.length > 0 && blocks[0].type === 'hero' && (
                        <div className="flex justify-center gap-3 -mt-4 mb-4 relative z-10">
                            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs"
                                style={{ borderColor: `${theme.primaryColor}30`, color: theme.primaryColor }}
                                onClick={handleShare}>
                                <Share2 className="w-3.5 h-3.5" /> Chia sẻ
                            </Button>
                            <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs"
                                style={{ borderColor: `${theme.primaryColor}30`, color: theme.primaryColor }}>
                                <QrCode className="w-3.5 h-3.5" /> QR Code
                            </Button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="py-8 px-6 text-center" style={{ background: isDarkTheme ? '#050505' : theme.textColor }}>
                        <Heart className="w-6 h-6 mx-auto mb-3 animate-heartbeat"
                            style={{ fill: theme.primaryColor, color: theme.primaryColor }} />
                        <p className="text-white/50 text-xs">
                            Made with ❤️ by{' '}
                            <Link href="/" className="hover:underline" style={{ color: theme.primaryColor }}>WeddingCard.vn</Link>
                        </p>
                        <p className="text-white/30 text-xs mt-1">
                            <Link href="/" className="hover:text-white/60 transition-colors">Tạo thiệp cưới của bạn →</Link>
                        </p>
                    </div>
                </div>
            </div>
        </ThemeContext.Provider>
    )
}
