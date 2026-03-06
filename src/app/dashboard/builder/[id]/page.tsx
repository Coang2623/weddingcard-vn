'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import {
    GripVertical, Plus, Trash2, Eye, Save,
    ChevronDown, ChevronUp, Smartphone, Monitor, ArrowLeft,
    Heart, Image, Calendar, MapPin, Users, MessageSquare, Gift, Timer, Type, Music,
    Loader2, ArrowUpCircle, ArrowDownCircle, Upload, X, Globe, Lock, Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { InvitationBlock, BlockType } from '@/types'
import { BLOCK_TEMPLATES, DEFAULT_THEME } from '@/lib/templates'
import { loadDesignBlocks, saveDesignBlocks, getInvitationById, updateInvitation } from '@/lib/supabase/api'
import Link from 'next/link'
import { toast } from '@/lib/toast'
import { createClient } from '@/lib/supabase/client'
import { RenderBlock, ThemeContext } from '@/app/[slug]/ClientInvitation'
import imageCompression from 'browser-image-compression'

const VIETQR_BANKS = [
    { id: 'vietcombank', name: 'Vietcombank (VCB)', shortName: 'vcb' },
    { id: 'vietinbank', name: 'VietinBank', shortName: 'vietinbank' },
    { id: 'bidv', name: 'BIDV', shortName: 'bidv' },
    { id: 'agribank', name: 'Agribank', shortName: 'agribank' },
    { id: 'ocb', name: 'OCB', shortName: 'ocb' },
    { id: 'mbbank', name: 'MBBank', shortName: 'mb' },
    { id: 'techcombank', name: 'Techcombank (TCB)', shortName: 'techcombank' },
    { id: 'acb', name: 'ACB', shortName: 'acb' },
    { id: 'vpbank', name: 'VPBank', shortName: 'vpbank' },
    { id: 'tpbank', name: 'TPBank', shortName: 'tpbank' },
    { id: 'sacombank', name: 'Sacombank', shortName: 'sacombank' },
    { id: 'hdbank', name: 'HDBank', shortName: 'hdbank' },
    { id: 'vib', name: 'VIB', shortName: 'vib' },
    { id: 'seabank', name: 'SeABank', shortName: 'seabank' },
    { id: 'msb', name: 'MSB', shortName: 'msb' },
]

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
    music: { label: 'Nhạc Nền', icon: Music, color: 'text-fuchsia-500', bg: 'bg-fuchsia-50' },
}

const ADD_BLOCKS: BlockType[] = ['hero', 'countdown', 'story', 'gallery', 'schedule', 'rsvp', 'map', 'guestbook', 'gift', 'text', 'music']

interface BlockEditorProps {
    block: InvitationBlock
    onChange: (updated: InvitationBlock) => void
}

