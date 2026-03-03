'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEFAULT_TEMPLATES, DEFAULT_THEME } from '@/lib/templates'
import type { Template } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const styleLabels: Record<string, string> = {
    minimal: 'Tối Giản',
    modern: 'Hiện Đại',
    cinematic: 'Điện Ảnh',
    traditional: 'Truyền Thống',
}

const styleColors: Record<string, string> = {
    minimal: 'bg-stone-100 text-stone-700',
    modern: 'bg-purple-100 text-purple-700',
    cinematic: 'bg-amber-100 text-amber-700',
    traditional: 'bg-red-100 text-red-700',
}

const templateEmojis: Record<string, string> = {
    'minimal-01': '🌿',
    'modern-01': '💜',
    'cinematic-01': '🎬',
    'traditional-01': '🏮',
}

const templateBgs: Record<string, string> = {
    'minimal-01': 'from-stone-50 to-amber-50',
    'modern-01': 'from-purple-50 to-indigo-50',
    'cinematic-01': 'from-gray-900 to-black',
    'traditional-01': 'from-red-50 to-yellow-50',
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

export default function NewInvitationPage() {
    const router = useRouter()
    const [step, setStep] = useState<'template' | 'details'>('template')
    const [selected, setSelected] = useState<Template | null>(null)
    const [groomName, setGroomName] = useState('')
    const [brideName, setBrideName] = useState('')
    const [weddingDate, setWeddingDate] = useState('')
    const [creating, setCreating] = useState(false)

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

            // Create invitation
            const { data: invitation, error: invError } = await supabase
                .from('invitations')
                .insert({
                    user_id: user.id,
                    title,
                    slug,
                    wedding_date: weddingDate || null,
                    is_published: false,
                })
                .select()
                .single()

            if (invError) throw invError

            // Create design with template blocks
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
        <div className="min-h-screen bg-[#fdfaf7]">
            {/* Nav */}
            <nav className="border-b border-[#c9a96e]/10 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2 text-[#2c1810]/60">
                            <ArrowLeft className="w-4 h-4" />
                            Quay lại
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-[#c9a96e] fill-[#c9a96e]" />
                        <span className="font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            {step === 'template' ? 'Chọn Mẫu Thiệp' : 'Thông Tin Cặp Đôi'}
                        </span>
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
                            <h1 className="text-3xl font-bold text-[#2c1810] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Chọn mẫu thiệp yêu thích
                            </h1>
                            <p className="text-[#2c1810]/50">Bạn có thể tùy chỉnh hoàn toàn sau khi chọn mẫu</p>
                        </motion.div>

                        {/* Template Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {DEFAULT_TEMPLATES.map((template, i) => (
                                <motion.div
                                    key={template.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => setSelected(template)}
                                    className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 ${selected?.id === template.id
                                        ? 'border-[#c9a96e] shadow-xl shadow-[#c9a96e]/20 scale-105'
                                        : 'border-transparent hover:border-[#c9a96e]/30 hover:shadow-lg'
                                        }`}
                                >
                                    <div className={`h-52 bg-gradient-to-b ${templateBgs[template.id]} flex flex-col items-center justify-center relative p-4`}>
                                        {template.is_premium && (
                                            <Badge className="absolute top-3 right-3 bg-[#c9a96e] text-white text-xs border-0">
                                                Premium
                                            </Badge>
                                        )}
                                        {selected?.id === template.id && (
                                            <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-[#c9a96e] flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5 text-white" />
                                            </div>
                                        )}
                                        <div className="text-5xl mb-3">{templateEmojis[template.id]}</div>
                                        <div className={`text-center ${template.style === 'cinematic' ? 'text-white' : 'text-[#2c1810]'}`}>
                                            <p className="text-xs opacity-60 tracking-widest uppercase mb-1">Cô dâu & Chú rể</p>
                                            <p className="text-sm font-semibold" style={{ fontFamily: template.default_theme.fontTitle + ', serif' }}>
                                                Minh Anh & Quang Huy
                                            </p>
                                            <p className="text-xs opacity-50 mt-1">12 – 12 – 2025</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-sm text-[#2c1810]">{template.name}</h3>
                                            <Badge className={`text-xs border-0 ${styleColors[template.style]}`}>
                                                {styleLabels[template.style]}
                                            </Badge>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <Button
                                size="lg"
                                disabled={!selected}
                                className="bg-[#c9a96e] hover:bg-[#b8925a] text-white gap-2 px-10 h-12 disabled:opacity-40 shadow-lg shadow-[#c9a96e]/30"
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
                        <div className="text-center mb-8">
                            <div className="text-5xl mb-4">💒</div>
                            <h1 className="text-2xl font-bold text-[#2c1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                                Thông tin cặp đôi
                            </h1>
                            <p className="text-[#2c1810]/50 text-sm">Nhập tên và ngày cưới để tạo thiệp</p>
                        </div>

                        <div className="space-y-5 bg-white rounded-2xl border border-[#c9a96e]/10 p-6 shadow-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-[#2c1810]">Tên Chú Rể</Label>
                                    <Input
                                        value={groomName}
                                        onChange={(e) => setGroomName(e.target.value)}
                                        placeholder="Nguyễn Văn A"
                                        className="h-11 border-[#c9a96e]/20 focus:border-[#c9a96e]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-[#2c1810]">Tên Cô Dâu</Label>
                                    <Input
                                        value={brideName}
                                        onChange={(e) => setBrideName(e.target.value)}
                                        placeholder="Trần Thị B"
                                        className="h-11 border-[#c9a96e]/20 focus:border-[#c9a96e]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#2c1810]">Ngày Cưới</Label>
                                <Input
                                    type="date"
                                    value={weddingDate}
                                    onChange={(e) => setWeddingDate(e.target.value)}
                                    className="h-11 border-[#c9a96e]/20 focus:border-[#c9a96e]"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-11 border-[#c9a96e]/20"
                                    onClick={() => setStep('template')}
                                >
                                    ← Đổi mẫu
                                </Button>
                                <Button
                                    className="flex-1 h-11 bg-[#c9a96e] hover:bg-[#b8925a] text-white shadow-lg shadow-[#c9a96e]/30"
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
