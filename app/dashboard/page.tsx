'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Note {
    _id: string
    title: string
    content: string
    createdAt: string
}

export default function Dashboard() {
    const router = useRouter()
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(true)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    useEffect(() => {
        if (token) loadNotes()
    }, [token])

    const loadNotes = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/notes', {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error('Failed to load notes')
            const data = await res.json()
            setNotes(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    // Load notes
    useEffect(() => {
        if (!token) return router.replace('/login')
        loadNotes()
    }, [token])
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
                        Neural Control Dashboard
                    </motion.h1>
                    <p className="text-gray-400 mt-2">
                        {new Date().toLocaleDateString('fa-IR')} · Adaptive Interface
                    </p>
                </header>

                {/* Cards Section */}
                <motion.section
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
                    }}
                >
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                        whileHover={{ scale: 1.06, rotate: 0.5 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push('/dashboard/notes')}
                        className="p-8 rounded-3xl cursor-pointer
                       bg-gradient-to-br from-blue-500/10 to-fuchsia-600/5
                       border border-blue-400/20 hover:border-fuchsia-400/30
                       shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:shadow-[0_0_45px_rgba(147,51,234,0.25)]
                       transition-all duration-300 backdrop-blur-xl"
                    >
                        <div className="flex items-center space-x-3">
                            <motion.span
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                className="inline-block w-4 h-4 bg-gradient-to-r from-blue-400 to-fuchsia-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                            />
                            <h2 className="text-2xl font-semibold">🧠 Notes</h2>
                        </div>
                        <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                            View and manage your knowledge capsules in one cognitive stream.
                        </p>
                    </motion.div>
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                        whileHover={{ scale: 1.06, rotate: 0.5 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push('/dashboard/roundtables')}
                        className="p-8 rounded-3xl cursor-pointer
                       bg-gradient-to-br from-blue-500/10 to-fuchsia-600/5
                       border border-blue-400/20 hover:border-fuchsia-400/30
                       shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:shadow-[0_0_45px_rgba(147,51,234,0.25)]
                       transition-all duration-300 backdrop-blur-xl"
                    >
                        <div className="flex items-center space-x-3">
                            <motion.span
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                className="inline-block w-4 h-4 bg-gradient-to-r from-blue-400 to-fuchsia-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                            />
                            <h2 className="text-2xl font-semibold">🗣️ Round Tables</h2>
                        </div>
                        <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                            Brain Storming Like Drink glass of water
                        </p>
                    </motion.div>
                </motion.section>

                {/* Notes Preview */}
                <div className="mt-24">
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
                            در حال بارگذاری نوت‌ها...
                        </motion.div>
                    ) : notes.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-64 text-gray-400"
                        >
                            <span className="text-6xl mb-4">✨</span>
                            <p>هیچ نوتی هنوز ثبت نشده — ذهن تو منتظر جرقه است ⚡️</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {notes.map((note, i) => (
                                <motion.div
                                    key={note._id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08 }}
                                    className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/70
                             border border-gray-700/40 hover:border-blue-400/30
                             shadow-[0_0_20px_rgba(59,130,246,0.2)]
                             hover:shadow-[0_0_40px_rgba(147,51,234,0.25)]
                             transition-all duration-300 backdrop-blur-md"
                                >
                                    <h3 className="text-xl font-semibold mb-2 text-blue-300">{note.title}</h3>
                                    <p className="text-gray-300 text-sm line-clamp-3">{note.content}</p>
                                    <p className="text-gray-500 text-xs mt-4 border-t border-gray-700/30 pt-2">
                                        {new Date(note.createdAt).toLocaleDateString('fa-IR')}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}
