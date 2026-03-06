'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEFAULT_THEME } from '@/lib/templates'
import type { Template } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast'

const styleLabels: Record<string, string> = {
    minimal: 'Tối Giản',
    modern: 'Hiện Đại',
    cinematic: 'Điện Ảnh',
    traditional: 'Truyền Thống',
    vip: 'VIP Pro Max',
}

const styleColors: Record<string, string> = {
    minimal: 'bg-stone-100 text-stone-700',
    modern: 'bg-purple-100 text-purple-700',
    cinematic: 'bg-amber-100 text-amber-700',
    traditional: 'bg-red-100 text-red-700',
    vip: 'bg-slate-950 text-yellow-500',
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

// ─────────────── Unique Mini Previews for each template ───────────────

function PreviewMinimal() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#FDF5F0] to-[#F8DCE0] px-4 py-5">
            <div className="w-12 h-px bg-[#8B0000] mb-3" />
            <p className="text-[9px] tracking-[4px] uppercase text-[#8B0000] mb-2">Trân trọng kính mời</p>
            <p className="text-sm font-bold text-[#4A0E0E]" style={{ fontFamily: 'Playfair Display, serif' }}>Minh Anh</p>
            <div className="flex items-center gap-2 my-1">
                <div className="w-6 h-px bg-[#8B0000]/40" />
                <span className="text-[#8B0000] text-xs">❧</span>
                <div className="w-6 h-px bg-[#8B0000]/40" />
            </div>
            <p className="text-sm font-bold text-[#4A0E0E]" style={{ fontFamily: 'Playfair Display, serif' }}>Quang Huy</p>
            <p className="text-[9px] text-[#4A0E0E]/40 mt-2 tracking-widest">12 – 12 – 2025</p>
            <div className="w-12 h-px bg-[#8B0000] mt-3" />
            <div className="flex gap-3 mt-4">
                {['Lễ Cưới', 'RSVP'].map(t => (
                    <div key={t} className="text-[7px] border border-[#8B0000]/30 rounded px-2 py-1 text-[#4A0E0E]/50 tracking-wider uppercase">{t}</div>
                ))}
            </div>
        </div>
    )
}

function PreviewModern() {
    return (
        <div className="w-full h-full flex flex-col bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6c63ff] via-[#e040fb] to-[#6c63ff]" />
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
                <div className="w-16 h-16 rounded-full border-2 border-[#6c63ff]/40 flex items-center justify-center mb-3 bg-[#6c63ff]/10">
                    <span className="text-xl">💜</span>
                </div>
                <p className="text-[8px] tracking-[3px] uppercase text-[#6c63ff]/70 mb-1">Wedding Invitation</p>
                <p className="text-sm font-bold" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Minh Anh &amp; Quang Huy</p>
                <p className="text-[9px] text-white/40 mt-1">12 · 12 · 2025</p>
            </div>
            <div className="bg-[#6c63ff]/20 border-t border-[#6c63ff]/20 px-4 py-2 flex justify-around">
                {['Câu Chuyện', 'Album', 'RSVP'].map(t => (
                    <span key={t} className="text-[7px] text-white/50 tracking-wide">{t}</span>
                ))}
            </div>
        </div>
    )
}

function PreviewCinematic() {
    return (
        <div className="w-full h-full flex flex-col bg-[#0d0d0d] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
            <div className="absolute top-2 left-0 right-0 flex justify-center gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-3 h-1.5 border border-[#d4af37]/30 rounded-sm" />
                ))}
            </div>
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
                <p className="text-[7px] tracking-[5px] uppercase text-[#d4af37]/60 mb-3">A Wedding Story</p>
                <p className="text-base font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>MINH ANH</p>
                <div className="text-[#d4af37]/40 text-xs my-1">✦ ✦ ✦</div>
                <p className="text-base font-bold text-[#d4af37]" style={{ fontFamily: 'Cinzel, serif' }}>QUANG HUY</p>
                <div className="flex items-center gap-2 mt-3">
                    <div className="h-px w-8 bg-[#d4af37]/30" />
                    <p className="text-[8px] text-white/40 tracking-widest">XII · XII · MMXXV</p>
                    <div className="h-px w-8 bg-[#d4af37]/30" />
                </div>
            </div>
            <div className="relative z-10 flex gap-2 justify-center pb-4">
                {['🎬', '📸', '🗓️', '🎁'].map((e, i) => (
                    <div key={i} className="w-7 h-7 rounded border border-[#d4af37]/20 flex items-center justify-center text-[10px]">{e}</div>
                ))}
            </div>
        </div>
    )
}

