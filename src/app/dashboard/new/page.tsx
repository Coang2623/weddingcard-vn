'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DEFAULT_TEMPLATES } from '@/lib/templates'
import type { Template } from '@/types'

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

export default function NewInvitationPage() {
    const [selected, setSelected] = useState<Template | null>(null)

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
                            Chọn Mẫu Thiệp
                        </span>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
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
                                    : 'border-transparent hover:border-[#c9a96e]/30 hover:shadow-lg hover:scale-102'
                                }`}
                        >
                            {/* Template Preview */}
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

                            {/* Template Info */}
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

                {/* CTA */}
                <div className="flex justify-center">
                    <Button
                        size="lg"
                        disabled={!selected}
                        className="bg-[#c9a96e] hover:bg-[#b8925a] text-white gap-2 px-10 h-12 disabled:opacity-40 shadow-lg shadow-[#c9a96e]/30"
                        asChild={!!selected}
                    >
                        {selected ? (
                            <Link href={`/dashboard/builder/new?template=${selected.id}`}>
                                <Heart className="w-4 h-4 fill-white" />
                                Dùng mẫu &ldquo;{selected.name}&rdquo; →
                            </Link>
                        ) : (
                            <span>Chọn một mẫu thiệp để tiếp tục</span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}
