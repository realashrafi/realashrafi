'use client'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import dynamic from 'next/dynamic'
import { Group, Mesh } from 'three'
import gsap from 'gsap'

// Dynamic Text
const Text = dynamic(() => import('@react-three/drei').then(mod => mod.Text), { ssr: false });

interface ThreeCardProps {
    title: string
    value: string
    subtitle: string  // ✅ نوشته اضافی
    color: string
    position: [number, number, number]
    onClick: () => void
}

export default function ThreeCard({ title, value, subtitle, color, position, onClick }: ThreeCardProps) {
    const groupRef = useRef<Group>(null)
    const buttonRef = useRef<Mesh>(null)
    const iconRef = useRef<Mesh>(null)

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.03
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.1) * 0.05
        }
    })

    const handleHover = () => {
        gsap.to(groupRef.current.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.3 });
    }

    const handleLeave = () => {
        gsap.to(groupRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
    }

    return (
        <group ref={groupRef} position={position} onClick={onClick} onPointerOver={handleHover} onPointerOut={handleLeave}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[2.8, 1.8, 0.3]} />
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
            </mesh>
            {Text && (
                <Text position={[0, 0.6, 0.16]} fontSize={0.14} color="#e0e0e0" anchorX="center" anchorY="middle">
                    {title}
                </Text>
            )}
            {Text && (
                <Text position={[0, 0, 0.16]} fontSize={0.2} color="#ffffff" anchorX="center" anchorY="middle">
                    {value}
                </Text>
            )}
            {Text && (
                <Text position={[0, -0.4, 0.16]} fontSize={0.1} color="#a0a0a0" anchorX="center" anchorY="middle">
                    {subtitle}  {/* ✅ نوشته اضافی */}
                </Text>
            )}
            {/* آیکون (مثال: کره کوچک) */}
            <mesh ref={iconRef} position={[-1, 0.4, 0.16]} scale={[0.3, 0.3, 0.3]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="#ffffff" emissive="#00ffcc" emissiveIntensity={0.5} />
            </mesh>
            {/* دکمه تعاملی */}
            <mesh ref={buttonRef} position={[1, -0.6, 0.16]} onClick={onClick}>
                <boxGeometry args={[1, 0.5, 0.1]} />
                <meshStandardMaterial color="#ff5555" emissive="#ff5555" emissiveIntensity={0.3} />
            </mesh>
        </group>
    )
}