function PreviewTraditional() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-between bg-gradient-to-b from-[#fef9f0] to-[#fde8c8] py-4 px-3">
            <div className="w-full flex flex-col items-center">
                <div className="text-[#c0392b] text-[10px] tracking-widest font-bold">❧ THIỆP CƯỚI ❧</div>
                <div className="flex gap-1 mt-1">
                    {['─', '✿', '─', '❋', '─', '✿', '─'].map((s, i) => (
                        <span key={i} className="text-[#c0392b]/40 text-[8px]">{s}</span>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="text-2xl">🏮</div>
                <p className="text-[8px] text-[#5d0e0e]/60 tracking-[2px]">TRÂN TRỌNG KÍNH MỜI</p>
                <p className="text-sm font-bold text-[#c0392b]" style={{ fontFamily: 'Noto Serif, serif' }}>Minh Anh &amp; Quang Huy</p>
                <p className="text-[9px] text-[#5d0e0e]/50">Ngày 12 tháng 12 năm 2025</p>
            </div>
            <div className="flex flex-col items-center gap-1 w-full">
                <div className="flex gap-1">
                    {['─', '✿', '─', '❋', '─', '✿', '─'].map((s, i) => (
                        <span key={i} className="text-[#c0392b]/40 text-[8px]">{s}</span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <div className="bg-[#c0392b] text-white text-[7px] px-2 py-0.5 rounded-sm tracking-wider">LỄ CƯỚI</div>
                    <div className="border border-[#c0392b]/30 text-[#c0392b] text-[7px] px-2 py-0.5 rounded-sm tracking-wider">RSVP</div>
                </div>
            </div>
        </div>
    )
}

function PreviewVip() {
    return (
        <div className="w-full h-full flex flex-col bg-slate-950 text-slate-50 relative overflow-hidden border border-slate-800">
            <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url(/assets/texture.png)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 bg-yellow-500" />

            <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
                <div className="flex items-center gap-2 mb-3 tracking-[3px] text-[#d4af37]">
                    <div className="h-px w-4 bg-[#d4af37]/30" />
                    <span>👑</span>
                    <div className="h-px w-4 bg-[#d4af37]/30" />
                </div>
                <p className="text-[7px] tracking-[4px] uppercase text-[#d4af37] mb-2 font-medium">Trân trọng kính mời</p>
                <p className="text-xl font-bold text-white" style={{ fontFamily: 'Cinzel, serif', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>M & Q</p>
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-3" />
                <div className="bg-white/5 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
                    <p className="text-[7px] text-white/80 tracking-widest" style={{ fontFamily: 'Outfit, sans-serif' }}>12 THÁNG 12 2025</p>
                </div>
            </div>

            <div className="relative z-10 flex gap-2 justify-center pb-4 text-[#d4af37]/70">
                {['📍', '🗓️', '💌', '🎁'].map((e, i) => (
                    <div key={i} className="text-[10px] bg-white/5 rounded-full w-6 h-6 flex items-center justify-center border border-white/5">{e}</div>
                ))}
            </div>
        </div>
    )
}

const PREVIEW_COMPONENTS: Record<string, React.FC> = {
    'minimal-01': PreviewMinimal,
    'modern-01': PreviewModern,
    'cinematic-01': PreviewCinematic,
    'traditional-01': PreviewTraditional,
    'vip-01': PreviewCinematic,
}

const TEMPLATE_FEATURES: Record<string, string[]> = {
    'minimal-01': ['Thanh lịch, tinh tế', 'Nền kem nhẹ nhàng', '4 mục nội dung'],
    'modern-01': ['Hiện Đại, sang trọng', 'Tông tím-chàm tối', '6 mục + Album ảnh'],
    'cinematic-01': ['Như phim, lãng mạn', 'Nền tối vàng gold', '8 mục đầy đủ nhất'],
    'traditional-01': ['Truyền thống đỏ vàng', 'Phong cách Á Đông', '4 mục cơ bản'],
    'vip-01': ['Giao diện siêu cao cấp', 'Kính mờ (Glassmorphism)', '10 mục thượng lưu'],
}

export default function NewInvitationPage() {
    const router = useRouter()
    const [step, setStep] = useState<'template' | 'details'>('template')
    const [selected, setSelected] = useState<Template | null>(null)
    const [templates, setTemplates] = useState<Template[]>([])
    const [loadingTemplates, setLoadingTemplates] = useState(true)
    const [groomName, setGroomName] = useState('')
    const [brideName, setBrideName] = useState('')
    const [weddingDate, setWeddingDate] = useState('')
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        async function fetchTemplates() {
            setLoadingTemplates(true)
            const supabase = createClient()
            const { data, error } = await supabase.from('templates').select('*')
            if (error) {
                console.error('Failed to load templates:', error)
                toast.error('Không thể tải danh sách mẫu')
            } else if (data) {
                setTemplates(data as Template[])
            }
            setLoadingTemplates(false)
        }
        fetchTemplates()
    }, [])

    const handleCreate = async () => {
        if (!selected || !groomName || !brideName) {
            toast.error('Vui lòng nhập đầy đủ tên cô dâu và chú rể.')
            return
        }

        setCreating(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const title = `${brideName} & ${groomName}`
            const slug = slugify(title) + '-' + Date.now().toString(36)

            const { data: invitation, error: invError } = await supabase
                .from('invitations')
                .insert({
                    user_id: user.id,
                    title,
                    slug,
                    wedding_date: weddingDate || null,
                    is_published: true, // Auto publish by default for easier experience
                })
                .select()
                .single()

            if (invError) throw invError

            const templateBlocks = selected.default_blocks.map((b, i) => ({
                ...b,
                order: i,
                props: {
                    ...b.props,
                    ...(b.type === 'hero' ? { groomName, brideName, weddingDate, subtitle: 'Trân trọng kính mời' } : {}),
                    ...(b.type === 'countdown' && weddingDate ? { targetDate: `${weddingDate}T10:00:00` } : {}),
                },
            }))

            const { error: designError } = await supabase
                .from('invitation_designs')
                .insert({
                    invitation_id: invitation.id,
                    theme: selected.default_theme || DEFAULT_THEME,
                    blocks: templateBlocks,
                })

            if (designError) throw designError

            toast.success('Thiệp đã được tạo! Đang mở trình chỉnh sửa...')
            router.push(`/dashboard/builder/${invitation.id}`)
        } catch (err: unknown) {
            console.error('Create failed:', err)
            toast.error('Tạo thiệp thất bại. Vui lòng thử lại.')
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#FDF5F0]">
            {/* Nav */}
            <nav className="border-b border-[#8B0000]/10 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2 text-[#4A0E0E]/60">
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-[#8B0000] fill-[#8B0000]" />
                        <span className="font-bold text-[#4A0E0E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {step === 'template' ? 'Chọn Mẫu Thiệp' : 'Thông Tin Cặp Đôi'}
                        </span>
                    </div>

                    {/* Step indicator */}
                    <div className="ml-auto flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 text-xs ${step === 'template' ? 'text-[#8B0000]' : 'text-[#4A0E0E]/30'}`}>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold
                                ${step === 'template' ? 'border-[#8B0000] bg-[#8B0000] text-white' : 'border-[#4A0E0E]/20'}`}>1</div>
                            <span className="hidden sm:inline">Chọn mẫu</span>
                        </div>
                        <div className="w-8 h-px bg-[#4A0E0E]/10" />
                        <div className={`flex items-center gap-1.5 text-xs ${step === 'details' ? 'text-[#8B0000]' : 'text-[#4A0E0E]/30'}`}>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold
                                ${step === 'details' ? 'border-[#8B0000] bg-[#8B0000] text-white' : 'border-[#4A0E0E]/20'}`}>2</div>
                            <span className="hidden sm:inline">Thông tin</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                {step === 'template' ? (
                    <>
                        <motion.div
                            className="text-center mb-10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl font-bold text-[#4A0E0E] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Chọn mẫu thiệp yêu thích
                            </h1>
                            <p className="text-[#4A0E0E]/50">Mỗi mẫu có phong cách riêng biệt – bạn có thể tùy chỉnh hoàn toàn sau khi chọn</p>
                        </motion.div>

                        {/* Template Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {loadingTemplates ? (
                                <div className="col-span-full py-10 flex flex-col items-center justify-center opacity-50">
                                    <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#8B0000]" />
                                    <p className="text-sm">Đang tải các mẫu thiệp...</p>
                                </div>
                            ) : templates.map((template, i) => {
                                const Preview = PREVIEW_COMPONENTS[template.id]
                                const features = TEMPLATE_FEATURES[template.id] || []
                                const isSelected = selected?.id === template.id

                                return (
                                    <motion.div
                                        key={template.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => setSelected(template)}
                                        className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 shadow-sm
                                            ${isSelected
                                                ? 'border-[#8B0000] shadow-xl shadow-[#8B0000]/20 scale-[1.03]'
                                                : 'border-slate-100 hover:border-[#8B0000]/40 hover:shadow-lg hover:scale-[1.01]'
                                            }`}
                                    >
                                        {/* Mini preview */}
                                        <div className="h-56 overflow-hidden relative">
                                            {Preview && <Preview />}
                                            {template.is_premium && (
                                                <Badge className="absolute top-2.5 right-2.5 bg-gradient-to-r from-[#d4af37] to-[#8B0000] text-white text-[10px] border-0 shadow">
                                                    ✦ Premium
                                                </Badge>
                                            )}
                                            {isSelected && (
                                                <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-[#8B0000] flex items-center justify-center shadow-md">
                                                    <Check className="w-3.5 h-3.5 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="bg-white p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-sm text-[#4A0E0E] leading-tight">{template.name}</h3>
                                                <Badge className={`text-[10px] border-0 shrink-0 ml-2 ${styleColors[template.style]}`}>
                                                    {styleLabels[template.style]}
                                                </Badge>
                                            </div>
                                            <ul className="space-y-0.5">
                                                {features.map(f => (
                                                    <li key={f} className="text-[10px] text-[#4A0E0E]/45 flex items-center gap-1.5">
                                                        <span className="w-1 h-1 rounded-full bg-[#8B0000]/40 shrink-0" />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        <div className="flex justify-center">
                            <Button
                                size="lg"
                                disabled={!selected}
                                className="bg-[#8B0000] hover:bg-[#A61C00] text-white gap-2 px-10 h-12 disabled:opacity-40 shadow-lg shadow-[#8B0000]/30"
                                onClick={() => setStep('details')}
                            >
                                <Heart className="w-4 h-4 fill-white" />
                                {selected ? `Dùng mẫu "${selected.name}" →` : 'Chọn một mẫu thiệp để tiếp tục'}
                            </Button>
                        </div>
                    </>
                ) : (
                    <motion.div
                        className="max-w-md mx-auto"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Selected template mini summary */}
                        {selected && (() => {
                            const P = PREVIEW_COMPONENTS[selected.id]
                            return (
                                <div className="flex items-center gap-3 bg-white border border-[#8B0000]/15 rounded-xl p-3 mb-6 shadow-sm">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#8B0000]/10 bg-slate-50">
                                        {P && <P />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-[#4A0E0E]/40">Mẫu đã chọn</p>
                                        <p className="text-sm font-semibold text-[#4A0E0E] truncate">{selected.name}</p>
                                    </div>
                                    <button
                                        className="text-xs text-[#8B0000] hover:underline shrink-0"
                                        onClick={() => setStep('template')}
                                    >
                                        Đổi mẫu
                                    </button>
                                </div>
                            )
                        })()}

                        <div className="text-center mb-8">
                            <div className="text-5xl mb-4">💒</div>
                            <h1 className="text-2xl font-bold text-[#4A0E0E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Thông tin cặp đôi
                            </h1>
                            <p className="text-[#4A0E0E]/50 text-sm">Nhập tên và ngày cưới để hoàn tất thiệp</p>
                        </div>

                        <div className="space-y-5 bg-white rounded-2xl border border-[#8B0000]/10 p-6 shadow-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-[#4A0E0E]">Tên Chú Rể</Label>
                                    <Input
                                        value={groomName}
                                        onChange={(e) => setGroomName(e.target.value)}
                                        placeholder="Nguyễn Văn A"
                                        className="h-11 border-[#8B0000]/20 focus:border-[#8B0000]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-[#4A0E0E]">Tên Cô Dâu</Label>
                                    <Input
                                        value={brideName}
                                        onChange={(e) => setBrideName(e.target.value)}
                                        placeholder="Trần Thị B"
                                        className="h-11 border-[#8B0000]/20 focus:border-[#8B0000]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#4A0E0E]">Ngày Cưới</Label>
                                <Input
                                    type="date"
                                    value={weddingDate}
                                    onChange={(e) => setWeddingDate(e.target.value)}
                                    className="h-11 border-[#8B0000]/20 focus:border-[#8B0000]"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-11 border-[#8B0000]/20"
                                    onClick={() => setStep('template')}
                                >
                                    ← Đổi mẫu
                                </Button>
                                <Button
                                    className="flex-1 h-11 bg-[#8B0000] hover:bg-[#A61C00] text-white shadow-lg shadow-[#8B0000]/30"
                                    onClick={handleCreate}
                                    disabled={creating || !groomName || !brideName}
                                >
                                    {creating ? (
                                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang tạo...</>
                                    ) : (
                                        '🎉 Tạo Thiệp Ngay'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
