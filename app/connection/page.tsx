'use client'
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {Box, OrbitControls} from "@react-three/drei";
import * as THREE from "three";

const Cubes = ({ analyser }: any) => {
    const cubesRef = useRef<any>([]);
    const cubesCount = 100; // تعداد کوب‌ها
    const height = 400; // ارتفاع کل نمایش

    useFrame(() => {
        if (analyser) {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);

            for (let i = 0; i < cubesCount; i++) {
                const scale = dataArray[i] / 255 * height; // تغییر اندازه بر اساس داده‌های فرکانسی
                cubesRef.current[i].scale.y = scale; // تغییر اندازه محور Y برای هر کوب
            }
        }
    });

    const cubes = [];
    for (let i = 0; i < cubesCount; i++) {
        const xPosition = (i - cubesCount / 2) * 2; // فاصله دادن کوب‌ها از هم
        cubes.push(
            <Box
                ref={(el) => (cubesRef.current[i] = el)} // نگهداری ارجاع به هر کوب
                key={i}
                position={[xPosition, 0, 0]}
                args={[0.5, 0.1, 0.5]} // اندازه کوب‌ها
            >
                <meshStandardMaterial color="skyblue" />
            </Box>
        );
    }

    return <>{cubes}</>;
};

const SoundVisualizer3D = () => {
    const analyserRef = useRef<AnalyserNode | null>(null);
    const [isAudioReady, setIsAudioReady] = useState(false);

    useEffect(() => {
        const setupAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(stream);
                source.connect(analyser);
                analyser.fftSize = 256;
                analyserRef.current = analyser;
                setIsAudioReady(true); // وقتی که داده‌های صوتی آماده شد
            } catch (error) {
                console.error("Error accessing microphone:", error);
            }
        };

        setupAudio();

        // پاکسازی هنگام unmount شدن کامپوننت
        return () => {
            if (analyserRef.current) {
                analyserRef.current.disconnect();
            }
        };
    }, []);

    return (
        <div className={'w-full h-screen overflow-y-hidden'}>
            <Canvas camera={{ position: [0, 5, 15], fov: 75 }} style={{ background: 'black' }}>
                <ambientLight intensity={0.5} />
                <OrbitControls/>
                <pointLight position={[10, 10, 10]} />
                <directionalLight position={[-5, 5, 5]} intensity={0.5} />
                {isAudioReady && analyserRef.current && <Cubes analyser={analyserRef.current} />}
            </Canvas>
        </div>
    );
};

export default SoundVisualizer3D;
