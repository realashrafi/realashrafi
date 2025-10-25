// app/signup/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const isSubmitting = useRef(false); // جلوگیری از اسپم دکمه

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // پاک کردن خطا هنگام تایپ
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting.current) return; // جلوگیری از ارسال چندگانه
        isSubmitting.current = true;
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('رمز عبور و تکرار آن مطابقت ندارند');
            setLoading(false);
            isSubmitting.current = false;
            return;
        }

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                router.push('/dashboard');
            } else {
                setError(data.error || 'خطا در ثبت نام');
            }
        } catch (err) {
            setError('خطای اتصال به سرور');
            console.error('Error in signUp:', err);
        } finally {
            setLoading(false);
            isSubmitting.current = false;
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0f1a] text-white">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_60%),radial-gradient(circle_at_80%_60%,rgba(147,51,234,0.15),transparent_60%)] blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-950/10 to-transparent backdrop-blur-[2px]" />

            {/* Content Container */}
            <div className="relative z-10 max-w-md mx-auto mt-16 p-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="rounded-3xl bg-gradient-to-br from-slate-800/60 to-slate-900/70 p-8 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-400 to-fuchsia-500 bg-clip-text text-transparent mb-6"
                    >
                        ثبت نام
                    </motion.h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <input
                                type="text"
                                name="name"
                                placeholder="نام"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 rounded-2xl bg-slate-800/50 border border-gray-700/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50"
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <input
                                type="email"
                                name="email"
                                placeholder="ایمیل"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 rounded-2xl bg-slate-800/50 border border-gray-700/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50"
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <input
                                type="password"
                                name="password"
                                placeholder="رمز عبور"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 rounded-2xl bg-slate-800/50 border border-gray-700/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50"
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="تکرار رمز عبور"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-3 rounded-2xl bg-slate-800/50 border border-gray-700/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50"
                                required
                            />
                        </motion.div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className="text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            type="submit"
                            disabled={loading}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="w-full p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'در حال ثبت...' : 'ثبت نام'}
                        </motion.button>
                    </form>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="text-center mt-6 text-gray-400"
                    >
                        حساب دارید؟{' '}
                        <a href="/login" className="text-blue-400 hover:underline">
                            وارد شوید
                        </a>
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
}