'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const perks = [
    'Tạo thiệp cưới hoàn toàn miễn phí',
    'Template đẹp, dễ tùy chỉnh',
    'Quản lý RSVP tự động',
    'Link thiệp cá nhân hoá',
]

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password.length < 8) {
            toast.error('Mật khẩu phải có ít nhất 8 ký tự.')
            return
        }
        setLoading(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: name },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
            toast.success('Tài khoản đã được tạo! Vui lòng kiểm tra email để xác nhận.')
            router.push('/dashboard')
        } catch (err: unknown) {
            const error = err as { message?: string }
            toast.error(error.message || 'Đăng ký thất bại. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fdfaf7] flex">
            {/* Left decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#f5e6d3] to-[#fdfaf7]">
                <div className="relative flex flex-col items-center justify-center w-full p-12">
                    <div className="text-center mb-10">
                        <div className="text-7xl mb-6 animate-float">💐</div>
                        <h2 className="text-3xl font-bold text-[#2c1810] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Bắt đầu hành trình<br />của bạn
                        </h2>
                        <p className="text-[#2c1810]/50 text-base leading-relaxed max-w-sm">
                            Hàng nghìn cặp đôi đã tin tưởng WeddingCard.vn để tạo nên ngày đặc biệt nhất của cuộc đời.
                        </p>
                    </div>
                    <div className="space-y-4 w-full max-w-xs">
                        {perks.map((perk, i) => (
                            <motion.div
                                key={perk}
                                className="flex items-center gap-3 glass-card rounded-xl p-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.15 }}
                            >
                                <CheckCircle2 className="w-5 h-5 text-[#c9a96e] flex-shrink-0" />
                                <span className="text-sm text-[#2c1810]/70">{perk}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-8">
                        <Heart className="w-6 h-6 text-[#c9a96e] fill-[#c9a96e]" />
                        <span className="font-bold text-lg text-[#2c1810]" style={{ fontFamily: 'Playfair Display, serif' }}>
                            WeddingCard<span className="text-[#c9a96e]">.vn</span>
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-[#2c1810] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Tạo tài khoản
                    </h1>
                    <p className="text-[#2c1810]/50 mb-8">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="text-[#c9a96e] hover:underline font-medium">
                            Đăng nhập tại đây
                        </Link>
                    </p>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[#2c1810] font-medium">Tên của bạn</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2c1810]/30" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="pl-10 h-11 border-[#c9a96e]/20 focus:border-[#c9a96e]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[#2c1810] font-medium">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2c1810]/30" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 h-11 border-[#c9a96e]/20 focus:border-[#c9a96e]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-[#2c1810] font-medium">Mật khẩu</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2c1810]/30" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Ít nhất 8 ký tự"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 pr-10 h-11 border-[#c9a96e]/20 focus:border-[#c9a96e]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2c1810]/30 hover:text-[#2c1810]/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {password && (
                                <div className="flex gap-1 mt-2">
                                    {[4, 6, 8].map((len) => (
                                        <div
                                            key={len}
                                            className={`h-1 flex-1 rounded-full transition-all ${password.length >= len ? 'bg-[#c9a96e]' : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-[#c9a96e] hover:bg-[#b8925a] text-white shadow-lg shadow-[#c9a96e]/30"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang tạo tài khoản...</>
                            ) : (
                                'Tạo Tài Khoản Miễn Phí'
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-xs text-[#2c1810]/30">
                        Bằng cách đăng ký, bạn đồng ý với{' '}
                        <Link href="/terms" className="underline hover:text-[#c9a96e]">Điều khoản dịch vụ</Link>{' '}
                        và{' '}
                        <Link href="/privacy" className="underline hover:text-[#c9a96e]">Chính sách riêng tư</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
