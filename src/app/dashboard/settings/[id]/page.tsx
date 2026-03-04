'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft, Save, Globe, Lock, Trash2, AlertTriangle, Loader2, Copy, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface Invitation {
    id: string
    title: string
    slug: string
    wedding_date: string | null
    is_published: boolean
}

export default function SettingsPage() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const [inv, setInv] = useState<Invitation | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState('')

    // Form state
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [weddingDate, setWeddingDate] = useState('')
    const [isPublished, setIsPublished] = useState(false)

    useEffect(() => {
        async function load() {
            const supabase = createClient()
            const { data } = await supabase.from('invitations').select('*').eq('id', id).single()
            if (data) {
                setInv(data)
                setTitle(data.title)
                setSlug(data.slug)
                setWeddingDate(data.wedding_date?.split('T')[0] || '')
                setIsPublished(data.is_published)
            }
            setLoading(false)
        }
        load()
    }, [id])

    const handleSave = async () => {
        if (!title.trim() || !slug.trim()) {
            toast.error('Tên thiệp và slug không được để trống')
            return
        }
        setSaving(true)
        const supabase = createClient()
        // Note: 'password' column not yet in DB — only update available columns
        const { error } = await supabase.from('invitations').update({
            title: title.trim(),
            slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
            wedding_date: weddingDate || null,
            is_published: isPublished,
        }).eq('id', id)

        setSaving(false)
        if (error) {
            toast.error('Lỗi khi lưu: ' + error.message)
        } else {
            toast.success('✅ Đã lưu cài đặt!')
        }
    }

    const handleDelete = async () => {
        if (confirmDelete !== inv?.title) {
            toast.error('Tên thiệp không khớp')
            return
        }
        setDeleting(true)
        const supabase = createClient()
        await supabase.from('invitations').delete().eq('id', id)
        toast.success('Đã xóa thiệp.')
        router.push('/dashboard')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#c9a96e]" />
            </div>
        )
    }

    const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${slug}`

    return (
        <div className="min-h-screen bg-[#fdfaf7]">
            {/* Nav */}
            <nav className="border-b border-[#c9a96e]/10 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-[#2c1810]/60 hover:text-[#2c1810] transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </Link>
                    <span className="text-[#c9a96e]">/</span>
                    <span className="text-sm font-medium text-[#2c1810]">Cài đặt thiệp</span>
                    <div className="ml-auto">
                        <Button size="sm" className="bg-[#c9a96e] hover:bg-[#b8925a] text-white gap-2" onClick={handleSave} disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Lưu thay đổi
                        </Button>
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-[#2c1810] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Cài đặt thiệp
                    </h1>
                    <p className="text-sm text-[#2c1810]/50">{inv?.title}</p>
                </motion.div>

                {/* Basic Info */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    <Card className="border-[#c9a96e]/10">
                        <CardContent className="p-6 space-y-5">
                            <h2 className="font-semibold text-[#2c1810]">Thông tin cơ bản</h2>

                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm text-[#2c1810]/70">Tên thiệp *</Label>
                                <Input id="title" value={title} onChange={e => setTitle(e.target.value)}
                                    placeholder="Vd: Đám cưới Minh Anh & Quang Huy"
                                    className="border-[#c9a96e]/20 focus:border-[#c9a96e]" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-sm text-[#2c1810]/70">Đường dẫn (slug) *</Label>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center rounded-lg border border-[#c9a96e]/20 overflow-hidden flex-1">
                                        <span className="px-3 py-2 bg-[#c9a96e]/5 text-[#2c1810]/40 text-sm border-r border-[#c9a96e]/20 whitespace-nowrap">
                                            weddingcard.vn/
                                        </span>
                                        <Input id="slug" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                                            className="border-0 focus-visible:ring-0 rounded-none flex-1" />
                                    </div>
                                    <Button variant="outline" size="icon" className="border-[#c9a96e]/20 flex-shrink-0"
                                        onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success('Đã sao chép!') }}>
                                        <Copy className="w-4 h-4 text-[#c9a96e]" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="border-[#c9a96e]/20 flex-shrink-0" asChild>
                                        <a href={`/${slug}`} target="_blank"><ExternalLink className="w-4 h-4 text-[#c9a96e]" /></a>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-sm text-[#2c1810]/70">Ngày cưới</Label>
                                <Input id="date" type="date" value={weddingDate} onChange={e => setWeddingDate(e.target.value)}
                                    className="border-[#c9a96e]/20 focus:border-[#c9a96e]" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Publish */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                    <Card className="border-[#c9a96e]/10">
                        <CardContent className="p-6 space-y-5">
                            <h2 className="font-semibold text-[#2c1810]">Hiển thị & Bảo mật</h2>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-[#c9a96e]/5 border border-[#c9a96e]/10">
                                <div className="flex items-center gap-3">
                                    {isPublished ? <Globe className="w-5 h-5 text-green-500" /> : <Lock className="w-5 h-5 text-[#2c1810]/40" />}
                                    <div>
                                        <p className="font-medium text-sm text-[#2c1810]">
                                            {isPublished ? 'Đang công khai' : 'Đang là bản nháp'}
                                        </p>
                                        <p className="text-xs text-[#2c1810]/40">
                                            {isPublished ? 'Khách có thể xem thiệp qua link' : 'Chỉ bạn có thể xem'}
                                        </p>
                                    </div>
                                </div>
                                <Switch checked={isPublished} onCheckedChange={setIsPublished} />
                            </div>

                            {/* Password - coming soon until DB column is added */}
                            <div className="p-4 rounded-xl border border-[#c9a96e]/10 space-y-2 opacity-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-[#2c1810]/50" />
                                        <p className="font-medium text-sm text-[#2c1810]">Đặt mật khẩu thiệp</p>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Sắp có</span>
                                </div>
                                <p className="text-xs text-[#2c1810]/40">Tính năng bảo mật thiệp sẽ sớm được thêm vào.</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Save button */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Button className="w-full h-11 bg-[#c9a96e] hover:bg-[#b8925a] text-white gap-2 shadow-lg shadow-[#c9a96e]/20" onClick={handleSave} disabled={saving}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Lưu tất cả thay đổi
                    </Button>
                </motion.div>

                {/* Danger Zone */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                    <Card className="border-red-200">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <h2 className="font-semibold text-red-600">Vùng nguy hiểm</h2>
                            </div>
                            <p className="text-sm text-[#2c1810]/60 mb-4">
                                Xóa thiệp sẽ xóa toàn bộ dữ liệu (RSVP, lời chúc, ảnh...) và không thể khôi phục.
                                Nhập tên thiệp để xác nhận:
                            </p>
                            <p className="text-xs font-mono bg-red-50 px-3 py-1.5 rounded-lg text-red-700 mb-3 border border-red-100">
                                {inv?.title}
                            </p>
                            <Input
                                placeholder="Nhập lại tên thiệp để xác nhận"
                                value={confirmDelete}
                                onChange={e => setConfirmDelete(e.target.value)}
                                className="mb-3 border-red-200 focus:border-red-400"
                            />
                            <Button
                                variant="destructive"
                                className="w-full gap-2"
                                onClick={handleDelete}
                                disabled={confirmDelete !== inv?.title || deleting}
                            >
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                Xóa vĩnh viễn thiệp này
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
