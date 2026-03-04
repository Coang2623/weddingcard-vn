'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Heart, Plus, Eye, Settings, Users, BarChart2,
    Copy, ExternalLink, MoreVertical, Sparkles, Clock, Loader2, LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { toast } from '@/lib/toast'
import { getMyInvitations, getCurrentUser, signOut } from '@/lib/supabase/api'
import type { Invitation } from '@/types'

export default function DashboardPage() {
    const router = useRouter()
    const [copied, setCopied] = useState(false)
    const [invitations, setInvitations] = useState<Array<Invitation & { invitation_designs?: Array<{ blocks: unknown[] }> }>>([])
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState('')

    useEffect(() => {
        async function loadData() {
            try {
                const [user, data] = await Promise.all([
                    getCurrentUser(),
                    getMyInvitations(),
                ])
                setUserName(user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Bạn')
                setInvitations(data || [])
            } catch (err) {
                console.error('Failed to load dashboard:', err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const copyLink = (slug: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/${slug}`)
        setCopied(true)
        toast.success('Đã sao chép link thiệp!')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
    }

    const stats = [
        { label: 'Số thiệp', value: String(invitations.length), icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50' },
        { label: 'Lượt xem', value: String(invitations.reduce((s, i) => s + (i.view_count || 0), 0)), icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Đã đăng', value: String(invitations.filter(i => i.is_published).length), icon: Sparkles, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Ngày còn lại', value: invitations[0]?.wedding_date ? String(Math.max(0, Math.ceil((new Date(invitations[0].wedding_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))) : '--', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    ]

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#c9a96e] mx-auto mb-4" />
                    <p className="text-sm text-[#2c1810]/50">Đang tải...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#fdfaf7]">
            {/* Top Nav */}
            <nav className="border-b border-[#c9a96e]/10 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-[#c9a96e] fill-[#c9a96e]" />
                        <span className="font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            WeddingCard<span className="text-[#c9a96e]">.vn</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button
                            size="sm"
                            className="bg-[#c9a96e] hover:bg-[#b8925a] text-white gap-2"
                            asChild
                        >
                            <Link href="/dashboard/new">
                                <Plus className="w-4 h-4" /> Tạo thiệp mới
                            </Link>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="w-9 h-9 cursor-pointer border-2 border-[#c9a96e]/20 hover:border-[#c9a96e]/50 transition-colors">
                                    <AvatarFallback className="bg-[#c9a96e]/10 text-[#c9a96e] text-sm font-semibold">MA</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
                                <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500" onClick={handleSignOut}>
                                    <LogOut className="w-3.5 h-3.5 mr-2" />Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Welcome */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Xin chào, {userName} 👋
                    </h1>
                    <p className="text-[#2c1810]/50 mt-1">Quản lý và theo dõi thiệp cưới của bạn</p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {stats.map((stat) => (
                        <Card key={stat.label} className="border-[#c9a96e]/10 hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs text-[#2c1810]/40 mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {/* Main content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Invitations List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-[#2c1810]">Thiệp cưới của bạn</h2>
                            <Badge variant="secondary" className="text-xs">{invitations.length} thiệp</Badge>
                        </div>

                        {invitations.map((inv, i) => (
                            <motion.div
                                key={inv.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.2 }}
                            >
                                <Card className="border-[#c9a96e]/10 hover:shadow-md transition-all hover:border-[#c9a96e]/30 group">
                                    <CardContent className="p-5">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                                                        {inv.title}
                                                    </h3>
                                                    <Badge className={inv.is_published ? 'bg-green-100 text-green-600 border-0 text-xs' : 'bg-neutral-100 text-neutral-500 border-0 text-xs'}>
                                                        {inv.is_published ? 'Đã đăng' : 'Nháp'}
                                                    </Badge>
                                                </div>
                                                {inv.wedding_date && (
                                                    <p className="text-sm text-[#2c1810]/50 flex items-center gap-2">
                                                        <Clock className="w-3 h-3" />
                                                        Cưới ngày {new Date(inv.wedding_date).toLocaleDateString('vi-VN')}
                                                    </p>
                                                )}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/builder/${inv.id}`}>Chỉnh sửa thiệp</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/guests/${inv.id}`}>Quản lý khách mời</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/${inv.slug}`} target="_blank">Xem thiệp</Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-500">Xóa thiệp</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        {/* Stats */}
                                        <div className="mb-4 flex items-center gap-4 text-xs text-[#2c1810]/50">
                                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {inv.view_count} lượt xem</span>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs border-[#c9a96e]/20 text-[#c9a96e] hover:bg-[#c9a96e]/5 gap-1.5"
                                                onClick={() => copyLink(inv.slug)}
                                            >
                                                <Copy className="w-3 h-3" />
                                                {copied ? 'Đã sao chép!' : 'Sao chép link'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 text-xs border-[#c9a96e]/20 gap-1.5"
                                                asChild
                                            >
                                                <Link href={`/${inv.slug}`} target="_blank">
                                                    <ExternalLink className="w-3 h-3" />
                                                    Xem thiệp
                                                </Link>
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="h-8 text-xs bg-[#2c1810] hover:bg-[#3d2415] text-white gap-1.5"
                                                asChild
                                            >
                                                <Link href={`/dashboard/builder/${inv.id}`}>
                                                    <Settings className="w-3 h-3" />
                                                    Chỉnh sửa
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}

                        {/* Empty state / Create new card */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link href="/dashboard/new">
                                <Card className="border-2 border-dashed border-[#c9a96e]/20 hover:border-[#c9a96e]/50 transition-all cursor-pointer group hover:shadow-md">
                                    <CardContent className="p-8 flex flex-col items-center text-center">
                                        <div className="w-12 h-12 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Plus className="w-6 h-6 text-[#c9a96e]" />
                                        </div>
                                        <p className="font-medium text-[#2c1810]/70 group-hover:text-[#2c1810] transition-colors">
                                            Tạo thiệp cưới mới
                                        </p>
                                        <p className="text-sm text-[#2c1810]/40 mt-1">Chọn mẫu và bắt đầu chỉnh sửa</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Quick Actions */}
                        <Card className="border-[#c9a96e]/10">
                            <CardContent className="p-5">
                                <h3 className="font-semibold text-[#2c1810] mb-4 text-sm">Truy cập nhanh</h3>
                                {invitations.length === 0 ? (
                                    <p className="text-xs text-[#2c1810]/40 text-center py-2">
                                        Tạo thiệp đầu tiên để bắt đầu
                                    </p>
                                ) : (
                                    <div className="space-y-1">
                                        {[
                                            { icon: Sparkles, label: 'Chỉnh sửa thiệp', href: `/dashboard/builder/${invitations[0].id}`, color: 'text-purple-500 bg-purple-50' },
                                            { icon: Users, label: 'Danh sách khách mời', href: `/dashboard/guests/${invitations[0].id}`, color: 'text-blue-500 bg-blue-50' },
                                            { icon: BarChart2, label: 'Thống kê RSVP', href: `/dashboard/stats/${invitations[0].id}`, color: 'text-green-500 bg-green-50' },
                                            { icon: Settings, label: 'Cài đặt thiệp', href: `/dashboard/settings/${invitations[0].id}`, color: 'text-slate-500 bg-slate-50' },
                                        ].map((item) => (
                                            <Link
                                                key={item.label}
                                                href={item.href}
                                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#c9a96e]/5 transition-colors group"
                                            >
                                                <div className={`w-8 h-8 rounded-lg ${item.color.split(' ')[1]} flex items-center justify-center flex-shrink-0`}>
                                                    <item.icon className={`w-4 h-4 ${item.color.split(' ')[0]}`} />
                                                </div>
                                                <span className="text-sm text-[#2c1810]/70 group-hover:text-[#2c1810] transition-colors font-medium">
                                                    {item.label}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Upgrade prompt */}
                        <Card className="border-0 bg-gradient-to-br from-[#2c1810] to-[#4a2518] text-white overflow-hidden relative">
                            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[#c9a96e]/20 blur-2xl" />
                            <CardContent className="p-5 relative">
                                <Sparkles className="w-8 h-8 text-[#c9a96e] mb-3" />
                                <h3 className="font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    Nâng cấp Gói Cặp Đôi
                                </h3>
                                <p className="text-white/60 text-xs mb-4 leading-relaxed">
                                    Mở khóa 20+ template premium, bảo mật thiệp, sổ lưu bút realtime và nhiều hơn nữa.
                                </p>
                                <Button size="sm" className="w-full bg-[#c9a96e] hover:bg-[#b8925a] text-white text-xs">
                                    Nâng cấp – 199K/lần
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
