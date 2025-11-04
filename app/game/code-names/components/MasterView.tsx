// src/pages/MasterView.tsx
import { gameCards, GRID_SIZE } from '../components/gameData';
import Card from '../components/Card';

export default function MasterView() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-5xl font-bold text-center text-white mb-10 drop-shadow-lg">
                    صفحه داوطلب
                </h1>

                <div
                    className="grid gap-4 p-6 bg-white/10 backdrop-blur rounded-2xl shadow-2xl"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                >
                    {gameCards.map((card, i) => (
                        <Card key={i} card={card} showColor={true} />
                    ))}
                </div>

                <p className="text-center text-white/70 mt-6 text-sm">
                    فقط داوطلب این صفحه را می‌بیند. رنگ‌ها همیشه مشخص هستند.
                </p>
            </div>
        </div>
    );
}