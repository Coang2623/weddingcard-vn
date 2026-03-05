'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ArrowLeft, Heart, Plus, Upload, Search, Trash2,
    Users, CheckCircle2, XCircle, Clock, BarChart2,
    Download, UserPlus, Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/lib/toast'

interface Guest {
    id: string
    name: string
    phone?: string
    group: 'family' | 'friends' | 'colleagues' | 'all'
    rsvp: 'pending' | 'attending' | 'declined'
    count: number
    message?: string
}

const MOCK_GUESTS: Guest[] = [
    { id: '1', name: 'Nguyễn Thị Lan', phone: '0912345678', group: 'family', rsvp: 'attending', count: 2, message: 'Chúc mừng đám cưới!' },
    { id: '2', name: 'Trần Văn Minh', phone: '0987654321', group: 'friends', rsvp: 'attending', count: 1 },
    { id: '3', name: 'Lê Thị Hoa', phone: '0909123456', group: 'friends', rsvp: 'declined', count: 0, message: 'Xin lỗi, tôi không tham dự được.' },
    { id: '4', name: 'Phạm Quang Nam', phone: '0936987654', group: 'colleagues', rsvp: 'pending', count: 1 },
    { id: '5', name: 'Hoàng Thu Trang', phone: '0963258741', group: 'family', rsvp: 'attending', count: 3 },
    { id: '6', name: 'Vũ Đức Hùng', phone: '0971234567', group: 'friends', rsvp: 'pending', count: 2 },
]

const GROUP_LABELS: Record<string, string> = {
    family: 'Gia đình',
    friends: 'Bạn bè',
    colleagues: 'Đồng nghiệp',
    all: 'Tất cả',
}

