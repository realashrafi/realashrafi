'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                localStorage.setItem('token', data.token)
                router.push('/dashboard')
            } else {
                setError(data.error || 'خطا در ورود')
            }
        } catch (err) {
            setError('خطای اتصال')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">ورود</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    name="email"
                    placeholder="ایمیل"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="رمز عبور"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'در حال ورود...' : 'ورود'}
                </button>
            </form>

            <p className="text-center mt-4">
                حساب ندارید؟{' '}
                <a href="/signup" className="text-green-500 hover:underline">ثبت نام کنید</a>
            </p>
        </div>
    )
}