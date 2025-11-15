//@ts-nocheck
'use client';

import * as THREE from 'three';
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { easing } from 'maath';
import getUuid from 'uuid-by-string';

const GOLDENRATIO = 1.61803398875;

const images = [
    { position: [0, 0, 1.5], rotation: [0, 0, 0], url: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
    { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: 'https://images.pexels.com/photos/416430/pexels-photo-416430.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
    { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: 'https://images.pexels.com/photos/310452/pexels-photo-310452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
    { position: [-1.75, 0, 0.25], rotation: [0, 1.2566, 0], url: 'https://images.pexels.com/photos/327482/pexels-photo-327482.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
    { position: [-2.15, 0, 1.5], rotation: [0, 1.2566, 0], url: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
    { position: [-2, 0, 2.75], rotation: [0, 1.2566, 0], url: 'https://images.pexels.com/photos/358574/pexels-photo-358574.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
    { position: [1.75, 0, 0.25], rotation: [0, -1.2566, 0], url: 'https://images.pexels.com/photos/227675/pexels-photo-227675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
    { position: [2.15, 0, 1.5], rotation: [0, -1.2566, 0], url: 'https://images.pexels.com/photos/911738/pexels-photo-911738.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
    { position: [2, 0, 2.75], rotation: [0, -1.2566, 0], url: 'https://images.pexels.com/photos/1738986/pexels-photo-1738986.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260' },
];

export function Gallery3D() {
    const router = useRouter();

    return (
        <Canvas
            dpr={[1, 1.5]}
            camera={{ fov: 70, position: [0, 2, 15] }}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
            }}
        >
            <color attach="background" args={['#191920']} />
            <fog attach="fog" args={['#191920', 0, 15]} />
            <group position={[0, -0.5, 0]}>
                <Frames images={images} router={router} />
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[50, 50]} />
                    <MeshReflectorMaterial
                        blur={[300, 100]}
                        resolution={2048}
                        mixBlur={1}
                        mixStrength={80}
                        roughness={1}
                        depthScale={1.2}
                        minDepthThreshold={0.4}
                        maxDepthThreshold={1.4}
                        color="#050505"
                        metalness={0.5}
                    />
                </mesh>
            </group>
            <Environment preset="city" />
        </Canvas>
    );
}

function Frames({ images, router }: { images: any[]; router: any }) {
    const ref = useRef<THREE.Group>(null);
    const clicked = useRef<THREE.Object3D | null>(null);
    const p = new THREE.Vector3();
    const q = new THREE.Quaternion();

    useFrame((state, dt) => {
        if (clicked.current) {
            clicked.current.parent!.updateWorldMatrix(true, true);
            clicked.current.parent!.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25));
            clicked.current.parent!.getWorldQuaternion(q);
        } else {
            p.set(0, 0, 5.5);
            q.identity();
        }

        easing.damp3(state.camera.position, p, 0.4, dt);
        easing.dampQ(state.camera.quaternion, q, 0.4, dt);
    });

    return (
        <group
            ref={ref}
            onClick={(e) => {
                e.stopPropagation();
                const name = e.object.name;
                if (clicked.current?.name === name) {
                    router.push('/gallery');
                    clicked.current = null;
                } else {
                    clicked.current = e.object;
                    router.push(`/gallery/item/${name}`);
                }
            }}
            onPointerMissed={() => {
                router.push('/gallery');
                clicked.current = null;
            }}
        >
            {images.map((props) => (
                <Frame key={props.url} {...props} />
            ))}
        </group>
    );
}

function Frame({ url, position, rotation }: any) {
    const image = useRef<any>(null);
    const frame = useRef<THREE.Mesh>(null);
    const [hovered, hover] = useState(false);
    const [rnd] = useState(() => Math.random());
    const name = getUuid(url);

    useCursor(hovered);

    useFrame((state, dt) => {
        if (!image.current || !frame.current) return;

        image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2;
        easing.damp3(
            image.current.scale,
            [0.85 * (hovered ? 0.85 : 1), 0.9 * (hovered ? 0.905 : 1), 1],
            0.1,
            dt
        );
        easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt);
    });

    return (
        <group position={position} rotation={rotation}>
            <mesh
                name={name}
                onPointerOver={(e) => (e.stopPropagation(), hover(true))}
                onPointerOut={() => hover(false)}
                scale={[1, GOLDENRATIO, 0.05]}
                position={[0, GOLDENRATIO / 2, 0]}
            >
                <boxGeometry />
                <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} />
                <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
                    <boxGeometry />
                    <meshBasicMaterial toneMapped={false} fog={false} />
                </mesh>
                <Image ref={image} raycast={() => null} position={[0, 0, 0.7]} url={url} />
            </mesh>
            <Text
                maxWidth={0.1}
                anchorX="left"
                anchorY="top"
                position={[0.55, GOLDENRATIO, 0]}
                fontSize={0.025}
                color="white"
                textRenderProps={{ worker: false }}
            >
                {name.split('-').join(' ')}
            </Text>
        </group>
    );
}