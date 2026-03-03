'use client'

import { useState, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { motion, AnimatePresence } from 'framer-motion'
import {
    GripVertical, Plus, Trash2, Eye, Save, Settings2,
    ChevronDown, ChevronUp, Smartphone, Monitor, ArrowLeft,
    Heart, Image, Calendar, MapPin, Users, MessageSquare, Gift, Timer, Type,
    Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { InvitationBlock, BlockType } from '@/types'
import { BLOCK_TEMPLATES } from '@/lib/templates'
import Link from 'next/link'
import { toast } from 'sonner'

const BLOCK_META: Record<BlockType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    hero: { label: 'Tiêu Đề Chính', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
    countdown: { label: 'Đếm Ngược', icon: Timer, color: 'text-amber-500', bg: 'bg-amber-50' },
    story: { label: 'Câu Chuyện', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
    gallery: { label: 'Album Ảnh', icon: Image, color: 'text-blue-500', bg: 'bg-blue-50' },
    schedule: { label: 'Lịch Trình', icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' },
    rsvp: { label: 'Form RSVP', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    map: { label: 'Bản Đồ', icon: MapPin, color: 'text-teal-500', bg: 'bg-teal-50' },
    guestbook: { label: 'Sổ Lưu Bút', icon: MessageSquare, color: 'text-pink-500', bg: 'bg-pink-50' },
    gift: { label: 'Mừng Cưới', icon: Gift, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    text: { label: 'Văn Bản', icon: Type, color: 'text-slate-500', bg: 'bg-slate-50' },
}

const ADD_BLOCKS: BlockType[] = ['hero', 'countdown', 'story', 'gallery', 'schedule', 'rsvp', 'map', 'guestbook', 'gift', 'text']

interface BlockEditorProps {
    block: InvitationBlock
    onChange: (updated: InvitationBlock) => void
}

function BlockEditor({ block, onChange }: BlockEditorProps) {
    const updateProp = (key: string, value: unknown) => {
        onChange({ ...block, props: { ...block.props, [key]: value } })
    }

    switch (block.type) {
        case 'hero':
            return (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs">Tên Chú Rể</Label>
                            <Input value={block.props.groomName || ''} onChange={(e) => updateProp('groomName', e.target.value)} placeholder="Nguyễn Văn A" className="h-9 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs">Tên Cô Dâu</Label>
                            <Input value={block.props.brideName || ''} onChange={(e) => updateProp('brideName', e.target.value)} placeholder="Trần Thị B" className="h-9 text-sm" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Ngày Cưới</Label>
                        <Input type="date" value={block.props.weddingDate || ''} onChange={(e) => updateProp('weddingDate', e.target.value)} className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Lời Dẫn (Subtitle)</Label>
                        <Input value={block.props.subtitle || ''} onChange={(e) => updateProp('subtitle', e.target.value)} placeholder="Trân trọng kính mời" className="h-9 text-sm" />
                    </div>
                </div>
            )
        case 'story':
            return (
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Câu Chuyện Tình Yêu</Label>
                        <Textarea value={block.props.story || ''} onChange={(e) => updateProp('story', e.target.value)} placeholder="Kể câu chuyện của hai bạn..." rows={4} className="text-sm resize-none" />
                    </div>
                </div>
            )
        case 'schedule':
            return (
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Địa Điểm</Label>
                        <Input value={block.props.venue || ''} onChange={(e) => updateProp('venue', e.target.value)} placeholder="Trung tâm Hội nghị ABC" className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Địa Chỉ</Label>
                        <Input value={block.props.address || ''} onChange={(e) => updateProp('address', e.target.value)} placeholder="123 Đường XYZ, Quận 1, TP.HCM" className="h-9 text-sm" />
                    </div>
                </div>
            )
        case 'gift':
            return (
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Tên Ngân Hàng</Label>
                        <Input value={block.props.bankName || ''} onChange={(e) => updateProp('bankName', e.target.value)} placeholder="Vietcombank" className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Số Tài Khoản</Label>
                        <Input value={block.props.accountNumber || ''} onChange={(e) => updateProp('accountNumber', e.target.value)} placeholder="0123456789" className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs">Tên Chủ Tài Khoản</Label>
                        <Input value={block.props.accountName || ''} onChange={(e) => updateProp('accountName', e.target.value)} placeholder="NGUYEN VAN A" className="h-9 text-sm" />
                    </div>
                </div>
            )
        case 'text':
            return (
                <div className="space-y-1.5">
                    <Label className="text-xs">Nội Dung</Label>
                    <Textarea value={block.props.content || ''} onChange={(e) => updateProp('content', e.target.value)} rows={4} className="text-sm resize-none" />
                </div>
            )
        case 'map':
            return (
                <div className="space-y-1.5">
                    <Label className="text-xs">Địa Chỉ Google Maps</Label>
                    <Input value={block.props.mapAddress || ''} onChange={(e) => updateProp('mapAddress', e.target.value)} placeholder="123 Đường XYZ, Quận 1, TP.HCM" className="h-9 text-sm" />
                </div>
            )
        default:
            return (
                <p className="text-xs text-muted-foreground py-2 text-center">
                    Block này không cần cấu hình thêm.
                </p>
            )
    }
}

// ---- Live Preview Components ----
function PreviewHero({ block }: { block: InvitationBlock }) {
    return (
        <div className="py-12 px-6 text-center bg-gradient-to-b from-[#fdfaf7] to-[#f5e6d3]">
            <div className="text-4xl mb-4 animate-float">💐</div>
            <p className="text-xs tracking-widest text-[#c9a96e]/60 uppercase mb-3">{block.props.subtitle || 'Trân trọng kính mời'}</p>
            <h2 className="text-2xl font-bold text-[#2c1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                {block.props.groomName || 'Chú Rể'} <span className="text-[#c9a96e]">♥</span> {block.props.brideName || 'Cô Dâu'}
            </h2>
            {block.props.weddingDate && (
                <p className="text-sm text-[#c9a96e] font-medium mt-2">
                    {new Date(block.props.weddingDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
            )}
        </div>
    )
}

function PreviewCountdown({ block }: { block: InvitationBlock }) {
    const target = block.props.targetDate ? new Date(block.props.targetDate) : new Date('2025-12-12')
    const now = new Date()
    const diff = Math.max(0, target.getTime() - now.getTime())
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return (
        <div className="py-8 px-6 bg-[#2c1810] text-white text-center">
            <p className="text-xs tracking-widest text-[#c9a96e]/70 uppercase mb-4">Đếm ngược đến ngày vui</p>
            <div className="flex justify-center gap-4">
                {[{ v: days, l: 'Ngày' }, { v: hours, l: 'Giờ' }, { v: mins, l: 'Phút' }].map((item) => (
                    <div key={item.l} className="text-center">
                        <div className="text-3xl font-bold text-[#c9a96e]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {String(item.v).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-white/40 mt-1">{item.l}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function PreviewSchedule({ block }: { block: InvitationBlock }) {
    const events = (block.props.events as Array<{ time: string; title: string }>) || []
    return (
        <div className="py-8 px-6 bg-white">
            <h3 className="text-center text-lg font-semibold text-[#2c1810] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>Lịch Trình</h3>
            {block.props.venue && <p className="text-center text-sm text-[#c9a96e] mb-4">📍 {block.props.venue}</p>}
            <div className="space-y-3">
                {events.map((evt, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <span className="text-sm font-medium text-[#c9a96e] w-12 text-right flex-shrink-0">{evt.time}</span>
                        <div className="w-px h-8 bg-[#c9a96e]/20 flex-shrink-0" />
                        <span className="text-sm text-[#2c1810]">{evt.title}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function PreviewRSVP() {
    return (
        <div className="py-8 px-6 bg-[#fdfaf7]">
            <h3 className="text-center text-lg font-semibold text-[#2c1810] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Xác Nhận Tham Dự</h3>
            <div className="space-y-3 max-w-sm mx-auto">
                <Input placeholder="Tên của bạn" className="h-9 text-sm border-[#c9a96e]/20" readOnly />
                <Input placeholder="Số điện thoại (tùy chọn)" className="h-9 text-sm border-[#c9a96e]/20" readOnly />
                <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-[#c9a96e] text-white text-xs h-9">✓ Tôi sẽ tham dự</Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-9 border-[#c9a96e]/20">✗ Không thể tham dự</Button>
                </div>
            </div>
        </div>
    )
}

function PreviewGuestbook() {
    return (
        <div className="py-8 px-6 bg-white">
            <h3 className="text-center text-lg font-semibold text-[#2c1810] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>❤️ Lời Chúc Mừng</h3>
            <div className="space-y-3 max-w-sm mx-auto">
                <div className="bg-[#fdfaf7] rounded-xl p-3 border border-[#c9a96e]/10">
                    <p className="text-sm text-[#2c1810]/70">&ldquo;Chúc mừng hai bạn! Sống vui, sống khỏe, sống hạnh phúc bên nhau mãi mãi! 🎉&rdquo;</p>
                    <p className="text-xs text-[#c9a96e] mt-2">— Bạn Thân</p>
                </div>
                <Textarea placeholder="Để lại lời chúc của bạn..." rows={2} className="text-sm resize-none border-[#c9a96e]/20" readOnly />
                <Button size="sm" className="w-full bg-[#c9a96e] text-white text-xs h-9">Gửi Lời Chúc</Button>
            </div>
        </div>
    )
}

function PreviewGift({ block }: { block: InvitationBlock }) {
    return (
        <div className="py-8 px-6 bg-[#fdfaf7] text-center">
            <div className="text-3xl mb-3">🎁</div>
            <h3 className="text-lg font-semibold text-[#2c1810] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Thông Tin Mừng Cưới</h3>
            <div className="glass-card rounded-xl p-4 max-w-xs mx-auto text-left space-y-2">
                <p className="text-xs text-[#2c1810]/50">Ngân hàng: <span className="font-medium text-[#2c1810]">{block.props.bankName || 'Vietcombank'}</span></p>
                <p className="text-xs text-[#2c1810]/50">Số TK: <span className="font-medium text-[#2c1810] tracking-wider">{block.props.accountNumber || '012 345 6789'}</span></p>
                <p className="text-xs text-[#2c1810]/50">Tên: <span className="font-medium text-[#2c1810]">{block.props.accountName || 'NGUYEN VAN A'}</span></p>
            </div>
        </div>
    )
}

function PreviewText({ block }: { block: InvitationBlock }) {
    return (
        <div className="py-8 px-6 bg-white">
            <p className="text-sm text-[#2c1810]/70 leading-relaxed text-center whitespace-pre-wrap">{block.props.content}</p>
        </div>
    )
}

function BlockPreview({ block }: { block: InvitationBlock }) {
    switch (block.type) {
        case 'hero': return <PreviewHero block={block} />
        case 'countdown': return <PreviewCountdown block={block} />
        case 'schedule': return <PreviewSchedule block={block} />
        case 'rsvp': return <PreviewRSVP />
        case 'guestbook': return <PreviewGuestbook />
        case 'gift': return <PreviewGift block={block} />
        case 'text': return <PreviewText block={block} />
        case 'story': return (
            <div className="py-8 px-6 bg-[#fdfaf7]">
                <h3 className="text-center text-lg font-semibold text-[#2c1810] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Câu Chuyện Của Chúng Tôi</h3>
                <p className="text-sm text-[#2c1810]/60 text-center leading-relaxed">{block.props.story}</p>
            </div>
        )
        case 'gallery': return (
            <div className="py-8 px-6 bg-white">
                <h3 className="text-center text-lg font-semibold text-[#2c1810] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Album Ảnh Cưới</h3>
                <div className="grid grid-cols-3 gap-1.5 max-w-xs mx-auto">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-square rounded-lg bg-[#c9a96e]/10 flex items-center justify-center">
                            <Image className="w-5 h-5 text-[#c9a96e]/40" />
                        </div>
                    ))}
                </div>
            </div>
        )
        case 'map': return (
            <div className="py-8 px-6 bg-white text-center">
                <h3 className="text-lg font-semibold text-[#2c1810] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>📍 Địa Điểm</h3>
                <div className="h-36 bg-[#c9a96e]/10 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                        <MapPin className="w-8 h-8 text-[#c9a96e] mx-auto mb-2" />
                        <p className="text-xs text-[#2c1810]/50">{block.props.mapAddress || 'Địa chỉ sẽ hiển thị tại đây'}</p>
                    </div>
                </div>
            </div>
        )
        default: return <div className="py-4 px-6 text-center text-sm text-muted-foreground">Block đang được cập nhật...</div>
    }
}

// ---- MAIN BUILDER ----
const INITIAL_BLOCKS: InvitationBlock[] = [
    {
        id: 'hero-1',
        type: 'hero',
        props: {
            groomName: 'Quang Huy',
            brideName: 'Minh Anh',
            weddingDate: '2025-12-12',
            subtitle: 'Trân trọng kính mời',
        },
        visibility: 'all',
        order: 0,
    },
    {
        id: 'countdown-1',
        type: 'countdown',
        props: { targetDate: '2025-12-12T10:00:00' },
        visibility: 'all',
        order: 1,
    },
    {
        id: 'schedule-1',
        type: 'schedule',
        props: {
            venue: 'Nhà Hàng Tiệc Cưới ABC',
            address: '123 Đường Trần Hưng Đạo, Quận 1, TP.HCM',
            events: [
                { time: '10:00', title: 'Đón khách & Chụp hình kỷ niệm' },
                { time: '11:00', title: 'Lễ Cưới chính thức' },
                { time: '12:00', title: 'Tiệc Buffer' },
            ],
        },
        visibility: 'all',
        order: 2,
    },
    {
        id: 'rsvp-1',
        type: 'rsvp',
        props: { rsvpDeadline: '2025-12-05' },
        visibility: 'all',
        order: 3,
    },
]

export default function BuilderPage() {
    const [blocks, setBlocks] = useState<InvitationBlock[]>(INITIAL_BLOCKS)
    const [activeBlock, setActiveBlock] = useState<string | null>(null)
    const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set(['hero-1']))
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
    const [saving, setSaving] = useState(false)

    const handleDragEnd = useCallback((result: DropResult) => {
        if (!result.destination) return
        const reordered = Array.from(blocks)
        const [moved] = reordered.splice(result.source.index, 1)
        reordered.splice(result.destination.index, 0, moved)
        setBlocks(reordered.map((b, i) => ({ ...b, order: i })))
    }, [blocks])

    const addBlock = (type: BlockType) => {
        const newBlock = BLOCK_TEMPLATES[type]()
        newBlock.order = blocks.length
        setBlocks([...blocks, newBlock])
        setExpandedBlocks(prev => new Set([...prev, newBlock.id]))
        toast.success(`Đã thêm block "${BLOCK_META[type].label}"`)
    }

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id))
        setExpandedBlocks(prev => { const s = new Set(prev); s.delete(id); return s })
    }

    const updateBlock = (updated: InvitationBlock) => {
        setBlocks(blocks.map(b => b.id === updated.id ? updated : b))
    }

    const toggleExpanded = (id: string) => {
        setExpandedBlocks(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) newSet.delete(id)
            else newSet.add(id)
            return newSet
        })
    }

    const handleSave = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 1200))
        setSaving(false)
        toast.success('Thiệp đã được lưu thành công!')
    }

    return (
        <div className="h-screen bg-[#fdfaf7] flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="border-b border-[#c9a96e]/10 bg-white/90 backdrop-blur-sm flex-shrink-0 z-40">
                <div className="h-14 flex items-center px-4 gap-3">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-[#2c1810]/60 h-8">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Dashboard
                        </Button>
                    </Link>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 fill-[#c9a96e] text-[#c9a96e]" />
                        <span className="font-semibold text-sm text-[#2c1810]">Minh Anh & Quang Huy</span>
                        <Badge className="bg-green-100 text-green-600 border-0 text-xs">Đã đăng</Badge>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        {/* Preview mode toggle */}
                        <div className="flex items-center bg-[#f5f0ec] rounded-lg p-0.5 gap-0.5">
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 w-7 p-0 rounded-md ${previewMode === 'mobile' ? 'bg-white shadow-sm' : ''}`}
                                onClick={() => setPreviewMode('mobile')}
                            >
                                <Smartphone className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`h-7 w-7 p-0 rounded-md ${previewMode === 'desktop' ? 'bg-white shadow-sm' : ''}`}
                                onClick={() => setPreviewMode('desktop')}
                            >
                                <Monitor className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-xs border-[#c9a96e]/20 gap-1.5" asChild>
                            <Link href="/minh-anh-quang-huy" target="_blank">
                                <Eye className="w-3.5 h-3.5" />
                                Xem thiệp
                            </Link>
                        </Button>
                        <Button
                            size="sm"
                            className="h-8 text-xs bg-[#c9a96e] hover:bg-[#b8925a] text-white gap-1.5"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            {saving ? 'Đang lưu...' : 'Lưu thiệp'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main 3-column layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Block Library */}
                <div className="w-52 border-r border-[#c9a96e]/10 bg-white/50 flex-shrink-0 overflow-y-auto">
                    <div className="p-3">
                        <p className="text-xs font-semibold text-[#2c1810]/40 uppercase tracking-wider mb-3 px-1">Thêm Block</p>
                        <div className="space-y-1">
                            {ADD_BLOCKS.map((type) => {
                                const meta = BLOCK_META[type]
                                return (
                                    <button
                                        key={type}
                                        onClick={() => addBlock(type)}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#c9a96e]/5 transition-colors group"
                                    >
                                        <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                            <meta.icon className={`w-3.5 h-3.5 ${meta.color}`} />
                                        </div>
                                        <span className="text-xs text-[#2c1810]/70 group-hover:text-[#2c1810] font-medium">{meta.label}</span>
                                        <Plus className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 text-[#c9a96e]" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Center: Drag & Drop Editor */}
                <div className="flex-1 overflow-y-auto bg-[#f8f5f1]">
                    <div className="max-w-xl mx-auto py-6 px-4">
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="blocks">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                                        <AnimatePresence>
                                            {blocks.map((block, index) => {
                                                const meta = BLOCK_META[block.type]
                                                const isExpanded = expandedBlocks.has(block.id)
                                                const isActive = activeBlock === block.id

                                                return (
                                                    <Draggable key={block.id} draggableId={block.id} index={index}>
                                                        {(drag, snapshot) => (
                                                            <motion.div
                                                                ref={drag.innerRef}
                                                                {...drag.draggableProps}
                                                                layout
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.9 }}
                                                                className={`bg-white rounded-2xl border-2 transition-all duration-150 ${snapshot.isDragging
                                                                    ? 'border-[#c9a96e] shadow-xl rotate-1'
                                                                    : isActive
                                                                        ? 'border-[#c9a96e]/50 shadow-md'
                                                                        : 'border-transparent hover:border-[#c9a96e]/20'
                                                                    }`}
                                                                onClick={() => setActiveBlock(block.id)}
                                                            >
                                                                {/* Block Header */}
                                                                <div className="flex items-center gap-2 px-3 py-2.5">
                                                                    <div {...drag.dragHandleProps} className="drag-handle p-1 rounded hover:bg-[#c9a96e]/10 flex-shrink-0">
                                                                        <GripVertical className="w-4 h-4 text-[#2c1810]/25" />
                                                                    </div>
                                                                    <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                                                                        <meta.icon className={`w-3.5 h-3.5 ${meta.color}`} />
                                                                    </div>
                                                                    <span className="text-sm font-medium text-[#2c1810] flex-1">{meta.label}</span>
                                                                    <div className="flex items-center gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-7 w-7 hover:bg-[#c9a96e]/10"
                                                                            onClick={(e) => { e.stopPropagation(); toggleExpanded(block.id) }}
                                                                        >
                                                                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#2c1810]/40" /> : <ChevronDown className="w-3.5 h-3.5 text-[#2c1810]/40" />}
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-7 w-7 hover:bg-red-50 hover:text-red-500"
                                                                            onClick={(e) => { e.stopPropagation(); removeBlock(block.id) }}
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </Button>
                                                                    </div>
                                                                </div>

                                                                {/* Block Editor (expanded) */}
                                                                <AnimatePresence>
                                                                    {isExpanded && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: 'auto', opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            transition={{ duration: 0.2 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <Separator className="bg-[#c9a96e]/10" />
                                                                            <div className="px-4 py-4">
                                                                                <BlockEditor block={block} onChange={updateBlock} />
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </motion.div>
                                                        )}
                                                    </Draggable>
                                                )
                                            })}
                                        </AnimatePresence>
                                        {provided.placeholder}

                                        {blocks.length === 0 && (
                                            <div className="text-center py-16 text-[#2c1810]/30">
                                                <div className="text-4xl mb-3">✨</div>
                                                <p className="text-sm">Chọn block từ bên trái để bắt đầu tạo thiệp</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                </div>

                {/* Right: Live Preview */}
                <div className="w-72 xl:w-80 border-l border-[#c9a96e]/10 bg-gray-50 flex-shrink-0 flex flex-col">
                    <div className="p-3 border-b border-[#c9a96e]/10 flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-[#2c1810]/40" />
                        <span className="text-xs font-medium text-[#2c1810]/50">Xem trước ({previewMode === 'mobile' ? 'Mobile' : 'Desktop'})</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3">
                        <div className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-[#c9a96e]/10 mx-auto ${previewMode === 'mobile' ? 'max-w-[280px]' : 'max-w-full'}`}>
                            {/* Mock phone frame for mobile */}
                            {previewMode === 'mobile' && (
                                <div className="bg-[#1a1a1a] px-6 py-2 flex items-center justify-center">
                                    <div className="w-20 h-1.5 rounded-full bg-gray-600" />
                                </div>
                            )}
                            <ScrollArea className="h-[calc(100vh-160px)]">
                                {blocks.map((block) => (
                                    <BlockPreview key={block.id} block={block} />
                                ))}
                                {blocks.length === 0 && (
                                    <div className="py-20 text-center text-xs text-[#2c1810]/30">
                                        Preview thiệp sẽ hiển thị tại đây
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
