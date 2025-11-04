'use client'
import { useState } from 'react';
import MasterView from "@/app/game/code-names/components/MasterView";
import TeamView from "@/app/game/code-names/components/TeamView";


export default function App() {
    const [page, setPage] = useState<'master' | 'team'>('master');

    return (
        <>
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-4 backdrop-blur-lg bg-white/20 rounded-2xl p-2 shadow-2xl">
                <button
                    onClick={() => setPage('master')}
                    className={`px-8 py-3 rounded-xl font-bold text-xl transition-all ${
                        page === 'master'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-white hover:bg-white/20'
                    }`}
                >
                    داوطلب
                </button>
                <button
                    onClick={() => setPage('team')}
                    className={`px-8 py-3 rounded-xl font-bold text-xl transition-all ${
                        page === 'team'
                            ? 'bg-cyan-600 text-white shadow-lg'
                            : 'text-white hover:bg-white/20'
                    }`}
                >
                    تیم‌ها
                </button>
            </div>

            {page === 'master' && <MasterView />}
            {page === 'team' && <TeamView />}
        </>
    );
}