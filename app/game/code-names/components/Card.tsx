// src/components/Card.tsx
import { Card as CardType } from '../components/gameData';

interface Props {
    card: CardType;
    onClick?: () => void;
    showColor: boolean;
}

const colorMap: Record<string, string> = {
    blue: 'bg-blue-600 border-blue-700',
    red: 'bg-red-600 border-red-700',
    green: 'bg-green-600 border-green-700',
    black: 'bg-gray-900 border-gray-800',
    hidden: 'bg-gray-700 border-gray-600',
};

export default function Card({ card, onClick, showColor }: Props) {
    const displayColor = showColor || card.revealed ? card.color : 'hidden';
    const canClick = onClick && !card.revealed;

    return (
        <button
            onClick={canClick ? onClick : undefined}
            disabled={!canClick}
            className={`
        w-full aspect-square rounded-lg border-4 font-bold text-lg
        flex items-center justify-center transition-all duration-300
        ${colorMap[displayColor]}
        ${canClick ? 'hover:scale-105 cursor-pointer shadow-lg' : 'cursor-default'}
      `}
        >
      <span className="text-white drop-shadow-md px-1 text-center leading-tight">
        {card.word}
      </span>
        </button>
    );
}