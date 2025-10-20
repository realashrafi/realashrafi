import dynamic from 'next/dynamic'

const Notes = dynamic(() => import('@/app/components/pages/Notes'), { ssr: false })

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-gray-100">
            <Notes />
        </main>
    )
}
