'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface Note {
    _id: string
    title: string
    content: any
    createdAt: string
}

export default function Notes() {
    const [notes, setNotes] = useState<Note[]>([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [editingId, setEditingId] = useState('')
    const [editTitle, setEditTitle] = useState('')
    const [editContent, setEditContent] = useState('')
    const router = useRouter()

    const token =
        typeof window !== 'undefined' ? localStorage.getItem('token') : null

    // Load notes
    useEffect(() => {
        if (!token) return router.replace('/login')
        loadNotes()
    }, [token])

    const loadNotes = async () => {
        try {
            const res = await fetch('/api/notes', {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error('Failed to fetch notes')
            setNotes(await res.json())
        } catch (err) {
            console.error(err)
        }
    }

    const addNote = async () => {
        if (!title || !content) return
        setLoading(true)
        try {
            await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content }),
            })
            setTitle('')
            setContent('')
            loadNotes()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const startEdit = (note: Note) => {
        setEditingId(note._id)
        setEditTitle(note.title)
        setEditContent(typeof note.content === 'string' ? note.content : JSON.stringify(note.content))
    }

    const updateNote = async (id: string) => {
        if (!editTitle || !editContent) return
        try {
            await fetch(`/api/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title: editTitle, content: editContent }),
            })
            setEditingId('')
            loadNotes()
        } catch (err) {
            console.error(err)
        }
    }

    const deleteNote = async (id: string) => {
        if (!confirm('آیا این نوت حذف شود؟')) return
        try {
            await fetch(`/api/notes/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            loadNotes()
        } catch (err) {
            console.error(err)
        }
    }

    if (!token) return null

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden">
            {/* Floating glowing background */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute w-[600px] h-[600px] bg-cyan-400/20 blur-3xl rounded-full"
                    animate={{ x: [0, 100, -100, 0], y: [0, 80, -80, 0] }}
                    transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
                />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <motion.h1
                        className="text-4xl font-bold tracking-tight"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        🧠 نوت‌بوک من
                    </motion.h1>

                    <motion.button
                        onClick={() => {
                            localStorage.removeItem('token')
                            router.push('/login')
                        }}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-xl text-white font-medium shadow-md"
                        whileTap={{ scale: 0.95 }}
                    >
                        خروج
                    </motion.button>
                </div>

                {/* Add Note Form */}
                <motion.div
                    className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-2xl mb-8 shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="عنوان نوت"
                        className="w-full p-3 mb-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="محتوای نوت"
                        rows={4}
                        className="w-full p-3 mb-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                        onClick={addNote}
                        disabled={loading}
                        className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-xl font-medium disabled:opacity-50 transition-all"
                    >
                        {loading ? 'در حال اضافه...' : '+ نوت جدید'}
                    </button>
                </motion.div>

                {/* Notes List */}
                <AnimatePresence>
                    {notes.length > 0 ? (
                        <motion.div
                            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { staggerChildren: 0.15 } }}
                        >
                            {notes.map((note) => {
                                const isEditing = editingId === note._id;
                                return (
                                    <motion.div
                                        key={note._id}
                                        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                                        className="relative p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/10 shadow-md hover:shadow-lg transition-all"
                                        whileHover={{ scale: 1.04 }}
                                    >
                                        {isEditing ? (
                                            <>
                                                <input
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    className="w-full p-3 mb-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:outline-none focus:border-cyan-400"
                                                    placeholder="عنوان نوت"
                                                />
                                                <textarea
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    rows={4}
                                                    className="w-full p-3 mb-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:outline-none focus:border-cyan-400"
                                                    placeholder="محتوای نوت"
                                                />
                                                <div className="flex justify-end space-x-2 mt-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateNote(note._id); }}
                                                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl font-medium transition-all"
                                                    >
                                                        ذخیره
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setEditingId(''); }}
                                                        className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-xl font-medium transition-all"
                                                    >
                                                        انصراف
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-xl font-semibold text-cyan-300 mb-2">{note.title}</h3>
                                                <p className="text-gray-300 text-sm line-clamp-4 break-words whitespace-pre-wrap">
                                                    {typeof note.content === 'string'
                                                        ? note.content
                                                        : JSON.stringify(note.content, null, 2)}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {new Date(note.createdAt).toLocaleDateString('fa-IR')}
                                                </p>
                                                <div className="flex justify-end space-x-2 mt-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); startEdit(note); }}
                                                        className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-xl font-medium transition-all"
                                                    >
                                                        ویرایش
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); deleteNote(note._id); }}
                                                        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-xl font-medium transition-all"
                                                    >
                                                        حذف
                                                    </button>
                                                </div>
                                            </>
                                        )}

                                        {/* Hover gradient overlay */}
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none"
                                            initial={false}
                                        />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            className="text-center text-gray-400 mt-20 text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            📭 هنوز نوتی وجود ندارد.
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
