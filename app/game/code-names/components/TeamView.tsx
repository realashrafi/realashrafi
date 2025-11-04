// src/pages/TeamView.tsx
import { useState } from 'react';
import { gameCards, GRID_SIZE } from '../components/gameData';
import Card from '../components/Card';

export default function TeamView() {
    const [revealedCards, setRevealedCards] = useState<boolean[]>(
        gameCards.map(() => false)
    );

    const handleClick = (index: number) => {
        const newRevealed = [...revealedCards];
        newRevealed[index] = true;
        setRevealedCards(newRevealed);
    };

    const resetBoard = () => {
        setRevealedCards(gameCards.map(() => false));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-900 to-cyan-900 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-5xl font-bold text-white drop-shadow-lg">
                        صفحه تیم‌ها
                    </h1>
                    <button
                        onClick={resetBoard}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg"
                    >
                        راند جدید
                    </button>
                </div>

                <div
                    className="grid gap-4 p-6 bg-white/10 backdrop-blur rounded-2xl shadow-2xl"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                >
                    {gameCards.map((card, i) => (
                        <Card
                            key={i}
                            card={{ ...card, revealed: revealedCards[i] }}
                            onClick={() => handleClick(i)}
                            showColor={false}
                        />
                    ))}
                </div>

                <p className="text-center text-white/70 mt-6 text-sm">
                    داوطلب کلیک می‌کند → رنگ ظاهر می‌شود. تیم‌ها فقط می‌بینند.
                </p>
            </div>
        </div>
    );
}