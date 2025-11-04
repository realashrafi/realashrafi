// src/components/Scene.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Card3D from './Card3D';
import { GRID_SIZE, gameCards } from '../components/gameData';
import { useSpring, animated } from '@react-spring/three';

interface Props {
    revealed: boolean[];
    onClick: (i: number) => void;
    showColors: boolean;
}

export default function Scene({ revealed, onClick, showColors }: Props) {
    return (
        <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
            <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 3} />

            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />

            <group position={[-6, 3, 0]}>
                {gameCards.map((card, i) => {
                    const row = Math.floor(i / GRID_SIZE);
                    const col = i % GRID_SIZE;
                    const x = col * 2.9 - (GRID_SIZE - 1) * 1.45;
                    const y = -row * 2.9 + (GRID_SIZE - 1) * 1.45;

                    const { scale } = useSpring({
                        scale: revealed[i] ? 1.15 : 1,
                        config: { tension: 300, friction: 20 },
                    });

                    return (
                        <animated.group
                            key={i}
                            position={[x, y, 0]}
                            scale={scale}
                        >
                            <Card3D
                                card={{ ...card, revealed: revealed[i] }}
                                showColor={showColors}
                                onClick={() => !revealed[i] && onClick(i)}
                            />
                        </animated.group>
                    );
                })}
            </group>
        </Canvas>
    );
}