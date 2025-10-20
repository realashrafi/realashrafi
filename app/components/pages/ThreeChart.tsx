'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface ThreeChartProps {
    position: [number, number, number]
    data: { label: string, value: number }[]
}

export default function ThreeChart({ position, data }: ThreeChartProps) {
    const groupRef = useRef<Group>(null)

    useFrame((state) => {
        if (groupRef.current) groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.05
    })

    return (
        <group ref={groupRef} position={position} rotation={[0, Math.PI / 4, 0]}>
            {data.map((item, i) => (
                <mesh key={i} position={[i * 1.5 - (data.length - 1) * 0.75, item.value / 2, 0]} castShadow>
                    <boxGeometry args={[1.2, item.value, 1.2]} />
                    <meshStandardMaterial color={`hsl(${i * 60}, 70%, 50%)`} metalness={0.4} />
                </mesh>
            ))}
        </group>
    )
}