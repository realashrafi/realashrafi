'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface SpaceDisplayProps {
    title: string
    value: string
    position: [number, number, number]
}

export default function SpaceDisplay({ title, value, position }: SpaceDisplayProps) {
    const groupRef = useRef<Group>(null)
    console.log(`SpaceDisplay Rendering: ${title} at`, new Date().toLocaleTimeString());

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1
        }
    })

    return (
        <group ref={groupRef} position={position} visible={true}>
            <mesh>
                <boxGeometry args={[3, 2, 0.1]} />
                <meshStandardMaterial color="#0f3460" emissive="#0f3460" emissiveIntensity={0.8} />
            </mesh>
            {/* جایگزین ساده با Mesh به جای Text (بدون Troika) */}
            <mesh position={[0, 0.5, 0.06]}>
                <boxGeometry args={[1, 0.3, 0.01]} />
                <meshBasicMaterial color="white" />
            </mesh>
            <mesh position={[0, 0, 0.06]}>
                <boxGeometry args={[1.5, 0.4, 0.01]} />
                <meshBasicMaterial color="#e94560" />
            </mesh>
        </group>
    )
}