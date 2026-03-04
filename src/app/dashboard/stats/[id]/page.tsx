'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ArrowLeft, Users, CheckCircle, XCircle, Clock, TrendingUp, Loader2, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'

interface RSVP {
    id: string
    guest_name: string
    attending: boolean
    guest_count: number
    message: string | null
    created_at: string
}

interface Invitation {
    id: string
    title: string
    slug: string
    wedding_date: string | null
}

export default function StatsPage() {
    const { id } = useParams<{ id: string }>()
    const [invitation, setInvitation] = useState<Invitation | null>(null)
    const [rsvps, setRsvps] = useState<RSVP[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const supabase = createClient()
            const [{ data: inv }, { data: rsvpData }] = await Promise.all([
                supabase.from('invitations').select('id,title,slug,wedding_date').eq('id', id).single(),
                supabase.from('rsvps').select('*').eq('invitation_id', id).order('created_at', { ascending: false }),
            ])
            setInvitation(inv)
            setRsvps(rsvpData || [])
            setLoading(false)
        }
        load()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#c9a96e]" />
            </div>
        )
    }

    const attending = rsvps.filter(r => r.attending)
    const declining = rsvps.filter(r => !r.attending)
    const totalGuests = attending.reduce((s, r) => s + (r.guest_count || 1), 0)
    const responseRate = rsvps.length ? Math.round((rsvps.length / Math.max(rsvps.length, 1)) * 100) : 0

    return (
        <div className="min-h-screen bg-[#fdfaf7]">
            {/* Nav */}
            <nav className="border-b border-[#c9a96e]/10 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-[#2c1810]/60 hover:text-[#2c1810] transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Dashboard
                    </Link>
                    <span className="text-[#c9a96e]">/</span>
                    <span className="text-sm font-medium text-[#2c1810]">Thống kê RSVP</span>
                    {invitation && (
                        <>
                            <span className="text-[#c9a96e]">/</span>
                            <span className="text-sm text-[#2c1810]/60">{invitation.title}</span>
                        </>
                    )}
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-[#2c1810] mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Thống kê RSVP
                    </h1>
                    <p className="text-sm text-[#2c1810]/50 mb-8">{invitation?.title}</p>
                </motion.div>

                {/* Summary Cards */}
                <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    {[
                        { icon: Users, label: 'Tổng phản hồi', value: rsvps.length, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { icon: CheckCircle, label: 'Sẽ tham dự', value: attending.length, color: 'text-green-500', bg: 'bg-green-50' },
                        { icon: XCircle, label: 'Không thể đến', value: declining.length, color: 'text-red-400', bg: 'bg-red-50' },
                        { icon: TrendingUp, label: 'Tổng khách đến', value: totalGuests, color: 'text-amber-500', bg: 'bg-amber-50' },
                    ].map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 + 0.15 }}>
                            <Card className="border-[#c9a96e]/10">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs text-[#2c1810]/40 mb-1">{s.label}</p>
                                            <p className="text-2xl font-bold text-[#2c1810]">{s.value}</p>
                                        </div>
                                        <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                                            <s.icon className={`w-4 h-4 ${s.color}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Attending breakdown */}
                {rsvps.length > 0 && (
                    <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <Card className="border-[#c9a96e]/10">
                            <CardContent className="p-6">
                                <h2 className="font-semibold text-[#2c1810] mb-4">Tỷ lệ phản hồi</h2>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs text-[#2c1810]/50 mb-1.5">
                                            <span>Sẽ tham dự ({attending.length})</span>
                                            <span>{rsvps.length > 0 ? Math.round(attending.length / rsvps.length * 100) : 0}%</span>
                                        </div>
                                        <Progress value={rsvps.length > 0 ? attending.length / rsvps.length * 100 : 0}
                                            className="h-2 bg-green-100 [&>div]:bg-green-500" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs text-[#2c1810]/50 mb-1.5">
                                            <span>Không thể đến ({declining.length})</span>
                                            <span>{rsvps.length > 0 ? Math.round(declining.length / rsvps.length * 100) : 0}%</span>
                                        </div>
                                        <Progress value={rsvps.length > 0 ? declining.length / rsvps.length * 100 : 0}
                                            className="h-2 bg-red-100 [&>div]:bg-red-400" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* RSVP List */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-[#2c1810]">Danh sách phản hồi</h2>
                        <Badge variant="secondary">{rsvps.length} người</Badge>
                    </div>

                    {rsvps.length === 0 ? (
                        <Card className="border-[#c9a96e]/10">
                            <CardContent className="p-16 text-center">
                                <Users className="w-10 h-10 text-[#c9a96e]/30 mx-auto mb-3" />
                                <p className="text-[#2c1810]/50 text-sm">Chưa có phản hồi nào</p>
                                <p className="text-[#2c1810]/30 text-xs mt-1">Khách sẽ xuất hiện đây khi họ xác nhận tham dự</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {rsvps.map((r, i) => (
                                <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                                    <Card className="border-[#c9a96e]/10 hover:shadow-sm transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${r.attending ? 'bg-green-50' : 'bg-red-50'}`}>
                                                        {r.attending
                                                            ? <CheckCircle className="w-4 h-4 text-green-500" />
                                                            : <XCircle className="w-4 h-4 text-red-400" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-[#2c1810]">{r.guest_name}</p>
                                                        <p className="text-xs text-[#2c1810]/40">
                                                            {r.attending ? `${r.guest_count} người tham dự` : 'Không thể tham dự'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <Badge className={r.attending ? 'bg-green-100 text-green-700 border-0 text-xs' : 'bg-red-100 text-red-600 border-0 text-xs'}>
                                                        {r.attending ? 'Tham dự' : 'Vắng'}
                                                    </Badge>
                                                    <p className="text-[10px] text-[#2c1810]/30 mt-1">
                                                        {new Date(r.created_at).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>
                                            </div>
                                            {r.message && (
                                                <div className="mt-3 flex gap-2 pl-12">
                                                    <MessageSquare className="w-3.5 h-3.5 text-[#c9a96e] flex-shrink-0 mt-0.5" />
                                                    <p className="text-xs text-[#2c1810]/60 italic">"{r.message}"</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}
