'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'

export default function ThreeGlobe({ stats }: { stats: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-96"
        >
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                <Sphere args={[1, 32, 32]} scale={1 + (stats / 1000) * 0.2}>
                    <meshStandardMaterial
                        color="hotpink"
                        wireframe
                        transparent
                        opacity={0.8}
                    />
                </Sphere>

                <OrbitControls enableZoom={false} />
            </Canvas>
        </motion.div>
    )
}