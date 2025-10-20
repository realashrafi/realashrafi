'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function SpacecraftCanvas({ children }: { children: React.ReactNode }) {
    console.log("SpacecraftCanvas Rendering at", new Date().toLocaleTimeString());
    return (
        <div className="w-full h-screen bg-black">
            <Canvas
                gl={{ alpha: false, antialias: true }}
                camera={{ position: [0, 5, 15], fov: 60 }}
                style={{ background: '#1a1a2e' }}
            >
                <ambientLight intensity={0.8} />
                <pointLight position={[5, 5, 5]} intensity={1.5} />
                <axesHelper args={[10]} /> {/* Debug */}
                <OrbitControls enableZoom={true} enablePan={false} />
                {children}
            </Canvas>
        </div>
    )
}