function GalleryEditor({
    images,
    onChangeImages,
}: {
    images: string[]
    onChangeImages: (next: string[]) => void
}) {
    const [uploading, setUploading] = useState(false)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return
        setUploading(true)
        try {
            const supabase = createClient()
            const newImages = [...images]
            for (const file of Array.from(files)) {
                // Compress image before upload
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true
                }
                let fileToUpload = file;
                try {
                    fileToUpload = await imageCompression(file, options);
                } catch (error) {
                    console.error('Lỗi nén ảnh:', error);
                    // continue uploading the original if compression fails
                }

                const ext = file.name.split('.').pop()
                const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
                const { error } = await supabase.storage.from('wedding-images').upload(path, fileToUpload)
                if (error) {
                    toast.error(`Lỗi upload: ${file.name}`)
                    continue
                }
                const { data: urlData } = supabase.storage.from('wedding-images').getPublicUrl(path)
                newImages.push(urlData.publicUrl)
            }
            onChangeImages(newImages)
            toast.success(`Đã thêm ${files.length} ảnh!`)
        } catch {
            toast.error('Upload ảnh thất bại.')
        } finally {
            setUploading(false)
            e.target.value = ''
        }
    }

    const removeImage = (index: number) => {
        onChangeImages(images.filter((_, i) => i !== index))
    }

    const addImageUrl = () => {
        const url = prompt('Nhập URL ảnh:')
        if (url) onChangeImages([...images, url])
    }

    return (
        <div className="space-y-3">
            <Label className="text-xs">Album Ảnh ({images.length} ảnh)</Label>

            {/* Image thumbnails */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {images.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-[#8B0000]/10 group">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <button
                                onClick={() => removeImage(i)}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload buttons */}
            <div className="flex gap-2">
                <label className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg border border-dashed border-[#8B0000]/30 text-xs text-[#8B0000] cursor-pointer hover:bg-[#8B0000]/5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                    />
                </label>
                <Button variant="outline" size="sm" onClick={addImageUrl} className="h-9 text-xs border-[#8B0000]/20">
                    <Plus className="w-3.5 h-3.5 mr-1" /> URL
                </Button>
            </div>
        </div>
    )
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
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs">Lời Nhắn (Tuỳ chọn)</Label>
                        <Input value={(block.props.note as string) || ''} onChange={(e) => updateProp('note', e.target.value)} placeholder="Nhắn nhủ lời yêu thương đến cặp đôi" className="h-9 text-sm" />
                    </div>
                    <div className="space-y-3 p-3 rounded-lg border border-[#8B0000]/10 bg-[#8B0000]/5">
                        <Label className="text-xs font-semibold text-[#8B0000]">Mã QR Tự Động (VietQR)</Label>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-[#4A0E0E]/70">Ngân Hàng</Label>
                            <Select value={(block.props.bankName as string) || ''} onValueChange={(val) => updateProp('bankName', val)}>
                                <SelectTrigger className="h-9 text-sm border-[#8B0000]/20 bg-white">
                                    <SelectValue placeholder="Chọn ngân hàng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {VIETQR_BANKS.map(bank => (
                                        <SelectItem key={bank.shortName} value={bank.shortName}>{bank.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-[#4A0E0E]/70">Số Tài Khoản</Label>
                            <Input value={(block.props.accountNumber as string ?? block.props.bankAccount as string) || ''} onChange={(e) => updateProp('accountNumber', e.target.value)} placeholder="0123456789" className="h-9 text-sm" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-[#4A0E0E]/70">Tên Chủ Tài Khoản</Label>
                            <Input value={(block.props.accountOwner as string ?? block.props.bankOwner as string ?? block.props.accountName as string) || ''} onChange={(e) => updateProp('accountOwner', e.target.value.toUpperCase())} placeholder="NGUYEN VAN A" className="h-9 text-sm uppercase" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-[#4A0E0E]/70">Giao diện VietQR</Label>
                            <Select value={(block.props.vietqrTemplate as string) || 'print'} onValueChange={(val) => updateProp('vietqrTemplate', val)}>
                                <SelectTrigger className="h-9 text-sm border-[#8B0000]/20 bg-white">
                                    <SelectValue placeholder="Chọn giao diện" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="print">Bản in (Đầy đủ)</SelectItem>
                                    <SelectItem value="compact">Nhỏ gọn 1</SelectItem>
                                    <SelectItem value="compact2">Nhỏ gọn 2</SelectItem>
                                    <SelectItem value="qr_only">Chỉ mã QR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3 p-3 rounded-lg border border-[#8B0000]/10">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-semibold text-[#4A0E0E]">Mã QR Tuỳ Chỉnh (Momo, Paypal...) (Tuỳ chọn)</Label>
                            {!!block.props.customQrImage && (
                                <button onClick={() => updateProp('customQrImage', null)} className="text-xs text-red-500 hover:text-red-600 transition-colors">
                                    Xoá ảnh
                                </button>
                            )}
                        </div>
                        <p className="text-[10px] text-[#4A0E0E]/50">Nếu tải ảnh lên, hệ thống sẽ hiển thị ảnh này thay vì tạo mã VietQR.</p>
                        {block.props.customQrImage ? (
                            <div className="relative w-32 h-32 rounded-lg border border-[#8B0000]/20 overflow-hidden mx-auto">
                                <img src={block.props.customQrImage as string} alt="Custom QR" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center p-4 h-24 rounded-lg border-2 border-dashed border-[#8B0000]/30 hover:bg-[#8B0000]/5 cursor-pointer text-[#4A0E0E]/50 transition-colors">
                                <Upload className="w-5 h-5 mb-2 text-[#8B0000]/50" />
                                <span className="text-xs">Tải ảnh mã QR lên</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0]
                                        if (!file) return
                                        const toastId = toast.loading('Đang tải ảnh lên...')
                                        try {
                                            const supabase = createClient()
                                            let fileToUpload = file
                                            try {
                                                fileToUpload = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true })
                                            } catch (e) { }
                                            const ext = file.name.split('.').pop()
                                            const path = `qr/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
                                            const { error } = await supabase.storage.from('wedding-images').upload(path, fileToUpload)
                                            if (error) throw error
                                            const { data: urlData } = supabase.storage.from('wedding-images').getPublicUrl(path)
                                            updateProp('customQrImage', urlData.publicUrl)
                                            toast.success('Đã tải lên mã QR!', { id: toastId })
                                        } catch (error) {
                                            toast.error('Lỗi khi tải ảnh. Vui lòng thử lại.', { id: toastId })
                                        }
                                        e.target.value = ''
                                    }}
                                />
                            </label>
                        )}
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
        case 'gallery': {
            const images: string[] = block.props.images || []
            return (
                <GalleryEditor
                    images={images}
                    onChangeImages={(next) => updateProp('images', next)}
                />
            )
        }
        case 'map':
            return (
                <div className="space-y-1.5">
                    <Label className="text-xs">Địa Chỉ Google Maps</Label>
                    <Input value={block.props.mapAddress || ''} onChange={(e) => updateProp('mapAddress', e.target.value)} placeholder="123 Đường XYZ, Quận 1, TP.HCM" className="h-9 text-sm" />
                </div>
            )
        case 'music':
            return (
                <div className="space-y-4">
                    <div className="space-y-3">
                        <Label className="text-xs">Đường Dẫn Nhạc Nền (URL)</Label>
                        <Input value={(block.props.musicUrl as string) || ''} onChange={(e) => updateProp('musicUrl', e.target.value)} placeholder="https://example.com/music.mp3" className="h-9 text-sm" />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[#8B0000]/10" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white px-2 text-[#4A0E0E]/40">Hoặc</span>
                            </div>
                        </div>

                        <label className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-[#8B0000]/30 hover:bg-[#8B0000]/5 cursor-pointer text-[#4A0E0E]/50 transition-colors">
                            <Upload className="w-4 h-4 mb-2 text-[#8B0000]/50" />
                            <span className="text-[11px]">Tải file nhạc lên (.mp3)</span>
                            <input
                                type="file"
                                accept="audio/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    const toastId = toast.loading('Đang tải nhạc lên...')
                                    try {
                                        const supabase = createClient()
                                        const ext = file.name.split('.').pop()
                                        const path = `audio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
                                        const { error } = await supabase.storage.from('wedding-images').upload(path, file)
                                        if (error) throw error
                                        const { data: urlData } = supabase.storage.from('wedding-images').getPublicUrl(path)
                                        updateProp('musicUrl', urlData.publicUrl)
                                        toast.success('Đã tải nhạc lên thành công!', { id: toastId })
                                    } catch (error) {
                                        toast.error('Lỗi khi tải file. Vui lòng thử lại.', { id: toastId })
                                    }
                                    e.target.value = ''
                                }}
                            />
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-[#8B0000]/10 bg-[#8B0000]/5">
                        <div className="space-y-0.5">
                            <Label className="text-xs font-semibold text-[#8B0000]">Tự động phát</Label>
                            <p className="text-[10px] text-[#4A0E0E]/50">Trình duyệt có thể tự chặn nếu người dùng chưa tương tác.</p>
                        </div>
                        <Switch checked={block.props.autoPlay !== false} onCheckedChange={(checked) => updateProp('autoPlay', checked)} />
                    </div>
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

// Removed Preview Components


// ---- MAIN BUILDER ----

export default function BuilderPage() {
    const params = useParams<{ id: string }>()
    const invitationId = params.id

    const [blocks, setBlocks] = useState<InvitationBlock[]>([])
    const [theme, setTheme] = useState<import('@/types').InvitationTheme>(DEFAULT_THEME)
    const [invitationTitle, setInvitationTitle] = useState('')
    const [invitationSlug, setInvitationSlug] = useState('')
    const [isPublished, setIsPublished] = useState(false) // Added this line
    const [activeBlock, setActiveBlock] = useState<string | null>(null)
    const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set())
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)
    const [previewWidth, setPreviewWidth] = useState(320)
    const isResizing = useRef(false)
    const previewRef = useRef<HTMLDivElement>(null)
    const [windowHeight, setWindowHeight] = useState(800)

    const PREVIEW_MIN = 240
    const PREVIEW_MAX = 600

    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        e.preventDefault()
        isResizing.current = true
        document.body.style.cursor = 'col-resize'
        document.body.style.userSelect = 'none'

        const startX = e.clientX
        const startWidth = previewWidth

        const onMouseMove = (ev: MouseEvent) => {
            if (!isResizing.current) return
            const delta = startX - ev.clientX
            const newWidth = Math.min(PREVIEW_MAX, Math.max(PREVIEW_MIN, startWidth + delta))
            setPreviewWidth(newWidth)
        }

        const onMouseUp = () => {
            isResizing.current = false
            document.body.style.cursor = ''
            document.body.style.userSelect = ''
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    }, [previewWidth])

    // Use ref so the drag handler always sees the latest blocks
    const blocksRef = useRef(blocks)
    blocksRef.current = blocks

    // Load blocks from Supabase on mount
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true)
                setLoadError(null)
                const invitation = await getInvitationById(invitationId)
                setInvitationTitle(invitation.title || '')
                setInvitationSlug(invitation.slug || '')
                setIsPublished(invitation.is_published || false)

                const design = await loadDesignBlocks(invitationId)
                if (design.theme) setTheme(design.theme)
                const sorted = [...design.blocks].sort((a, b) => a.order - b.order)
                setBlocks(sorted)
                if (sorted.length > 0) {
                    setExpandedBlocks(new Set([sorted[0].id]))
                }
            } catch (err: unknown) {
                console.error('Failed to load invitation:', err)
                setLoadError('Không thể tải thiệp. Vui lòng thử lại.')
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [invitationId])

    useEffect(() => {
        setWindowHeight(window.innerHeight)
        const onResize = () => setWindowHeight(window.innerHeight)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return
        if (result.source.index === result.destination.index) return

        const currentBlocks = blocksRef.current
        const reordered = Array.from(currentBlocks)
        const [moved] = reordered.splice(result.source.index, 1)
        reordered.splice(result.destination.index, 0, moved)
        const updated = reordered.map((b, i) => ({ ...b, order: i }))
        setBlocks(updated)
        toast.success(`Đã di chuyển "${BLOCK_META[moved.type].label}"`)
    }

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= blocks.length) return
        const reordered = Array.from(blocks)
        const [moved] = reordered.splice(index, 1)
        reordered.splice(newIndex, 0, moved)
        setBlocks(reordered.map((b, i) => ({ ...b, order: i })))
    }

    const addBlock = (type: BlockType) => {
        const newBlock = BLOCK_TEMPLATES[type]()
        newBlock.order = blocks.length
        setBlocks(prev => [...prev, newBlock])
        setExpandedBlocks(prev => new Set([...prev, newBlock.id]))
        toast.success(`Đã thêm block "${BLOCK_META[type].label}"`)
    }

    const removeBlock = (id: string) => {
        setBlocks(prev => prev.filter(b => b.id !== id))
        setExpandedBlocks(prev => { const s = new Set(prev); s.delete(id); return s })
    }

    const updateBlock = (updated: InvitationBlock) => {
        setBlocks(prev => prev.map(b => b.id === updated.id ? updated : b))
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
        try {
            await saveDesignBlocks(invitationId, blocks, theme)
            toast.success('Thiệp đã được lưu thành công!')
        } catch (err: unknown) {
            console.error('Save failed:', err)
            toast.error('Lưu thất bại. Vui lòng thử lại.')
        } finally {
            setSaving(false)
        }
    }

    const handleTogglePublish = async (checked: boolean) => {
        try {
            await updateInvitation(invitationId, { is_published: checked })
            setIsPublished(checked)
            toast.success(checked ? 'Đã công khai thiệp!' : 'Đã ẩn thiệp (Bản nháp)')
        } catch (err) {
            console.error(err)
            toast.error('Cập nhật trạng thái thất bại')
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="h-screen bg-[#FDF5F0] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#8B0000] mx-auto mb-4" />
                    <p className="text-sm text-[#4A0E0E]/50">Đang tải thiệp...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (loadError) {
        return (
            <div className="h-screen bg-[#FDF5F0] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">😔</div>
                    <p className="text-sm text-red-500 mb-4">{loadError}</p>
                    <Link href="/dashboard">
                        <Button variant="outline">← Quay về Dashboard</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen bg-[#FDF5F0] flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="border-b border-[#8B0000]/10 bg-white/90 backdrop-blur-sm flex-shrink-0 z-40">
                <div className="h-14 flex items-center px-4 gap-3">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-[#4A0E0E]/60 h-8">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Dashboard
                        </Button>
                    </Link>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 fill-[#8B0000] text-[#8B0000]" />
                        <span className="font-semibold text-sm text-[#4A0E0E]">{invitationTitle || 'Thiệp chưa đặt tên'}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        {/* Publish Toggle */}
                        <div className="flex items-center gap-2 mr-2 border-r border-[#8B0000]/10 pr-4">
                            {isPublished ? <Globe className="w-3.5 h-3.5 text-green-500" /> : <Lock className="w-3.5 h-3.5 text-[#4A0E0E]/40" />}
                            <span className="text-xs font-medium text-[#4A0E0E]/70">
                                {isPublished ? 'Công khai' : 'Bản nháp'}
                            </span>
                            <Switch checked={isPublished} onCheckedChange={handleTogglePublish} className="scale-75 origin-left ml-1" />
                        </div>

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
                        <Button variant="outline" size="sm" className="h-8 text-xs border-[#8B0000]/20 gap-1.5" asChild>
                            <Link href={`/dashboard/settings/${invitationId}`}>
                                <Settings className="w-3.5 h-3.5" />
                                Cài đặt
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs border-[#8B0000]/20 gap-1.5" asChild>
                            <Link href={`/${invitationSlug}`} target="_blank">
                                <Eye className="w-3.5 h-3.5" />
                                Xem thiệp
                            </Link>
                        </Button>
                        <Button
                            size="sm"
                            className="h-8 text-xs bg-[#8B0000] hover:bg-[#A61C00] text-white gap-1.5"
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
                <div className="w-52 border-r border-[#8B0000]/10 bg-white/50 flex-shrink-0 overflow-y-auto">
                    <div className="p-3">
                        <p className="text-xs font-semibold text-[#4A0E0E]/40 uppercase tracking-wider mb-3 px-1">Thêm Block</p>
                        <div className="space-y-1">
                            {ADD_BLOCKS.map((type) => {
                                const meta = BLOCK_META[type]
                                return (
                                    <button
                                        key={type}
                                        onClick={() => addBlock(type)}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[#8B0000]/5 transition-colors group"
                                    >
                                        <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                            <meta.icon className={`w-3.5 h-3.5 ${meta.color}`} />
                                        </div>
                                        <span className="text-xs text-[#4A0E0E]/70 group-hover:text-[#4A0E0E] font-medium">{meta.label}</span>
                                        <Plus className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 text-[#8B0000]" />
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
                                        {blocks.map((block, index) => {
                                            const meta = BLOCK_META[block.type]
                                            const isExpanded = expandedBlocks.has(block.id)
                                            const isActive = activeBlock === block.id

                                            return (
                                                <Draggable key={block.id} draggableId={block.id} index={index}>
                                                    {(drag, snapshot) => (
                                                        <div
                                                            ref={drag.innerRef}
                                                            {...drag.draggableProps}
                                                            style={drag.draggableProps.style}
                                                            className={`bg-white rounded-2xl border-2 transition-shadow duration-150 ${snapshot.isDragging
                                                                ? 'border-[#8B0000] shadow-xl'
                                                                : isActive
                                                                    ? 'border-[#8B0000]/50 shadow-md'
                                                                    : 'border-transparent hover:border-[#8B0000]/20'
                                                                }`}
                                                            onClick={() => setActiveBlock(block.id)}
                                                        >
                                                            {/* Block Header */}
                                                            <div className="flex items-center gap-2 px-3 py-2.5">
                                                                <div {...drag.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-[#8B0000]/10 flex-shrink-0">
                                                                    <GripVertical className="w-4 h-4 text-[#4A0E0E]/25" />
                                                                </div>
                                                                {/* Move up/down buttons */}
                                                                <div className="flex flex-col gap-0 flex-shrink-0">
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up') }}
                                                                        disabled={index === 0}
                                                                        className="p-0.5 rounded hover:bg-[#8B0000]/10 disabled:opacity-20 transition-opacity"
                                                                        title="Di chuyển lên"
                                                                    >
                                                                        <ChevronUp className="w-3 h-3 text-[#4A0E0E]/40" />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down') }}
                                                                        disabled={index === blocks.length - 1}
                                                                        className="p-0.5 rounded hover:bg-[#8B0000]/10 disabled:opacity-20 transition-opacity"
                                                                        title="Di chuyển xuống"
                                                                    >
                                                                        <ChevronDown className="w-3 h-3 text-[#4A0E0E]/40" />
                                                                    </button>
                                                                </div>
                                                                <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                                                                    <meta.icon className={`w-3.5 h-3.5 ${meta.color}`} />
                                                                </div>
                                                                <span className="text-sm font-medium text-[#4A0E0E] flex-1">{meta.label}</span>
                                                                <Badge variant="outline" className="text-xs border-[#8B0000]/20 text-[#4A0E0E]/30">
                                                                    #{index + 1}
                                                                </Badge>
                                                                <div className="flex items-center gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-7 w-7 hover:bg-[#8B0000]/10"
                                                                        onClick={(e) => { e.stopPropagation(); toggleExpanded(block.id) }}
                                                                    >
                                                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#4A0E0E]/40" /> : <ChevronDown className="w-3.5 h-3.5 text-[#4A0E0E]/40" />}
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
                                                            {isExpanded && (
                                                                <div>
                                                                    <Separator className="bg-[#8B0000]/10" />
                                                                    <div className="px-4 py-4">
                                                                        <BlockEditor block={block} onChange={updateBlock} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        })}
                                        {provided.placeholder}

                                        {blocks.length === 0 && (
                                            <div className="text-center py-16 text-[#4A0E0E]/30">
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

                {/* Resize Handle */}
                <div
                    className="w-1.5 flex-shrink-0 cursor-col-resize group relative hover:bg-[#8B0000]/20 transition-colors bg-transparent border-l border-[#8B0000]/10"
                    onMouseDown={handleResizeStart}
                    title="Kéo để thay đổi kích thước xem trước"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-[#8B0000]/20 group-hover:bg-[#8B0000]/50 transition-colors" />
                </div>

                {/* Right: Live Preview */}
                <div
                    ref={previewRef}
                    style={{ width: previewWidth }}
                    className="border-l border-[#8B0000]/10 bg-gray-50 flex-shrink-0 flex flex-col"
                >
                    <div className="p-3 border-b border-[#8B0000]/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5 text-[#4A0E0E]/40" />
                            <span className="text-xs font-medium text-[#4A0E0E]/50">Xem trước ({previewMode === 'mobile' ? 'Mobile' : 'Desktop'})</span>
                        </div>
                        <span className="text-[10px] text-[#4A0E0E]/30 font-mono">{previewWidth}px</span>
                    </div>
                    {(() => {
                        const baseWidth = previewMode === 'mobile' ? 375 : 768
                        const availableWidth = previewWidth - 24 // subtract padding
                        const scale = Math.min(1, availableWidth / baseWidth)
                        return (
                            <div className="flex-1 overflow-hidden flex flex-col items-center p-3">
                                <div
                                    className="origin-top"
                                    style={{
                                        width: baseWidth,
                                        transform: `scale(${scale})`,
                                        transformOrigin: 'top center',
                                    }}
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#8B0000]/10">
                                        {/* Mock phone frame for mobile */}
                                        {previewMode === 'mobile' && (
                                            <div className="bg-[#1a1a1a] px-6 py-2 flex items-center justify-center">
                                                <div className="w-20 h-1.5 rounded-full bg-gray-600" />
                                            </div>
                                        )}
                                        <div className="overflow-y-auto w-full h-full relative" style={{ maxHeight: `${(windowHeight - 160) / scale}px` }}>
                                            <ThemeContext.Provider value={theme}>
                                                <div style={{ background: theme.style === 'cinematic' || theme.style === 'modern' ? '#111' : 'white', minHeight: '100%' }}>
                                                    {blocks.map((block) => (
                                                        <RenderBlock key={block.id} block={block} invitationId={invitationId} />
                                                    ))}
                                                    {blocks.length === 0 && (
                                                        <div className="py-20 text-center text-xs text-[#4A0E0E]/30">
                                                            Preview thiệp sẽ hiển thị tại đây
                                                        </div>
                                                    )}
                                                </div>
                                            </ThemeContext.Provider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })()}
                </div>
            </div>
        </div>
    )
}
