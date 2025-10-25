// app/roundtables/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Link from 'next/link';

interface Roundtable {
    _id: string;
    title: string;
    creatorId: { _id: string; name?: string; email: string };
    createdAt: string;
}

export default function RoundtablesPage() {
    const [roundtables, setRoundtables] = useState<Roundtable[]>([]);
    const [newTitle, setNewTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // دریافت لیست میزگردها
    useEffect(() => {
        if (token) {
            loadRoundtables();
        } else {
            setError('لطفاً وارد شوید');
            setLoading(false);
        }
    }, [token]);

    const loadRoundtables = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/roundtables', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to load roundtables');
            const data = await res.json();
            setRoundtables(data);
        } catch (err) {
            setError('خطا در دریافت میزگردها');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ایجاد میزگرد جدید
    const createRoundtable = async () => {
        if (!newTitle) {
            setError('عنوان الزامی است');
            return;
        }
        try {
            const res = await fetch('/api/roundtables', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title: newTitle }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setRoundtables([data, ...roundtables]);
                setNewTitle('');
                setError('');
            }
        } catch (err) {
            setError('خطا در ایجاد میزگرد');
            console.error(err);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0a0f1a] text-white">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_60%),radial-gradient(circle_at_80%_60%,rgba(147,51,234,0.15),transparent_60%)] blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-950/10 to-transparent backdrop-blur-[2px]" />

            {/* Content Container */}
            <div className="relative z-10 p-10">
                {/* Header */}
                <header className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    >
                        میزگردهای شما
                    </motion.h1>
                    <p className="text-gray-400 mt-2">
                        {new Date().toLocaleDateString('fa-IR')} · محیط تعاملی گفت‌وگو
                    </p>
                </header>

                {/* Create Roundtable Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 max-w-md mx-auto"
                >
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="عنوان میزگرد جدید"
                            className="flex-1 p-3 rounded-2xl bg-slate-800/50 border border-gray-700/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50"
                        />
                        <button
                            onClick={createRoundtable}
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300"
                        >
                            ایجاد
                        </button>
                    </div>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 mt-2 text-sm"
                        >
                            {error}
                        </motion.p>
                    )}
                </motion.div>

                {/* Roundtables Carousel */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
                    }}
                >
                    {loading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-64 text-gray-500"
                        >
                            <motion.div
                                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"
                                transition={{ repeat: Infinity, duration: 1 }}
                            />
                            در حال بارگذاری میزگردها...
                        </motion.div>
                    ) : roundtables.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-64 text-gray-400"
                        >
                            <span className="text-6xl mb-4">✨</span>
                            <p>هیچ میزگردی ثبت نشده — گفت‌وگویی جدید شروع کنید ⚡️</p>
                        </motion.div>
                    ) : (
                        <Swiper spaceBetween={20} slidesPerView={3} breakpoints={{
                            320: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}>
                            {roundtables.map((rt) => (
                                <SwiperSlide key={rt._id}>
                                    <motion.div
                                        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                                        whileHover={{ scale: 1.06, rotate: 0.5 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="p-8 rounded-3xl cursor-pointer bg-gradient-to-br from-blue-500/10 to-fuchsia-600/5 border border-blue-400/20 hover:border-fuchsia-400/30 shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:shadow-[0_0_45px_rgba(147,51,234,0.25)] transition-all duration-300 backdrop-blur-xl"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <motion.span
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                                className="inline-block w-4 h-4 bg-gradient-to-r from-blue-400 to-fuchsia-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                            />
                                            <h2 className="text-2xl font-semibold">{rt.title}</h2>
                                        </div>
                                        <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                                            ایجاد شده توسط: {rt.creatorId?.name || 'ناشناس'}
                                        </p>
                                        <Link
                                            href={`/dashboard/roundtables/${rt._id}`}
                                            className="mt-4 inline-block text-blue-400 hover:text-fuchsia-400"
                                        >
                                            پیوستن به گفت‌وگو
                                        </Link>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </motion.section>
            </div>
        </div>
    );
}