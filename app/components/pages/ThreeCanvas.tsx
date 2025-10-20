'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

export default function ThreeCanvas({ children }: { children: React.ReactNode }) {
    console.log("ThreeCanvas Rendering at", new Date().toLocaleTimeString());
    return (
        <div className="w-full h-screen bg-gray-900">
            <Canvas
                gl={{ alpha: false, antialias: true }}
                camera={{ position: [0, 5, 15], fov: 60 }}
                shadows={true}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
                <directionalLight position={[0, 10, 5]} intensity={1} castShadow />
                <Environment preset="city" /> {/* نور محیط واقع‌گرایانه */}
                <axesHelper args={[10]} /> {/* Debug */}
                <OrbitControls enableZoom={true} enablePan={false} minDistance={5} maxDistance={20} />
                {children}
            </Canvas>
        </div>
    )
}