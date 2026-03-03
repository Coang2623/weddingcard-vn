'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            toast.success('Đăng nhập thành công! Đang chuyển hướng...')
            router.push('/dashboard')
        } catch (err: unknown) {
            const error = err as { message?: string }
            toast.error(error.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#fdfaf7] flex">
            {/* Left decorative */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#2c1810]">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#c9a96e] blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-rose-400 blur-3xl" />
                </div>
                <div className="relative flex flex-col items-center justify-center w-full p-12 text-center">
                    <div className="text-8xl mb-8 animate-float">💒</div>
                    <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Chào mừng trở lại
                    </h2>
                    <p className="text-white/60 text-lg leading-relaxed max-w-sm">
                        Thiệp cưới của bạn đang chờ. Đăng nhập để tiếp tục chỉnh sửa và quản lý khách mời.
                    </p>
                    <div className="mt-10 flex items-center gap-4 text-white/40 text-sm">
                        <Heart className="w-4 h-4 fill-[#c9a96e] text-[#c9a96e]" />
                        <span>WeddingCard.vn — Thiệp cưới đẹp nhất Việt Nam</span>
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
                        Đăng nhập
                    </h1>
                    <p className="text-[#2c1810]/50 mb-8">
                        Chưa có tài khoản?{' '}
                        <Link href="/register" className="text-[#c9a96e] hover:underline font-medium">
                            Đăng ký miễn phí
                        </Link>
                    </p>

                    <form onSubmit={handleLogin} className="space-y-5">
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
                                    className="pl-10 h-11 border-[#c9a96e]/20 focus:border-[#c9a96e] focus:ring-[#c9a96e]/20"
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
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 pr-10 h-11 border-[#c9a96e]/20 focus:border-[#c9a96e] focus:ring-[#c9a96e]/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2c1810]/30 hover:text-[#2c1810]/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-sm text-[#c9a96e] hover:underline">
                                Quên mật khẩu?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-[#c9a96e] hover:bg-[#b8925a] text-white shadow-lg shadow-[#c9a96e]/30"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang đăng nhập...</>
                            ) : (
                                'Đăng nhập'
                            )}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#c9a96e]/10" />
                        </div>
                        <div className="relative flex justify-center text-xs text-[#2c1810]/40 bg-[#fdfaf7] px-3">
                            hoặc
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full h-11 border-[#c9a96e]/20 hover:border-[#c9a96e]/40 text-[#2c1810]"
                        onClick={async () => {
                            const supabase = createClient()
                            await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })
                        }}
                    >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Tiếp tục với Google
                    </Button>

                    <p className="mt-8 text-center text-xs text-[#2c1810]/30">
                        Bằng cách đăng nhập, bạn đồng ý với{' '}
                        <Link href="/terms" className="underline hover:text-[#c9a96e]">Điều khoản</Link>{' '}
                        và{' '}
                        <Link href="/privacy" className="underline hover:text-[#c9a96e]">Chính sách riêng tư</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