const RSVP_CONFIG = {
    attending: { label: 'Sẽ tham dự', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', badge: 'bg-green-100 text-green-600' },
    declined: { label: 'Không tham dự', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', badge: 'bg-red-100 text-red-600' },
    pending: { label: 'Chưa phản hồi', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-600' },
}

export default function GuestsPage() {
    const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS)
    const [search, setSearch] = useState('')
    const [filterGroup, setFilterGroup] = useState('all')
    const [filterRsvp, setFilterRsvp] = useState('all')
    const [addOpen, setAddOpen] = useState(false)
    const [newGuest, setNewGuest] = useState({ name: '', phone: '', group: 'friends' as Guest['group'] })

    const filtered = guests.filter((g) => {
        const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.phone?.includes(search)
        const matchGroup = filterGroup === 'all' || g.group === filterGroup
        const matchRsvp = filterRsvp === 'all' || g.rsvp === filterRsvp
        return matchSearch && matchGroup && matchRsvp
    })

    const stats = {
        total: guests.length,
        attending: guests.filter(g => g.rsvp === 'attending').length,
        declined: guests.filter(g => g.rsvp === 'declined').length,
        pending: guests.filter(g => g.rsvp === 'pending').length,
        totalAttendees: guests.filter(g => g.rsvp === 'attending').reduce((s, g) => s + g.count, 0),
    }

    const handleAdd = () => {
        if (!newGuest.name) { toast.error('Vui lòng nhập tên khách.'); return }
        const guest: Guest = { ...newGuest, id: Date.now().toString(), rsvp: 'pending', count: 1 }
        setGuests([...guests, guest])
        setNewGuest({ name: '', phone: '', group: 'friends' })
        setAddOpen(false)
        toast.success('Đã thêm khách mời!')
    }

    const handleRemove = (id: string) => {
        setGuests(guests.filter(g => g.id !== id))
        toast.success('Đã xóa khách mời.')
    }

    return (
        <div className="min-h-screen bg-[#FDF5F0]">
            {/* Nav */}
            <nav className="border-b border-[#8B0000]/10 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="gap-2 text-[#4A0E0E]/60 h-8">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-[#8B0000] fill-[#8B0000]" />
                        <span className="font-bold text-[#4A0E0E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Quản lý Khách Mời
                        </span>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs border-[#8B0000]/20 gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            Xuất CSV
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs border-[#8B0000]/20 gap-1.5">
                            <Upload className="w-3.5 h-3.5" />
                            Import CSV
                        </Button>
                        <Dialog open={addOpen} onOpenChange={setAddOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-8 text-xs bg-[#8B0000] hover:bg-[#A61C00] text-white gap-1.5">
                                    <Plus className="w-3.5 h-3.5" />
                                    Thêm khách
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Thêm khách mời mới</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-2">
                                    <div className="space-y-1.5">
                                        <Label>Tên khách mời *</Label>
                                        <Input placeholder="Nguyễn Văn A" value={newGuest.name} onChange={e => setNewGuest({ ...newGuest, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Số điện thoại</Label>
                                        <Input placeholder="0912345678" value={newGuest.phone} onChange={e => setNewGuest({ ...newGuest, phone: e.target.value })} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Nhóm</Label>
                                        <Select value={newGuest.group} onValueChange={(v) => setNewGuest({ ...newGuest, group: v as Guest['group'] })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="family">Gia đình</SelectItem>
                                                <SelectItem value="friends">Bạn bè</SelectItem>
                                                <SelectItem value="colleagues">Đồng nghiệp</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button onClick={handleAdd} className="w-full bg-[#8B0000] hover:bg-[#A61C00] text-white">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Thêm khách
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Tổng khách', value: stats.total, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Sẽ tham dự', value: `${stats.attending} (${stats.totalAttendees} người)`, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
                        { label: 'Không tham dự', value: stats.declined, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
                        { label: 'Chưa phản hồi', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
                    ].map((s) => (
                        <Card key={s.label} className="border-[#8B0000]/10">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs text-[#4A0E0E]/40">{s.label}</p>
                                    <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                                        <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                                    </div>
                                </div>
                                <p className="text-xl font-bold text-[#4A0E0E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                                    {s.value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* RSVP Progress bar */}
                <Card className="border-[#8B0000]/10 mb-6">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <BarChart2 className="w-4 h-4 text-[#8B0000]" />
                            <span className="font-medium text-sm text-[#4A0E0E]">Tỉ lệ phản hồi RSVP</span>
                            <span className="text-sm text-[#4A0E0E]/50 ml-auto">
                                {stats.attending + stats.declined}/{stats.total} ({Math.round(((stats.attending + stats.declined) / stats.total) * 100)}%)
                            </span>
                        </div>
                        <div className="flex rounded-full overflow-hidden h-3">
                            <div className="bg-green-400 transition-all" style={{ width: `${(stats.attending / stats.total) * 100}%` }} />
                            <div className="bg-red-300 transition-all" style={{ width: `${(stats.declined / stats.total) * 100}%` }} />
                            <div className="bg-amber-200 flex-1" />
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-[#4A0E0E]/50">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />Sẽ tham dự</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-300 inline-block" />Không tham dự</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-200 inline-block" />Chưa phản hồi</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A0E0E]/30" />
                        <Input
                            placeholder="Tìm theo tên hoặc số điện thoại..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 h-9 text-sm border-[#8B0000]/20"
                        />
                    </div>
                    <Select value={filterGroup} onValueChange={setFilterGroup}>
                        <SelectTrigger className="w-40 h-9 text-sm border-[#8B0000]/20">
                            <SelectValue placeholder="Nhóm" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả nhóm</SelectItem>
                            <SelectItem value="family">Gia đình</SelectItem>
                            <SelectItem value="friends">Bạn bè</SelectItem>
                            <SelectItem value="colleagues">Đồng nghiệp</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterRsvp} onValueChange={setFilterRsvp}>
                        <SelectTrigger className="w-44 h-9 text-sm border-[#8B0000]/20">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="attending">Sẽ tham dự</SelectItem>
                            <SelectItem value="declined">Không tham dự</SelectItem>
                            <SelectItem value="pending">Chưa phản hồi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Guest List */}
                <Tabs defaultValue="list">
                    <TabsList className="mb-4 bg-[#8B0000]/5">
                        <TabsTrigger value="list" className="text-sm data-[state=active]:bg-white">Danh sách</TabsTrigger>
                        <TabsTrigger value="pending" className="text-sm data-[state=active]:bg-white">
                            Chưa phản hồi
                            {stats.pending > 0 && <Badge className="ml-1.5 bg-amber-400 text-white border-0 text-xs px-1.5">{stats.pending}</Badge>}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="list">
                        <div className="space-y-2">
                            {filtered.map((guest, i) => {
                                const rsvpCfg = RSVP_CONFIG[guest.rsvp]
                                return (
                                    <motion.div
                                        key={guest.id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                    >
                                        <Card className="border-[#8B0000]/10 hover:shadow-sm transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full ${rsvpCfg.bg} flex items-center justify-center flex-shrink-0`}>
                                                        <rsvpCfg.icon className={`w-4.5 h-4.5 ${rsvpCfg.color}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-medium text-sm text-[#4A0E0E]">{guest.name}</span>
                                                            <Badge className={`text-xs border-0 ${rsvpCfg.badge}`}>{rsvpCfg.label}</Badge>
                                                            <Badge variant="outline" className="text-xs border-[#8B0000]/20 text-[#4A0E0E]/50">
                                                                {GROUP_LABELS[guest.group]}
                                                            </Badge>
                                                        </div>
                                                        {guest.phone && <p className="text-xs text-[#4A0E0E]/40 mt-0.5">{guest.phone}</p>}
                                                        {guest.message && <p className="text-xs text-[#4A0E0E]/50 mt-1 italic">&ldquo;{guest.message}&rdquo;</p>}
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        {guest.rsvp === 'attending' && (
                                                            <p className="text-xs text-green-600 font-medium">{guest.count} người</p>
                                                        )}
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-50 hover:text-blue-500">
                                                                <Mail className="w-3.5 h-3.5" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 hover:bg-red-50 hover:text-red-500"
                                                                onClick={() => handleRemove(guest.id)}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )
                            })}
                            {filtered.length === 0 && (
                                <div className="text-center py-16 text-[#4A0E0E]/30">
                                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">Không tìm thấy khách mời phù hợp</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="pending">
                        <div className="space-y-2">
                            {guests.filter(g => g.rsvp === 'pending').map((guest, i) => (
                                <motion.div key={guest.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                                    <Card className="border-amber-200 bg-amber-50/50">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm text-[#4A0E0E]">{guest.name}</p>
                                                {guest.phone && <p className="text-xs text-[#4A0E0E]/40">{guest.phone} · {GROUP_LABELS[guest.group]}</p>}
                                            </div>
                                            <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-amber-300">
                                                <Mail className="w-3 h-3" />
                                                Gửi nhắc nhở
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                            {stats.pending === 0 && (
                                <div className="text-center py-16 text-green-500">
                                    <CheckCircle2 className="w-10 h-10 mx-auto mb-3" />
                                    <p className="text-sm font-medium">Tất cả khách đã phản hồi!</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
