// app/roundtables/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

interface Roundtable {
    _id: string;
    title: string;
    creatorId: { _id: string; name?: string; email: string };
    createdAt: string;
}

interface Message {
    _id: string;
    content: string;
    userId: { _id: string; name?: string };
    createdAt: string;
}

export default function RoundtablePage() {
    const { id } = useParams();
    const [roundtable, setRoundtable] = useState<Roundtable | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // دریافت اطلاعات میزگرد و پیام‌ها
    useEffect(() => {
        if (token && id) {
            loadRoundtable();
        } else {
            setError('لطفاً وارد شوید');
            setLoading(false);
        }
    }, [token, id]);

    const loadRoundtable = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/roundtables/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to load roundtable');
            const data = await res.json();
            setRoundtable(data.roundtable);
            setMessages(data.messages);
        } catch (err) {
            setError('خطا در دریافت اطلاعات');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ارسال پیام جدید
    const sendMessage = async () => {
        if (!newMessage) {
            setError('متن پیام الزامی است');
            return;
        }
        try {
            const res = await fetch(`/api/roundtables/${id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: newMessage }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setMessages([data, ...messages]);
                setNewMessage('');
                setError('');
            }
        } catch (err) {
            setError('خطا در ارسال پیام');
            console.error(err);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#0a0f1a] text-white">
            {/* Background Layers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_60%),radial-gradient(circle_at_80%_60%,rgba(147,51,234,0.15),transparent_60%)] blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-950/10 to-transparent backdrop-blur-[2px]" />

            {/* Content Container */}
            <div className="relative z-10 p-10 max-w-3xl mx-auto">
                {/* Header */}
                <header className="mb-12 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-fuchsia-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    >
                        {roundtable?.title || 'در حال بارگذاری...'}
                    </motion.h1>
                    <p className="text-gray-400 mt-2">
                        ایجاد شده توسط: {roundtable?.creatorId?.name || 'ناشناس'} ·{' '}
                        {roundtable ? new Date(roundtable.createdAt).toLocaleDateString('fa-IR') : ''}
                    </p>
                </header>

                {/* Messages Section */}
                <motion.section
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
                            در حال بارگذاری پیام‌ها...
                        </motion.div>
                    ) : messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-64 text-gray-400"
                        >
                            <span className="text-6xl mb-4">✨</span>
                            <p>هیچ پیامی هنوز ثبت نشده — گفت‌وگو رو شروع کنید ⚡️</p>
                        </motion.div>
                    ) : (
                        <div className="border rounded-3xl bg-gradient-to-br from-slate-800/60 to-slate-900/70 p-6 max-h-[500px] overflow-y-auto">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={msg._id}
                                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-4 border-b border-gray-700/30 last:border-b-0"
                                >
                                    <p className="text-sm">
                                        <span className="font-semibold text-blue-300">{msg.userId?.name || 'ناشناس'}: </span>
                                        {msg.content}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(msg.createdAt).toLocaleDateString('fa-IR')}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.section>

                {/* Send Message Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-8"
                >
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="پیام خود را بنویسید..."
                            className="flex-1 p-3 rounded-2xl bg-slate-800/50 border border-gray-700/40 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50"
                        />
                        <button
                            onClick={sendMessage}
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-fuchsia-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300"
                        >
                            ارسال
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
            </div>
        </div>
    );
}