// src/components/Card3D.tsx
import { Text, useCursor } from '@react-three/drei';
import { useState } from 'react';
import { Card as CardType } from '../components/gameData';

interface Props {
    card: CardType;
    showColor: boolean;
    onClick?: () => void;
}

const colors: Record<string, string> = {
    blue: '#2563eb',
    red: '#dc2626',
    green: '#16a34a',
    black: '#1f2937',
    hidden: '#374151',
};

export default function Card3D({ card, showColor, onClick }: Props) {
    const [hovered, setHovered] = useState(false);
    useCursor(hovered && !!onClick);

    const frontColor = showColor || card.revealed ? colors[card.color] : colors.hidden;

    return (
        <group
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* کارت اصلی */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[2.5, 2.5, 0.15]} />
                <meshStandardMaterial color={frontColor} roughness={0.3} metalness={0.1} />
            </mesh>

            {/* متن */}
            <Text
                position={[0, 0, 0.08]}
                fontSize={0.32}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="/fonts/IRANSans.woff"
            >
                {card.word}
            </Text>

            {/* لبه براق */}
            <mesh>
                <boxGeometry args={[2.6, 2.6, 0.05]} />
                <meshStandardMaterial color="#ffffff" opacity={0.3} transparent />
            </mesh>

            {/* افکت هاور */}
            {hovered && onClick && (
                <mesh scale={[1.1, 1.1, 1.1]}>
                    <boxGeometry args={[2.5, 2.5, 0.15]} />
                    <meshStandardMaterial color="#ffffff" opacity={0.2} transparent />
                </mesh>
            )}
        </group>
    );
}